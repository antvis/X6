import { Filter } from '../filter/filter'
import { FEGaussianBlur } from './fe-gaussian-blur'

describe('FEGaussianBlur', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEGaussianBlur.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feGaussianBlur()).toBeInstanceOf(FEGaussianBlur)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feGaussianBlur({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('in()', () => {
    it('should set in attribute', () => {
      const fe = new FEGaussianBlur()
      fe.in('BackgroundAlpha')
      expect(fe.in()).toEqual('BackgroundAlpha')
      expect(fe.attr('in')).toEqual('BackgroundAlpha')
    })
  })

  describe('stdDeviation()', () => {
    it('should set stdDeviation attribute', () => {
      const fe = new FEGaussianBlur()
      fe.stdDeviation(1)
      expect(fe.stdDeviation()).toEqual(1)
      expect(fe.attr('stdDeviation')).toEqual(1)
    })
  })

  describe('edgeMode()', () => {
    it('should set edgeMode attribute', () => {
      const fe = new FEGaussianBlur()
      fe.edgeMode('duplicate')
      expect(fe.edgeMode()).toEqual('duplicate')
      expect(fe.attr('edgeMode')).toEqual('duplicate')
    })
  })
})
