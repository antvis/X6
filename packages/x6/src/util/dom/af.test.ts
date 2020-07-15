import { requestAnimationFrame, cancelAnimationFrame } from './af'

describe('af', () => {
  describe('#requestAnimationFrame', () => {
    it('should call the callback', async () => {
      const callback = jest.fn()
      requestAnimationFrame(() => {
        callback()
      })
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 50)
      })
      expect(callback).toBeCalled()
    })
  })

  describe('#cancelAnimationFrame', () => {
    it('requestAnimationFrame can be cancel', async () => {
      const callback = jest.fn()
      const id = requestAnimationFrame(callback)
      cancelAnimationFrame(id)
      await new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, 50)
      })
      expect(callback).not.toBeCalled()
    })
  })
})