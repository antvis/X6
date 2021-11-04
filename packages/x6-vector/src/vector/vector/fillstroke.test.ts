import { Pattern } from '../pattern/pattern'
import { Rect } from '../rect/rect'
import { SVG } from '../svg/svg'

describe('Vector', () => {
  describe('fill()', () => {
    describe('setter', () => {
      it('should return itself', () => {
        const rect = new Rect()
        expect(rect.fill('black')).toBe(rect)
      })

      it('should set a fill color', () => {
        const rect = new Rect()
        expect(rect.fill('black').attr('fill')).toBe('black')
      })

      it('should remove fill when pass `null`', () => {
        const rect = new Rect()
        expect(rect.fill('black').attr('fill')).toBe('black')
        expect(rect.fill(null).attr('fill')).toEqual('#000000')
      })

      it('should set fill with color object', () => {
        const rect = new Rect()
        expect(rect.fill({ r: 1, g: 1, b: 1 }).attr('fill')).toBe(
          'rgba(1,1,1,1)',
        )
      })

      it('should set a fill pattern when pattern given', () => {
        const svg = new SVG()
        const pattern = svg.pattern()
        const rect = svg.rect(100, 100)
        expect(rect.fill(pattern).attr('fill')).toBe(pattern.url())
      })

      it('should set a fill pattern when image given', () => {
        const svg = new SVG()
        const image = svg.image('http://via.placeholder.com/120x80')
        const rect = svg.rect(100, 100)
        expect(rect.fill(image).attr('fill')).toBe(
          image.parent<Pattern>()!.url(),
        )
      })

      it('should set a fill pattern when image url given', () => {
        const svg = new SVG()
        const rect = svg.rect()
        rect.fill(
          'https://www.centerforempathy.org/wp-content/uploads/2019/11/placeholder.png',
        )
        const defs = svg.defs()
        const pattern = defs.firstChild<Pattern>()!

        expect(rect.fill()).toEqual(pattern.url())
      })

      it('should set an object of fill properties', () => {
        const rect = new Rect()
        expect(
          rect
            .fill({
              color: 'black',
              opacity: 0.5,
              rule: 'evenodd',
            })
            .attr(),
        ).toEqual({
          fill: 'black',
          fillOpacity: 0.5,
          fillRule: 'evenodd',
        } as any)
      })
    })

    describe('getter', () => {
      it('should return fill color', () => {
        const rect = new Rect().fill('black')
        expect(rect.fill()).toBe('black')
      })
    })
  })

  describe('stroke()', () => {
    describe('setter', () => {
      it('should return itself', () => {
        const rect = new Rect()
        expect(rect.stroke('black')).toBe(rect)
      })

      it('should set a stroke color', () => {
        const rect = new Rect()
        expect(rect.stroke('black').attr('stroke')).toBe('black')
      })

      it('should sets a stroke pattern when pattern given', () => {
        const svg = new SVG()
        const pattern = svg.pattern()
        const rect = svg.rect(100, 100)
        expect(rect.stroke(pattern).attr('stroke')).toBe(pattern.url())
      })

      it('should set a stroke pattern when image given', () => {
        const svg = new SVG()
        const image = svg.image('http://via.placeholder.com/120x80')
        const rect = svg.rect(100, 100)
        expect(rect.stroke(image).attr('stroke')).toBe(
          image.parent<Pattern>()!.url(),
        )
      })

      it('should set an object of stroke properties', () => {
        const rect = new Rect()
        expect(
          rect
            .stroke({
              color: 'black',
              width: 2,
              opacity: 0.5,
              linecap: 'butt',
              linejoin: 'miter',
              miterlimit: 10,
              dasharray: '2 2',
              dashoffset: 15,
            })
            .attr(),
        ).toEqual({
          stroke: 'black',
          strokeWidth: 2,
          strokeOpacity: 0.5,
          strokeLinecap: 'butt',
          strokeLinejoin: 'miter',
          strokeMiterlimit: 10,
          strokeDasharray: '2 2',
          strokeDashoffset: 15,
        } as any)
      })

      it('should set stroke dasharray with array passed', () => {
        const rect = new Rect().stroke({ dasharray: [2, 2] })
        expect(rect.attr()).toEqual({ strokeDasharray: '2 2' } as any)
      })
    })

    describe('getter', () => {
      it('should return stroke color', () => {
        const rect = new Rect().stroke('black')
        expect(rect.stroke()).toBe('black')
      })
    })
  })

  describe('opacity()', () => {
    it('should get/set opacity', () => {
      const rect = new Rect()
      expect(rect.opacity()).toEqual(1)
      rect.opacity(0.5)
      expect(rect.opacity()).toEqual(0.5)
    })
  })
})
