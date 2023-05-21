// Create the DynamoDB service client module using ES6 syntax.
import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { config } from "dotenv";
config();

// Create an Amazon DynamoDB service client object.
export const getDynamoDbClient = (localEndPoint?: string) => {
  const params: DynamoDBClientConfig = {
    region: process.env.CDK_DEFAULT_REGION,
  };
  if (localEndPoint) {
    params.endpoint = localEndPoint;
    params.credentials = {
      accessKeyId: "accessKeyId",
      secretAccessKey: "secretAccessKey",
    };
  }
  return new DynamoDBClient(params);
};
