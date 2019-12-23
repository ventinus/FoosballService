const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const bucketName = process.env.BUCKET;
const headers = {}

module.exports = async (event) => {
  const { httpMethod, pathParameters: { competitionId } } = event

  try {
    if (httpMethod === "POST") {
      let body
      try {
        const response = await s3.getObject({ Bucket: bucketName, Key: `${competitionId}.json` }).promise();
        body = JSON.parse(response.Body.toString('utf-8'))
      } catch (error) {
        if (error.code !== 'NoSuchKey') throw error
        body = { completed: [], current: null }
        await s3.putObject({
          Bucket: bucketName,
          Key: competitionId,
          Body: JSON.stringify(body),
          ContentType: 'application/json'
        }).promise();
      }

      return {
        headers,
        statusCode: 200,
        body: JSON.stringify(body)
      };
    }

    return {
      headers,
      statusCode: 400,
      body: JSON.stringify({ message: "This endpoint only accepts POST" })
    };
  } catch (error) {
    const body = error.stack || JSON.stringify(error, null, 2);
    return {
      headers,
      statusCode: 400,
      body: JSON.stringify(body)
    }
  }
}
