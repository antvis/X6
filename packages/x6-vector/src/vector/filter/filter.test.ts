import { Svg } from '../svg/svg'
import { Filter } from './filter'

describe('Filter', () => {
  describe('constructor()', () => {
    it('should create a new object of type Filter', () => {
      const filter = new Filter()
      expect(filter).toBeInstanceOf(Filter)
    })

    it('should create an instance with given attributes', () => {
      expect(Filter.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from container', () => {
      const svg = new Svg()
      expect(svg.filter()).toBeInstanceOf(Filter)
    })

    it('should create an instance from container with given attributes', () => {
      const svg = new Svg()
      const filter = svg.filter({ id: 'foo' })
      expect(filter.id()).toEqual('foo')
    })
  })
})
