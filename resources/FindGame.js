const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const bucketName = process.env.BUCKET;

module.exports = async (event) => {
  const { httpMethod, body } = event
  
  const { gameIdPrefix } = JSON.parse(body)

  try {
    if (httpMethod === "GET") {
      if (event.path === "/") {
        const body = await S3.listObjectsV2({ Bucket: bucketName, Key: gameIdPrefix }).promise();

        return {
          statusCode: 200,
          headers: {},
          body: JSON.stringify(body)
        };
      }

      return {
        statusCode: 400,
        headers: {},
        body: "We only accept GET"
      };
    }
  } catch (error) {
    const body = error.stack || JSON.stringify(error, null, 2);
    return {
      statusCode: 400,
      headers: {},
      body: JSON.stringify(body)
    }
  }
}
