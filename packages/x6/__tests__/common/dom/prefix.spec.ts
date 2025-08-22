import { Dom } from '@/common/dom'

describe('Dom', () => {
  describe('#prefix', () => {
    it('should return prefixed name with compatibility name', () => {
      expect(Dom.getVendorPrefixedName('userDrag')).toBe('webkitUserDrag')
    })
  })
})
