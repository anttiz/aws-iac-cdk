# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
* `cdk deploy -O outputs.json` Deploy and output variables
* `npm run deploy`  combines the build and deploy

## Instructions
1. Setup project with `npm install`
2. Perform another `npm install` in `src` folder
3. Create .env files based on .env.default files in root and src directories
4. ensure AWS profile exists by using `export AWS_PROFILE=<profile>`
5. Deploy by using `npm run deploy`
6. Create user by command `source ./login.sh`
7. Test GET API with `./test-get-todos.sh`
8. Create item with `./test-create.sh`
9. Test GET API with `./test-get-todos.sh`
