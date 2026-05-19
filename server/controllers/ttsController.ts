import { Response } from 'express';
import Groq from 'groq-sdk';
import { textToSpeechWatson } from '../lib/ibmTts.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamo, TABLES, isSimulationMode } from '../../src/lib/dynamo.js';
import { store } from '../simulationStore.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getMonthlyNarrativeAudio(req: AuthRequest, res: Response) {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // 1) Generate monthly summary text (reuse similar logic from aiController)
    let assets: any[] = [];
    let liabilities: any[] = [];
    let transactions: any[] = [];

    if (!isSimulationMode) {
      const assetsResult = await dynamo.send(
        new QueryCommand({
          TableName: TABLES.ASSETS,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
        })
      );
      assets = assetsResult.Items || [];

      const liabilitiesResult = await dynamo.send(
        new QueryCommand({
          TableName: TABLES.LIABILITIES,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
        })
      );
      liabilities = liabilitiesResult.Items || [];

      const transactionsResult = await dynamo.send(
        new QueryCommand({
          TableName: TABLES.TRANSACTIONS,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: { ':userId': userId },
        })
      );
      transactions = transactionsResult.Items || [];
    } else {
      assets = store.assets;
      liabilities = store.liabilities;
      transactions = store.transactions;
    }

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTxns = transactions.filter((t: any) => t.date?.startsWith(currentMonth));
    const income = monthlyTxns.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
    const expenses = monthlyTxns.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

    const prompt =
      `Generate a monthly financial summary for an Indian user. ` +
      `Use exactly 3 sentences in simple English. ` +
      `Focus on this month vs last month growth and spending trends when possible; otherwise speak confidently from available data. ` +
      `Include specific numbers using INR. ` +
      `Monthly Income: ₹${income}. Monthly Expenses: ₹${expenses}. ` +
      `Return ONLY the plain text summary (no quotes, no JSON).`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a financial analyst for Indian users. Write a concise, friendly monthly narrative in simple English. Be specific with INR numbers and avoid jargon.',
        },
        { role: 'user', content: prompt },
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const summaryText = (chatCompletion.choices[0]?.message?.content || '').trim();
    if (!summaryText) return res.status(500).json({ message: 'AI summary unavailable' });

    // 2) Call IBM Watson Text-to-Speech REST
    const apiKey = (process.env.IBM_TTS_API_KEY || process.env.IBM_TTS_APIKEY) as string;
    const url = process.env.IBM_TTS_URL as string;
    const voice = process.env.IBM_TTS_VOICE; // optional

    if (!apiKey || !url) {
      return res.status(500).json({
        message: 'Missing IBM TTS configuration. Set IBM_TTS_API_KEY and IBM_TTS_URL in server environment variables.',
      });
    }

    const { audioBase64 } = await textToSpeechWatson({
      apiKey,
      url,
      text: summaryText,
      voice,
    });

    return res.json({ summary: summaryText, audioBase64, audioMime: 'audio/wav' });
  } catch (error: any) {
    console.error('TTS Error:', error);
    return res.status(500).json({ message: error.message || 'TTS generation failed' });
  }
}

