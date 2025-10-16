import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import services from "./providersDetails.json" assert { type: "json" };
import dotenv from 'dotenv';
dotenv.config('../../.env');

const client = new DynamoDBClient({
    region: "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
const tableName = "Providers"; // cambia por tu tabla

async function uploadServicesBulk() {
  const putRequests = services.map(service => ({
    PutRequest: {
      Item: marshall(service)
    }
  }));

  // DynamoDB permite máximo 25 items por BatchWrite
  const batch = {
    RequestItems: {
      [tableName]: putRequests
    }
  };

  try {
    const command = new BatchWriteItemCommand(batch);
    const result = await client.send(command);
    console.log("Servicios subidos correctamente:", result);
  } catch (err) {
    console.error("Error subiendo servicios:", err);
  }
}

uploadServicesBulk();
