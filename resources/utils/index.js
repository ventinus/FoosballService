
exports.applyUpdatesToCurrent = async (s3Client, params, updates) => {
  let body
  try {
    const response = await s3Client.getObject(params).promise();
    const data = JSON.parse(response.Body.toString('utf-8'))
    let updatedCurrent
    if (data.current && updates) {
      updatedCurrent = {
        ...data.current,
        ...updates,
      }
    } else if (updates || updates === null) {
      updatedCurrent = updates
    } else {
      updatedCurrent = data.current
    }
    body = {
      completed: data.completed,
      current: updatedCurrent
    }

    await s3Client.putObject({
      ...params,
      Body: JSON.stringify(body),
      ContentType: 'application/json'
    }).promise();

  } catch (error) {
    if (error.code !== 'NoSuchKey') throw error

    body = {
      completed: [],
      current: updates || null
    }

    await s3Client.putObject({
      ...params,
      Body: JSON.stringify(body),
      ContentType: 'application/json'
    }).promise();
  }

  return Promise.resolve(body)
}
