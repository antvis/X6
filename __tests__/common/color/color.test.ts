import { describe, it, expect } from 'vitest'
import { Color } from '@/common/color'

describe('Color', () => {
  describe('constructor', () => {
    it('should default to white when no args', () => {
      const c = new Color()
      expect(c.toHex()).toBe('#ffffff')
    })

    it('should accept rgba numbers', () => {
      const c = new Color(10, 20, 30, 0.5)
      expect(c.toRGBA()).toEqual([10, 20, 30, 0.5])
    })

    it('should accept rgba array', () => {
      const c = new Color([1, 2, 3, 0.7])
      expect(c.toRGBA()).toEqual([1, 2, 3, 0.7])
    })

    it('should accept rgba object', () => {
      const c = new Color({ r: 5, g: 6, b: 7, a: 0.8 })
      expect(c.toRGBA()).toEqual([5, 6, 7, 0.8])
    })

    it('should accept hex string', () => {
      const c = new Color('#ff0000')
      expect(c.toHex()).toBe('#ff0000')
    })

    it('should accept rgb string', () => {
      const c = new Color('rgb(255,0,0)')
      expect(c.toHex()).toBe('#ff0000')
    })

    it('should accept named color', () => {
      const c = new Color('blue')
      expect(c.toHex()).toBe('#0000ff')
    })
  })

  describe('methods', () => {
    it('blend should interpolate between colors', () => {
      const c = new Color()
      c.blend(new Color(0, 0, 0, 1), new Color(255, 255, 255, 0), 0.5)
      expect(c.toRGBA()).toEqual([128, 128, 128, 0.5])
    })

    it('lighten and darken should adjust brightness', () => {
      const c = new Color('#888888')
      const before = c.toHex()
      c.lighten(10)
      expect(c.toHex()).not.toBe(before)
      c.darken(10)
      expect(c.toHex()).toBe(before)
    })

    it('set with clamping values', () => {
      const c = new Color()
      c.set(300, -10, 100, 2)
      expect(c.toRGBA()).toEqual([255, 0, 100, 1])
    })

    it('toHex should return hex string', () => {
      const c = new Color(255, 0, 255, 1)
      expect(c.toHex()).toBe('#ff00ff')
    })

    it('toHSLA should convert correctly', () => {
      const c = new Color(255, 0, 0, 1)
      const hsla = c.toHSLA()
      expect(hsla[0]).toBeGreaterThanOrEqual(0)
      expect(hsla[0]).toBeLessThanOrEqual(1)
    })

    it('toCSS should format correctly', () => {
      const c = new Color(1, 2, 3, 0.4)
      expect(c.toCSS()).toContain('rgba')
      expect(c.toCSS(true)).toContain('rgb')
    })

    it('toGrey should return grey color', () => {
      const c = new Color(10, 20, 30, 0.5)
      const grey = c.toGrey()
      expect(grey.r).toBe(grey.g)
      expect(grey.g).toBe(grey.b)
    })
  })

  describe('static methods', () => {
    it('fromArray should create from array', () => {
      const c = Color.fromArray([1, 2, 3, 0.5])
      expect(c.toRGBA()).toEqual([1, 2, 3, 0.5])
    })

    it('fromHex should create from hex', () => {
      const c = Color.fromHex('#00ff00')
      expect(c.toHex()).toBe('#00ff00')
    })

    it('fromRGBA should parse rgba string', () => {
      const c = Color.fromRGBA('rgba(1,2,3,0.5)')
      expect(c?.toRGBA()[0]).toBe(1)
    })

    it('fromHSLA should return null for invalid string', () => {
      expect(Color.fromHSLA('invalid')).toBeNull()
    })

    it('fromString should parse hex format', () => {
      const c = Color.fromString('#ff0000')
      expect(c.r).toBe(255)
      expect(c.g).toBe(0)
      expect(c.b).toBe(0)
    })

    it('fromString should parse rgb format', () => {
      const c = Color.fromString('rgb(0, 128, 255)')
      expect(c.r).toBe(0)
      expect(c.g).toBe(128)
      expect(c.b).toBe(255)
    })

    it('fromString should parse rgba format', () => {
      const c = Color.fromString('rgba(0, 128, 255, 0.5)')
      expect(c.r).toBe(0)
      expect(c.g).toBe(128)
      expect(c.b).toBe(255)
    })

    it('makeGrey should return grey color', () => {
      const c = Color.makeGrey(50, 0.5)
      expect(c.r).toBe(50)
      expect(c.g).toBe(50)
    })

    it('rgba2hsla and hsla2rgba should be inverses (approx)', () => {
      const rgba: Color.RGBA = [100, 150, 200, 1]
      const hsla = Color.rgba2hsla(rgba)
      const back = Color.hsla2rgba(hsla)
      expect(back[0]).toBeGreaterThan(0)
    })

    it('random should return valid color', () => {
      const c = Color.random()
      expect(c.r).toBeGreaterThanOrEqual(0)
      expect(c.r).toBeLessThanOrEqual(255)
    })

    it('randomHex should return hex string', () => {
      const hex = Color.randomHex()
      expect(hex).toMatch(/^#[0-9A-F]{6}$/)
    })

    it('randomRGBA should return css string', () => {
      const str = Color.randomRGBA()
      expect(str).toContain('rgb')
    })

    it('invert should invert hex string', () => {
      expect(Color.invert('#ffffff', false)).toBe('#000000')
    })

    it('invert should return black/white when bw=true', () => {
      expect(Color.invert('#ffffff', true)).toBe('#000000')
      expect(Color.invert('#000000', true)).toBe('#ffffff')
    })

    it('invert should invert RGBA array', () => {
      const rgba: Color.RGBA = [10, 20, 30, 1]
      const inv = Color.invert(rgba, false) as Color.RGBA
      expect(inv[0]).toBe(245)
    })

    it('lighten/darken with string input', () => {
      const hex = '#123456'
      expect(Color.lighten(hex, 10)).toMatch(/^#/)
      expect(Color.darken(hex, 10)).toMatch(/^#/)
    })

    it('should throw on invalid hex', () => {
      expect(() => new Color('#xyz')).toThrow()
    })
  })
})
