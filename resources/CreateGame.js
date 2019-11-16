const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const bucketName = process.env.BUCKET;

module.exports = async (event) => {
  const { httpMethod, body } = event
  console.log('Event:', JSON.parse(body))

  try {
    if (httpMethod === "POST") {
      return {
        statusCode: 200,
        headers: {},
        body: ''
      };
    }

    return {
      statusCode: 400,
      headers: {},
      body: "We only accept POST"
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
