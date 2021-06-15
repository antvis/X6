import { G } from '../g/g'
import { Path } from '../path/path'
import { Svg } from '../svg/svg'
import { Marker } from './marker'

describe('Marker', () => {
  describe('constructor()', () => {
    it('should create an instance of Marker', () => {
      expect(new Marker()).toBeInstanceOf(Marker)
    })

    it('should set passed attributes on the element', () => {
      expect(new Marker({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance with given attributes', () => {
      const marker = Marker.create({ id: 'foo' })
      expect(marker.id()).toBe('foo')
    })

    it('should create an instance with given width and height', () => {
      const marker = Marker.create(100, 200)
      expect(marker.width()).toBe(100)
      expect(marker.height()).toBe(200)
    })

    it('should create an instance with given width, height and attributes', () => {
      const marker = Marker.create(100, 200, { id: 'foo' })
      expect(marker.width()).toBe(100)
      expect(marker.height()).toBe(200)
      expect(marker.id()).toBe('foo')
    })

    it('should create an instance with given width, height, update function and attributes', () => {
      const marker = Marker.create(100, 200, (m) => m.rect(100, 100), {
        id: 'foo',
      })
      expect(marker.width()).toBe(100)
      expect(marker.height()).toBe(200)
      expect(marker.id()).toBe('foo')
      expect(marker.children().length).toBe(1)
    })

    it('should create an instance with given size', () => {
      const marker = Marker.create(100)
      expect(marker.width()).toBe(100)
      expect(marker.height()).toBe(100)
    })

    it('should create an instance with given size, update function and attributes', () => {
      const marker = Marker.create(100, (m) => m.rect(100, 100), { id: 'foo' })

      expect(marker.width()).toBe(100)
      expect(marker.height()).toBe(100)
      expect(marker.id()).toBe('foo')
      expect(marker.children().length).toBe(1)
    })

    it('should create an instance with given size and attributes', () => {
      const marker = Marker.create(100, { id: 'foo' })
      expect(marker.width()).toBe(100)
      expect(marker.height()).toBe(100)
      expect(marker.id()).toBe('foo')
    })

    it('should create an instance from container', () => {
      const svg = new Svg()
      const g = svg.group()
      const marker = g.marker()
      expect(marker).toBeInstanceOf(Marker)
    })

    it('should throw an error when container do not in svg context', () => {
      const g = new G()
      expect(() => g.marker()).toThrowError()
    })
  })

  describe('Line extension', () => {
    let path: Path
    let svg: Svg

    beforeEach(() => {
      // because we use `reference` here we need to put it into the live dom
      svg = new Svg().addTo(document.body)
      path = svg.path(
        'M 100 200 C 200 100 300  0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100',
      )
    })

    afterEach(() => {
      svg.remove()
    })

    it('should create an instance of Marker', () => {
      path.marker('mid', 10, 12, function (m) {
        m.rect(10, 12)
        this.ref(5, 6)
      })

      const marker = path.reference('marker-mid')!

      expect(marker.children().length).toBe(1)
      expect(marker.attr('refX')).toBe(5)
      expect(marker).toBeInstanceOf(Marker)

      expect(path.reference('marker-end')).toBeNull()
    })

    it('should create a marker and applies it to the marker-start attribute', () => {
      path.marker('start', 10, 12)
      const marker = path.reference('marker-start')!
      expect(path.node.getAttribute('marker-start')).toBe(marker.toString())
    })

    it('should create a marker and applies it to the marker-mid attribute', () => {
      path.marker('mid', 10, 12)
      const marker = path.reference('marker-mid')!
      expect(path.node.getAttribute('marker-mid')).toBe(marker.toString())
    })

    it('should create a marker and applies it to the marker-end attribute', () => {
      path.marker('end', 10, 12)
      const marker = path.reference('marker-end')!
      expect(path.node.getAttribute('marker-end')).toBe(marker.toString())
    })

    it('should create a marker and applies it to the marker attribute', () => {
      path.marker('all', 10, 12)
      const marker = path.reference('marker')!
      expect(path.node.getAttribute('marker')).toBe(marker.toString())
    })

    it('accepts an instance of an existing marker element as the second argument', () => {
      const marker = new Marker().size(11, 11)
      path.marker('mid', marker)
      expect(path.node.getAttribute('marker-mid')).toBe(marker.toString())
    })
  })

  describe('width()', () => {
    it('should set the markerWidth attribute', () => {
      const marker = new Marker().width(100)
      expect(marker.attr('markerWidth')).toBe(100)
    })
  })

  describe('height()', () => {
    it('should set the markerHeight attribute', () => {
      const marker = new Marker().height(100)
      expect(marker.attr('markerHeight')).toBe(100)
    })
  })

  describe('orient()', () => {
    it('should set the orient attribute', () => {
      const marker = new Marker().orient('auto')
      expect(marker.attr('orient')).toBe('auto')
    })
  })

  describe('units()', () => {
    it('should set the units attribute', () => {
      const marker = new Marker().units('userSpaceOnUse')
      expect(marker.attr('markerUnits')).toBe('userSpaceOnUse')
    })
  })

  describe('ref()', () => {
    it('should set the refX and refY attribute', () => {
      const marker = new Marker().ref(10, 20)
      expect(marker.attr('refX')).toBe(10)
      expect(marker.attr('refY')).toBe(20)
    })
  })

  describe('update()', () => {
    it('should update the marker', (done) => {
      const marker = new Marker()
      marker.rect(100, 100)
      marker.update(function (m) {
        m.rect(100, 100)
        expect(this).toBe(marker)
        expect(m).toBe(marker)
        done()
      })
      expect(marker.children().length).toBe(1)
    })
  })

  describe('toString()', () => {
    it('should return the url identifier for this marker', () => {
      const marker = new Marker()
      expect(marker.toString()).toBe(`url(#${marker.id()})`)
    })
  })
})
