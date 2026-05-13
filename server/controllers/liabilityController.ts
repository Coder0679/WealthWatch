import { Response } from 'express';
import { PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamo, TABLES, isSimulationMode } from '../../src/lib/dynamo.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { store } from '../simulationStore.js';

export const getLiabilities = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    if (isSimulationMode) {
      return res.json(store.liabilities);
    }
    const result = await dynamo.send(new QueryCommand({
      TableName: TABLES.LIABILITIES,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": userId }
    }));
    res.json(result.Items || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching liabilities' });
  }
};

export const addLiability = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const liabilityId = `liab_${Date.now()}`;
  const liability = { ...req.body, userId, id: liabilityId, liabilityId };
  try {
    if (!isSimulationMode) {
      await dynamo.send(new PutCommand({ TableName: TABLES.LIABILITIES, Item: liability }));
    } else {
      store.liabilities.push(liability);
    }
    res.status(201).json(liability);
  } catch (error: any) {
    console.error('Error adding liability:', error);
    res.status(500).json({ message: 'Error adding liability', error: error.message });
  }
};

export const deleteLiability = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  try {
    if (!isSimulationMode) {
      await dynamo.send(new DeleteCommand({ TableName: TABLES.LIABILITIES, Key: { userId, liabilityId: id } }));
    } else {
      store.liabilities = store.liabilities.filter(l => l.id !== id && l.liabilityId !== id);
    }
    res.json({ message: 'Liability deleted' });
  } catch (error) {
    console.error('Delete liability error:', error);
    res.status(500).json({ message: 'Error deleting liability' });
  }
};
