import { Response } from 'express';
import { PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamo, TABLES, isSimulationMode } from '../../src/lib/dynamo.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { store } from '../simulationStore.js';

export const getTransactions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { type, category, month } = req.query;

  try {
    let transactions: any[] = isSimulationMode ? [...store.transactions] : [];

    if (!isSimulationMode) {
      const command = new QueryCommand({
        TableName: TABLES.TRANSACTIONS,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId }
      });
      const result = await dynamo.send(command);
      transactions = result.Items || [];
    }

    // Filter results
    if (type) transactions = transactions.filter(t => t.type === type);
    if (category) transactions = transactions.filter(t => t.category === category);
    if (month) transactions = transactions.filter(t => t.date.startsWith(month as string));

    res.json(transactions.sort((a, b) => b.date.localeCompare(a.date)));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
};

export const addTransaction = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const transactionId = `txn_${Date.now()}`;
  const transaction = { ...req.body, userId, id: transactionId, transactionId, createdAt: new Date().toISOString() };

  try {
    if (!isSimulationMode) {
      await dynamo.send(new PutCommand({ TableName: TABLES.TRANSACTIONS, Item: transaction }));
    } else {
      store.transactions.unshift(transaction);
    }
    res.status(201).json(transaction);
  } catch (error: any) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ message: 'Error adding transaction', error: error.message });
  }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  
  try {
    if (!isSimulationMode) {
      await dynamo.send(new UpdateCommand({
        TableName: TABLES.TRANSACTIONS,
        Key: { userId, transactionId: id },
        UpdateExpression: "set amount = :a, category = :c, note = :n, #t = :type, #d = :date",
        ExpressionAttributeNames: { "#t": "type", "#d": "date" },
        ExpressionAttributeValues: {
          ":a": req.body.amount, ":c": req.body.category, ":n": req.body.note, ":type": req.body.type, ":date": req.body.date
        }
      }));
    } else {
      const idx = store.transactions.findIndex(t => t.id === id);
      if (idx !== -1) store.transactions[idx] = { ...store.transactions[idx], ...req.body };
    }
    res.json({ message: 'Transaction updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transaction' });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    if (!isSimulationMode) {
      // In DynamoDB, try deleting using transactionId as id
      await dynamo.send(new DeleteCommand({ TableName: TABLES.TRANSACTIONS, Key: { userId, transactionId: id } }));
    } else {
      store.transactions = store.transactions.filter(t => t.id !== id && t.transactionId !== id);
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Error deleting transaction' });
  }
};
