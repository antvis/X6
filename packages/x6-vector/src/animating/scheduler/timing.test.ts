import sinon from 'sinon'
import { Timing } from './timing'
import { MockRAF } from '../../global/mock-raf'
import { Global } from '../../global'

describe('Animator.js', () => {
  let raf: MockRAF

  beforeEach(() => {
    raf = new MockRAF()
    raf.install(Global.getWindow())
    Timing.clean()
  })

  afterEach(() => {
    raf.uninstall(Global.getWindow())
  })

  describe('timeout()', () => {
    it('should call a function after a specific time', () => {
      const spy = sinon.spy()
      Timing.timeout(spy, 100)
      raf.tick(99)
      expect(spy).not.toHaveBeenCalled()
      raf.tick()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('cancelTimeout()', () => {
    it('should cancel a timeout which was created with timeout()', () => {
      const spy = sinon.spy()

      const id = Timing.timeout(spy, 100)
      Timing.clearTimeout(id)

      expect(spy).not.toHaveBeenCalled()
      raf.tick(100)
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('frame()', () => {
    it('should call a function at the next animationFrame', () => {
      const spy = sinon.spy()

      Timing.frame(spy)
      expect(spy).not.toHaveBeenCalled()
      raf.tick()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('cancelFrame()', () => {
    it('should cancel a single frame which was created with frame()', () => {
      const spy = sinon.spy()

      const id = Timing.frame(spy)
      Timing.cancelFrame(id)

      expect(spy).not.toHaveBeenCalled()
      raf.tick()
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('immediate()', () => {
    it('should call a function at the next animationFrame but after all frames are processed', () => {
      const spy = sinon.spy()

      Timing.immediate(spy)

      expect(spy).not.toHaveBeenCalled()
      raf.tick()
      expect(spy).toHaveBeenCalled()
    })
  })

  describe('cancelImmediate()', () => {
    it('should cancel an immediate cakk which was created with immediate()', () => {
      const spy = sinon.spy()

      const id = Timing.immediate(spy)
      Timing.cancelImmediate(id)

      expect(spy).not.toHaveBeenCalled()
      raf.tick()
      expect(spy).not.toHaveBeenCalled()
    })
  })
})
