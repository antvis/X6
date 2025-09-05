import { describe, expect, it } from 'vitest'
import { contrast } from '../../../src/registry/filter/contrast'

describe('contrast filter', () => {
  it('should return default filter when no arguments provided', () => {
    const result = contrast()
    expect(result).toContain('slope="1"')
    expect(result).toContain('intercept="0"')
    expect(result).toContain('<feFuncR type="linear"')
    expect(result).toContain('<feFuncG type="linear"')
    expect(result).toContain('<feFuncB type="linear"')
  })

  it('should apply custom contrast amount', () => {
    const result = contrast({ amount: 2 })
    expect(result).toContain('slope="2"')
    expect(result).toContain('intercept="-0.5"')
  })

  it('should handle zero contrast amount', () => {
    const result = contrast({ amount: 0 })
    expect(result).toContain('slope="0"')
    expect(result).toContain('intercept="0.5"')
  })

  it('should handle negative contrast amount', () => {
    const result = contrast({ amount: -1 })
    expect(result).toContain('slope="-1"')
    expect(result).toContain('intercept="1"')
  })

  it('should handle decimal contrast amount', () => {
    const result = contrast({ amount: 1.5 })
    expect(result).toContain('slope="1.5"')
    expect(result).toContain('intercept="-0.25"')
  })

  it('should handle undefined amount by using default', () => {
    const result = contrast({ amount: undefined })
    expect(result).toContain('slope="1"')
    expect(result).toContain('intercept="0"')
  })

  it('should handle null amount by using default', () => {
    const result = contrast({ amount: null })
    expect(result).toContain('slope="1"')
    expect(result).toContain('intercept="0"')
  })

  it('should return valid SVG filter structure', () => {
    const result = contrast()
    expect(result).toMatch(/^<filter>[\s\S]*<\/filter>$/)
    expect(result).toContain('<feComponentTransfer>')
    expect(result).toContain('</feComponentTransfer>')
  })
})
