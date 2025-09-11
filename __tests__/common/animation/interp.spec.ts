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
