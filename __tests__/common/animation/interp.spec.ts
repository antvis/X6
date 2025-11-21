import { describe, expect, it } from 'vitest'
import { Interp } from '../../../src/common/animation'

describe('number', () => {
  it('should interpolate numbers linearly', () => {
    const interp = Interp.number(0, 10)
    expect(interp(0)).toBe(0)
    expect(interp(0.5)).toBe(5)
    expect(interp(1)).toBe(10)
  })
})

describe('object', () => {
  it('should interpolate object properties', () => {
    const interp = Interp.object({ x: 0, y: 10 }, { x: 10, y: 20 })
    expect(interp(0)).toEqual({ x: 0, y: 10 })
    expect(interp(0.5)).toEqual({ x: 5, y: 15 })
    expect(interp(1)).toEqual({ x: 10, y: 20 })
  })
})

describe('unit', () => {
  it('should interpolate px values', () => {
    const interp = Interp.unit('0px', '100px')
    expect(interp(0)).toBe('0px')
    expect(interp(0.5)).toBe('50px')
    expect(interp(1)).toBe('100px')
  })

  it('should interpolate % values', () => {
    const interp = Interp.unit('10%', '20%')
    expect(interp(0)).toBe('10%')
    expect(interp(0.5)).toBe('15%')
    expect(interp(1)).toBe('20%')
  })
})

describe('color', () => {
  it('should interpolate hex colors', () => {
    const interp = Interp.color('#000000', '#ffffff')
    expect(interp(0)).toBe('#000000')
    expect(interp(0.5)).toBe('#7f7f7f') // 中间灰色
    expect(interp(1)).toBe('#ffffff')
  })

  it('should interpolate red to blue', () => {
    const interp = Interp.color('#ff0000', '#0000ff')
    expect(interp(0)).toBe('#ff0000')
    expect(interp(0.5)).toBe('#7f007f')
    expect(interp(1)).toBe('#0000ff')
  })
})

describe('transform', () => {
  it('should interpolate translate values', () => {
    const interp = Interp.transform(
      'translate(0px, 0px)',
      'translate(100px, 200px)',
    )
    expect(interp(0)).toBe('translate(0px, 0px)')
    expect(interp(0.5)).toBe('translate(50px, 100px)')
    expect(interp(1)).toBe('translate(100px, 200px)')
  })

  it('should interpolate rotate values', () => {
    const interp = Interp.transform('rotate(0deg)', 'rotate(180deg)')
    expect(interp(0)).toBe('rotate(0deg)')
    expect(interp(0.5)).toBe('rotate(90deg)')
    expect(interp(1)).toBe('rotate(180deg)')
  })

  it('should interpolate scale values', () => {
    const interp = Interp.transform('scale(1)', 'scale(2)')
    expect(interp(0)).toBe('scale(1)')
    expect(interp(0.5)).toBe('scale(1.5)')
    expect(interp(1)).toBe('scale(2)')
  })

  it('should handle multiple transform functions', () => {
    const interp = Interp.transform(
      'translate(0px, 0px) rotate(0deg) scale(1)',
      'translate(100px, 100px) rotate(90deg) scale(2)',
    )
    expect(interp(0.5)).toBe('translate(50px, 50px) rotate(45deg) scale(1.5)')
  })

  it('should handle unitless values', () => {
    const interp = Interp.transform('scale(1)', 'scale(2)')
    expect(interp(0.5)).toBe('scale(1.5)')
  })

  it('should return original value for invalid input', () => {
    const interp = Interp.transform('invalid', 'translate(100px)')
    expect(interp(0.5)).toBe('invalid')
  })

  it('should handle empty string', () => {
    const interp = Interp.transform('', 'translate(100px)')
    expect(interp(0.5)).toBe('')
  })
})
