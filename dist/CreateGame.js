const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const bucketName = process.env.BUCKET;

module.exports = async (event) => {
  const { httpMethod, body } = event

  try {
    if (httpMethod === "POST") {
      const { competitionId } = JSON.parse(body)

      const currentCompleted = await S3.getObject({
        Bucket: bucketName,
        Key: competitionId,
      }).promise()

      const data = {
        completed: currentCompleted,
        current: {
          startedAt: new Date(),
          endedAt: null,
          t1Score: 0,
          t2Score: 0
        }
      }

      await S3.putObject({
        Bucket: bucketName,
        Key: competitionId,
        Body: JSON.stringify(data),
        ContentType: 'application/json'
      }).promise();

      return {
        statusCode: 200,
        headers: {},
        body: ''
      };
    }

    return {
      statusCode: 400,
      headers: {},
      body: "Game was not created."
    };
  } catch (error) {
    const body = error.stack || JSON.stringify(error, null, 2);
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify(body)
    }
  }
}
