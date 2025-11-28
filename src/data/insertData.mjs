import { DynamoDBClient, BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import dataTable from "./bookingHistory.json" assert { type: "json" };
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const tableName = "Bookings";
const BATCH_SIZE = 25;

// helper: splits array into chunks of size N
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

async function uploadServicesBulk() {
  const chunks = chunkArray(dataTable, BATCH_SIZE);
  console.log(`Uploading ${dataTable.length} data in ${chunks.length} batches...`);

  for (let i = 0; i < chunks.length; i++) {
    const batch = {
      RequestItems: {
        [tableName]: chunks[i].map(service => ({
          PutRequest: {
            Item: marshall(service)
          }
        }))
      }
    };

    try {
      const command = new BatchWriteItemCommand(batch);
      let result = await client.send(command);

      // retry unprocessed items if any
      while (result.UnprocessedItems && Object.keys(result.UnprocessedItems).length > 0) {
        console.log(`Retrying ${Object.keys(result.UnprocessedItems[tableName]).length} unprocessed items...`);
        const retryCommand = new BatchWriteItemCommand({ RequestItems: result.UnprocessedItems });
        result = await client.send(retryCommand);
      }

      console.log(`✅ Batch ${i + 1}/${chunks.length} uploaded successfully`);
    } catch (err) {
      console.error(`❌ Error uploading batch ${i + 1}:`, err);
    }
  }

  console.log("🎉 All data uploaded successfully!");
}

uploadServicesBulk();
