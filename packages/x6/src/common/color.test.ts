import { Color } from './color'

describe('Color', () => {
  describe('#constructor', () => {
    it('shoud create instance from named color', () => {
      const black = new Color(Color.named.black)
      expect(black.r).toBe(0)
      expect(black.g).toBe(0)
      expect(black.b).toBe(0)
      expect(black.a).toBe(1)

      const white = new Color(Color.named.white)
      expect(white.r).toBe(255)
      expect(white.g).toBe(255)
      expect(white.b).toBe(255)
      expect(black.a).toBe(1)
    })

    it('should create instance from hex color', () => {
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

    it('should create instance from rgba array', () => {
      const black = new Color([0, 0, 0, 1])
      expect(black.r).toBe(0)
      expect(black.g).toBe(0)
      expect(black.b).toBe(0)
      expect(black.a).toBe(1)
    })

    it('should create instance from rgba values', () => {
      const black = new Color(-1, 0, 300, 1)
      expect(black.r).toBe(0)
      expect(black.g).toBe(0)
      expect(black.b).toBe(255)
      expect(black.a).toBe(1)
    })
  })

  describe('#randomHex', () => {
    it('shoud return valid random hex value', () => {
      expect(Color.randomHex()).toMatch(/^#[0-9A-F]{6}/)
    })
  })

  describe('#randomRGBA', () => {
    it('shoud generate an rgba color string', () => {
      expect(Color.randomRGBA().startsWith('rgba')).toBe(true)
      expect(Color.randomRGBA(true).startsWith('rgba')).toBe(true)
    })
  })

  describe('#invert', () => {
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
})
