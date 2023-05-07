source .env
USER_POOL_ID="$(aws cloudformation describe-stacks \
    --stack-name AwsIacCdkStack  \
    --query "Stacks[0].Outputs" \
    --output json | jq -rc '.[] | select(.OutputKey=="UserPoolId") | .OutputValue '
)"
CLIENT_ID="$(aws cloudformation describe-stacks \
    --stack-name AwsIacCdkStack  \
    --query "Stacks[0].Outputs" \
    --output json | jq -rc '.[] | select(.OutputKey=="UserPoolClientId") | .OutputValue '
)"

TEST_TOKEN=`aws cognito-idp initiate-auth \
 --client-id ${CLIENT_ID} \
 --auth-flow USER_PASSWORD_AUTH \
 --auth-parameters USERNAME=${TEST_USER},PASSWORD=${TEST_PASS} \
 --query 'AuthenticationResult.IdToken' \
 --output text`
echo ${TEST_TOKEN}
export TEST_TOKEN
