import { describe, expect, it } from 'vitest'
import { Rectangle } from '../../../src/geometry'
import {
  refDx,
  refDy,
  refHeight,
  refRCircumscribed,
  refRInscribed,
  refWidth,
  refX,
  refY,
} from '../../../src/registry/attr/ref'

describe('Ref attribute', () => {
  const refBBox = new Rectangle(100, 100, 200, 150)

  describe('refX/refY', () => {
    it('should handle percentage values', () => {
      const resultX = refX.position!('50%', { refBBox })
      const resultY = refY.position!('50%', { refBBox })
      expect(resultX.x).toBe(200)
      expect(resultY.y).toBe(175)
    })

    it('should handle absolute values', () => {
      const resultX = refX.position!('20', { refBBox })
      const resultY = refY.position!('30', { refBBox })
      expect(resultX.x).toBe(120)
      expect(resultY.y).toBe(130)
    })
  })

  describe('refDx/refDy', () => {
    it('should calculate from corner', () => {
      const resultX = refDx.position!('-10', { refBBox })
      const resultY = refDy.position!('-15', { refBBox })
      expect(resultX.x).toBe(290)
      expect(resultY.y).toBe(235)
    })
  })

  describe('refWidth/refHeight', () => {
    it('should handle percentage values', () => {
      const resultW = refWidth.set!('50%', { refBBox })
      const resultH = refHeight.set!('50%', { refBBox })
      expect(resultW.width).toBe(100)
      expect(resultH.height).toBe(75)
    })

    it('should handle absolute offsets', () => {
      const resultW = refWidth.set!('-20', { refBBox })
      const resultH = refHeight.set!('-30', { refBBox })
      expect(resultW.width).toBe(180)
      expect(resultH.height).toBe(120)
    })
  })

  describe('refRInscribed', () => {
    it('should use width when bbox is wider', () => {
      const wideBBox = new Rectangle(0, 0, 200, 100)
      const result = refRInscribed.set!('50%', { refBBox: wideBBox })
      expect(result.r).toBe(50)
    })

    it('should use height when bbox is taller', () => {
      const tallBBox = new Rectangle(0, 0, 100, 200)
      const result = refRInscribed.set!('50%', { refBBox: tallBBox })
      expect(result.r).toBe(50)
    })
  })

  describe('refRCircumscribed', () => {
    it('should calculate diagonal percentage', () => {
      const result = refRCircumscribed.set!('50%', { refBBox })
      const diagonal = Math.sqrt(200 * 200 + 150 * 150)
      expect(result.r).toBeCloseTo(diagonal * 0.5)
    })
  })
})
