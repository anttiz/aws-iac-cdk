import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { config } from "dotenv";
import { GetListRequest } from "./shared/request/GetListRequest";
config();

const conf: DynamoDBClientConfig = {
  region: process.env.REGION
}
const dynamoDb = DynamoDBDocument.from(new DynamoDB(conf));
const params = {
  TableName: process.env.TODO_TABLE ?? "",
};

export const handler = async (event: APIGatewayProxyEventV2):Promise<APIGatewayProxyResultV2> => {
  // fetch all todos from the database
  const request = new GetListRequest(event.body ?? '', params.TableName);
  const response = await request.process();
  return response;
};
