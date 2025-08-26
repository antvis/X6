import { describe, expect, it } from "vitest";
import { Dom } from '../../../src/common/dom'

describe('Dom', () => {
  describe('#prefix', () => {
    it('should return prefixed name with compatibility name', () => {
      expect(Dom.getVendorPrefixedName('userDrag')).toBe('webkitUserDrag')
    })
  })
})
