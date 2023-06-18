import { GetListRequest } from "./shared/request/GetListRequest";
import { config } from "dotenv";

config();

async function start() {
  let tableName = process.env.TODO_TABLE ?? "";
  let body = {};
  let request = new GetListRequest({
    eventBody: JSON.stringify(body),
    tableNameInput: tableName,
    localEndpoint: "http://localhost:6789",
    userId: ''
  });
  let response = await request.process();
  console.log(response);
}
start();
