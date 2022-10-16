import sinon from 'sinon'
import { Dom } from '../../dom'

describe('af', () => {
  describe('#requestAnimationFrame', () => {
    it('should call the callback', (done) => {
      Dom.requestAnimationFrame(() => {
        expect(1).toEqual(1)
        done()
      })
    })
  })

  describe('#cancelAnimationFrame', () => {
    it('requestAnimationFrame can be cancel', (done) => {
      const spy = sinon.spy()
      const id = Dom.requestAnimationFrame(spy)
      Dom.cancelAnimationFrame(id)
      setTimeout(() => {
        expect(spy.callCount).toEqual(0)
        done()
      }, 100)
    })
  })
})
