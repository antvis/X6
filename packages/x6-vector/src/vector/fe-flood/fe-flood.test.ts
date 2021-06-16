import { Filter } from '../filter/filter'
import { FEFlood } from './fe-flood'

describe('FEFlood', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEFlood.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feFlood()).toBeInstanceOf(FEFlood)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feFlood({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('opacity()', () => {
    it('should set flood-opacity attribute', () => {
      const fe = new FEFlood()
      fe.opacity(0.1)
      expect(fe.opacity()).toEqual(0.1)
      expect(fe.attr('floodOpacity')).toEqual(0.1)
    })
  })

  describe('color()', () => {
    it('should set flood-color attribute', () => {
      const fe = new FEFlood()
      fe.color('red')
      expect(fe.color()).toEqual('red')
      expect(fe.attr('floodColor')).toEqual('red')
    })
  })
})
