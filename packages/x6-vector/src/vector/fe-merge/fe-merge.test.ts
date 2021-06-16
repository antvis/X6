import { FEMergeNode } from '../fe-merge-node/fe-merge-node'
import { Filter } from '../filter/filter'
import { FEMerge } from './fe-merge'

describe('FEMerge', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEMerge.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance from filter', () => {
      const filter = new Filter()
      expect(filter.feMerge()).toBeInstanceOf(FEMerge)
    })

    it('should create an instance from filter with given attributes', () => {
      const filter = new Filter()
      const fe = filter.feMerge({ id: 'foo' })
      expect(fe.id()).toEqual('foo')
    })
  })

  describe('feMergeNode()', () => {
    it('should create an FeMergeNode', () => {
      const fe = new FEMerge()
      const node = fe.feMergeNode()
      expect(node).toBeInstanceOf(FEMergeNode)
    })

    it('should create an FeMergeNode with given attributes', () => {
      const fe = new FEMerge()
      const node = fe.feMergeNode({ id: 'bar' })
      expect(node).toBeInstanceOf(FEMergeNode)
      expect(node.id()).toEqual('bar')
    })
  })
})
