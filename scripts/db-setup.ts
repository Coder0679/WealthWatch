import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import 'dotenv/config';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const TABLES = {
  USERS: process.env.AWS_DYNAMODB_TABLE_USERS || "WealthWatch_Users",
  TRANSACTIONS: process.env.AWS_DYNAMODB_TABLE_TRANSACTIONS || "WealthWatch_Transactions",
  ASSETS: process.env.AWS_DYNAMODB_TABLE_ASSETS || "WealthWatch_Assets",
  LIABILITIES: process.env.AWS_DYNAMODB_TABLE_LIABILITIES || "WealthWatch_Liabilities",
  GOALS: process.env.AWS_DYNAMODB_TABLE_GOALS || "WealthWatch_Goals",
  REPORTS: process.env.AWS_DYNAMODB_TABLE_REPORTS || "WealthWatch_Reports",
};

async function tableExists(name: string) {
  try {
    await client.send(new DescribeTableCommand({ TableName: name }));
    return true;
  } catch (e) {
    return false;
  }
}

async function createTable(name: string, pk: string, sk?: string) {
  if (await tableExists(name)) {
    console.log(`✅ Table ${name} already exists.`);
    return;
  }

  console.log(`⏳ Creating table ${name}...`);
  const params: any = {
    TableName: name,
    AttributeDefinitions: [
      { AttributeName: pk, AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: pk, KeyType: "HASH" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  };

  if (sk) {
    params.AttributeDefinitions.push({ AttributeName: sk, AttributeType: "S" });
    params.KeySchema.push({ AttributeName: sk, KeyType: "RANGE" });
  }

  try {
    await client.send(new CreateTableCommand(params));
    console.log(`🚀 Successfully created ${name}`);
  } catch (error: any) {
    console.error(`❌ Error creating ${name}:`, error.message);
  }
}

async function init() {
  console.log("🛠️ Starting WealthWatch Database Initialization...");
  
  if (!process.env.AWS_ACCESS_KEY_ID) {
    console.error("❌ Error: AWS Credentials missing in .env file.");
    return;
  }

  await createTable(TABLES.USERS, "userId");
  await createTable(TABLES.TRANSACTIONS, "userId", "transactionId");
  await createTable(TABLES.ASSETS, "userId", "assetId");
  await createTable(TABLES.LIABILITIES, "userId", "liabilityId");
  await createTable(TABLES.GOALS, "userId", "goalId");
  await createTable(TABLES.REPORTS, "userId", "reportId");

  console.log("✨ Database initialization complete!");
}

init();
