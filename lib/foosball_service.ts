import core = require("@aws-cdk/core");
import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
import s3 = require("@aws-cdk/aws-s3");

export class FoosballService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, "Foosball");

    const createGameHandler = new lambda.Function(this, "CreateGameHandler", {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.asset("resources"),
      handler: "index.CreateGame",
      environment: {
        BUCKET: bucket.bucketName
      }
    });

    bucket.grantReadWrite(createGameHandler);

    const api = new apigateway.RestApi(this, "foosball-api", {
      restApiName: "Foosball Service",
      description: "This service serves foosball games."
    });

    const createGameIntegration = new apigateway.LambdaIntegration(createGameHandler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("POST", createGameIntegration);
  }
}
