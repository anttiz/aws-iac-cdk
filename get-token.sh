source .env
USER_POOL_ID="$(cat outputs.json | jq -r '.AwsIacCdkStack.UserPoolId')"
CLIENT_ID="$(cat outputs.json | jq -r '.AwsIacCdkStack.UserPoolClientId')"

TEST_TOKEN=`aws cognito-idp initiate-auth \
 --client-id ${CLIENT_ID} \
 --auth-flow USER_PASSWORD_AUTH \
 --auth-parameters USERNAME=${TEST_USER},PASSWORD=${TEST_PASS} \
 --query 'AuthenticationResult.IdToken' \
 --output text`
echo ${TEST_TOKEN}
export TEST_TOKEN
