import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { config } from "dotenv";
import { GetListRequest } from "./shared/request/GetListRequest";
import { CognitoIdToken } from "@xeedware/cognito-jwt/dist";

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
  const token = event.headers.Authorization?.split(" ")[1] ?? '';
  const cognitoIdToken = new CognitoIdToken(token);
  const request = new GetListRequest({
    eventBody: event.body ?? '',
    tableNameInput: params.TableName,
    userId: cognitoIdToken.sub
  });
  const response = await request.process();
  return response;
};
