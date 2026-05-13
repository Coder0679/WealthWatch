# WealthWatch — Project Report

## 1. Project Overview
WealthWatch is a high-performance financial command center designed for the modern investor. It leverage institutional-grade infrastructure to provide real-time auditing, AI-powered insights, and formal financial reporting. The app bridges the gap between complex financial data and actionable strategy, focusing on the Indian economic landscape (INR).

## 2. Services Used

### AWS Services (Provisioned via Infrastructure as Code Patterns)
| Service | Purpose | Where Used | Status |
|---------|---------|------------|--------|
| DynamoDB | Core NoSQL Database | `src/lib/dynamo.ts`, `assetController.ts`, `transactionController.ts` | ✅ Active |
| S3 | Secure PDF Storage | `server/controllers/reportController.ts` | ✅ Active |
| Lambda | Serverless Logic | Application backend runtime | ✅ Active |
| EventBridge | Event Scheduler | Automated EMI and Goal notifications logic | ✅ Active |
| API Gateway | Rest API Handling | Traffic routing to Express controllers | ✅ Active |

### IBM Watson & Cloud Services
| Service | Purpose | Where Used | Status |
|---------|---------|------------|--------|
| App ID | Identity Management | `server/middleware/authMiddleware.ts` integration | ✅ Active |
| Watson Assistant | AI Chatbot | `server/controllers/chatController.ts` | ✅ Active (v2) |
| Watson NLU | Text Intelligence | Used for categorizing unstructured notes | ✅ Active |
| Log Analysis | Observability | Error tracing in production | ✅ Active |

### Intelligent Edge
| Service | Purpose | Where Used | Status |
|---------|---------|------------|--------|
| Groq API | LLM Engine | `aiController.ts`, `reportController.ts` (Llama 3.3) | ✅ Active |

## 3. Features Completed

### Phase 1 MVP
| Feature | Status | Notes |
|---------|--------|-------|
| Landing Page | ✅ Done | Responsive glassmorphism design with anchors. |
| Authentication | ✅ Done | JWT-based auth with user persistence in DynamoDB. |
| Dashboard | ✅ Done | 4 KPI cards + 4 interactive charts (Recharts). |
| Transactions | ✅ Done | CRUD operations with category and month filtering. |
| Assets | ✅ Done | Tracking for Stocks, Bank, FD with gain/loss logic. |
| Liabilities | ✅ Done | EMI tracking with automated remaining balance calc. |
| AI Tips | ✅ Done | Hyper-personalized tips generated via Groq (Llama 3). |
| Goals | ✅ Done | Milestone tracking with "Add Money" flow. |
| Watson Chatbot | ✅ Done | Financial assistant with context-aware responses. |
| Monthly Reports | ✅ Done | PDFKit generation, S3 storage, AI Auditor summary. |

## 4. Tech Stack Summary
- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, tsx, PDFKit, AWS SDK v3, IBM Watson SDK.
- **Database/Cloud**: AWS DynamoDB, AWS S3, IBM Watson Assistant/NLU.
- **AI**: Groq (Llama-3.3-70b-versatile).

## 5. API Endpoints
- `POST /api/auth/signup` - Register new investor.
- `POST /api/auth/login` - Secure session start.
- `GET /api/dashboard/summary` - Fetch net worth and KPIs.
- `GET /api/dashboard/charts` - 6-month historical data.
- `GET /api/transactions` - Categorized transaction history.
- `POST /api/reports/generate` - Generate and upload PDF audit.
- `GET /api/reports` - Fetch audit history list and S3 URLs.
- `POST /api/chat/message` - Contextual IBM Watson interaction.
- `GET /api/ai/insights` - Groq-generated financial strategy.

## 6. Known Issues
- S3 Bucket permissions must be public or correctly configured for the signed URL to bypass CORS in some browsers.
- Simulation mode active when AWS Secrets are missing (intended fallback).

## 7. Future Improvements (Phase 2)
- Multi-currency support (USD/EUR conversion).
- OCR for processing bank statement PDFs automatically.
- Direct integration with Indian stock brokers via APIs.
- Push notifications for EMI due dates via SNS.

---
*Report generated on: 2026-05-12*
*System ID: WealthWatch-v1.0-Audit*
