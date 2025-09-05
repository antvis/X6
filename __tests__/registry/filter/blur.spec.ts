import { describe, expect, it } from 'vitest'
import { type BlurArgs, blur } from '../../../src/registry/filter/blur'

describe('blur filter', () => {
  const normalizeSVG = (svg: string) => svg.replace(/\s+/g, ' ').trim()

  it('should use default values when no arguments provided', () => {
    const result = blur()
    expect(normalizeSVG(result)).toBe(
      '<filter> <feGaussianBlur stdDeviation="2"/> </filter>',
    )
  })

  it('should use provided x value when only x is specified', () => {
    const args: BlurArgs = { x: 5 }
    const result = blur(args)
    expect(normalizeSVG(result)).toBe(
      '<filter> <feGaussianBlur stdDeviation="5"/> </filter>',
    )
  })

  it('should use both x and y values when both are specified', () => {
    const args: BlurArgs = { x: 3, y: 4 }
    const result = blur(args)
    expect(normalizeSVG(result)).toBe(
      '<filter> <feGaussianBlur stdDeviation="3,4"/> </filter>',
    )
  })

  it('should handle y value only (x defaults to 2)', () => {
    const args: BlurArgs = { y: 6 }
    const result = blur(args)
    expect(normalizeSVG(result)).toBe(
      '<filter> <feGaussianBlur stdDeviation="2,6"/> </filter>',
    )
  })

  it('should handle null/undefined values correctly', () => {
    const result1 = blur({ x: null as any, y: undefined })
    expect(normalizeSVG(result1)).toBe(
      '<filter> <feGaussianBlur stdDeviation="2"/> </filter>',
    )

    const result2 = blur({ x: 1, y: null as any })
    expect(normalizeSVG(result2)).toBe(
      '<filter> <feGaussianBlur stdDeviation="1"/> </filter>',
    )
  })

  it('should handle non-finite numbers correctly', () => {
    const result1 = blur({ x: NaN, y: 3 })
    expect(normalizeSVG(result1)).toBe(
      '<filter> <feGaussianBlur stdDeviation="2,3"/> </filter>',
    )

    const result2 = blur({ x: Infinity, y: 4 })
    expect(normalizeSVG(result2)).toBe(
      '<filter> <feGaussianBlur stdDeviation="2,4"/> </filter>',
    )
  })
})
