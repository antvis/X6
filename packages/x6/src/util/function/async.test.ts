import { toDeferredBoolean } from './async'

describe('async', () => {
  describe('#toDeferredBoolean', () => {
    it('should return a promise resloved true when input is true or truthy promise', async () => {
      let ret = await toDeferredBoolean(Promise.resolve(true))
      expect(ret).toBeTruthy()
      ret = await toDeferredBoolean(true, [true], Promise.resolve(true))
      expect(ret).toBe(true)
    })

    it('should return a promise resloved false when some input is falsy', async () => {
      const ret = await toDeferredBoolean(true, [true], Promise.resolve(false))
      expect(ret).toBe(false)
    })
  })
})
