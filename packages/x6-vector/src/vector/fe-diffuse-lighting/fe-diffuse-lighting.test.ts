import { FEDistantLight } from '../fe-distant-light/fe-distant-light'
import { FEPointLight } from '../fe-point-light/fe-point-light'
import { FESpotLight } from '../fe-spot-light/fe-spot-light'
import { Filter } from '../filter/filter'
import { FEDiffuseLighting } from './fe-diffuse-lighting'

describe('FEDiffuseLighting', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEDiffuseLighting.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feDiffuseLighting()).toBeInstanceOf(FEDiffuseLighting)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feDiffuseLighting({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('feDistantLight()', () => {
    it('should create an instance of FEDistantLight', () => {
      const fe = new FEDiffuseLighting()
      const light = fe.feDistantLight()
      expect(light).toBeInstanceOf(FEDistantLight)
    })

    it('should create an instance of FEDistantLight with given attributes', () => {
      const fe = new FEDiffuseLighting()
      const light = fe.feDistantLight({ id: 'bar' })
      expect(light).toBeInstanceOf(FEDistantLight)
      expect(light.id()).toEqual('bar')
    })
  })

  describe('fePointLight()', () => {
    it('should create an instance of FEPointLight', () => {
      const fe = new FEDiffuseLighting()
      const light = fe.fePointLight()
      expect(light).toBeInstanceOf(FEPointLight)
    })

    it('should create an instance of FEPointLight with given attributes', () => {
      const fe = new FEDiffuseLighting()
      const light = fe.fePointLight({ id: 'bar' })
      expect(light).toBeInstanceOf(FEPointLight)
      expect(light.id()).toEqual('bar')
    })
  })

  describe('feSpotLight()', () => {
    it('should create an instance of FESpotLight', () => {
      const fe = new FEDiffuseLighting()
      const light = fe.feSpotLight()
      expect(light).toBeInstanceOf(FESpotLight)
    })

    it('should create an instance of FESpotLight with given attributes', () => {
      const fe = new FEDiffuseLighting()
      const light = fe.feSpotLight({ id: 'bar' })
      expect(light).toBeInstanceOf(FESpotLight)
      expect(light.id()).toEqual('bar')
    })
  })

  describe('in()', () => {
    it('should set in attribute', () => {
      const fe = new FEDiffuseLighting()
      fe.in('BackgroundAlpha')
      expect(fe.in()).toEqual('BackgroundAlpha')
      expect(fe.attr('in')).toEqual('BackgroundAlpha')
    })
  })

  describe('surfaceScale()', () => {
    it('should set surfaceScale attribute', () => {
      const fe = new FEDiffuseLighting()
      fe.surfaceScale(1)
      expect(fe.surfaceScale()).toEqual(1)
      expect(fe.attr('surfaceScale')).toEqual(1)
    })
  })

  describe('diffuseConstant()', () => {
    it('should set diffuseConstant attribute', () => {
      const fe = new FEDiffuseLighting()
      fe.diffuseConstant(1)
      expect(fe.diffuseConstant()).toEqual(1)
      expect(fe.attr('diffuseConstant')).toEqual(1)
    })
  })

  describe('kernelUnitLength()', () => {
    it('should set kernelUnitLength attribute', () => {
      const fe = new FEDiffuseLighting()
      fe.kernelUnitLength(0)
      expect(fe.kernelUnitLength()).toEqual(0)
      expect(fe.attr('kernelUnitLength')).toEqual(0)
    })
  })
})
