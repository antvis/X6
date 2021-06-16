import { Filter } from '../filter/filter'
import { FEConvolveMatrix } from './fe-convolve-matrix'

describe('FEConvolveMatrix', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEConvolveMatrix.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feConvolveMatrix()).toBeInstanceOf(FEConvolveMatrix)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feConvolveMatrix({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('in()', () => {
    it('should set in attribute', () => {
      const fe = new FEConvolveMatrix()
      fe.in('BackgroundAlpha')
      expect(fe.in()).toEqual('BackgroundAlpha')
      expect(fe.attr('in')).toEqual('BackgroundAlpha')
    })
  })

  describe('edgeMode()', () => {
    it('should set edgeMode attribute', () => {
      const fe = new FEConvolveMatrix()
      fe.edgeMode('duplicate')
      expect(fe.edgeMode()).toEqual('duplicate')
      expect(fe.attr('edgeMode')).toEqual('duplicate')
    })
  })

  describe('targetX()', () => {
    it('should set targetX attribute', () => {
      const fe = new FEConvolveMatrix()
      fe.targetX(1)
      expect(fe.targetX()).toEqual(1)
      expect(fe.attr('targetX')).toEqual(1)
    })
  })

  describe('targetY()', () => {
    it('should set targetY attribute', () => {
      const fe = new FEConvolveMatrix()
      fe.targetY(1)
      expect(fe.targetY()).toEqual(1)
      expect(fe.attr('targetY')).toEqual(1)
    })
  })

  describe('order()', () => {
    it('should set order attribute', () => {
      const fe = new FEConvolveMatrix()
      fe.order(0)
      expect(fe.order()).toEqual(0)
      expect(fe.attr('order')).toEqual(0)
    })
  })

  describe('divisor()', () => {
    it('should set divisor attribute', () => {
      const fe = new FEConvolveMatrix()
      fe.divisor(0.5)
      expect(fe.divisor()).toEqual(0.5)
      expect(fe.attr('divisor')).toEqual(0.5)
    })
  })

  describe('bias()', () => {
    it('should set bias attribute', () => {
      const fe = new FEConvolveMatrix()
      fe.bias(0.5)
      expect(fe.bias()).toEqual(0.5)
      expect(fe.attr('bias')).toEqual(0.5)
    })
  })

  describe('kernelMatrix()', () => {
    it('should set kernelMatrix attribute', () => {
      const fe = new FEConvolveMatrix()
      const values = `0 0 0 0 0
                1 1 1 1 0
                0 0 0 0 0
                0 0 0 1 0`
      fe.kernelMatrix(values)
      expect(fe.kernelMatrix()).toEqual(values)
      expect(fe.attr('kernelMatrix')).toEqual(values)
    })
  })

  describe('kernelUnitLength()', () => {
    it('should set kernelUnitLength attribute', () => {
      const fe = new FEConvolveMatrix()
      fe.kernelUnitLength(5)
      expect(fe.kernelUnitLength()).toEqual(5)
      expect(fe.attr('kernelUnitLength')).toEqual(5)
    })
  })

  describe('preserveAlpha()', () => {
    it('should set preserveAlpha attribute', () => {
      const fe = new FEConvolveMatrix()
      fe.preserveAlpha(false)
      expect(fe.preserveAlpha()).toBeFalse()
      expect(fe.attr('preserveAlpha')).toBeFalse()
    })
  })
})
