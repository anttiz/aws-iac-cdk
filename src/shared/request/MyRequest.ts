import { APIGatewayProxyResultV2 } from "aws-lambda";

export type MyRequestProps = {
  eventBody: string;
  tableNameInput: string;
  localEndpoint?: string;
  userId: string;
}

export abstract class MyRequest {
  protected eventBody: string;
  protected tableName: string;
  protected localEndPoint?: string;
  protected userId: string;

  constructor(props: MyRequestProps) {
    this.eventBody = props.eventBody;
    this.tableName = props.tableNameInput;
    this.localEndPoint = props.localEndpoint;
    this.userId = props.userId;
  }

  protected validate(): Promise<boolean> {
    return Promise.resolve(true);
  }

  protected process(): Promise<APIGatewayProxyResultV2> {
    return Promise.resolve('');
  }
}
