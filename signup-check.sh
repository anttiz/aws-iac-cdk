source .env
USER_POOL_ID="$(cat outputs.json | jq -r '.AwsIacCdkStack.UserPoolId')"

aws cognito-idp admin-get-user \
  --user-pool-id ${USER_POOL_ID} \
  --username ${TEST_USER}