import { StringExt } from '../../string'

describe('string', () => {
  describe('#uuid', () => {
    it('should generate uuids with RFC-4122 format', () => {
      for (let i = 0; i < 10000; i += 1) {
        expect(StringExt.uuid()).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        )
      }
    })
  })
})
