import { getDynamoDbDocumentClient } from "../dynamoDb/dynamoDbDocumentClient";
import { ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyResultV2 } from "aws-lambda";
import { MyRequest } from "./MyRequest";
import { config } from "dotenv";

config();

export class GetListRequest extends MyRequest {
  private params: ScanCommandInput;

  constructor(
    protected eventBody: string,
    protected tableNameInput: string,
    protected localEndpoint?: string
  ) {
    super(eventBody, tableNameInput, localEndpoint);
    this.tableName = tableNameInput;
    this.params = {
      TableName: process.env.TODO_TABLE ?? "",
    };
  }

  scanTable = async () => {
    const client = getDynamoDbDocumentClient(this.localEndpoint);
    try {
      const data = await client.send(new ScanCommand(this.params));
      return data.Items;
    } catch (err) {
      throw err;
    }
  };

  validate(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async process(): Promise<APIGatewayProxyResultV2> {
    const items = await this.scanTable();
    const response = {
      statusCode: 200,
      body: JSON.stringify(items),
      headers: {
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Credentials': true,
      },
    };
    return response;
  }
}
