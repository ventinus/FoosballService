#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { FoosballServiceStack } from '../lib/foosball_service-stack';

const app = new cdk.App();
new FoosballServiceStack(app, 'FoosballServiceStack');
