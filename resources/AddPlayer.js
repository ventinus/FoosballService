const AWS = require('aws-sdk');
const { getPlayers } = require('./utils')

const s3 = new AWS.S3();

const bucketName = process.env.BUCKET;
const headers = {}

module.exports = async (event) => {
  const { httpMethod, body, pathParameters: { playerId } } = event

  const { alias } = JSON.parse(body)

  const params = { Bucket: bucketName }

  try {
    if (httpMethod === "PUT") {
      const players = await getPlayers(s3, params)

      const body = {
        ...players,
        [playerId]: alias,
      }

      await s3.putObject({
        ...params,
        Key: 'players.json',
        Body: JSON.stringify(body),
        ContentType: 'application/json'
      }).promise()

      return {
        headers,
        statusCode: 200,
        body: JSON.stringify({
          alias,
          id: +playerId,
        })
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
