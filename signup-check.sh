source .env
USER_POOL_ID="$(aws cloudformation describe-stacks \
    --stack-name AwsIacCdkStack  \
    --query "Stacks[0].Outputs" \
    --output json | jq -rc '.[] | select(.OutputKey=="UserPoolId") | .OutputValue '
)"

aws cognito-idp admin-get-user \
  --user-pool-id ${USER_POOL_ID} \
  --username ${TEST_USER}