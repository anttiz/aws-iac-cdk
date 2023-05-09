source .env
CLIENT_ID=$(cat outputs.json | jq -r '.AwsIacCdkStack.UserPoolClientId')
aws cognito-idp sign-up \
 --client-id ${CLIENT_ID} \
 --username ${TEST_USER} \
 --password ${TEST_PASS} \
 --user-attributes Name=name,Value=${TEST_USER} Name=email,Value=${TODO_EMAIL}
