import { Defs } from './defs'

describe('Defs', () => {
  describe('flatten()', () => {
    it('should doe nothing and returns itself', () => {
      const defs = Object.freeze(new Defs())
      expect(defs.flatten()).toBe(defs)
    })
  })

  describe('ungroup()', () => {
    it('should do nothing and returns itself', () => {
      const defs = Object.freeze(new Defs())
      expect(defs.ungroup()).toBe(defs)
    })
  })
})
