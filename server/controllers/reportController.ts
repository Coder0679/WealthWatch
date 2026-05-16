import { Response } from 'express';
import { QueryCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { dynamo, TABLES, isSimulationMode } from '../../src/lib/dynamo.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { store } from '../simulationStore.js';
import Groq from 'groq-sdk';
import PDFDocument from 'pdfkit';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PassThrough } from 'stream';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const s3Client = new S3Client({
  region: 'us-east-1', // User specified us-east-1 for reports
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'wealthwatch-reports';

export const getReports = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // In a real app, we'd have a Reports table in DynamoDB to track generated reports
    // For now, let's assume we store report metadata in the USERS table or a separate table
    // Let's use a hypothetical table TABLES.REPORTS if it exists, or just Scan for now if simulated
    
    // For this implementation, let's just return a list based on what's in the simulation store
    // or a hardcoded list if real DB but no reports table yet.
    // Ideally we should have a WealthWatch_Reports table.
    
    // Let's check if we can scan a reports table
    let reports = [];
    if (!isSimulationMode) {
      try {
        const result = await dynamo.send(new ScanCommand({
          TableName: TABLES.REPORTS,
          FilterExpression: "userId = :userId",
          ExpressionAttributeValues: { ":userId": userId }
        }));
        reports = result.Items || [];
      } catch (e) {
        // Table might not exist, return empty
        reports = [];
      }
    } else {
      reports = (store as any).reports || [];
    }

    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const generateMonthlyReport = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // 1. Fetch Data
    let assets = [];
    let liabilities = [];
    let transactions = [];
    let goals = [];

    if (!isSimulationMode) {
      const [assetsRes, liabilitiesRes, txnsRes, goalsRes] = await Promise.all([
        dynamo.send(new QueryCommand({ TableName: TABLES.ASSETS, KeyConditionExpression: "userId = :userId", ExpressionAttributeValues: { ":userId": userId } })),
        dynamo.send(new QueryCommand({ TableName: TABLES.LIABILITIES, KeyConditionExpression: "userId = :userId", ExpressionAttributeValues: { ":userId": userId } })),
        dynamo.send(new QueryCommand({ TableName: TABLES.TRANSACTIONS, KeyConditionExpression: "userId = :userId", ExpressionAttributeValues: { ":userId": userId } })),
        dynamo.send(new QueryCommand({ TableName: TABLES.GOALS, KeyConditionExpression: "userId = :userId", ExpressionAttributeValues: { ":userId": userId } }))
      ]);
      assets = assetsRes.Items || [];
      liabilities = liabilitiesRes.Items || [];
      transactions = txnsRes.Items || [];
      goals = goalsRes.Items || [];
    } else {
      assets = store.assets.filter(a => a.userId === userId);
      liabilities = store.liabilities.filter(l => l.userId === userId);
      transactions = store.transactions.filter(t => t.userId === userId);
      goals = store.goals.filter(g => g.userId === userId);
    }

    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const monthKey = new Date().toISOString().slice(0, 7);
    
    // Calculations
    const monthlyTxns = transactions.filter(t => t.date.startsWith(monthKey));
    const income = monthlyTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = monthlyTxns.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    const savings = income - expenses;
    const savingsRate = income > 0 ? (savings / income * 100).toFixed(1) : 0;
    
    const totalAssets = assets.reduce((sum, a) => sum + Number(a.currentValue), 0);
    const totalLiabilities = liabilities.reduce((sum, l) => sum + Number(l.remainingAmount || l.balance || 0), 0);
    const netWorth = totalAssets - totalLiabilities;

    // 2. AI Summary from Groq
    const aiPrompt = `Analyze my finances for ${currentMonth}:
    Income: ₹${income}
    Expenses: ₹${expenses}
    Savings: ₹${savings}
    Net Worth: ₹${netWorth}
    
    Write a 3-paragraph summary:
    Paragraph 1: Spending analysis.
    Paragraph 2: Comparison trends (assume slight improvement for now).
    Paragraph 3: Recommendations for next month.`;

    const aiRes = await groq.chat.completions.create({
      messages: [{ role: "system", content: "You are a professional financial auditor." }, { role: "user", content: aiPrompt }],
      model: "llama-3.3-70b-versatile"
    });
    const aiSummary = aiRes.choices[0]?.message?.content || "AI summary currently unavailable.";

    // 3. Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    const stream = new PassThrough();

    // IMPORTANT: pipe doc output into our PassThrough
    doc.pipe(stream);

    // Page 1: Summary
    doc.fontSize(25).text('WealthWatch Monthly Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(currentMonth, { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(14).text(`Net Worth: ₹${netWorth.toLocaleString()}`);
    doc.text(`Total Assets: ₹${totalAssets.toLocaleString()}`);
    doc.text(`Total Liabilities: ₹${totalLiabilities.toLocaleString()}`);
    doc.moveDown();
    doc.text(`Monthly Income: ₹${income.toLocaleString()}`);
    doc.text(`Monthly Expenses: ₹${expenses.toLocaleString()}`);
    doc.text(`Monthly Savings: ₹${savings.toLocaleString()}`);
    doc.text(`Savings Rate: ${savingsRate}%`);

    // Page 2: Transactions
    doc.addPage();
    doc.fontSize(20).text('Recent Transactions', { underline: true });
    doc.moveDown();
    doc.fontSize(10);
    monthlyTxns.forEach((t: any) => {
      const desc = t.note || t.description || '';
      const cat = (t.category || '').padEnd(12).slice(0, 12);
      const safeDesc = String(desc).slice(0, 30).padEnd(32);
      doc.text(`${t.date} | ${cat} | ${safeDesc} | ₹${t.amount}`);
    });
    doc.moveDown();
    doc.fontSize(12).text(`Total Transactions: ${monthlyTxns.length}`, { align: 'right' });

    // Page 3: Goals Progress
    doc.addPage();
    doc.fontSize(20).text('Financial Goals Progress', { underline: true });
    doc.moveDown();
    goals.forEach((g: any) => {
      const progress = Math.min(100, (Number(g.currentAmount) / Number(g.targetAmount)) * 100).toFixed(1);
      doc.fontSize(14).text(`${g.title}: ${progress}% complete`);
      doc.fontSize(10).text(`Target: ₹${g.targetAmount} | Saved: ₹${g.currentAmount}`);
      doc.moveDown();
    });

    // Page 4: AI Summary
    doc.addPage();
    doc.fontSize(20).text('AI Financial Auditor Review', { underline: true });
    doc.moveDown();
    doc.fontSize(12).text(aiSummary, { lineGap: 5 });

    doc.end();

    // 4. Upload to S3
    const fileName = `${userId}/reports/${monthKey}-${Date.now()}.pdf`;

    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: 'application/pdf',
      })
    );

    // 5. Generate Signed URL
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: fileName });
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // 6. Save metadata
    const reportData = {
      reportId: `rep_${Date.now()}`,
      userId,
      monthName: currentMonth,
      monthKey,
      generatedAt: new Date().toISOString(),
      s3Key: fileName,
      downloadUrl,
      // Financial metrics for preview/summary
      netWorth,
      totalAssets,
      totalLiabilities,
      income,
      expenses,
      savings,
      savingsRate: Number(savingsRate)
    };

    let metadataSaved = false;
    let metadataError: string | null = null;

    if (!isSimulationMode) {
      try {
        await dynamo.send(new PutCommand({
          TableName: TABLES.REPORTS,
          Item: reportData
        }));
        metadataSaved = true;
      } catch (e: any) {
        metadataSaved = false;
        metadataError = e?.message || String(e);
        console.warn(
          `Could not save report metadata to DynamoDB (table=${TABLES.REPORTS}). Error: ${metadataError}`
        );
      }
    } else {
      (store as any).reports = (store as any).reports || [];
      (store as any).reports.push(reportData);
      metadataSaved = true;
    }

    res.json({
      message: metadataSaved ? 'Report generated successfully' : 'Report generated successfully, but metadata save failed',
      report: reportData,
      metadata: {
        saved: metadataSaved,
        table: TABLES.REPORTS,
        error: metadataError
      }
    });

  } catch (error: any) {
    console.error('Report Generation Error:', error);
    res.status(500).json({ message: error.message });
  }
};
