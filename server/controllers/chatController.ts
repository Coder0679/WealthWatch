import { Response } from "express";
import Groq from "groq-sdk";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo, TABLES, isSimulationMode } from "../../src/lib/dynamo.js";
import { store } from "../simulationStore.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

type FinancialItem = Record<string, any>;

async function getItemsForUser(tableName: string, userId: string): Promise<FinancialItem[]> {
  const result = await dynamo.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: { ":userId": userId },
    })
  );

  return result.Items || [];
}

async function getFinancialData(userId: string) {
  if (isSimulationMode) {
    return {
      transactions: store.transactions.filter((item) => item.userId === userId),
      assets: store.assets.filter((item) => item.userId === userId),
      liabilities: store.liabilities.filter((item) => item.userId === userId),
      goals: store.goals.filter((item) => item.userId === userId),
    };
  }

  const [transactions, assets, liabilities, goals] = await Promise.all([
    getItemsForUser(TABLES.TRANSACTIONS, userId),
    getItemsForUser(TABLES.ASSETS, userId),
    getItemsForUser(TABLES.LIABILITIES, userId),
    getItemsForUser(TABLES.GOALS, userId),
  ]);

  return { transactions, assets, liabilities, goals };
}

const toAmount = (value: unknown) => Number(value || 0);

export const sendMessage = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { message } = req.body;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!message || typeof message !== "string") {
    return res.status(400).json({ message: "Missing message" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(503).json({ message: "Groq API key not configured" });
  }

  try {
    const { transactions, assets, liabilities, goals } = await getFinancialData(userId);

    const totalAssets = assets.reduce((sum, asset) => sum + toAmount(asset.currentValue), 0);
    const totalLiabilities = liabilities.reduce(
      (sum, liability) => sum + toAmount(liability.balance ?? liability.remainingAmount),
      0
    );
    const netWorth = totalAssets - totalLiabilities;
    const monthlyIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + toAmount(transaction.amount), 0);
    const monthlyExpense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + toAmount(transaction.amount), 0);
    const activeGoals = goals.filter((goal) => goal.status !== "completed");

    const groqResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are WealthWatch AI Assistant for Indian users.

User Financial Data:
Net Worth: ₹${netWorth}
Monthly Income: ₹${monthlyIncome}
Monthly Expenses: ₹${monthlyExpense}
Total Assets: ₹${totalAssets}
Total Liabilities: ₹${totalLiabilities}
Active Goals: ${activeGoals.length}

Answer questions about their finances specifically.
Also answer general Indian finance questions.
Be friendly and use simple English.
Always use ₹ INR format.
Keep responses concise (max 3-4 lines).`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 300,
    });

    const reply = groqResponse.choices[0]?.message?.content?.trim();
    return res.json({
      reply: reply || "I couldn't generate a response right now. Please try again.",
    });
  } catch (error: any) {
    console.error("Groq Chat Error:", error);
    return res.status(502).json({ message: "Failed to generate chat response" });
  }
};
