const AWS = require('aws-sdk');
const { applyUpdatesToCurrent } = require('./utils')

const s3 = new AWS.S3();

const bucketName = process.env.BUCKET;
const headers = {}

module.exports = async (event) => {
  const { httpMethod, body, pathParameters: { competitionId } } = event

  const updates = JSON.parse(body)

  const params = {
    Bucket: bucketName,
    Key: competitionId,
  }

  try {
    if (httpMethod === "PUT") {
      const result = await applyUpdatesToCurrent(s3, params, updates)

      return {
        headers,
        statusCode: 200,
        body: JSON.stringify(result)
      };
    }

    return {
      headers,
      statusCode: 400,
      body: JSON.stringify({ message: "This endpoint only accepts PUT" })
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
