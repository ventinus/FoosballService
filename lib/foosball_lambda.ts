import core = require("@aws-cdk/core");
import apigateway = require("@aws-cdk/aws-apigateway");
import s3 = require("@aws-cdk/aws-s3");

export default class FoosballLambda extends core.Construct {
  constructor(scope: core.Construct, id: string, bucket: s3.Bucket, api: apigateway.RestApi) {
    super(scope, id);

  }
}
