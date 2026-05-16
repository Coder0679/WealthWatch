import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const hasCredentials = !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY);

export const TABLES = {
  USERS: process.env.AWS_DYNAMODB_TABLE_USERS || "WealthWatch_Users",
  TRANSACTIONS: process.env.AWS_DYNAMODB_TABLE_TRANSACTIONS || "WealthWatch_Transactions",
  ASSETS: process.env.AWS_DYNAMODB_TABLE_ASSETS || "WealthWatch_Assets",
  LIABILITIES: process.env.AWS_DYNAMODB_TABLE_LIABILITIES || "WealthWatch_Liabilities",
  GOALS: process.env.AWS_DYNAMODB_TABLE_GOALS || "WealthWatch_Goals",
  REPORTS: process.env.AWS_DYNAMODB_TABLE_REPORTS || "WealthWatch_Reports",
};

if (!hasCredentials) {
  console.warn("⚠️ AWS Credentials missing. WealthWatch will run in SIMULATION MODE. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in the Secrets panel.");
}

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "MOCK_KEY",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "MOCK_SECRET",
  },
});

export const dynamo = DynamoDBDocumentClient.from(client);
export const isSimulationMode = !hasCredentials;
