const AWS = require('aws-sdk');

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
      const response = await s3.getObject(params).promise();
      const data = JSON.parse(response.Body.toString('utf-8'))

      const updatedBody = {
        completed: [{ ...data.current, ...updates }, ...data.completed],
        current: null
      }

      await s3.putObject({
        ...params,
        Body: JSON.stringify(updatedBody),
        ContentType: 'application/json'
      }).promise();

      return {
        headers,
        statusCode: 200,
      };
    }

    return {
      headers,
      statusCode: 400,
      body: "This endpoint only accepts PUT"
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
