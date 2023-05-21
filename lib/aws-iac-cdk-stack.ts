import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  CfnAuthorizer,
  AuthorizationType,
  LambdaIntegration,
  RestApi,
  Cors,
} from "aws-cdk-lib/aws-apigateway";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { AssetCode, Runtime, Function } from "aws-cdk-lib/aws-lambda";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { config } from "dotenv";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  IdentityPool,
  UserPoolAuthenticationProvider,
} from "@aws-cdk/aws-cognito-identitypool-alpha";
config();

export class AwsIacCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const env = process.env.ENVIRONMENT;
    // User pool
    const userPool = new UserPool(this, env + "_todoUserPool_cdk", {
      passwordPolicy: {
        requireDigits: false,
        requireUppercase: false,
        minLength: 6,
      },
      selfSignUpEnabled: true,
      removalPolicy: RemovalPolicy.DESTROY,
      userPoolName: env + "_todoUserPool_cdk",
    });
    new CfnOutput(this, "UserPoolId", { value: userPool.userPoolId });

    // User pool client
    const userPoolClient = new UserPoolClient(
      this,
      env + "_todoUserPoolClient_cdk",
      {
        userPool,
        authFlows: {
          userPassword: true,
          userSrp: true,
        },
      }
    );
    new CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });

    const identityPool = new IdentityPool(this, "TodoIdentityPool", {
      authenticationProviders: {
        userPools: [new UserPoolAuthenticationProvider({ userPool })],
      },
      allowClassicFlow: true,
    });

    new CfnOutput(this, "IdentityPoolId", {
      value: identityPool.identityPoolId,
    });

    // DynamoDB
    const dynamoTable = new Table(this, process.env.TODO_TABLE ?? "unknown", {
      partitionKey: {
        name: "todoId",
        type: AttributeType.STRING,
      },
      tableName: process.env.TODO_TABLE,
      /**
       *  The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new table, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will delete the table (even if it has data in it)
       */
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // API gateway
    const restApi = new RestApi(this, env + `_TodoLambdaRestApi`, {
      restApiName: `todo-cdk-api`
    });
    // Todo Resource API for the REST API.
    const items = restApi.root.addResource("todo");

    const methods = [
      ["get", "Get", "list.handler", "list"],
      ["post", "Post", "create.handler", "create"],
    ];

    methods.forEach(([method, ucMethod, handler, fileName]) => {
      // Lambda
      const func = new Function(this, env + `_${ucMethod}TodoFunction`, {
        code: new AssetCode("src"),
        handler,
        runtime: Runtime.NODEJS_18_X,
      });
      const authorizer = new CfnAuthorizer(
        this,
        env + `_Todo${ucMethod}CfnAuthorizer`,
        {
          restApiId: restApi.restApiId,
          name: `Todo${ucMethod}APIAuthorizer`,
          type: "COGNITO_USER_POOLS",
          identitySource: "method.request.header.Authorization",
          providerArns: [userPool.userPoolArn],
        }
      );

      items.addMethod(method.toUpperCase(), new LambdaIntegration(func), {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
          authorizerId: authorizer.ref,
        }
      });
      dynamoTable.grantReadWriteData(func);
    });
  }
}
