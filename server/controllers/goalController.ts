import { Response } from "express";
import { PutCommand, GetCommand, ScanCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo, TABLES, isSimulationMode } from "../../src/lib/dynamo.js";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { store } from "../simulationStore.js";

export const getGoals = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    let goals = [];
    let transactions = [];

    if (!isSimulationMode) {
      const [goalsRes, txnsRes] = await Promise.all([
        dynamo.send(new ScanCommand({
          TableName: TABLES.GOALS,
          FilterExpression: "userId = :u",
          ExpressionAttributeValues: { ":u": userId }
        })),
        dynamo.send(new ScanCommand({
          TableName: TABLES.TRANSACTIONS,
          FilterExpression: "userId = :u",
          ExpressionAttributeValues: { ":u": userId }
        }))
      ]);
      goals = goalsRes.Items || [];
      transactions = txnsRes.Items || [];
    } else {
      goals = store.goals.filter(g => g.userId === userId);
      transactions = store.transactions.filter((t: any) => t.userId === userId);
    }

    // Calculate average monthly savings
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const recentTxns = transactions.filter((t: any) => new Date(t.date) >= threeMonthsAgo);
    const totalIncome = recentTxns.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + Number(t.amount), 0);
    const totalExpense = recentTxns.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + Number(t.amount), 0);
    
    const monthlySavingsRate = Math.max((totalIncome - totalExpense) / 3, 500); // Default min 500 if no data

    const enrichedGoals = goals.map((goal: any) => {
      const remainingAmount = goal.targetAmount - goal.currentAmount;
      const progressPercent = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
      
      // Estimate months to complete
      const monthsToComplete = remainingAmount > 0 ? remainingAmount / monthlySavingsRate : 0;
      const estimatedDate = new Date();
      estimatedDate.setMonth(estimatedDate.getMonth() + Math.ceil(monthsToComplete));

      return {
        ...goal,
        progressPercent,
        estimatedCompletionDate: estimatedDate.toISOString(),
        monthlySavingsRateUsed: monthlySavingsRate
      };
    });

    res.json(enrichedGoals);
  } catch (error) {
    console.error('Error fetching enriched goals:', error);
    res.status(500).json({ message: 'Error fetching goals' });
  }
};

export const addGoal = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const goalId = `goal_${Date.now()}`;
  const goal = { ...req.body, userId, id: goalId, goalId, status: 'active' };

  try {
    if (!isSimulationMode) {
      await dynamo.send(new PutCommand({ TableName: TABLES.GOALS, Item: goal }));
    } else {
      store.goals.push(goal);
    }
    res.status(201).json(goal);
  } catch (error) {
    console.error('Error adding goal:', error);
    res.status(500).json({ message: 'Error adding goal' });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;
  const { currentAmount } = req.body;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Get existing goal to check target
    let existingGoal;
    if (!isSimulationMode) {
      const result = await dynamo.send(new GetCommand({ TableName: TABLES.GOALS, Key: { userId, goalId: id } }));
      existingGoal = result.Item;
    } else {
      existingGoal = store.goals.find(g => g.id === id);
    }

    if (!existingGoal) return res.status(404).json({ message: 'Goal not found' });

    const status = currentAmount >= existingGoal.targetAmount ? 'completed' : 'active';

    if (!isSimulationMode) {
      await dynamo.send(new UpdateCommand({
        TableName: TABLES.GOALS,
        Key: { userId, goalId: id },
        UpdateExpression: "set currentAmount = :c, #s = :s",
        ExpressionAttributeNames: { "#s": "status" },
        ExpressionAttributeValues: { ":c": currentAmount, ":s": status }
      }));
    } else {
      const index = store.goals.findIndex(g => g.id === id);
      store.goals[index] = { ...store.goals[index], currentAmount, status };
    }

    res.json({ ...existingGoal, currentAmount, status });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Error updating goal' });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    if (!isSimulationMode) {
      await dynamo.send(new DeleteCommand({ TableName: TABLES.GOALS, Key: { userId, goalId: id } }));
    } else {
      store.goals = store.goals.filter(g => g.id !== id && g.goalId !== id);
    }
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Error deleting goal' });
  }
};
