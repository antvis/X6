import { G } from '../g/g'
import { Rect } from '../rect/rect'
import { SVG } from '../svg/svg'

describe('ContainerGeometry', () => {
  let svg: SVG
  let g: G

  beforeEach(() => {
    document.body.style.margin = '0px'
    document.body.style.padding = '0px'
    svg = new SVG().appendTo(document.body)
    g = svg.group()
  })

  afterEach(() => {
    svg.remove()
    document.body.style.margin = ''
    document.body.style.padding = ''
  })

  describe('dmove()', () => {
    it('should move the bbox of the group by a certain amount (1)', () => {
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      g.dmove(10, 10)

      const box = g.bbox()
      expect(box.x).toEqual(20)
      expect(box.y).toEqual(30)
    })

    it('should move the bbox of the group by a certain amount (2)', () => {
      g.rect(400, 200).move(123, 312).rotate(34).skew(12)
      g.rect(100, 50).move(11, 43).translate(123, 32).skew(-12)
      g.rect(400, 200).rotate(90)
      g.group().rotate(23).group().skew(32).rect(100, 40).skew(11).rotate(12)

      const oldBox = g.bbox()

      g.dmove(10, 10)

      const newBox = g.bbox()

      expect(newBox.x).toBeCloseTo(oldBox.x + 10, 4)
      expect(newBox.y).toBeCloseTo(oldBox.y + 10, 4)
      expect(newBox.w).toBeCloseTo(oldBox.w, 4)
      expect(newBox.h).toBeCloseTo(oldBox.h, 4)
    })
  })

  describe('dx()', () => {
    it('should call dmove with dy=0 and returns itself', () => {
      const spy = spyOn(g, 'dmove').and.callThrough()
      expect(g.dx(10)).toBe(g)
      expect(spy).toHaveBeenCalledWith(10, 0)
    })
  })

  describe('dy()', () => {
    it('should call dmove with dx=0 and returns itself', () => {
      const spy = spyOn(g, 'dmove').and.callThrough()
      expect(g.dy(10)).toBe(g)
      expect(spy).toHaveBeenCalledWith(0, 10)
    })
  })

  describe('move()', () => {
    it('should call dmove() with the correct difference', () => {
      g.rect(100, 200).move(111, 223)

      spyOn(g, 'dmove')

      g.move(100, 150)
      expect(g.dmove).toHaveBeenCalledWith(-11, -73)
    })
  })

  describe('x()', () => {
    it('should get the x value of the bbox', () => {
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      expect(g.x()).toBe(g.bbox().x)
      expect(g.x()).toBe(10)
    })

    it('should call move with the paramater as x', () => {
      g.rect(100, 200).move(111, 223)
      spyOn(g, 'move')
      g.x(100)
      expect(g.move).toHaveBeenCalledWith(100, g.bbox().y, g.bbox())
    })
  })

  describe('y()', () => {
    it('should get the y value of the bbox', () => {
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      expect(g.y()).toBe(g.bbox().y)
      expect(g.y()).toBe(20)
    })

    it('should call move with the paramater as y', () => {
      g.rect(100, 200).move(111, 223)
      spyOn(g, 'move')
      g.y(100)
      expect(g.move).toHaveBeenCalledWith(g.bbox().x, 100, g.bbox())
    })
  })

  describe('size()', () => {
    it('should change the dimensions of the bbox (1)', () => {
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      const oldBox = g.bbox()

      g.size(100, 100)

      const newBox = g.bbox()

      expect(newBox.x).toBeCloseTo(oldBox.x, 4)
      expect(newBox.y).toBeCloseTo(oldBox.y, 4)
      expect(newBox.w).toBeCloseTo(100, 4)
      expect(newBox.h).toBeCloseTo(100, 4)

      const rbox1 = g.children<Rect>()[0].rbox()
      const rbox2 = g.children<Rect>()[1].rbox()

      expect(rbox1.width).toBeCloseTo(90.9, 1)
      expect(Math.floor(rbox2.width * 10) / 10).toBeCloseTo(63.6, 1) // Browsers have different opinion on this one (chrome: 63.6, ff: 63.7)

      expect(rbox1.x).toBeCloseTo(10, 1)
      expect(rbox2.x).toBeCloseTo(46.4, 1)
      expect(rbox1.height).toBeCloseTo(85.7, 1)
      expect(rbox2.height).toBeCloseTo(71.4, 1)
      expect(rbox1.y).toBeCloseTo(20, 1)
      expect(rbox2.y).toBeCloseTo(48.6, 1)
    })

    it('should change the dimensions of the bbox (2)', () => {
      g.rect(400, 200).move(123, 312).rotate(34).skew(12)
      g.rect(100, 50).move(11, 43).translate(123, 32).skew(-12)
      g.rect(400, 200).rotate(90)
      g.group().rotate(23).group().skew(32).rect(100, 40).skew(11).rotate(12)

      const oldBox = g.bbox()

      g.size(100, 100)

      const newBox = g.bbox()

      expect(newBox.x).toBeCloseTo(oldBox.x, 4)
      expect(newBox.y).toBeCloseTo(oldBox.y, 4)
      expect(newBox.w).toBeCloseTo(100, 4)
      expect(newBox.h).toBeCloseTo(100, 4)
    })
  })

  describe('width()', () => {
    it('should get the width value of the bbox', () => {
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      expect(g.width()).toBe(g.bbox().width)
      expect(g.width()).toBe(110)
    })

    it('should set the width value of the bbox by moving all children', () => {
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      expect(g.width(100)).toBe(g)
      expect(g.bbox().width).toBe(100)

      const rbox1 = g.children<Rect>()[0].rbox()
      const rbox2 = g.children<Rect>()[1].rbox()

      expect(rbox1.width).toBeCloseTo(90.9, 1)
      expect(Math.floor(rbox2.width * 10) / 10).toBeCloseTo(63.6, 1) // Browsers have different opinion on this one (chrome: 63.6, ff: 63.7)

      expect(rbox1.x).toBeCloseTo(10, 3)
      expect(rbox2.x).toBeCloseTo(46.4, 1)
    })
  })

  describe('height()', () => {
    it('should get the height value of the bbox', () => {
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      expect(g.height()).toBe(g.bbox().height)
      expect(g.height()).toBe(140)

      svg.remove()
    })

    it('should set the height value of the bbox by moving all children', () => {
      g.add(new Rect({ width: 100, height: 120, x: 10, y: 20 }))
      g.add(new Rect({ width: 70, height: 100, x: 50, y: 60 }))

      expect(g.height(100)).toBe(g)
      expect(g.bbox().height).toBeCloseTo(100, 3)

      const rbox1 = g.children<Rect>()[0].rbox()
      const rbox2 = g.children<Rect>()[1].rbox()

      expect(rbox1.height).toBeCloseTo(85.7, 1)
      expect(rbox2.height).toBeCloseTo(71.4, 1)

      expect(rbox1.y).toBeCloseTo(20, 3)
      expect(rbox2.y).toBeCloseTo(48.6, 1)
    })
  })
})
