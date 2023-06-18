import * as uuid from "uuid";
import { Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { config } from "dotenv";
import {CognitoIdToken} from '@xeedware/cognito-jwt/dist';

config();

const dynamoDb = new DynamoDB.DocumentClient();

export const handler: Handler = (event, context, callback) => {
  const timeStamp = new Date().getTime();
  const token = event.headers.Authorization.split(' ')[1];
  const cognitoIdToken = new CognitoIdToken(token);
  const data = JSON.parse(event.body);
  if (typeof data.name !== "string" || !cognitoIdToken || !cognitoIdToken.sub) {
    console.error("Validation Failed");
    callback(new Error("Couldn't create the todo item."));
    return;
  }
  const id = uuid.v1();
  const params = {
    TableName: process.env.TODO_TABLE ?? "",
    Item: {
      id,
      todoId: id,
      userId: cognitoIdToken.sub,
      name: data.name,
      createdAt: timeStamp,
      updatedAt: timeStamp,
      expiryPeriod: timeStamp,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error("Couldn't create the todo item."));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
    callback(null, response);
  });
};
