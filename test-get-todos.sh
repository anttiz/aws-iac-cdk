source .env
API_URL_START="$(cat outputs.json | jq -r '.AwsIacCdkStack.devTodoLambdaRestApiEndpoint72C1C87B')"
API_URL="${API_URL_START}todo"
output=$(curl -H "Authorization: Bearer ${TEST_TOKEN}" \
  -X GET ${API_URL})
echo $output | jq -r '.'
