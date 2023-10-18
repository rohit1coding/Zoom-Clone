# Serverless Email Tracking Function

This Serverless Framework project deploys an AWS Lambda function that tracks email events using SQS as an event source. The function can be deployed with different stages, including staging and production.

## Prerequisites

Before deploying the function, ensure that you have the following prerequisites installed and configured:

- Node.js and npm: [Node.js Installation](https://nodejs.org/)
- Serverless Framework: [Serverless Installation](https://www.serverless.com/framework/docs/getting-started/)
- AWS CLI: [AWS CLI Installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

## Usage

### Deployment

In order to deploy the example, you need to run the following command:

```
$ serverless deploy --stage <stage-name>

```
stage-name can be dev, staging or production

After running deploy, you should see output similar to:

```bash
Deploying aws-node-project to stage dev (ap-south-1)

✔ Service deployed to stack aws-node-project-dev (112s)

functions:
  emailTracking: aws-node-project-dev-hello (1.5 kB)
```

### Invocation

After successful deployment, you can invoke the deployed function by using the following command:

```bash
serverless invoke --function emailTracking --stage <stage-name>
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function emailTracking --stage <stage-name>
```
