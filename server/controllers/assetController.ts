import { Response } from 'express';
import { PutCommand, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { dynamo, TABLES, isSimulationMode } from '../../src/lib/dynamo.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { store } from '../simulationStore.js';

export const getAssets = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    if (isSimulationMode) {
      return res.json(store.assets);
    }
    const result = await dynamo.send(new QueryCommand({
      TableName: TABLES.ASSETS,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": userId }
    }));
    res.json(result.Items || []);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assets' });
  }
};

export const addAsset = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const assetId = `asset_${Date.now()}`;
  const asset = { ...req.body, userId, id: assetId, assetId };
  try {
    if (!isSimulationMode) {
      await dynamo.send(new PutCommand({ TableName: TABLES.ASSETS, Item: asset }));
    } else {
      store.assets.push(asset);
    }
    res.status(201).json(asset);
  } catch (error: any) {
    console.error('Error adding asset:', error);
    res.status(500).json({ message: 'Error adding asset', error: error.message });
  }
};

export const deleteAsset = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  try {
    if (!isSimulationMode) {
      await dynamo.send(new DeleteCommand({ TableName: TABLES.ASSETS, Key: { userId, assetId: id } }));
    } else {
      store.assets = store.assets.filter(a => a.id !== id && a.assetId !== id);
    }
    res.json({ message: 'Asset deleted' });
  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({ message: 'Error deleting asset' });
  }
};
