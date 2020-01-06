import { Point } from './point'

describe('point', () => {
  describe('#constructor', () => {
    it('should create a point instance', () => {
      expect(new Point()).toBeInstanceOf(Point)
      expect(new Point(1)).toBeInstanceOf(Point)
      expect(new Point(1, 2)).toBeInstanceOf(Point)
      expect(new Point().equals(new Point(0, 0)))
    })
  })
})
