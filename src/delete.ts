import * as uuid from "uuid";
import { Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { config } from "dotenv";
config();

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: Handler = async (event, context, callback) => {
  const timeStamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.id !== "string") {
    console.error("Validation Failed");
    callback(new Error("Couldn't delete the todo item."));
    return;
  }
  const params = {
    TableName: process.env.TODO_TABLE ?? "",
    Key: {
      todoId: data.id,
    },
  };

  // write the todo to the database
  await dynamoDb.delete(params).promise();

  // create a response
  const response = {
    statusCode: 200,
    body: "",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
  callback(null, response);
};
