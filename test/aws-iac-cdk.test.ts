import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as AwsIacCdk from '../lib/aws-iac-cdk-stack';

test('User pool created', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new AwsIacCdk.AwsIacCdkStack(app, 'MyTestStack');
  // THEN
  const template = Template.fromStack(stack);
  template.hasResourceProperties('AWS::Cognito::UserPool', {
    UserPoolName: 'dev_todoUserPool_cdk'
  });
});
