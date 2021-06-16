import { FEDistantLight } from '../fe-distant-light/fe-distant-light'
import { FEPointLight } from '../fe-point-light/fe-point-light'
import { FESpotLight } from '../fe-spot-light/fe-spot-light'
import { Filter } from '../filter/filter'
import { FESpecularLighting } from './fe-specular-lighting'

describe('FESpecularLighting', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FESpecularLighting.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feSpecularLighting()).toBeInstanceOf(FESpecularLighting)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feSpecularLighting({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('feDistantLight()', () => {
    it('should create an instance of FEDistantLight', () => {
      const fe = new FESpecularLighting()
      const light = fe.feDistantLight()
      expect(light).toBeInstanceOf(FEDistantLight)
    })

    it('should create an instance of FEDistantLight with given attributes', () => {
      const fe = new FESpecularLighting()
      const light = fe.feDistantLight({ id: 'bar' })
      expect(light).toBeInstanceOf(FEDistantLight)
      expect(light.id()).toEqual('bar')
    })
  })

  describe('fePointLight()', () => {
    it('should create an instance of FEPointLight', () => {
      const fe = new FESpecularLighting()
      const light = fe.fePointLight()
      expect(light).toBeInstanceOf(FEPointLight)
    })

    it('should create an instance of FEPointLight with given attributes', () => {
      const fe = new FESpecularLighting()
      const light = fe.fePointLight({ id: 'bar' })
      expect(light).toBeInstanceOf(FEPointLight)
      expect(light.id()).toEqual('bar')
    })
  })

  describe('feSpotLight()', () => {
    it('should create an instance of FESpotLight', () => {
      const fe = new FESpecularLighting()
      const light = fe.feSpotLight()
      expect(light).toBeInstanceOf(FESpotLight)
    })

    it('should create an instance of FESpotLight with given attributes', () => {
      const fe = new FESpecularLighting()
      const light = fe.feSpotLight({ id: 'bar' })
      expect(light).toBeInstanceOf(FESpotLight)
      expect(light.id()).toEqual('bar')
    })
  })

  describe('in()', () => {
    it('should set in attribute', () => {
      const fe = new FESpecularLighting()
      fe.in('BackgroundAlpha')
      expect(fe.in()).toEqual('BackgroundAlpha')
      expect(fe.attr('in')).toEqual('BackgroundAlpha')
    })
  })

  describe('surfaceScale()', () => {
    it('should set surfaceScale attribute', () => {
      const fe = new FESpecularLighting()
      fe.surfaceScale(1)
      expect(fe.surfaceScale()).toEqual(1)
      expect(fe.attr('surfaceScale')).toEqual(1)
    })
  })

  describe('specularConstant()', () => {
    it('should set specularConstant attribute', () => {
      const fe = new FESpecularLighting()
      fe.specularConstant(1)
      expect(fe.specularConstant()).toEqual(1)
      expect(fe.attr('specularConstant')).toEqual(1)
    })
  })

  describe('specularExponent()', () => {
    it('should set specularExponent attribute', () => {
      const fe = new FESpecularLighting()
      fe.specularExponent(1)
      expect(fe.specularExponent()).toEqual(1)
      expect(fe.attr('specularExponent')).toEqual(1)
    })
  })

  describe('kernelUnitLength()', () => {
    it('should set kernelUnitLength attribute', () => {
      const fe = new FESpecularLighting()
      fe.kernelUnitLength(1)
      expect(fe.kernelUnitLength()).toEqual(1)
      expect(fe.attr('kernelUnitLength')).toEqual(1)
    })
  })
})
