# WealthWatch — Personal Financial Dashboard

WealthWatch is a comprehensive personal finance tracking application designed to provide a unified view of your financial health.

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Recharts, Zustand
- **Backend:** Node.js, Express, TypeScript
- **Database:** AWS DynamoDB
- **Auth:** IBM App ID (JWT)
- **AI:** Groq API (llama-3.3-70b-versatile)
- **Alerts:** AWS SNS + AWS SES
- **Storage:** AWS S3

## Project Structure

- `frontend/`: React SPA built with Vite
- `backend/`: Express REST API

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- IBM Cloud Account (App ID)
- AWS Account (DynamoDB, S3, SNS, SES)
- Groq API Key

### 2. Environment Variables
Copy `.env.example` to `.env` in both `frontend` and `backend` directories and fill in your credentials.

### 3. Installation
```bash
# Install dependencies for both
cd backend && npm install
cd ../frontend && npm install
```

### 4. Running the App
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

## API Documentation Scaffolding
- **Auth**: `/api/auth/*`
- **Transactions**: `/api/transactions/*`
- **Assets/Liabilities**: `/api/assets/*`, `/api/liabilities/*`
- **AI Insights**: `/api/ai/*`
- **Goals**: `/api/goals/*`
