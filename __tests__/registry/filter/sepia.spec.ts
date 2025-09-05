import { describe, expect, it } from 'vitest'
import { sepia } from '../../../src/registry/filter/sepia'

describe('sepia filter', () => {
  it('should return default sepia filter when no args provided', () => {
    const result = sepia()
    expect(result).toContain('<filter>')
    expect(result).toContain('feColorMatrix')
    expect(result).toContain('type="matrix"')
    expect(result).toContain(
      'values="0.393 0.769 0.189 0 0 0.349 0.686 0.168 0 0 0.272 0.534 0.131 0 0 0 0 0 1 0"',
    )
  })

  it('should return full sepia filter when amount=1', () => {
    const result = sepia({ amount: 1 })
    expect(result).toContain(
      'values="0.393 0.769 0.189 0 0 0.349 0.686 0.168 0 0 0.272 0.534 0.131 0 0 0 0 0 1 0"',
    )
  })

  it('should return identity filter when amount=0', () => {
    const result = sepia({ amount: 0 })
    expect(result).toContain('values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"')
  })

  it('should return partial sepia filter when amount=0.5', () => {
    const result = sepia({ amount: 0.5 })
    expect(result).toContain('feColorMatrix')
    expect(result).toMatch(
      /values="[0-9.]+\s[0-9.]+\s[0-9.]+\s0\s0\s[0-9.]+\s[0-9.]+\s[0-9.]+\s0\s0\s[0-9.]+\s[0-9.]+\s[0-9.]+\s0\s0\s0\s0\s0\s1\s0"/,
    )
  })

  it('should handle invalid amount values by using default', () => {
    const result1 = sepia({ amount: NaN })
    const result2 = sepia({ amount: null as any })
    const result3 = sepia({ amount: undefined })

    const expected = sepia({ amount: 1 })
    expect(result1).toBe(expected)
    expect(result2).toBe(expected)
    expect(result3).toBe(expected)
  })

  it('should handle negative amount values', () => {
    const result = sepia({ amount: -1 })
    expect(result).toContain('feColorMatrix')
  })

  it('should handle amount values greater than 1', () => {
    const result = sepia({ amount: 2 })
    expect(result).toContain('feColorMatrix')
  })
})
