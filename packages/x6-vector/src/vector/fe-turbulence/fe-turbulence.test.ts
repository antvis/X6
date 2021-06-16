import { Filter } from '../filter/filter'
import { FETurbulence } from './fe-turbulence'

describe('FETurbulence', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FETurbulence.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feTurbulence()).toBeInstanceOf(FETurbulence)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feTurbulence({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('baseFrequency()', () => {
    it('should set baseFrequency attribute', () => {
      const fe = new FETurbulence()
      fe.baseFrequency(1)
      expect(fe.baseFrequency()).toEqual(1)
      expect(fe.attr('baseFrequency')).toEqual(1)
    })
  })

  describe('numOctaves()', () => {
    it('should set numOctaves attribute', () => {
      const fe = new FETurbulence()
      fe.numOctaves(1)
      expect(fe.numOctaves()).toEqual(1)
      expect(fe.attr('numOctaves')).toEqual(1)
    })
  })

  describe('seed()', () => {
    it('should set seed attribute', () => {
      const fe = new FETurbulence()
      fe.seed(1)
      expect(fe.seed()).toEqual(1)
      expect(fe.attr('seed')).toEqual(1)
    })
  })

  describe('feType()', () => {
    it('should set type attribute', () => {
      const fe = new FETurbulence()
      fe.feType('rotate')
      expect(fe.feType()).toEqual('rotate')
      expect(fe.attr('type')).toEqual('rotate')
    })
  })

  describe('stitchTiles()', () => {
    it('should set stitchTiles attribute', () => {
      const fe = new FETurbulence()
      fe.stitchTiles('noStitch')
      expect(fe.stitchTiles()).toEqual('noStitch')
      expect(fe.attr('stitchTiles')).toEqual('noStitch')
    })
  })
})
