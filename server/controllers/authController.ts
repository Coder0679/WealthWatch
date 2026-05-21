import { Request, Response } from 'express';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import jwt from 'jsonwebtoken';
import axios from 'axios';
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

// Helper to get Redirect URI
const getRedirectUri = (req: Request) => {
  if (process.env.APP_URL) {
    return `${process.env.APP_URL}/api/auth/appid/callback`;
  }
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  return `${protocol}://${req.get('host')}/api/auth/appid/callback`;
};

export const getAppIDAuthUrl = async (req: Request, res: Response) => {
  const clientId = process.env.IBM_APP_ID_CLIENT_ID;
  const tenantId = process.env.IBM_APP_ID_TENANT_ID;
  const region = process.env.IBM_APP_ID_REGION || 'au-syd';

  if (!clientId || !tenantId) {
    return res.status(500).json({ message: 'IBM App ID configuration is missing in server environment variables' });
  }

  const redirectUri = getRedirectUri(req);
  const authUrl = `https://${region}.appid.cloud.ibm.com/oauth/v4/${tenantId}/authorization?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20email%20profile&idp=google`;

  res.json({ url: authUrl });
};

export const handleAppIDCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send('<h3>Error: Authorization code is missing.</h3>');
  }

  const clientId = process.env.IBM_APP_ID_CLIENT_ID;
  const clientSecret = process.env.IBM_APP_ID_CLIENT_SECRET;
  const tenantId = process.env.IBM_APP_ID_TENANT_ID;
  const region = process.env.IBM_APP_ID_REGION || 'au-syd';

  if (!clientId || !clientSecret || !tenantId) {
    return res.status(500).send('<h3>Error: IBM App ID configuration is missing in server environment variables.</h3>');
  }

  try {
    const redirectUri = getRedirectUri(req);
    const tokenUrl = `https://${region}.appid.cloud.ibm.com/oauth/v4/${tenantId}/token`;

    // 1. Exchange authorization code for tokens
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const tokenResponse = await axios.post(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${basicAuth}`
        }
      }
    );

    const { access_token } = tokenResponse.data;

    // 2. Fetch user information using access_token
    const userinfoUrl = `https://${region}.appid.cloud.ibm.com/oauth/v4/${tenantId}/userinfo`;
    const userinfoResponse = await axios.get(userinfoUrl, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const appidUser = userinfoResponse.data;
    const email = appidUser.email;
    const name = appidUser.name || appidUser.given_name || email.split('@')[0];

    if (!email) {
      return res.status(400).send('<h3>Error: Email not provided by identity provider.</h3>');
    }

    // 3. Check if user exists in DynamoDB
    let user: any = null;

    if (!isSimulationMode) {
      const { ScanCommand } = await import('@aws-sdk/lib-dynamodb');
      const checkResult = await dynamo.send(new ScanCommand({
        TableName: TABLES.USERS,
        FilterExpression: "email = :email",
        ExpressionAttributeValues: { ":email": email }
      }));

      if (checkResult.Items && checkResult.Items.length > 0) {
        user = checkResult.Items[0];
      }
    }

    // 4. If user doesn't exist, create a new user record
    if (!user) {
      const userId = `user_${Date.now()}`;
      user = {
        userId,
        email,
        name,
        currency: "INR",
        monthlyIncome: 0,
        riskProfile: "medium",
        createdAt: new Date().toISOString(),
      };

      if (!isSimulationMode) {
        await dynamo.send(new PutCommand({ TableName: TABLES.USERS, Item: user }));
      } else {
        console.log('Simulation Mode: Skipping user creation in DynamoDB');
      }
    }

    // 5. Generate a local JWT token for WealthWatch
    const token = jwt.sign(
      { userId: user.userId, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 6. Return HTML that sends the authentication data back to the opener window and closes the popup
    const htmlResponse = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Successful</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #0A0F1E;
            color: white;
            margin: 0;
          }
          .container {
            text-align: center;
            background: #15192C;
            padding: 2.5rem;
            border-radius: 1.5rem;
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          }
          h2 { color: #6366F1; margin-top: 0; }
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.1);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border-left-color: #6366F1;
            animation: spin 1s linear infinite;
            margin: 1.5rem auto;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Authentication Successful</h2>
          <div class="spinner"></div>
          <p>Completing login and redirecting you back...</p>
        </div>
        <script>
          const token = ${JSON.stringify(token)};
          const user = ${JSON.stringify(user)};
          
          if (window.opener) {
            window.opener.postMessage({
              type: 'AUTH_SUCCESS',
              token: token,
              user: user
            }, window.location.origin);
            window.close();
          } else {
            document.querySelector('.container').innerHTML = '<h2>Authentication Successful</h2><p>You can close this window now.</p>';
          }
        </script>
      </body>
      </html>
    `;

    res.send(htmlResponse);
  } catch (error: any) {
    console.error('App ID callback error:', error.response?.data || error.message);
    res.status(500).send(`<h3>Error during App ID callback:</h3><p>${error.message}</p>`);
  }
};
