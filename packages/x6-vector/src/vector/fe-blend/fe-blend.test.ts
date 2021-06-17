import { Filter } from '../filter/filter'
import { FEBlend } from './fe-blend'

describe('FeBlend', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEBlend.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feBlend()).toBeInstanceOf(FEBlend)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const feBlend = filter.feBlend({ id: 'foo' })
      expect(feBlend.id()).toEqual('foo')
    })
  })

  describe('in()', () => {
    it('should set in attribute', () => {
      const feBlend = new FEBlend()
      feBlend.in('BackgroundAlpha')
      expect(feBlend.in()).toEqual('BackgroundAlpha')
      expect(feBlend.attr('in')).toEqual('BackgroundAlpha')
    })
  })

  describe('in2()', () => {
    it('should set in2 attribute', () => {
      const feBlend = new FEBlend()
      feBlend.in2('BackgroundAlpha')
      expect(feBlend.in2()).toEqual('BackgroundAlpha')
      expect(feBlend.attr('in2')).toEqual('BackgroundAlpha')
    })
  })

  describe('mode()', () => {
    it('should set mode attribute', () => {
      const feBlend = new FEBlend()
      feBlend.mode('color')
      expect(feBlend.mode()).toEqual('color')
      expect(feBlend.attr('mode')).toEqual('color')
    })
  })
})
