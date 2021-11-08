import { PathArray } from '../../struct/path-array'
import { SVG } from '../svg/svg'
import { Path } from './path'

describe('Path', () => {
  describe('constructor()', () => {
    it('should create an instance with given attributes', () => {
      expect(Path.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance with path string and attributes', () => {
      const path = Path.create('M1 2 3 4', { id: 'foo' })
      expect(path.toArray()).toEqual([
        ['M', 1, 2],
        ['L', 3, 4],
      ])
    })
  })

  describe('toArray()', () => {
    it('should return the underlying array', () => {
      const path = Path.create()
      const array = path.plot('M1 2 3 4').toArray()
      expect(array).toEqual([
        ['M', 1, 2],
        ['L', 3, 4],
      ])
    })
  })

  describe('toPathArray()', () => {
    it('should return the underlying toPathArray', () => {
      const path = Path.create()
      const array = path.plot('M1 2 3 4').toPathArray()
      expect(array).toBeInstanceOf(PathArray)
      expect(array.slice()).toEqual([
        ['M', 1, 2],
        ['L', 3, 4],
      ])
    })
  })

  describe('x()', () => {
    it('should get the x position of the path', () => {
      const svg = new SVG().appendTo(document.body)

      const path = svg.path('M10 10 50, 50')
      expect(path.x()).toBe(10)

      svg.remove()
    })

    it('should set the x position of the path and returns itself', () => {
      const svg = new SVG().appendTo(document.body)

      const path = svg.path('M0 0 50, 50')
      expect(path.x(100)).toBe(path)
      expect(path.x()).toBe(100)

      svg.remove()
    })
  })

  describe('y()', () => {
    it('gets the y position of the path', () => {
      const svg = new SVG().appendTo(document.body)

      const path = svg.path('M10 10 50, 50')
      expect(path.y()).toBe(10)

      svg.remove()
    })

    it('sets the y position of the path and returns itself', () => {
      const svg = new SVG().appendTo(document.body)

      const path = svg.path('M0 0 50, 50')
      expect(path.y(100)).toBe(path)
      expect(path.y()).toBe(100)

      svg.remove()
    })
  })

  describe('width()', () => {
    it('should get the width of the path', () => {
      const svg = new SVG().appendTo(document.body)

      const path = svg.path('M0 0 50, 50')
      expect(path.width()).toBe(50)

      svg.remove()
    })

    it('should set the width of the path and returns itself', () => {
      const svg = new SVG().appendTo(document.body)

      const path = svg.path('M0 0 50, 50')
      expect(path.width(100)).toBe(path)
      expect(path.width()).toBe(100)

      svg.remove()
    })
  })

  describe('height()', () => {
    it('should get the height of the path', () => {
      const svg = new SVG().appendTo(document.body)

      const path = svg.path('M0 0 50, 50')
      expect(path.height()).toBe(50)

      svg.remove()
    })

    it('should set the height of the path and returns itself', () => {
      const svg = new SVG().appendTo(document.body)

      const path = svg.path('M0 0 50, 50')
      expect(path.height(100)).toBe(path)
      expect(path.height()).toBe(100)

      svg.remove()
    })
  })

  describe('size()', () => {
    it('should set the size of the path', () => {
      const svg = new SVG().appendTo(document.body)

      const path = svg.path('M0 0 50, 50')
      path.size(100, 100)
      expect(path.bbox().toArray()).toEqual([0, 0, 100, 100])

      svg.remove()
    })

    it('should change height proportionally', () => {
      const svg = new SVG().appendTo(document.body)

      const path = svg.path('M0 0 50, 50')
      path.size(100, null)
      expect(path.bbox().toArray()).toEqual([0, 0, 100, 100])

      svg.remove()
    })

    it('should change width proportionally', () => {
      const svg = new SVG().appendTo(document.body)

      const path = svg.path('M0 0 50, 50')
      path.size(null, 100)
      expect(path.bbox().toArray()).toEqual([0, 0, 100, 100])

      svg.remove()
    })
  })

  describe('move()', () => {
    it('should move the path along x and y axis', () => {
      const svg = new SVG().appendTo(document.body)

      const path = svg.path('M0 0 50, 50')
      path.move(50, 50)
      expect(path.bbox().toArray()).toEqual([50, 50, 50, 50])

      svg.remove()
    })
  })

  describe('plot()', () => {
    it('should work as a getter', () => {
      const path = Path.create('M1 2 3 4')
      expect(path.plot()).toEqual([
        ['M', 1, 2],
        ['L', 3, 4],
      ])
    })

    it('should plot with a path string', () => {
      const path = Path.create('M1 2 3 4')
      path.plot('M0 0L50 50')
      expect(path.attr('d')).toEqual('M0 0L50 50')
    })

    it('should plot with path segment', () => {
      const path = Path.create('M1 2 3 4')
      path.plot([
        ['M', 0, 0],
        ['L', 50, 50],
      ])
      expect(path.attr('d')).toEqual('M0 0L50 50')
    })

    it('should plot with PathArray', () => {
      const path = Path.create('M1 2 3 4')
      path.plot(
        new PathArray([
          ['M', 0, 0],
          ['L', 50, 50],
        ]),
      )
      expect(path.attr('d')).toEqual('M0 0L50 50')
    })
  })

  describe('length()', () => {
    it('should return the path length', () => {
      expect(Path.create('M0 0 0, 50').length()).toEqual(50)
    })
  })

  describe('pointAt()', () => {
    it('should return a point on the path', () => {
      const p = Path.create('M0 0 50, 50').pointAt(0)
      expect(p.x).toEqual(0)
      expect(p.y).toEqual(0)
    })
  })
})
