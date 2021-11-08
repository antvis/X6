import { Pattern } from '../pattern/pattern'
import { SVG } from '../svg/svg'
import { Image } from './image'

describe('Image', () => {
  const url = 'http://via.placeholder.com/120x80'

  describe('constructor()', () => {
    it('should create an instance of Image', () => {
      expect(new Image()).toBeInstanceOf(Image)
    })

    it('should create an instance with given attributes', () => {
      expect(Image.create({ id: 'foo' }).id()).toBe('foo')
    })

    it('should create an instance with given url and attributes', () => {
      const image = Image.create(url, {
        id: 'foo',
      })
      expect(image.id()).toBe('foo')
      expect(image.attr('href')).toEqual(url)
    })

    it('should create an instance with given url, callback and attributes', (done) => {
      const image = Image.create(
        url,
        function () {
          expect(this.width()).toEqual(120)
          expect(this.height()).toEqual(80)
          done()
        },
        {
          id: 'foo',
        },
      )
      expect(image.id()).toBe('foo')
      expect(image.attr('href')).toEqual(url)
    })

    it('should create an instance in the container', () => {
      const svg = new SVG()
      const image = svg.image()
      expect(image).toBeInstanceOf(Image)
    })
  })

  describe('load()', () => {
    it('should no nothing when url is falsy and returns itself', () => {
      const image = new Image()
      expect(image.load()).toBe(image)
    })

    it('should execute a callback when the image is loaded', (done) => {
      new Image().load(url, (e: any) => {
        expect(e.target.complete).toBe(true)
        done()
      })
    })

    it('should set width and height automatically if no size is given', (done) => {
      const image = new Image().load(url, () => {
        expect(image.attr('width')).toBe(120)
        expect(image.attr('height')).toBe(80)
        done()
      })
    })

    it('should not change with and height when size already set', (done) => {
      const image = new Image()
        .load(url, () => {
          expect(image.attr('width')).toBe(100)
          expect(image.attr('height')).toBe(100)
          done()
        })
        .size(100, 100)
    })

    it('should change the size of pattern to image size if parent is pattern and size is 0', (done) => {
      const pattern = new Pattern().size(0, 0)
      new Image()
        .load(url, () => {
          expect(pattern.attr('width')).toBe(100)
          expect(pattern.attr('height')).toBe(100)
          done()
        })
        .size(100, 100)
        .appendTo(pattern)
    })

    it('should not change the size of pattern if pattern has a size set', (done) => {
      const pattern = new Pattern().size(50, 50)
      new Image().load(url, () => {
        expect(pattern.attr('width')).toBe(50)
        expect(pattern.attr('height')).toBe(50)
        done()
      })
    })
  })
})
