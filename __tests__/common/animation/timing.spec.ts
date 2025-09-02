import { describe, it, expect } from 'vitest'
import { Timing } from '@/common/animation/timing'

describe('Timing', () => {
  describe('basic definitions', () => {
    it('linear', () => {
      expect(Timing.linear(0)).toBe(0)
      expect(Timing.linear(0.5)).toBe(0.5)
      expect(Timing.linear(1)).toBe(1)
    })

    it('quad', () => {
      expect(Timing.quad(0.5)).toBeCloseTo(0.25)
    })

    it('cubic', () => {
      expect(Timing.cubic(0.5)).toBeCloseTo(0.125)
    })

    it('inout', () => {
      expect(Timing.inout(0)).toBe(0)
      expect(Timing.inout(1)).toBe(1)
      expect(typeof Timing.inout(0.3)).toBe('number')
    })

    it('exponential', () => {
      expect(Timing.exponential(1)).toBe(1)
      expect(Timing.exponential(0)).toBeCloseTo(Math.pow(2, -10))
    })

    it('bounce', () => {
      expect(Timing.bounce(0)).toBe(0)
      expect(Timing.bounce(1)).toBe(1)
    })
  })

  describe('decorators', () => {
    it('reverse', () => {
      const f = Timing.decorators.reverse(Timing.linear)
      expect(f(0)).toBe(0)
      expect(f(1)).toBe(1)
    })

    it('reflect', () => {
      const f = Timing.decorators.reflect(Timing.linear)
      expect(f(0)).toBe(0)
      expect(f(0.25)).toBeCloseTo(0.25)
      expect(f(0.75)).toBeCloseTo(0.75)
    })

    it('clamp', () => {
      const f = Timing.decorators.clamp((t) => t * 2, 0, 1)
      expect(f(-1)).toBe(0)
      expect(f(0.25)).toBe(0.5)
      expect(f(1)).toBe(1)
      expect(f(2)).toBe(1)
    })

    it('back', () => {
      const f = Timing.decorators.back()
      expect(f(0)).toBeCloseTo(0)
      expect(typeof f(0.5)).toBe('number')
    })

    it('elastic', () => {
      const f = Timing.decorators.elastic()
      expect(f(0)).toBeCloseTo(0)
      expect(typeof f(0.5)).toBe('number')
    })
  })

  describe('sine family', () => {
    it('easeInSine', () => {
      expect(Timing.easeInSine(0)).toBe(0)
      expect(Timing.easeInSine(1)).toBeCloseTo(1)
    })

    it('easeOutSine', () => {
      expect(Timing.easeOutSine(0)).toBe(0)
      expect(Timing.easeOutSine(1)).toBe(1)
    })

    it('easeInOutSine', () => {
      expect(Timing.easeInOutSine(0)).toBeCloseTo(0)
      expect(Timing.easeInOutSine(1)).toBeCloseTo(1)
    })
  })

  describe('quad/cubic/quart/quint', () => {
    it('easeInQuad', () => {
      expect(Timing.easeInQuad(0.5)).toBeCloseTo(0.25)
    })

    it('easeOutQuad', () => {
      expect(Timing.easeOutQuad(0.5)).toBeCloseTo(0.75)
    })

    it('easeInOutQuad', () => {
      expect(Timing.easeInOutQuad(0.25)).toBeCloseTo(0.125)
      expect(Timing.easeInOutQuad(0.75)).toBeCloseTo(0.875)
    })

    it('easeInCubic', () => {
      expect(Timing.easeInCubic(0.5)).toBeCloseTo(0.125)
    })

    it('easeOutCubic', () => {
      expect(Timing.easeOutCubic(0.5)).toBeCloseTo(0.875)
    })

    it('easeInOutCubic', () => {
      expect(Timing.easeInOutCubic(0.25)).toBeCloseTo(0.0625)
      expect(Timing.easeInOutCubic(0.75)).toBeCloseTo(0.9375)
    })
  })

  describe('expo/circ', () => {
    it('easeInExpo', () => {
      expect(Timing.easeInExpo(0)).toBe(0)
      expect(Timing.easeInExpo(1)).toBeCloseTo(1)
    })

    it('easeOutExpo', () => {
      expect(Timing.easeOutExpo(0)).toBeCloseTo(0)
      expect(Timing.easeOutExpo(1)).toBe(1)
    })

    it('easeInOutExpo', () => {
      expect(Timing.easeInOutExpo(0)).toBe(0)
      expect(Timing.easeInOutExpo(1)).toBe(1)
    })

    it('easeInCirc', () => {
      expect(Timing.easeInCirc(0)).toBeCloseTo(0)
      expect(Timing.easeInCirc(1)).toBe(1)
    })

    it('easeOutCirc', () => {
      expect(Timing.easeOutCirc(0)).toBeCloseTo(0)
      expect(Timing.easeOutCirc(1)).toBe(1)
    })

    it('easeInOutCirc', () => {
      expect(Timing.easeInOutCirc(0)).toBeCloseTo(0)
      expect(Timing.easeInOutCirc(1)).toBeCloseTo(1)
    })
  })

  describe('back/elastic/bounce', () => {
    it('easeInBack / easeOutBack / easeInOutBack', () => {
      expect(Timing.easeInBack(0)).toBeCloseTo(0)
      expect(Timing.easeOutBack(1)).toBe(1)
      expect(Timing.easeInOutBack(0)).toBeCloseTo(0)
      expect(Timing.easeInOutBack(1)).toBe(1)
    })

    it('easeInElastic / easeOutElastic / easeInOutElastic', () => {
      expect(Timing.easeInElastic(0)).toBe(0)
      expect(Timing.easeInElastic(1)).toBe(1)
      expect(Timing.easeOutElastic(0)).toBe(0)
      expect(Timing.easeOutElastic(1)).toBe(1)
      expect(Timing.easeInOutElastic(0)).toBe(0)
      expect(Timing.easeInOutElastic(1)).toBe(1)
    })

    it('easeOutBounce', () => {
      expect(Timing.easeOutBounce(0)).toBe(0)
      expect(Timing.easeOutBounce(1)).toBe(1)
    })

    it('easeInBounce', () => {
      expect(Timing.easeInBounce(0)).toBe(0)
      expect(Timing.easeInBounce(1)).toBe(1)
    })

    it('easeInOutBounce', () => {
      expect(Timing.easeInOutBounce(0)).toBe(0)
      expect(Timing.easeInOutBounce(1)).toBe(1)
    })
  })
})
