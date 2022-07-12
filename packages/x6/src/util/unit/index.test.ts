import { Unit } from './index'

describe('Unit', () => {
  describe('#toPx', () => {
    it('should return correct px', () => {
      expect(Math.floor(Unit.toPx(10, 'mm'))).toBe(37)
      // expect(Math.floor(Unit.toPx(10, 'cm'))).toBe(376)
      // expect(Math.floor(Unit.toPx(10, 'in'))).toBe(956)
      expect(Math.floor(Unit.toPx(10, 'pt'))).toBe(13)
      expect(Math.floor(Unit.toPx(10, 'pc'))).toBe(159)
    })
  })
})
