import { Filter } from '../filter/filter'
import { FEColorMatrix } from './fe-color-matrix'

describe('FeColorMatrix', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEColorMatrix.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feColorMatrix()).toBeInstanceOf(FEColorMatrix)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const feColorMatrix = filter.feColorMatrix({ id: 'foo' })
      expect(feColorMatrix.id()).toEqual('foo')
    })
  })

  describe('in()', () => {
    it('should set in attribute', () => {
      const feColorMatrix = new FEColorMatrix()
      feColorMatrix.in('BackgroundAlpha')
      expect(feColorMatrix.in()).toEqual('BackgroundAlpha')
      expect(feColorMatrix.attr('in')).toEqual('BackgroundAlpha')
    })
  })

  describe('feType()', () => {
    it('should set type attribute', () => {
      const feColorMatrix = new FEColorMatrix()
      feColorMatrix.feType('hueRotate')
      expect(feColorMatrix.feType()).toEqual('hueRotate')
      expect(feColorMatrix.attr('type')).toEqual('hueRotate')
    })
  })

  describe('values()', () => {
    it('should set values attribute', () => {
      const feColorMatrix = new FEColorMatrix()
      const values = `0 0 0 0 0
                1 1 1 1 0
                0 0 0 0 0
                0 0 0 1 0`
      feColorMatrix.values(values)
      expect(feColorMatrix.values()).toEqual(values)
      expect(feColorMatrix.attr('values')).toEqual(values)
    })
  })
})
