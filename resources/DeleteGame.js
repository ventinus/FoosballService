const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const bucketName = process.env.BUCKET;

module.exports = async (event) => {
  const { httpMethod, body } = event

  try {
    if (httpMethod === "DELETE") {
      const { gameIdPrefix } = JSON.parse(body)

      await S3.deleteObject({
        Bucket: bucketName,
        Key: gameIdPrefix,
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
      body: "Game was not deleted."
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
