import { describe, expect, it } from 'vitest'
import { Timing as timing } from '../../../src/common/animation'

describe('timing functions', () => {
  describe('basic easing functions', () => {
    it('should return correct values for linear', () => {
      expect(timing.linear(0)).toBeCloseTo(0)
      expect(timing.linear(0.5)).toBeCloseTo(0.5)
      expect(timing.linear(1)).toBeCloseTo(1)
    })

    it('should return correct values for quad', () => {
      expect(timing.quad(0)).toBeCloseTo(0)
      expect(timing.quad(0.5)).toBeCloseTo(0.25)
      expect(timing.quad(1)).toBeCloseTo(1)
    })

    it('should return correct values for cubic', () => {
      expect(timing.cubic(0)).toBeCloseTo(0)
      expect(timing.cubic(0.5)).toBeCloseTo(0.125)
      expect(timing.cubic(1)).toBeCloseTo(1)
    })

    it('should return correct values for inout', () => {
      expect(timing.inout(-1)).toBeCloseTo(0)
      expect(timing.inout(0)).toBeCloseTo(0)
      expect(timing.inout(0.25)).toBeCloseTo(0.0625)
      expect(timing.inout(0.5)).toBeCloseTo(0.5)
      expect(timing.inout(0.75)).toBeCloseTo(0.9375)
      expect(timing.inout(1)).toBeCloseTo(1)
      expect(timing.inout(2)).toBeCloseTo(1)
    })

    it('should return correct values for exponential', () => {
      expect(timing.exponential(0)).toBeCloseTo(0.001953125)
      expect(timing.exponential(0.5)).toBeCloseTo(0.03125)
      expect(timing.exponential(1)).toBeCloseTo(1)
    })

    it('should return correct values for bounce', () => {
      expect(timing.bounce(0)).toBeCloseTo(0)
      expect(timing.bounce(0.5)).toBeCloseTo(0.234375)
      expect(timing.bounce(1)).toBeCloseTo(1)
    })
  })

  describe('decorators', () => {
    it('should reverse function correctly', () => {
      const reversed = timing.decorators.reverse(timing.linear)
      expect(reversed(0)).toBeCloseTo(0)
      expect(reversed(0.5)).toBeCloseTo(0.5)
      expect(reversed(1)).toBeCloseTo(1)
    })

    it('should reflect function correctly', () => {
      const reflected = timing.decorators.reflect(timing.linear)
      expect(reflected(0)).toBeCloseTo(0)
      expect(reflected(0.25)).toBeCloseTo(0.25)
      expect(reflected(0.5)).toBeCloseTo(0.5)
      expect(reflected(0.75)).toBeCloseTo(0.75)
      expect(reflected(1)).toBeCloseTo(1)
    })

    it('should clamp function correctly with default values', () => {
      const clamped = timing.decorators.clamp((t) => t * 2)
      expect(clamped(0.5)).toBeCloseTo(1)
      expect(clamped(0.6)).toBeCloseTo(1)
      expect(clamped(-0.1)).toBeCloseTo(0)
    })

    it('should clamp function correctly with custom values', () => {
      const clamped = timing.decorators.clamp((t) => t * 10, 2, 8)
      expect(clamped(0.1)).toBeCloseTo(2)
      expect(clamped(0.5)).toBeCloseTo(5)
      expect(clamped(0.9)).toBeCloseTo(8)
    })

    it('should create back function with default parameter', () => {
      const back = timing.decorators.back()
      expect(back(0)).toBeCloseTo(0)
      expect(back(1)).toBeCloseTo(1)
    })

    it('should create back function with custom parameter', () => {
      const back = timing.decorators.back(2)
      expect(back(0)).toBeCloseTo(0)
      expect(back(1)).toBeCloseTo(1)
    })

    it('should create elastic function with default parameter', () => {
      const elastic = timing.decorators.elastic()
      expect(elastic(0)).toBeCloseTo(0.001953125)
      expect(elastic(1)).toBeCloseTo(1)
    })

    it('should create elastic function with custom parameter', () => {
      const elastic = timing.decorators.elastic(2)
      expect(elastic(0)).toBeCloseTo(0.001953125)
      expect(elastic(1)).toBeCloseTo(-0.5)
    })
  })

  describe('sine easing functions', () => {
    it('should return correct values for easeInSine', () => {
      expect(timing.easeInSine(0)).toBeCloseTo(0)
      expect(timing.easeInSine(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeOutSine', () => {
      expect(timing.easeOutSine(0)).toBeCloseTo(0)
      expect(timing.easeOutSine(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInOutSine', () => {
      expect(timing.easeInOutSine(0)).toBeCloseTo(0)
      expect(timing.easeInOutSine(0.5)).toBeCloseTo(0.5)
      expect(timing.easeInOutSine(1)).toBeCloseTo(1)
    })
  })

  describe('quad easing functions', () => {
    it('should return correct values for easeInQuad', () => {
      expect(timing.easeInQuad(0)).toBeCloseTo(0)
      expect(timing.easeInQuad(0.5)).toBeCloseTo(0.25)
      expect(timing.easeInQuad(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeOutQuad', () => {
      expect(timing.easeOutQuad(0)).toBeCloseTo(0)
      expect(timing.easeOutQuad(0.5)).toBeCloseTo(0.75)
      expect(timing.easeOutQuad(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInOutQuad', () => {
      expect(timing.easeInOutQuad(0)).toBeCloseTo(0)
      expect(timing.easeInOutQuad(0.25)).toBeCloseTo(0.125)
      expect(timing.easeInOutQuad(0.5)).toBeCloseTo(0.5)
      expect(timing.easeInOutQuad(0.75)).toBeCloseTo(0.875)
      expect(timing.easeInOutQuad(1)).toBeCloseTo(1)
    })
  })

  describe('cubic easing functions', () => {
    it('should return correct values for easeInCubic', () => {
      expect(timing.easeInCubic(0)).toBeCloseTo(0)
      expect(timing.easeInCubic(0.5)).toBeCloseTo(0.125)
      expect(timing.easeInCubic(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeOutCubic', () => {
      expect(timing.easeOutCubic(0)).toBeCloseTo(0)
      expect(timing.easeOutCubic(0.5)).toBeCloseTo(0.875)
      expect(timing.easeOutCubic(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInOutCubic', () => {
      expect(timing.easeInOutCubic(0)).toBeCloseTo(0)
      expect(timing.easeInOutCubic(0.25)).toBeCloseTo(0.0625)
      expect(timing.easeInOutCubic(0.5)).toBeCloseTo(0.5)
      expect(timing.easeInOutCubic(0.75)).toBeCloseTo(0.9375)
      expect(timing.easeInOutCubic(1)).toBeCloseTo(1)
    })
  })

  describe('quart easing functions', () => {
    it('should return correct values for easeInQuart', () => {
      expect(timing.easeInQuart(0)).toBeCloseTo(0)
      expect(timing.easeInQuart(0.5)).toBeCloseTo(0.0625)
      expect(timing.easeInQuart(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeOutQuart', () => {
      expect(timing.easeOutQuart(0)).toBeCloseTo(0)
      expect(timing.easeOutQuart(0.5)).toBeCloseTo(0.9375)
      expect(timing.easeOutQuart(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInOutQuart', () => {
      expect(timing.easeInOutQuart(0)).toBeCloseTo(0)
      expect(timing.easeInOutQuart(0.25)).toBeCloseTo(0.03125)
      expect(timing.easeInOutQuart(0.5)).toBeCloseTo(0.5)
      expect(timing.easeInOutQuart(0.75)).toBeCloseTo(0.96875)
      expect(timing.easeInOutQuart(1)).toBeCloseTo(1)
    })
  })

  describe('quint easing functions', () => {
    it('should return correct values for easeInQuint', () => {
      expect(timing.easeInQuint(0)).toBeCloseTo(0)
      expect(timing.easeInQuint(0.5)).toBeCloseTo(0.03125)
      expect(timing.easeInQuint(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeOutQuint', () => {
      expect(timing.easeOutQuint(0)).toBeCloseTo(0)
      expect(timing.easeOutQuint(0.5)).toBeCloseTo(0.96875)
      expect(timing.easeOutQuint(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInOutQuint', () => {
      expect(timing.easeInOutQuint(0)).toBeCloseTo(0)
      expect(timing.easeInOutQuint(0.25)).toBeCloseTo(0.015625)
      expect(timing.easeInOutQuint(0.5)).toBeCloseTo(0.5)
      expect(timing.easeInOutQuint(0.75)).toBeCloseTo(0.984375)
      expect(timing.easeInOutQuint(1)).toBeCloseTo(1)
    })
  })

  describe('expo easing functions', () => {
    it('should return correct values for easeInExpo', () => {
      expect(timing.easeInExpo(0)).toBeCloseTo(0)
      expect(timing.easeInExpo(0.5)).toBeCloseTo(0.03125)
      expect(timing.easeInExpo(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeOutExpo', () => {
      expect(timing.easeOutExpo(0)).toBeCloseTo(0)
      expect(timing.easeOutExpo(0.5)).toBeCloseTo(0.96875)
      expect(timing.easeOutExpo(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInOutExpo', () => {
      expect(timing.easeInOutExpo(0)).toBeCloseTo(0)
      expect(timing.easeInOutExpo(0.25)).toBeCloseTo(0.015625)
      expect(timing.easeInOutExpo(0.5)).toBeCloseTo(0.5)
      expect(timing.easeInOutExpo(0.75)).toBeCloseTo(0.984375)
      expect(timing.easeInOutExpo(1)).toBeCloseTo(1)
    })
  })

  describe('circ easing functions', () => {
    it('should return correct values for easeInCirc', () => {
      expect(timing.easeInCirc(0)).toBeCloseTo(0)
      expect(timing.easeInCirc(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeOutCirc', () => {
      expect(timing.easeOutCirc(0)).toBeCloseTo(0)
      expect(timing.easeOutCirc(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInOutCirc', () => {
      expect(timing.easeInOutCirc(0)).toBeCloseTo(0)
      expect(timing.easeInOutCirc(0.5)).toBeCloseTo(0.5)
      expect(timing.easeInOutCirc(1)).toBeCloseTo(1)
    })
  })

  describe('back easing functions', () => {
    it('should return correct values for easeInBack with default magnitude', () => {
      expect(timing.easeInBack(0)).toBeCloseTo(0)
      expect(timing.easeInBack(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInBack with custom magnitude', () => {
      expect(timing.easeInBack(0, 2)).toBeCloseTo(0)
      expect(timing.easeInBack(1, 2)).toBeCloseTo(1)
    })

    it('should return correct values for easeOutBack with default magnitude', () => {
      expect(timing.easeOutBack(0)).toBeCloseTo(0)
      expect(timing.easeOutBack(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeOutBack with custom magnitude', () => {
      expect(timing.easeOutBack(0, 2)).toBeCloseTo(0)
      expect(timing.easeOutBack(1, 2)).toBeCloseTo(1)
    })

    it('should return correct values for easeInOutBack with default magnitude', () => {
      expect(timing.easeInOutBack(0)).toBeCloseTo(0)
      expect(timing.easeInOutBack(0.5)).toBeCloseTo(0.5)
      expect(timing.easeInOutBack(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInOutBack with custom magnitude', () => {
      expect(timing.easeInOutBack(0, 2)).toBeCloseTo(0)
      expect(timing.easeInOutBack(0.5, 2)).toBeCloseTo(0.5)
      expect(timing.easeInOutBack(1, 2)).toBeCloseTo(1)
    })
  })

  describe('elastic easing functions', () => {
    it('should return correct values for easeInElastic with default magnitude', () => {
      expect(timing.easeInElastic(0)).toBeCloseTo(0)
      expect(timing.easeInElastic(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInElastic with custom magnitude', () => {
      expect(timing.easeInElastic(0, 0.5)).toBeCloseTo(0)
      expect(timing.easeInElastic(1, 0.5)).toBeCloseTo(1)
    })

    it('should return correct values for easeOutElastic with default magnitude', () => {
      expect(timing.easeOutElastic(0)).toBeCloseTo(0)
      expect(timing.easeOutElastic(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeOutElastic with custom magnitude', () => {
      expect(timing.easeOutElastic(0, 0.5)).toBeCloseTo(0)
      expect(timing.easeOutElastic(1, 0.5)).toBeCloseTo(1)
    })

    it('should return correct values for easeInOutElastic with default magnitude', () => {
      expect(timing.easeInOutElastic(0)).toBeCloseTo(0)
      expect(timing.easeInOutElastic(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInOutElastic with custom magnitude', () => {
      expect(timing.easeInOutElastic(0, 0.5)).toBeCloseTo(0)
      expect(timing.easeInOutElastic(1, 0.5)).toBeCloseTo(1)
    })
  })

  describe('bounce easing functions', () => {
    it('should return correct values for easeOutBounce', () => {
      expect(timing.easeOutBounce(0)).toBeCloseTo(0)
      expect(timing.easeOutBounce(0.2)).toBeCloseTo(0.3025)
      expect(timing.easeOutBounce(0.6)).toBeCloseTo(0.7725)
      expect(timing.easeOutBounce(0.8)).toBeCloseTo(0.94)
      expect(timing.easeOutBounce(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInBounce', () => {
      expect(timing.easeInBounce(0)).toBeCloseTo(0)
      expect(timing.easeInBounce(1)).toBeCloseTo(1)
    })

    it('should return correct values for easeInOutBounce', () => {
      expect(timing.easeInOutBounce(0)).toBeCloseTo(0)
      expect(timing.easeInOutBounce(0.25)).toBeCloseTo(0.11562499999999999)
      expect(timing.easeInOutBounce(0.5)).toBeCloseTo(0.5)
      expect(timing.easeInOutBounce(0.75)).toBeCloseTo(0.8843750000000001)
      expect(timing.easeInOutBounce(1)).toBeCloseTo(1)
    })
  })
})
