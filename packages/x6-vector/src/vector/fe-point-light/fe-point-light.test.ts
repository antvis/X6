import { FEPointLight } from './fe-point-light'

describe('FEPointLight', () => {
  describe('x()', () => {
    it('should set x attribute', () => {
      const fe = new FEPointLight()
      fe.x(1)
      expect(fe.x()).toEqual(1)
      expect(fe.attr('x')).toEqual(1)
    })
  })

  describe('y()', () => {
    it('should set y attribute', () => {
      const fe = new FEPointLight()
      fe.y(1)
      expect(fe.y()).toEqual(1)
      expect(fe.attr('y')).toEqual(1)
    })
  })

  describe('z()', () => {
    it('should set z attribute', () => {
      const fe = new FEPointLight()
      fe.z(1)
      expect(fe.z()).toEqual(1)
      expect(fe.attr('z')).toEqual(1)
    })
  })
})
