import { Rect } from '../rect/rect'

describe('Vector', () => {
  let rect: Rect

  beforeEach(() => {
    rect = new Rect()
  })

  describe('x()', () => {
    it('should call attr with x', () => {
      const spy = spyOn(rect, 'attr')
      rect.x(123)
      expect(spy).toHaveBeenCalledWith('x', 123)
    })
  })

  describe('y()', () => {
    it('should call attr with y', () => {
      const spy = spyOn(rect, 'attr')
      rect.y(123)
      expect(spy).toHaveBeenCalledWith('y', 123)
    })
  })

  describe('move()', () => {
    it('should call `x()` and `y()` with passed parameters and return itself', () => {
      const spyx = spyOn(rect, 'x').and.callThrough()
      const spyy = spyOn(rect, 'y').and.callThrough()
      expect(rect.move(1, 2)).toBe(rect)
      expect(spyx).toHaveBeenCalledWith(1)
      expect(spyy).toHaveBeenCalledWith(2)
    })
  })

  describe('cx()', () => {
    it('should return the elements center along the x axis', () => {
      rect.attr({ x: 10, width: 100 })
      expect(rect.cx()).toBe(60)
    })

    it('should center the element along the x axis and return itself', () => {
      rect.attr({ x: 10, width: 100 })
      expect(rect.cx(100)).toBe(rect)
      expect(rect.attr('x')).toBe(50)
    })
  })

  describe('cy()', () => {
    it('should return the elements center along the y axis', () => {
      rect.attr({ y: 10, height: 100 })
      expect(rect.cy()).toBe(60)
    })

    it('should center the element along the y axis and return itself', () => {
      rect.attr({ y: 10, height: 100 })
      expect(rect.cy(100)).toBe(rect)
      expect(rect.attr('y')).toBe(50)
    })
  })

  describe('center()', () => {
    it('should call `cx()` and `cy()` with passed parameters and return itself', () => {
      const spyCx = spyOn(rect, 'cx').and.callThrough()
      const spyCy = spyOn(rect, 'cy').and.callThrough()
      expect(rect.center(1, 2)).toBe(rect)
      expect(spyCx).toHaveBeenCalledWith(1)
      expect(spyCy).toHaveBeenCalledWith(2)
    })
  })

  describe('dx()', () => {
    it('should move the element along the x axis relatively and return itself', () => {
      rect.attr({ x: 10, width: 100 })
      expect(rect.dx(100)).toBe(rect)
      expect(rect.attr('x')).toBe(110)
    })
  })

  describe('dy()', () => {
    it('should move the element along the x axis relatively and return itself', () => {
      rect.attr({ y: 10, height: 100 })
      expect(rect.dy(100)).toBe(rect)
      expect(rect.attr('y')).toBe(110)
    })
  })

  describe('dmove()', () => {
    it('should call `dx()` and `dy()` with passed parameters and return itself', () => {
      const spyDx = spyOn(rect, 'dx').and.callThrough()
      const spyDy = spyOn(rect, 'dy').and.callThrough()
      expect(rect.dmove(1, 2)).toBe(rect)
      expect(spyDx).toHaveBeenCalledWith(1)
      expect(spyDy).toHaveBeenCalledWith(2)
    })
  })

  describe('width()', () => {
    it('should call attr with width', () => {
      const spy = spyOn(rect, 'attr')
      rect.width(123)
      expect(spy).toHaveBeenCalledWith('width', 123)
    })
  })

  describe('height()', () => {
    it('should call attr with height', () => {
      const spy = spyOn(rect, 'attr')
      rect.height(123)
      expect(spy).toHaveBeenCalledWith('height', 123)
    })
  })

  describe('size()', () => {
    it('should call `width()` and `height()` with passed parameters and return itself', () => {
      const spyWidth = spyOn(rect, 'width').and.callThrough()
      const spyHeight = spyOn(rect, 'height').and.callThrough()
      expect(rect.size(1, 2)).toBe(rect)
      expect(spyWidth).toHaveBeenCalledWith(1)
      expect(spyHeight).toHaveBeenCalledWith(2)
    })

    it('should change height proportionally if null', () => {
      const rect = Rect.create(100, 100)
      const spyWidth = spyOn(rect, 'width').and.callThrough()
      const spyHeight = spyOn(rect, 'height').and.callThrough()
      expect(rect.size(200, null)).toBe(rect)
      expect(spyWidth).toHaveBeenCalledWith(200)
      expect(spyHeight).toHaveBeenCalledWith(200)
    })

    it('should change width proportionally if null', () => {
      const rect = Rect.create(100, 100)
      const spyWidth = spyOn(rect, 'width').and.callThrough()
      const spyHeight = spyOn(rect, 'height').and.callThrough()
      expect(rect.size(null, 200)).toBe(rect)
      expect(spyWidth).toHaveBeenCalledWith(200)
      expect(spyHeight).toHaveBeenCalledWith(200)
    })
  })
})
