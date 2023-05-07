import { Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { config } from "dotenv";
config();

const dynamoDb = new DynamoDB.DocumentClient();
const params = {
  TableName: process.env.TODO_TABLE ?? '',
};

export const handler: Handler = (event, context, callback) => {
  // fetch all todos from the database
  // For production workloads you should design your tables and indexes so that your applications can use Query instead of Scan.
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the todo items.",
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
