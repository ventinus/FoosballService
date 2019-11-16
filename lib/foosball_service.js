"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@aws-cdk/core");
const apigateway = require("@aws-cdk/aws-apigateway");
const lambda = require("@aws-cdk/aws-lambda");
const s3 = require("@aws-cdk/aws-s3");
class FoosballService extends core.Construct {
    constructor(scope, id) {
        super(scope, id);
        const bucket = new s3.Bucket(this, "Foosball");
        const handler = new lambda.Function(this, "CreateGameHandler", {
            runtime: lambda.Runtime.NODEJS_10_X,
            code: lambda.Code.asset("resources"),
            handler: "index.CreateGame",
            environment: {
                BUCKET: bucket.bucketName
            }
        });
        bucket.grantReadWrite(handler); // was: handler.role);
        const api = new apigateway.RestApi(this, "foosball-api", {
            restApiName: "Foosball Service",
            description: "This service serves foosball games."
        });
        const getWidgetsIntegration = new apigateway.LambdaIntegration(handler, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });
        api.root.addMethod("POST", getWidgetsIntegration);
    }
}
exports.FoosballService = FoosballService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vc2JhbGxfc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZvb3NiYWxsX3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBdUM7QUFDdkMsc0RBQXVEO0FBQ3ZELDhDQUErQztBQUMvQyxzQ0FBdUM7QUFFdkMsTUFBYSxlQUFnQixTQUFRLElBQUksQ0FBQyxTQUFTO0lBQ2pELFlBQVksS0FBcUIsRUFBRSxFQUFVO1FBQzNDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztRQUUvQyxNQUFNLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQzdELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQztZQUNwQyxPQUFPLEVBQUUsa0JBQWtCO1lBQzNCLFdBQVcsRUFBRTtnQkFDWCxNQUFNLEVBQUUsTUFBTSxDQUFDLFVBQVU7YUFDMUI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsc0JBQXNCO1FBRXRELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3ZELFdBQVcsRUFBRSxrQkFBa0I7WUFDL0IsV0FBVyxFQUFFLHFDQUFxQztTQUNuRCxDQUFDLENBQUM7UUFFSCxNQUFNLHFCQUFxQixHQUFHLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRTtZQUN0RSxnQkFBZ0IsRUFBRSxFQUFFLGtCQUFrQixFQUFFLHlCQUF5QixFQUFFO1NBQ3BFLENBQUMsQ0FBQztRQUVILEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQ3BELENBQUM7Q0FDRjtBQTVCRCwwQ0E0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY29yZSA9IHJlcXVpcmUoXCJAYXdzLWNkay9jb3JlXCIpO1xuaW1wb3J0IGFwaWdhdGV3YXkgPSByZXF1aXJlKFwiQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXlcIik7XG5pbXBvcnQgbGFtYmRhID0gcmVxdWlyZShcIkBhd3MtY2RrL2F3cy1sYW1iZGFcIik7XG5pbXBvcnQgczMgPSByZXF1aXJlKFwiQGF3cy1jZGsvYXdzLXMzXCIpO1xuXG5leHBvcnQgY2xhc3MgRm9vc2JhbGxTZXJ2aWNlIGV4dGVuZHMgY29yZS5Db25zdHJ1Y3Qge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY29yZS5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBcIkZvb3NiYWxsXCIpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgXCJDcmVhdGVHYW1lSGFuZGxlclwiLCB7XG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTBfWCxcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmFzc2V0KFwicmVzb3VyY2VzXCIpLFxuICAgICAgaGFuZGxlcjogXCJpbmRleC5DcmVhdGVHYW1lXCIsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBCVUNLRVQ6IGJ1Y2tldC5idWNrZXROYW1lXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBidWNrZXQuZ3JhbnRSZWFkV3JpdGUoaGFuZGxlcik7IC8vIHdhczogaGFuZGxlci5yb2xlKTtcblxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgXCJmb29zYmFsbC1hcGlcIiwge1xuICAgICAgcmVzdEFwaU5hbWU6IFwiRm9vc2JhbGwgU2VydmljZVwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiVGhpcyBzZXJ2aWNlIHNlcnZlcyBmb29zYmFsbCBnYW1lcy5cIlxuICAgIH0pO1xuXG4gICAgY29uc3QgZ2V0V2lkZ2V0c0ludGVncmF0aW9uID0gbmV3IGFwaWdhdGV3YXkuTGFtYmRhSW50ZWdyYXRpb24oaGFuZGxlciwge1xuICAgICAgcmVxdWVzdFRlbXBsYXRlczogeyBcImFwcGxpY2F0aW9uL2pzb25cIjogJ3sgXCJzdGF0dXNDb2RlXCI6IFwiMjAwXCIgfScgfVxuICAgIH0pO1xuXG4gICAgYXBpLnJvb3QuYWRkTWV0aG9kKFwiUE9TVFwiLCBnZXRXaWRnZXRzSW50ZWdyYXRpb24pO1xuICB9XG59XG4iXX0=