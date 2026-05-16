import { Request, Response } from 'express';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';
import { dynamo, TABLES, isSimulationMode } from '../../src/lib/dynamo.js';

const JWT_SECRET = process.env.JWT_SECRET || 'wealthwatch-premium-secret-2026';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing required fields' });

  try {
    if (!isSimulationMode) {
      const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
      const checkResult = await dynamo.send(new ScanCommand({
        TableName: TABLES.USERS,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: { ":email": email }
      }));
      
      if (checkResult.Items && checkResult.Items.length > 0) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }
    }

    const userId = `user_${Date.now()}`;
    const newUser = {
      userId,
      email,
      name,
      currency: "INR",
      monthlyIncome: 0,
      riskProfile: "medium",
      createdAt: new Date().toISOString(),
    };

    if (!isSimulationMode) {
      await dynamo.send(new PutCommand({ TableName: TABLES.USERS, Item: newUser }));
    } else {
      console.log('Simulation Mode: Skipping DynamoDB user insertion.');
    }
    
    const token = jwt.sign({ userId, email, name }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ 
      message: isSimulationMode ? 'User created (Simulation Mode)' : 'User created successfully', 
      token, 
      user: newUser 
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    const message = error.name === 'UnrecognizedClientException' 
      ? 'AWS Credentials invalid. Please check your Secrets.' 
      : 'Error during signup';
    res.status(500).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });

  try {
    let user: any = null;

    if (!isSimulationMode) {
      const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
      const result = await dynamo.send(new ScanCommand({
        TableName: TABLES.USERS,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: { ":email": email }
      }));
      
      if (result.Items && result.Items.length > 0) {
        user = result.Items[0];
      }
    } else {
      // Simulation mode fallback
      if (email === 'test@example.com') {
        user = {
          userId: 'user_123',
          email,
          name: 'Test User',
          currency: 'INR',
          monthlyIncome: 85000,
          riskProfile: 'medium',
          createdAt: new Date().toISOString(),
        };
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Note: In a real app, verify password here using bcrypt
    
    const token = jwt.sign({ userId: user.userId, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
};
