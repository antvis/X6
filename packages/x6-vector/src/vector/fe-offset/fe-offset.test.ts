import { Filter } from '../filter/filter'
import { FEOffset } from './fe-offset'

describe('FEOffset', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEOffset.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feOffset()).toBeInstanceOf(FEOffset)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feOffset({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('in()', () => {
    it('should set in attribute', () => {
      const fe = new FEOffset()
      fe.in('BackgroundAlpha')
      expect(fe.in()).toEqual('BackgroundAlpha')
      expect(fe.attr('in')).toEqual('BackgroundAlpha')
    })
  })

  describe('dx()', () => {
    it('should set dx attribute', () => {
      const fe = new FEOffset()
      fe.dx(1)
      expect(fe.dx()).toEqual(1)
      expect(fe.attr('dx')).toEqual(1)
    })
  })

  describe('dy()', () => {
    it('should set dy attribute', () => {
      const fe = new FEOffset()
      fe.dy(1)
      expect(fe.dy()).toEqual(1)
      expect(fe.attr('dy')).toEqual(1)
    })
  })
})
