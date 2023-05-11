source .env
API_URL_START="$(cat outputs.json | jq -r '.AwsIacCdkStack.devTodoLambdaRestApiEndpoint72C1C87B')"
API_URL="${API_URL_START}todo"
output=$(curl -H "Authorization: Bearer ${TEST_TOKEN}" \
  -X POST ${API_URL} \
  -d "{\"name\": \"Todo1\"}")
echo $output | jq -r '.'
TODO_ID_LAST=$(echo $output | jq -r '.todoId')
echo $TODO_ID_LAST
export TODO_ID_LAST
