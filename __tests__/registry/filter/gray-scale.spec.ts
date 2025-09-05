import { describe, expect, it } from 'vitest'
import {
  type GrayScaleArgs,
  grayScale,
} from '../../../src/registry/filter/gray-scale'

describe('grayScale filter', () => {
  it('should return default filter when no arguments provided', () => {
    const result = grayScale()
    expect(result).toContain('<filter>')
    expect(result).toContain('feColorMatrix')
    expect(result).toContain('type="matrix"')
    expect(result).toContain(
      '0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0',
    )
  })

  it('should return correct filter with amount=1 (full grayscale)', () => {
    const args: GrayScaleArgs = { amount: 1 }
    const result = grayScale(args)
    expect(result).toContain(
      '0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0',
    )
  })

  it('should return correct filter with amount=0 (no change)', () => {
    const args: GrayScaleArgs = { amount: 0 }
    const result = grayScale(args)
    expect(result).toContain('1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0')
  })

  it('should handle undefined amount by using default value', () => {
    const args: GrayScaleArgs = { amount: undefined }
    const result = grayScale(args)
    expect(result).toContain(
      '0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0',
    )
  })

  it('should handle null amount by using default value', () => {
    const args = { amount: null } as unknown as GrayScaleArgs
    const result = grayScale(args)
    expect(result).toContain(
      '0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0',
    )
  })

  it('should return valid SVG filter syntax', () => {
    const result = grayScale({ amount: 1 })
    expect(result).toMatch(/^<filter>\s*<feColorMatrix[^>]*\/>\s*<\/filter>$/)
    expect(result).toContain('values="')
  })
})
