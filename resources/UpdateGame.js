const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const bucketName = process.env.BUCKET;

module.exports = async (event) => {
  const { httpMethod, body } = event
  
  const { gameId, ...newAttributes } = JSON.parse(body)

  try {
    if (httpMethod === "PUT") {
      if (event.path === "/") {
        const body = await S3.listObjectsV2({ Bucket: bucketName, Key: gameId }).promise();
        const previewsAttributes = JSON.parse(body)

        const base64data = new Buffer({...previewsAttributes, ...newAttributes}, 'binary')


        await S3.putObject({
          Bucket: bucketName,
          Key: widgetName,
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
        body: "We only accept PUT"
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
