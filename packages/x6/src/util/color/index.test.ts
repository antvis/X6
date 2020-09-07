import { Color } from './'

describe('Color', () => {
  describe('#randomHex', () => {
    it('shoud return valid random hex value', () => {
      expect(Color.randomHex()).toMatch(/^#[0-9A-F]{6}/)
    })
  })

  describe('#invert', () => {
    it('shoud return invert value of a color value', () => {
      expect(Color.invert('#ffffff', false)).toBe('#000000')
      expect(Color.invert('#000', false)).toBe('#ffffff')
      expect(Color.invert('234567', false)).toBe('#dcba98')
    })

    it('decide font color in white or black depending on background color', () => {
      expect(Color.invert('#121212', true)).toBe('#FFFFFF')
      expect(Color.invert('#feeade', true)).toBe('#000000')
    })

    it('shoud throw exception with invalid color value', () => {
      expect(() => {
        Color.invert('#abcd', false)
      }).toThrowError('Invalid hex color.')
    })
  })
})
