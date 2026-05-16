# Watson Custom Extension Setup Guide

## Overview

This document explains how to integrate the Groq-powered Custom Extension with IBM Watson Assistant for WealthWatch.

## Architecture

```
User → Watson Dashboard (UI)
          ↓
Watson Dialog Flow (with Custom Extension action)
          ↓
Custom Extension calls: /api/chat/groq-extension
          ↓
Groq API (Financial AI Response)
          ↓
Response returns to Watson → User
```

## Setup Steps

### 1. Prerequisites
- ✅ Groq API Key (from https://console.groq.com/keys)
- ✅ IBM Watson Assistant Instance
- ✅ WealthWatch backend running on your server
- ✅ Environment variables configured (.env file)

### 2. Configure Environment Variables

In your `.env` file, ensure these are set:

```env
# Groq API
GROQ_API_KEY=your_groq_api_key_here

# Watson Assistant
IBM_WATSON_ASSISTANT_ID=your_assistant_id
IBM_WATSON_ASSISTANT_APIKEY=your_watson_api_key
IBM_WATSON_ASSISTANT_SERVICE_URL=https://api.au-syd.assistant.watson.cloud.ibm.com
IBM_WATSON_ASSISTANT_ENVIRONMENT_ID=draft
```

### 3. Create Custom Extension in Watson Dashboard

#### Step 3.1: Open Watson Dashboard
1. Go to your Watson Assistant instance
2. Navigate to **Integrations** tab
3. Click **Add Custom Extension** or **Extensions**

#### Step 3.2: Configure Extension Details
Fill in these fields:

| Field | Value |
|-------|-------|
| **Extension Name** | WealthWatch Groq AI |
| **Extension URL** | `http://your-server.com:3000/api/chat/groq-extension` |
| **Authentication** | Bearer Token |
| **Auth Token** | Your JWT token or API key |

**For Local Development:**
If testing locally, use: `http://localhost:3000/api/chat/groq-extension`

#### Step 3.3: Define Extension Action

Create an action that calls the extension:

**Request Body (JSON):**
```json
{
  "message": "<? input.text ?>",
  "userDetails": {
    "userId": "<? user.id ?>",
    "userName": "<? user.name ?>"
  }
}
```

**Expected Response:**
```json
{
  "response": "Your personalized financial advice...",
  "timestamp": "2026-05-15T10:30:00.000Z"
}
```

### 4. Create Dialog Flow in Watson

#### Step 4.1: Add Action Node
In your Watson dialog:

1. Create a new action/intent (e.g., "Get Financial Advice")
2. Add a skill/extension action that calls your custom extension
3. Map the user's input message to the `message` parameter

#### Step 4.2: Use Response
Watson will automatically handle:
- Sending user message to `/api/chat/groq-extension`
- Receiving AI response from Groq
- Returning it to the user with Watson's branding

### 5. Test the Integration

#### Using Watson Web Chat:
1. Open the Watson web chat widget
2. Type a financial question, e.g., "How can I improve my savings rate?"
3. Watson should:
   - Trigger the Custom Extension
   - Call your Groq endpoint
   - Display the AI response

#### Using Curl (Direct API Test):
```bash
curl -X POST http://localhost:3000/api/chat/groq-extension \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "What should I do with my extra savings?",
    "userDetails": {
      "userId": "user123",
      "userName": "John Doe"
    }
  }'
```

Expected Response:
```json
{
  "response": "Based on your financial profile with a net worth of $XXX and savings rate of YY%, I recommend...",
  "timestamp": "2026-05-15T10:30:00.000Z"
}
```

## Endpoint Details

### POST `/api/chat/groq-extension`

**Authentication:** Requires valid JWT token (via authMiddleware)

**Request Body:**
```typescript
{
  message: string;        // User's question/message
  userDetails?: {         // Optional: override user details
    userId?: string;
    userName?: string;
  }
}
```

**Response:**
```typescript
{
  response: string;       // AI response from Groq
  timestamp: string;      // ISO timestamp
  error?: string;         // Error message if request fails
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (missing JWT)
- `400` - Bad request (missing message)
- `500` - Server error

## Watson Dashboard - Where to Find Extension URL

1. **Watson Dashboard** → Your Assistant
2. **Integrations** (left menu)
3. **Preview** (to test web chat)
4. **Extensions** (to manage custom extensions)
5. Find your extension → Copy webhook URL

## Important Notes

### Branding
- Watson handles the "powered by IBM Watson" branding
- Extension operates invisibly to the user
- Groq attribution can be added to response text if desired

### Financial Data
The extension automatically includes user's:
- Net Worth, Assets, Liabilities
- Income & Expenses
- Savings Rate
- Active Goals

This context is sent to Groq for personalized advice.

### Model Selection

You can change the Groq model in `chatController.ts`:

```typescript
model: 'mixtral-8x7b-32768',  // Current default
// Other options:
// model: 'llama2-70b-4096',
// model: 'gemma-7b-it',
// model: 'llama-3.3-70b-versatile',
```

## Troubleshooting

### Error: "Bad Request: URL environmentid parameter 'live' is not a valid GUID"
**Solution:** Ensure `IBM_WATSON_ASSISTANT_ENVIRONMENT_ID=draft` in .env

### Error: "401 Unauthorized"
**Solution:** Check that your JWT token is valid and included in Authorization header

### Error: "GROQ_API_KEY is invalid"
**Solution:** Verify your Groq API key from https://console.groq.com/keys

### Extension not being called
**Solution:** 
1. Check Watson dialog flow includes the extension action
2. Verify extension URL is correct and accessible
3. Test endpoint directly with curl command above

## Next Steps

1. ✅ Set up `.env` with Groq API key
2. ✅ Configure Watson Custom Extension
3. ✅ Create dialog flow to use extension
4. ✅ Test with web chat
5. ✅ Deploy to production with public URL

## Support

For issues:
- Check server logs: `npm run dev` output
- Verify environment variables: `echo $GROQ_API_KEY`
- Test endpoint directly before Watson integration
