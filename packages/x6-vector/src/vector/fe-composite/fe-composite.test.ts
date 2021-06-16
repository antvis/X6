import { Filter } from '../filter/filter'
import { FEComposite } from './fe-composite'

describe('FEComposite', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEComposite.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feComposite()).toBeInstanceOf(FEComposite)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feComposite({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('in()', () => {
    it('should set in attribute', () => {
      const fe = new FEComposite()
      fe.in('BackgroundAlpha')
      expect(fe.in()).toEqual('BackgroundAlpha')
      expect(fe.attr('in')).toEqual('BackgroundAlpha')
    })
  })

  describe('in2()', () => {
    it('should set in2 attribute', () => {
      const fe = new FEComposite()
      fe.in2('BackgroundAlpha')
      expect(fe.in2()).toEqual('BackgroundAlpha')
      expect(fe.attr('in2')).toEqual('BackgroundAlpha')
    })
  })

  describe('operator()', () => {
    it('should set operator attribute', () => {
      const fe = new FEComposite()
      fe.operator('arithmetic')
      expect(fe.operator()).toEqual('arithmetic')
      expect(fe.attr('operator')).toEqual('arithmetic')
    })
  })

  describe('k1()', () => {
    it('should set k1 attribute', () => {
      const fe = new FEComposite()
      fe.k1(1)
      expect(fe.k1()).toEqual(1)
      expect(fe.attr('k1')).toEqual(1)
    })
  })

  describe('k2()', () => {
    it('should set k2 attribute', () => {
      const fe = new FEComposite()
      fe.k2(2)
      expect(fe.k2()).toEqual(2)
      expect(fe.attr('k2')).toEqual(2)
    })
  })

  describe('k3()', () => {
    it('should set k3 attribute', () => {
      const fe = new FEComposite()
      fe.k3(3)
      expect(fe.k3()).toEqual(3)
      expect(fe.attr('k3')).toEqual(3)
    })
  })

  describe('k4()', () => {
    it('should set k4 attribute', () => {
      const fe = new FEComposite()
      fe.k4(4)
      expect(fe.k4()).toEqual(4)
      expect(fe.attr('k4')).toEqual(4)
    })
  })
})
