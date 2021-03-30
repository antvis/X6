import { Color } from './color'

const { objectContaining } = jasmine

describe('Color', () => {
  describe('constructor', () => {
    it('shoud create a Color with default args', () => {
      const color = new Color()
      expect(color.r).toBe(255)
      expect(color.g).toBe(255)
      expect(color.b).toBe(255)
      expect(color.a).toBe(1)
    })

    it('shoud create a Color from named color', () => {
      const black = new Color(Color.presets.black)
      expect(black.r).toBe(0)
      expect(black.g).toBe(0)
      expect(black.b).toBe(0)
      expect(black.a).toBe(1)

      const white = new Color(Color.presets.white)
      expect(white.r).toBe(255)
      expect(white.g).toBe(255)
      expect(white.b).toBe(255)
      expect(black.a).toBe(1)
    })

    it('should create a Color from hex color', () => {
      const black = new Color('#000000')
      expect(black.r).toBe(0)
      expect(black.g).toBe(0)
      expect(black.b).toBe(0)
      expect(black.a).toBe(1)

      const white = new Color('#fff')
      expect(white.r).toBe(255)
      expect(white.g).toBe(255)
      expect(white.b).toBe(255)
      expect(black.a).toBe(1)
    })

    it('should not parse invalid string', () => {
      const color = new Color('')
      expect(color.r).toBeUndefined()
      expect(color.g).toBeUndefined()
      expect(color.b).toBeUndefined()
      expect(color.a).toBeUndefined()
    })

    it('should create a Color from rgba array', () => {
      const black = new Color([0, 0, 0, 1])
      expect(black.r).toBe(0)
      expect(black.g).toBe(0)
      expect(black.b).toBe(0)
      expect(black.a).toBe(1)
    })

    it('should create a Color from rgba values', () => {
      const black = new Color(-1, 0, 300, 1)
      expect(black.r).toBe(0)
      expect(black.g).toBe(0)
      expect(black.b).toBe(255)
      expect(black.a).toBe(1)
    })

    it('should create a Color from rgba like Object', () => {
      const color1 = new Color({ r: 1, g: 1, b: 1 })
      expect(color1.r).toBe(1)
      expect(color1.g).toBe(1)
      expect(color1.b).toBe(1)
      expect(color1.a).toBe(1)

      const color2 = new Color({ r: 1, g: 1, b: 1, a: 0.5 })
      expect(color2.r).toBe(1)
      expect(color2.g).toBe(1)
      expect(color2.b).toBe(1)
      expect(color2.a).toBe(0.5)
    })
  })

  describe('randomHex()', () => {
    it('shoud return valid random hex value', () => {
      expect(Color.randomHex()).toMatch(/^#[0-9A-F]{6}/)
    })
  })

  describe('randomRGBA()', () => {
    it('shoud generate an rgba color string', () => {
      expect(Color.randomRgb().startsWith('rgba')).toBe(true)
      expect(Color.randomRgb(true).startsWith('rgba')).toBe(true)
    })
  })

  describe('invert()', () => {
    it('shoud return invert value of a color value', () => {
      expect(Color.invert('#ffffff', false)).toBe('#000000')
      expect(Color.invert('#000', false)).toBe('#ffffff')
      expect(Color.invert('234567', false)).toBe('dcba98')
    })

    it('decide font color in white or black depending on background color', () => {
      expect(Color.invert('#121212', true)).toBe('#ffffff')
      expect(Color.invert('#feeade', true)).toBe('#000000')
    })

    it('shoud throw exception with invalid color value', () => {
      expect(() => {
        Color.invert('#abcd', false)
      }).toThrowError('Invalid hex color.')
    })
  })

  describe('blend()', () => {
    it('should generate a blend color', () => {
      expect(new Color().blend(new Color(), new Color(0, 0, 0, 1), 50)).toEqual(
        objectContaining({ r: 0, g: 0, b: 0, a: 1 }),
      )
    })
  })

  describe('lighten()', () => {
    it('should generate a lighten color', () => {
      expect(new Color().lighten(10)).toEqual(
        objectContaining({ r: 255, g: 255, b: 255, a: 1 }),
      )
    })
  })

  describe('darken()', () => {
    it('should generate a darken color', () => {
      expect(new Color().darken(10)).toEqual(
        objectContaining({ r: 245, g: 245, b: 245, a: 1 }),
      )
    })
  })

  describe('toHex()', () => {
    it('should convert to hex string', () => {
      expect(new Color().toHex()).toEqual('#ffffff')
      expect(new Color(0, 0, 0).toHex()).toEqual('#000000')
    })
  })

  describe('toRGBA()', () => {
    it('should convert to rgba array', () => {
      expect(new Color().toRGBA()).toEqual([255, 255, 255, 1])
    })
  })

  describe('toHSLA()', () => {
    it('should convert to hsla array', () => {
      expect(new Color().toHSLA()).toEqual([0, 0, 255, 1])
    })
  })

  describe('toGrey()', () => {
    it('should convert to gray color', () => {
      expect(new Color().toGrey()).toEqual(
        objectContaining({ r: 255, g: 255, b: 255, a: 1 }),
      )
    })
  })

  describe('toCSS()', () => {
    it('should convert color to rgba css string', () => {
      expect(new Color().toCSS()).toBe('rgba(255,255,255,1)')
    })

    it('should ingore alpha', () => {
      expect(new Color().toCSS(true)).toBe('rgb(255,255,255)')
    })
  })

  describe('toArray()', () => {
    it('should convert color to rgba string', () => {
      expect(new Color().toArray()).toEqual([255, 255, 255, 1])
    })
  })

  describe('toString()', () => {
    it('should convert color to rgba string', () => {
      expect(new Color().toCSS()).toBe('rgba(255,255,255,1)')
    })
  })
})
