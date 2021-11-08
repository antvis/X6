import { G } from '../g/g'
import { SVG } from '../svg/svg'
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
      const svg = new SVG()
      expect(svg.filter()).toBeInstanceOf(Filter)
    })

    it('should create an instance from container with given attributes', () => {
      const svg = new SVG()
      const filter = svg.filter({ id: 'foo' })
      expect(filter.id()).toEqual('foo')
    })
  })

  describe('units()', () => {
    it('should set units attributes', () => {
      const filter = new Filter()
      filter.units('userSpaceOnUse')
      expect(filter.units()).toEqual('userSpaceOnUse')
      expect(filter.attr('filterUnits')).toEqual('userSpaceOnUse')
    })
  })

  describe('primitiveUnits()', () => {
    it('should set primitiveUnits attributes', () => {
      const filter = new Filter()
      filter.primitiveUnits('userSpaceOnUse')
      expect(filter.primitiveUnits()).toEqual('userSpaceOnUse')
      expect(filter.attr('primitiveUnits')).toEqual('userSpaceOnUse')
    })
  })

  describe('update()', () => {
    it('should clear the element', () => {
      const filter = new Filter()
      filter.append(new G())
      expect(filter.update().children()).toEqual([])
    })

    it('should execute a function in the context of the filter', () => {
      const filter = new Filter()
      const g = new G()
      filter.update((instance) => instance.append(g))
      expect(filter.children()).toEqual([g])
    })
  })

  describe('targets()', () => {
    it('should get all targets of this filter', () => {
      const svg = new SVG().appendTo(document.body)
      const filter = svg.filter()
      const rect = svg.rect(100, 100).filterWith(filter)
      expect(filter.targets()).toEqual([rect])
      expect(rect.filterRef()).toEqual(filter)

      rect.filterWith(null)
      expect(filter.targets()).toEqual([])
      expect(rect.filterRef()).toBeNull()

      svg.remove()
    })
  })

  describe('remove()', () => {
    it('should unfilter all targets', () => {
      const svg = new SVG().appendTo(document.body)
      const filter = svg.filter()
      const rect = svg.rect(100, 100).filterWith(filter)
      expect(filter.targets()).toEqual([rect])
      expect(filter.remove()).toBe(filter)
      expect(rect.attr('filter')).toBeUndefined()
      svg.remove()
    })
  })
})
