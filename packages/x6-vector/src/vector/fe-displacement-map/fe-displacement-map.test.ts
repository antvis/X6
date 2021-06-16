import { Filter } from '../filter/filter'
import { FEDisplacementMap } from './fe-displacement-map'

describe('FEDisplacementMap', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEDisplacementMap.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feDisplacementMap()).toBeInstanceOf(FEDisplacementMap)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feDisplacementMap({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('in()', () => {
    it('should set in attribute', () => {
      const fe = new FEDisplacementMap()
      fe.in('BackgroundAlpha')
      expect(fe.in()).toEqual('BackgroundAlpha')
      expect(fe.attr('in')).toEqual('BackgroundAlpha')
    })
  })

  describe('in2()', () => {
    it('should set in2 attribute', () => {
      const fe = new FEDisplacementMap()
      fe.in2('BackgroundAlpha')
      expect(fe.in2()).toEqual('BackgroundAlpha')
      expect(fe.attr('in2')).toEqual('BackgroundAlpha')
    })
  })

  describe('feScale()', () => {
    it('should set scale attribute', () => {
      const fe = new FEDisplacementMap()
      fe.feScale(1)
      expect(fe.feScale()).toEqual(1)
      expect(fe.attr('scale')).toEqual(1)
    })
  })

  describe('diffuseConstant()', () => {
    it('should set diffuseConstant attribute', () => {
      const fe = new FEDisplacementMap()
      fe.xChannelSelector('A')
      expect(fe.xChannelSelector()).toEqual('A')
      expect(fe.attr('xChannelSelector')).toEqual('A')
    })
  })

  describe('yChannelSelector()', () => {
    it('should set yChannelSelector attribute', () => {
      const fe = new FEDisplacementMap()
      fe.yChannelSelector('B')
      expect(fe.yChannelSelector()).toEqual('B')
      expect(fe.attr('yChannelSelector')).toEqual('B')
    })
  })
})
