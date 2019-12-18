const { applyUpdatesToCurrent } = require('.')

class S3Error extends Error {
  constructor() {
    super()
    this.code = 'NoSuchKey'
  }
}

const s3 = {}
const promise = function() {
  return {
    Body: JSON.stringify(this)
  }
}
const mockS3 = (getData) => {
  s3.getObject = jest.fn(() => {
    if (getData) {
      return {
        promise: promise.bind(getData)
      }
    }
    throw new S3Error
  })

  s3.putObject = jest.fn(() => ({ promise }))
}

const emptyData = {
  completed: [],
  current: null
}

const getBody = fn => fn.mock.calls[0][0].Body

describe('#applyUpdatesToCurrent', () => {

  describe('UpdateCurrentGame', () => {
    it('should create a new object with updates when none found', async () => {
      mockS3()
      await applyUpdatesToCurrent(s3, {}, { foo: 'bar' })
      expect(JSON.parse(getBody(s3.putObject))).toEqual({
        completed: [],
        current: {
          foo: 'bar'
        }
      })
    })

    it('should update the current from null to next state', async () => {
      mockS3(emptyData)
      await applyUpdatesToCurrent(s3, {}, { foo: 'bar' })
      expect(JSON.parse(getBody(s3.putObject))).toEqual({
        completed: [],
        current: { foo: 'bar' }
      })
    })

    it('should merge the current and next state', async () => {
      mockS3({ completed: [], current: { foo: 'bar' } })
      await applyUpdatesToCurrent(s3, {}, { foo: 'car' })
      expect(JSON.parse(getBody(s3.putObject))).toEqual({
        completed: [],
        current: { foo: 'car' }
      })
    })
  })

  describe('DeleteCurrentGame', () => {
    it('should create a new object when none found', async () => {
      mockS3()
      await applyUpdatesToCurrent(s3, {}, null)
      expect(JSON.parse(getBody(s3.putObject))).toEqual({
        completed: [],
        current: null
      })
    })

    it('should update the current to be null', async () => {
      mockS3({ completed: [], current: { baz: 'bar' } })
      await applyUpdatesToCurrent(s3, {}, null)
      expect(JSON.parse(getBody(s3.putObject))).toEqual({
        completed: [],
        current: null
      })
    })
  })
})
