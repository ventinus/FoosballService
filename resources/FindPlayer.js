const AWS = require('aws-sdk');
const { getPlayers } = require('./utils')

const s3 = new AWS.S3();

const bucketName = process.env.BUCKET;
const headers = {}

module.exports = async (event) => {
  const { httpMethod, body, pathParameters: { playerId } } = event

  const params = { Bucket: bucketName }

  try {
    if (httpMethod === "GET") {
      const players = await getPlayers(s3, params)

      const result = {
        id: +playerId,
        alias: players[playerId],
      }

      return {
        headers,
        statusCode: 200,
        body: JSON.stringify(result)
      };
    }

    return {
      headers,
      statusCode: 400,
      body: JSON.stringify({ message: "This endpoint only accepts GET" })
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
