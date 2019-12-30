import core = require("@aws-cdk/core");
import apigateway = require("@aws-cdk/aws-apigateway");
import lambda = require("@aws-cdk/aws-lambda");
import s3 = require("@aws-cdk/aws-s3");

export class FoosballService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id);

    const bucket = new s3.Bucket(this, "Foosball", {
      publicReadAccess: false
    });

    const lambdaProps = {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.asset("dist"),
      timeout: core.Duration.seconds(20),
      environment: {
        BUCKET: bucket.bucketName
      }
    }

    const findPlayerHandler = new lambda.Function(this, "FindPlayerHandler", {
      ...lambdaProps,
      handler: "index.FindPlayer",
    });

    const addPlayerHandler = new lambda.Function(this, "AddPlayerHandler", {
      ...lambdaProps,
      handler: "index.AddPlayer",
    });

    const initializeCompetitionHandler = new lambda.Function(this, "InitializeCompetitionHandler", {
      ...lambdaProps,
      handler: "index.InitializeCompetition",
    });

    const updateCurrentGameHandler = new lambda.Function(this, "UpdateCurrentGameHandler", {
      ...lambdaProps,
      handler: "index.UpdateCurrentGame",
    });

    const deleteCurrentGameHandler = new lambda.Function(this, "DeleteCurrentGameHandler", {
      ...lambdaProps,
      handler: "index.DeleteCurrentGame",
    });

    const finalizeGameHandler = new lambda.Function(this, "FinalizeGameHandler", {
      ...lambdaProps,
      handler: "index.FinalizeGame",
    });

    bucket.grantReadWrite(findPlayerHandler);
    bucket.grantReadWrite(addPlayerHandler);
    bucket.grantReadWrite(initializeCompetitionHandler);
    bucket.grantReadWrite(updateCurrentGameHandler);
    bucket.grantReadWrite(deleteCurrentGameHandler);
    bucket.grantReadWrite(finalizeGameHandler);

    const api = new apigateway.RestApi(this, "foosball-api", {
      restApiName: "Foosball Service",
      description: "This service serves foosball games."
    });

    const players = api.root.addResource('Players');
    const singlePlayer = players.addResource('{playerId}');
    const findPlayer = singlePlayer.addResource('Find');
    const addPlayer = singlePlayer.addResource('Add');

    const competitions = api.root.addResource('Competitions');
    const singleCompetition = competitions.addResource('{competitionId}');
    const initCompetition = singleCompetition.addResource('Initialize');
    const currentCompetition = singleCompetition.addResource('Current');
    const finalizeCompetition = singleCompetition.addResource('Finalize');

    // const methodProps = {
    //   authorizationType: apigateway.AuthorizationType.IAM,
    // }

    const findPlayerIntegration = new apigateway.LambdaIntegration(findPlayerHandler);
    findPlayer.addMethod('GET', findPlayerIntegration);

    const addPlayerIntegration = new apigateway.LambdaIntegration(addPlayerHandler);
    addPlayer.addMethod('PUT', addPlayerIntegration);

    const initializeCompetitionIntegration = new apigateway.LambdaIntegration(initializeCompetitionHandler);
    initCompetition.addMethod('POST', initializeCompetitionIntegration);

    const updateCurrentGameIntegration = new apigateway.LambdaIntegration(updateCurrentGameHandler);
    currentCompetition.addMethod('PUT', updateCurrentGameIntegration);

    const deleteCurrentGameIntegration = new apigateway.LambdaIntegration(deleteCurrentGameHandler);
    currentCompetition.addMethod('DELETE', deleteCurrentGameIntegration);

    const finalizeGameIntegration = new apigateway.LambdaIntegration(finalizeGameHandler);
    finalizeCompetition.addMethod('PUT', finalizeGameIntegration);

    addCorsOptions(findPlayer)
    addCorsOptions(addPlayer)
    addCorsOptions(initCompetition)
    addCorsOptions(currentCompetition)
    addCorsOptions(finalizeCompetition)
  }
}

export function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    }]
  })
}
