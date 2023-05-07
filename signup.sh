source .env
CLIENT_ID="$(aws cloudformation describe-stacks \
    --stack-name AwsIacCdkStack  \
    --query "Stacks[0].Outputs" \
    --output json | jq -rc '.[] | select(.OutputKey=="UserPoolClientId") | .OutputValue '
)"
aws cognito-idp sign-up \
 --client-id ${CLIENT_ID} \
 --username ${TEST_USER} \
 --password ${TEST_PASS} \
 --user-attributes Name=name,Value=${NAME} Name=email,Value=${TODO_EMAIL}
