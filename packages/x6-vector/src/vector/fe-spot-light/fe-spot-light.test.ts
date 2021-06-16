import { FESpotLight } from './fe-spot-light'

describe('FESpotLight', () => {
  describe('x()', () => {
    it('should set x attribute', () => {
      const fe = new FESpotLight()
      fe.x(1)
      expect(fe.x()).toEqual(1)
      expect(fe.attr('x')).toEqual(1)
    })
  })

  describe('y()', () => {
    it('should set y attribute', () => {
      const fe = new FESpotLight()
      fe.y(1)
      expect(fe.y()).toEqual(1)
      expect(fe.attr('y')).toEqual(1)
    })
  })

  describe('z()', () => {
    it('should set z attribute', () => {
      const fe = new FESpotLight()
      fe.z(1)
      expect(fe.z()).toEqual(1)
      expect(fe.attr('z')).toEqual(1)
    })
  })

  describe('pointsAtX()', () => {
    it('should set pointsAtX attribute', () => {
      const fe = new FESpotLight()
      fe.pointsAtX(1)
      expect(fe.pointsAtX()).toEqual(1)
      expect(fe.attr('pointsAtX')).toEqual(1)
    })
  })

  describe('pointsAtY()', () => {
    it('should set pointsAtY attribute', () => {
      const fe = new FESpotLight()
      fe.pointsAtY(1)
      expect(fe.pointsAtY()).toEqual(1)
      expect(fe.attr('pointsAtY')).toEqual(1)
    })
  })

  describe('pointsAtZ()', () => {
    it('should set pointsAtZ attribute', () => {
      const fe = new FESpotLight()
      fe.pointsAtZ(1)
      expect(fe.pointsAtZ()).toEqual(1)
      expect(fe.attr('pointsAtZ')).toEqual(1)
    })
  })

  describe('specularExponent()', () => {
    it('should set specularExponent attribute', () => {
      const fe = new FESpotLight()
      fe.specularExponent(1)
      expect(fe.specularExponent()).toEqual(1)
      expect(fe.attr('specularExponent')).toEqual(1)
    })
  })

  describe('limitingConeAngle()', () => {
    it('should set limitingConeAngle attribute', () => {
      const fe = new FESpotLight()
      fe.limitingConeAngle(1)
      expect(fe.limitingConeAngle()).toEqual(1)
      expect(fe.attr('limitingConeAngle')).toEqual(1)
    })
  })
})
