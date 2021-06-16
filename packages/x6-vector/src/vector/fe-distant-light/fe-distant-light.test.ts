import { FEDistantLight } from './fe-distant-light'

describe('FEDistantLight', () => {
  describe('azimuth()', () => {
    it('should set azimuth attribute', () => {
      const fe = new FEDistantLight()
      fe.azimuth(1)
      expect(fe.azimuth()).toEqual(1)
      expect(fe.attr('azimuth')).toEqual(1)
    })
  })

  describe('elevation()', () => {
    it('should set elevation attribute', () => {
      const fe = new FEDistantLight()
      fe.elevation(1)
      expect(fe.elevation()).toEqual(1)
      expect(fe.attr('elevation')).toEqual(1)
    })
  })
})
