const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const bucketName = process.env.BUCKET;

module.exports = async (event) => {
  const { httpMethod, body } = event

  try {
    if (httpMethod === "POST") {
      const { gameIdPrefix } = JSON.parse(body)

      const data = {
        startedAt: new Date(),
        endedAt: null,
        t1Score: 0,
        t2Score: 0
      }
    
      const base64data = new Buffer(data, 'binary')

      await S3.putObject({
        Bucket: bucketName,
        Key: gameIdPrefix,
        Body: base64data,
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
