import { getVendorPrefixedName } from './prefix'

describe('Dom', () => {
  describe('#prefix', () => {
    it('should return prefixed name with compatibility name', () => {
      expect(getVendorPrefixedName('userDrag')).toBe('WebkitUserDrag')
    })
  })
})
