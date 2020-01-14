import { v } from './v'

describe('v', () => {
  describe('styleToObject', () => {
    it('should parse style string to object', () => {
      const ret = { fill: 'red', stroke: 'blue' }
      expect(v.styleToObject('fill=red; stroke=blue')).toEqual(ret)
      expect(v.styleToObject('fill=red; stroke=blue;')).toEqual(ret)
    })

    it('should ingore empty section', () => {
      expect(v.styleToObject(';fill=red;;')).toEqual({ fill: 'red' })
    })

    it('should parse empty string to empty object', () => {
      expect(v.styleToObject('')).toEqual({})
    })
  })

  describe('mergeAttrs', () => {
    it('shoule merge attrs by extend', () => {
      expect(
        v.mergeAttrs(
          { x: 5, y: 10, style: 'fill=red; stroke=blue' },
          { y: 20, style: { stroke: 'orange' } },
        ),
      ).toEqual({ x: 5, y: 20, style: { fill: 'red', stroke: 'orange' } })
    })
  })
})
