import { describe, expect, it } from 'vitest'
import { saturate } from '../../../src/registry/filter/saturate'

describe('saturate filter', () => {
  it('should return default filter when no arguments provided', () => {
    const result = saturate()
    expect(result.replace(/\s+/g, ' ').trim()).toBe(
      '<filter> <feColorMatrix type="saturate" values="0"/> </filter>',
    )
  })

  it('should return filter with custom amount', () => {
    const result = saturate({ amount: 0.5 })
    expect(result.replace(/\s+/g, ' ').trim()).toBe(
      '<filter> <feColorMatrix type="saturate" values="0.5"/> </filter>',
    )
  })

  it('should return completely unsaturated filter when amount is 1', () => {
    const result = saturate({ amount: 1 })
    expect(result.replace(/\s+/g, ' ').trim()).toBe(
      '<filter> <feColorMatrix type="saturate" values="0"/> </filter>',
    )
  })

  it('should return unchanged filter when amount is 0', () => {
    const result = saturate({ amount: 0 })
    expect(result.replace(/\s+/g, ' ').trim()).toBe(
      '<filter> <feColorMatrix type="saturate" values="1"/> </filter>',
    )
  })

  it('should handle negative amount values', () => {
    const result = saturate({ amount: -0.5 })
    expect(result.replace(/\s+/g, ' ').trim()).toBe(
      '<filter> <feColorMatrix type="saturate" values="1.5"/> </filter>',
    )
  })

  it('should handle amount greater than 1', () => {
    const result = saturate({ amount: 1.5 })
    expect(result.replace(/\s+/g, ' ').trim()).toBe(
      '<filter> <feColorMatrix type="saturate" values="-0.5"/> </filter>',
    )
  })

  it('should use default value when amount is null', () => {
    const result = saturate({ amount: null })
    expect(result.replace(/\s+/g, ' ').trim()).toBe(
      '<filter> <feColorMatrix type="saturate" values="0"/> </filter>',
    )
  })

  it('should use default value when amount is undefined', () => {
    const result = saturate({ amount: undefined })
    expect(result.replace(/\s+/g, ' ').trim()).toBe(
      '<filter> <feColorMatrix type="saturate" values="0"/> </filter>',
    )
  })

  it('should use default value when amount is NaN', () => {
    const result = saturate({ amount: NaN })
    expect(result.replace(/\s+/g, ' ').trim()).toBe(
      '<filter> <feColorMatrix type="saturate" values="0"/> </filter>',
    )
  })
})
