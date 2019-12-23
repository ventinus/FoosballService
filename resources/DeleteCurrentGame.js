const AWS = require('aws-sdk');
const { applyUpdatesToCurrent } = require('./utils')

const s3 = new AWS.S3();

const bucketName = process.env.BUCKET;
const headers = {}

module.exports = async (event) => {
  const { httpMethod, pathParameters: { competitionId } } = event

  const params = {
    Bucket: bucketName,
    Key: `${competitionId}.json`,
  }

  try {
    if (httpMethod === "DELETE") {
      await applyUpdatesToCurrent(s3, params, null)

      return {
        headers,
        statusCode: 200, // TODO: how to make this respond with 202 (currently throws an internal server error)
        body: JSON.stringify('')
      }
    }

    return {
      headers,
      statusCode: 400,
      body: JSON.stringify({ message: "This endpoint only accepts DELETE" })
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
