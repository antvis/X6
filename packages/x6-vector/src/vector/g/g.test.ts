import { G } from './g'

describe('G', () => {
  describe('constructor()', () => {
    it('should create an instance with empty args', () => {
      expect(G.create()).toBeInstanceOf(G)
    })

    it('should create an sintance with passed attributes', () => {
      expect(G.create({ id: 'foo' }).id()).toBe('foo')
    })
  })
})
