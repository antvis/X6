import sinon from 'sinon'
import { requestAnimationFrame, cancelAnimationFrame } from './af'

describe('af', () => {
  describe('#requestAnimationFrame', () => {
    it('should call the callback', (done) => {
      requestAnimationFrame(() => {
        expect(1).toEqual(1)
        done()
      })
    })
  })

  describe('#cancelAnimationFrame', () => {
    it('requestAnimationFrame can be cancel', (done) => {
      const spy = sinon.spy()
      const id = requestAnimationFrame(spy)
      cancelAnimationFrame(id)
      setTimeout(() => {
        expect(spy.callCount).toEqual(0)
        done()
      }, 100)
    })
  })
})
