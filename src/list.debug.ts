import { GetListRequest } from "./shared/request/GetListRequest";
import { config } from "dotenv";

config();

async function start() {
  let tableName = process.env.TODO_TABLE ?? '';
  let body = {};
  let request = new GetListRequest(
    JSON.stringify(body),
    tableName,
    "http://localhost:6789"
  );
  let response = await request.process();
  console.log(response);
}
start();
