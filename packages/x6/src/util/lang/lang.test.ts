import { Lang } from '.'

describe('Lang', () => {
  describe('#isNumeric', () => {
    it('should return true with numberic string', () => {
      expect(Lang.isNumeric('1')).toBe(true)
      expect(Lang.isNumeric('1.2')).toBe(true)
    })

    it('should return true with invalid types', () => {
      expect(Lang.isNumeric(null)).toBe(false)
      expect(Lang.isNumeric(undefined)).toBe(false)
      expect(Lang.isNumeric({ a: 1 })).toBe(false)
      expect(Lang.isNumeric([1])).toBe(false)
      expect(Lang.isNumeric(new Date())).toBe(false)
      expect(Lang.isNumeric(/a/g)).toBe(false)
    })
  })

  describe('#isWindow', () => {
    it('should return `true` for window', () => {
      expect(Lang.isWindow(window)).toBe(true)
    })

    it('should return `false` for non window', () => {
      expect(Lang.isWindow(1)).toBe(false)
      expect(Lang.isWindow(false)).toBe(false)
      expect(Lang.isWindow('a')).toBe(false)
      expect(Lang.isWindow(/x/)).toBe(false)
      expect(Lang.isWindow({ a: 1 })).toBe(false)
      expect(Lang.isWindow([1, 2, 3])).toBe(false)
      expect(Lang.isWindow(new Date())).toBe(false)
      expect(Lang.isWindow(new Error())).toBe(false)
    })
  })
})
