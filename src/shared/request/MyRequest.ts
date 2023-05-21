import { APIGatewayProxyResultV2 } from "aws-lambda";

export abstract class MyRequest {
  constructor(protected eventBody: string, protected tableName: string, protected localEndpoint?: string) {}

  protected validate(): Promise<boolean> {
    return Promise.resolve(true);
  }

  protected process(): Promise<APIGatewayProxyResultV2> {
    return Promise.resolve('');
  }
}
