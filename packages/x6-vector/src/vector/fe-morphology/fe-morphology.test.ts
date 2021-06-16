import { Filter } from '../filter/filter'
import { FEMorphology } from './fe-morphology'

describe('FEMorphology', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEMorphology.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feMorphology()).toBeInstanceOf(FEMorphology)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feMorphology({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('in()', () => {
    it('should set in attribute', () => {
      const fe = new FEMorphology()
      fe.in('BackgroundAlpha')
      expect(fe.in()).toEqual('BackgroundAlpha')
      expect(fe.attr('in')).toEqual('BackgroundAlpha')
    })
  })

  describe('radius()', () => {
    it('should set radius attribute', () => {
      const fe = new FEMorphology()
      fe.radius(1)
      expect(fe.radius()).toEqual(1)
      expect(fe.attr('radius')).toEqual(1)
    })
  })

  describe('edgeMode()', () => {
    it('should set edgeMode attribute', () => {
      const fe = new FEMorphology()
      fe.operator('arithmetic')
      expect(fe.operator()).toEqual('arithmetic')
      expect(fe.attr('operator')).toEqual('arithmetic')
    })
  })
})
