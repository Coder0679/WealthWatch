import { Response } from "express";
import AssistantV2 from 'ibm-watson/assistant/v2.js';
import { IamAuthenticator } from 'ibm-watson/auth/index.js';
import { dynamo, TABLES, isSimulationMode } from "../../src/lib/dynamo.js";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { AuthRequest } from "../middleware/authMiddleware.js";

const fullUrl = process.env.IBM_WATSON_ASSISTANT_SERVICE_URL || 'https://api.au-syd.assistant.watson.cloud.ibm.com';
const assistantId = process.env.IBM_WATSON_ASSISTANT_ID || '';

const assistant = new AssistantV2({
  version: '2021-06-14',
  authenticator: new IamAuthenticator({
    apikey: process.env.IBM_WATSON_ASSISTANT_APIKEY || '',
  }),
  serviceUrl: fullUrl,
});

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!assistantId) {
      console.error('IBM_WATSON_ASSISTANT_ID is missing');
      return res.status(500).json({ message: 'Watson Assistant ID not configured' });
    }
    
    // Newer V2 Assistant API often requires environmentId to be 'draft' or 'live' 
    // unless a specific environment UUID is provided.
    const session = await assistant.createSession({
      assistantId: assistantId,
    } as any);
    res.json({ sessionId: session.result.session_id });
  } catch (error: any) {
    console.error('Watson Session Error Detail:', error);
    res.status(500).json({ message: 'Failed to create chat session', error: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { message, sessionId } = req.body;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!sessionId) return res.status(400).json({ message: 'Missing sessionId' });

  try {
    let assets = [];
    let liabilities = [];
    let transactions = [];
    let goals = [];

    if (!isSimulationMode) {
      const [assetsRes, liabsRes, txnsRes, goalsRes] = await Promise.all([
        dynamo.send(new ScanCommand({ TableName: TABLES.ASSETS, FilterExpression: "userId = :u", ExpressionAttributeValues: { ":u": userId } })),
        dynamo.send(new ScanCommand({ TableName: TABLES.LIABILITIES, FilterExpression: "userId = :u", ExpressionAttributeValues: { ":u": userId } })),
        dynamo.send(new ScanCommand({ TableName: TABLES.TRANSACTIONS, FilterExpression: "userId = :u", ExpressionAttributeValues: { ":u": userId } })),
        dynamo.send(new ScanCommand({ TableName: TABLES.GOALS, FilterExpression: "userId = :u", ExpressionAttributeValues: { ":u": userId } })),
      ]);
      assets = assetsRes.Items || [];
      liabilities = liabsRes.Items || [];
      transactions = txnsRes.Items || [];
      goals = goalsRes.Items || [];
    }

    const totalAssets = assets.reduce((sum: number, a: any) => sum + Number(a.currentValue || 0), 0);
    const totalLiabilities = liabilities.reduce((sum: number, l: any) => sum + Number(l.balance || l.remainingAmount || 0), 0);
    const netWorth = totalAssets - totalLiabilities;
    
    const expenses = transactions.filter((t: any) => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
    const totalIncome = transactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    const financialContext = {
      user_name: req.user?.name || 'User',
      financial_data: {
        totalAssets,
        totalLiabilities,
        netWorth,
        totalIncome,
        totalExpenses,
        savingsRate: `${savingsRate.toFixed(1)}%`,
        goalsCount: goals.length,
        activeGoals: goals.filter((g: any) => g.status === 'active').map((g: any) => g.title),
      }
    };

    const response = await assistant.message({
      assistantId,
      sessionId,
      input: {
        message_type: 'text',
        text: message,
      },
      context: {
        skills: {
          'main skill': {
            user_defined: financialContext
          }
        }
      }
    } as any);

    res.json(response.result);
  } catch (error: any) {
    console.error('Watson Message Error Detail:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};
