import { Response } from 'express';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamo, TABLES, isSimulationMode } from '../../src/lib/dynamo.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { store } from '../simulationStore.js';

export const getSummary = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    let assets = [];
    let liabilities = [];

    if (!isSimulationMode) {
      const [assetsResult, liabsResult, goalsResult] = await Promise.all([
        dynamo.send(new QueryCommand({
          TableName: TABLES.ASSETS,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: { ":userId": userId }
        })),
        dynamo.send(new QueryCommand({
          TableName: TABLES.LIABILITIES,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: { ":userId": userId }
        })),
        dynamo.send(new QueryCommand({
          TableName: TABLES.GOALS,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: { ":userId": userId }
        }))
      ]);
      assets = assetsResult.Items || [];
      liabilities = liabsResult.Items || [];
      const goals = goalsResult.Items || [];
      const activeGoals = goals.filter((g: any) => g.status === 'active');
      
      const totalAssets = assets.reduce((sum, asset) => sum + (Number(asset.currentValue) || 0), 0);
      const totalLiabilities = liabilities.reduce((sum, liability) => sum + (Number(liability.remainingAmount) || 0), 0);

      // Fetch transactions to calculate dynamic monthly stats
      const txnsResult = await dynamo.send(new QueryCommand({
        TableName: TABLES.TRANSACTIONS,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId }
      }));
      const transactions = txnsResult.Items || [];
      const currentMonth = new Date().toISOString().slice(0, 7);
      const filteredTxns = transactions.filter((t: any) => t.date.startsWith(currentMonth));
      
      const monthlyIncome = filteredTxns.filter((t: any) => t.type === 'income').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      const monthlyExpenses = filteredTxns.filter((t: any) => t.type === 'expense').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      return res.json({
        netWorth: totalAssets - totalLiabilities,
        totalAssets,
        totalLiabilities,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings: monthlyIncome - monthlyExpenses,
        netWorthChange: 25000, // Still placeholder for now unless we have historical data
        netWorthChangePercent: 2.0,
        activeGoals: activeGoals.length
      });
    } else {
      assets = store.assets;
      liabilities = store.liabilities;
      const goals = store.goals || [];
      const activeGoals = goals.filter((g: any) => g.status === 'active');

      const totalAssets = assets.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
      const totalLiabilities = liabilities.reduce((sum, liability) => sum + (liability.remainingAmount || 0), 0);

      const currentMonth = new Date().toISOString().slice(0, 7);
      const filteredTxns = store.transactions.filter(t => t.date.startsWith(currentMonth));
      const monthlyIncome = filteredTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const monthlyExpenses = filteredTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      res.json({
        netWorth: totalAssets - totalLiabilities,
        totalAssets,
        totalLiabilities,
        monthlyIncome,
        monthlyExpenses,
        monthlySavings: monthlyIncome - monthlyExpenses,
        netWorthChange: 25000,
        netWorthChangePercent: 2.0,
        activeGoals: activeGoals.length
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching summary' });
  }
};

export const getCharts = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    let assets: any[] = [];
    let liabilities: any[] = [];
    let transactions: any[] = [];

    if (!isSimulationMode) {
      const [assetsResult, liabsResult, txnsResult] = await Promise.all([
        dynamo.send(new QueryCommand({
          TableName: TABLES.ASSETS,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: { ":userId": userId }
        })),
        dynamo.send(new QueryCommand({
          TableName: TABLES.LIABILITIES,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: { ":userId": userId }
        })),
        dynamo.send(new QueryCommand({
          TableName: TABLES.TRANSACTIONS,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: { ":userId": userId }
        }))
      ]);
      assets = assetsResult.Items || [];
      liabilities = liabsResult.Items || [];
      transactions = txnsResult.Items || [];
    } else {
      assets = store.assets.filter(a => a.userId === userId || !a.userId);
      liabilities = store.liabilities.filter(l => l.userId === userId || !l.userId);
      transactions = store.transactions.filter(t => t.userId === userId || !t.userId);
    }

    // 1. Spending by Category (Current Month)
    const currentMonth = new Date().toISOString().slice(0, 7);
    const spendingByCategoryMap: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
      .forEach(t => {
        spendingByCategoryMap[t.category] = (spendingByCategoryMap[t.category] || 0) + (Number(t.amount) || 0);
      });
    
    const spendingByCategory = Object.entries(spendingByCategoryMap).map(([category, amount]) => ({
      category, amount
    }));

    // 2. Income vs Expense (Last 6 Months)
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return d.toISOString().slice(0, 7);
    });

    const incomeVsExpense = last6Months.map(month => {
      const monthTxns = transactions.filter(t => t.date.startsWith(month));
      return {
        month: new Date(month + '-01').toLocaleString('default', { month: 'short' }),
        income: monthTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
        expense: monthTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
      };
    });

    // 3. Asset Allocation
    const assetAllocationMap: Record<string, number> = {};
    assets.forEach(a => {
      assetAllocationMap[a.type] = (assetAllocationMap[a.type] || 0) + (Number(a.currentValue) || 0);
    });
    const totalAssetVal = assets.reduce((sum, a) => sum + (Number(a.currentValue) || 0), 0);
    const assetAllocation = Object.entries(assetAllocationMap).map(([type, value]) => ({
      type,
      value,
      percentage: totalAssetVal > 0 ? (value / totalAssetVal) * 100 : 0
    }));

    // 4. Net Worth History (Approximate)
    const totalAssets = assets.reduce((sum, a) => sum + (Number(a.currentValue) || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + (Number(l.remainingAmount || l.balance || 0) || 0), 0);
    const currentNetWorth = totalAssets - totalLiabilities;

    // Simulate history based on transactions (going back from current net worth)
    let runningNetWorth = currentNetWorth;
    const netWorthHistory = last6Months.reverse().map(month => {
      const monthLabel = new Date(month + '-01').toLocaleString('default', { month: 'short' });
      const result = { month: monthLabel, value: runningNetWorth };
      
      // Subtract month's net impact (income - expense) to get previous month's value
      const monthImpact = transactions
        .filter(t => t.date.startsWith(month))
        .reduce((sum, t) => sum + (t.type === 'income' ? (Number(t.amount) || 0) : -(Number(t.amount) || 0)), 0);
      
      runningNetWorth -= monthImpact;
      return result;
    }).reverse();

    res.json({
      netWorthHistory,
      spendingByCategory: spendingByCategory.length > 0 ? spendingByCategory : [
        { category: "Food", amount: 0 }, { category: "Travel", amount: 0 },
        { category: "EMI", amount: 0 }, { category: "Shopping", amount: 0 },
        { category: "Bills", amount: 0 }, { category: "Other", amount: 0 },
      ],
      incomeVsExpense,
      assetAllocation: assetAllocation.length > 0 ? assetAllocation : [
        { type: "Bank", value: 0, percentage: 0 },
        { type: "Stocks", value: 0, percentage: 0 },
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching charts' });
  }
};
