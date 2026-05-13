import { Response } from 'express';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamo, TABLES, isSimulationMode } from '../../src/lib/dynamo.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { store } from '../simulationStore.js';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const getInsights = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    let assets = [];
    let liabilities = [];
    let transactions = [];

    if (!isSimulationMode) {
      const assetsResult = await dynamo.send(new QueryCommand({
        TableName: TABLES.ASSETS,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId }
      }));
      assets = assetsResult.Items || [];

      const liabilitiesResult = await dynamo.send(new QueryCommand({
        TableName: TABLES.LIABILITIES,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId }
      }));
      liabilities = liabilitiesResult.Items || [];

      const transactionsResult = await dynamo.send(new QueryCommand({
        TableName: TABLES.TRANSACTIONS,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId }
      }));
      transactions = transactionsResult.Items || [];
    } else {
      assets = store.assets;
      liabilities = store.liabilities;
      transactions = store.transactions;
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTxns = transactions.filter(t => t.date.startsWith(currentMonth));
    const income = monthlyTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthlyTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'EMI', 'Other'];
    const spendingBreakdown = categories.reduce((acc, cat) => {
      acc[cat] = monthlyTxns.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0);
      return acc;
    }, {} as Record<string, number>);

    const bankBalance = assets.filter(a => a.type === 'bank').reduce((sum, a) => sum + a.currentValue, 0);
    const stocks = assets.filter(a => a.type === 'stock').reduce((sum, a) => sum + a.currentValue, 0);
    const fd = assets.filter(a => a.type === 'fd').reduce((sum, a) => sum + a.currentValue, 0);
    const totalAssets = assets.reduce((sum, a) => sum + a.currentValue, 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + l.remainingAmount, 0);

    const prompt = `Here is my financial data:
  
  Monthly Income: ₹${income}
  Monthly Expenses: ₹${expenses}
  
  Spending breakdown:
  ${categories.map(cat => `- ${cat}: ₹${spendingBreakdown[cat]}`).join('\n')}
  
  Assets:
  - Bank Balance: ₹${bankBalance}
  - Stocks: ₹${stocks}
  - FD: ₹${fd}
  
  Liabilities:
  ${liabilities.map(l => `- ${l.name}: ₹${l.remainingAmount} remaining`).join('\n')}
  
  Net Worth: ₹${totalAssets - totalLiabilities}
  Savings Rate: ${income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0}%
  
  Give me 5 specific financial tips based on my actual numbers.
  
  Return ONLY a JSON array:
  [
    {
      "title": "string",
      "description": "string",
      "priority": "high"|"medium"|"low",
      "category": "saving"|"investing"|"debt"|"budgeting"|"emergency"
    }
  ]`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a personal financial advisor for Indian users. Analyze the user's financial data and give specific, actionable advice in simple English. Be direct and practical. Always consider Indian financial context (INR, Indian tax laws, Indian investment options like PPF, FD, SIP, ELSS)."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "[]";
    const insights = JSON.parse(responseContent);
    
    // Ensure we return an array if the model wrapped it in an object
    res.json(Array.isArray(insights) ? insights : (insights.tips || insights.insights || Object.values(insights)[0] || []));
  } catch (error: any) {
    console.error('Groq Error:', error);
    const status = error.status || 500;
    const message = error.message || 'AI temporarily unavailable, try again in a moment';
    res.status(status).json({ message });
  }
};

export const getMonthlySummary = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
     const prompt = "Generate a monthly financial summary. Use 3 sentences in plain English summary of this month vs last month based on growth and spending trends.";
     // For now, returning a static but AI-sounding summary since we need more historical data comparison logic
     const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a financial analyst. Write a concise 3-sentence summary of the user's financial progress."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile"
    });
    res.json({ summary: chatCompletion.choices[0]?.message?.content || "No summary available." });
  } catch (error: any) {
    console.error('Groq Summary Error:', error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || 'AI summary unavailable' });
  }
};
