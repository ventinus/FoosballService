import cdk = require('@aws-cdk/core');
import foosball_service = require('./foosball_service');

export class FoosballServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new foosball_service.FoosballService(this, 'Foosball')
  }
}
