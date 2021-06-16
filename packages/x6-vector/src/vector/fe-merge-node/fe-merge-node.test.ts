import { FEMergeNode } from './fe-merge-node'

describe('FEMergeNode', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(FEMergeNode.create({ id: 'foo' }).id()).toBe('foo')
    })
  })

  describe('in()', () => {
    it('should set in attribute', () => {
      const fe = new FEMergeNode()
      fe.in('BackgroundAlpha')
      expect(fe.in()).toEqual('BackgroundAlpha')
      expect(fe.attr('in')).toEqual('BackgroundAlpha')
    })
  })
})
