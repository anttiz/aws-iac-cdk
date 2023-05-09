import { App, CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  CfnAuthorizer,
  AuthorizationType,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { PasswordPolicy, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { AssetCode, Runtime, Function } from "aws-cdk-lib/aws-lambda";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { config } from "dotenv";
config();

export class AwsIacCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const env = process.env.ENVIRONMENT;
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

    const userPoolClient = new UserPoolClient(
      this,
      env + "_todoUserPoolClient_cdk",
      {
        userPool,
        authFlows: {
          userPassword: true
        }
      }
    );
    new CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });

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

    const restApi = new RestApi(this, env + `_TodoLambdaRestApi`, {
      restApiName: `todo-cdk-api`,
    });
    // Todo Resource API for the REST API.
    const items = restApi.root.addResource("todo");

    const methods = [
      ["get", "Get", "list.handler"],
      ["post", "Post", "create.handler"]
    ];

    methods.forEach(([method, ucMethod, handler]) => {
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

      // GET method for the TODO API resource. It uses Cognito for
      // authorization and the authorizer defined above.
      items.addMethod(method.toUpperCase(), new LambdaIntegration(func), {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
          authorizerId: authorizer.ref,
        },
      });
      dynamoTable.grantReadWriteData(func);
    });
  }
}
