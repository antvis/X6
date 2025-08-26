import { describe, expect, it } from "vitest";
import { Unit } from '@/common'

describe('Unit', () => {
  beforeAll(() => {
    Unit.setMillimeterSize(3.7)
  })
  describe('#toPx', () => {
    it('should return correct px', () => {
      expect(Math.floor(Unit.toPx(10, 'mm'))).toBe(37)
      expect(Math.floor(Unit.toPx(10, 'pt'))).toBe(13)
      expect(Math.floor(Unit.toPx(10, 'pc'))).toBe(156)
    })
  })
})
