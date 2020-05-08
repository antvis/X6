import { setupTest, clearnTest } from './elem.test'
import { createVector } from './vector'
import { Vectorizer } from './vectorizer'
import { toPathData } from './path'

describe('Dom', () => {
  describe('path', () => {
    const {
      svgContainer,
      svgPath,
      svgGroup,
      svgCircle,
      svgEllipse,
      svgPolygon,
      svgText,
      svgRectangle,
      svgGroup1,
      svgGroup2,
      svgGroup3,
      svgPath2,
      svgPath3,
    } = setupTest()

    afterAll(() => clearnTest())

    describe('#toPathData', () => {
      function roundPathData(pathData: string | null) {
        return pathData != null
          ? pathData
              .split(' ')
              .map((command) => {
                const number = parseInt(command, 10)
                if (isNaN(number)) return command
                return number.toFixed(0)
              })
              .join(' ')
          : null
      }

      it('should throw an exception on convert an invalid SvgElement', () => {
        expect(() => {
          const group = createVector('<group/>')
          toPathData(group.node as any)
        }).toThrowError()
      })

      it('should convert SVGPathElement', () => {
        const path = createVector('path', { d: 'M 100 50 L 200 150' })
        expect(path.convertToPathData()).toEqual('M 100 50 L 200 150')
      })

      it('should convert SVGLineElement', () => {
        const line = createVector('line', {
          x1: 100,
          y1: 50,
          x2: 200,
          y2: 150,
        })
        expect(line.convertToPathData()).toEqual('M 100 50 L 200 150')
      })

      it('should convert SVGRectElement', () => {
        const rect = createVector('rect', {
          x: 100,
          y: 50,
          width: 200,
          height: 150,
        })
        expect(rect.convertToPathData()).toEqual(
          'M 100 50 H 300 V 200 H 100 V 50 Z',
        )
      })

      it('should convert SVGRectElement with `rx` and `ry` attributes', () => {
        const rect = createVector('<rect/>', {
          x: 100,
          y: 50,
          width: 200,
          height: 150,
          rx: 200,
          ry: 200,
        })
        expect(rect.convertToPathData()).toEqual(
          'M 100 125 v 0 a 100 75 0 0 0 100 75 h 0 a 100 75 0 0 0 100 -75 v 0 a 100 75 0 0 0 -100 -75 h 0 a 100 75 0 0 0 -100 75 Z',
        )
      })

      it('should convert SVGCircleElement', () => {
        const circle = createVector('circle', { cx: 100, cy: 50, r: 50 })
        expect(roundPathData(circle.convertToPathData())).toEqual(
          'M 100 0 C 127 0 150 22 150 50 C 150 77 127 100 100 100 C 72 100 50 77 50 50 C 50 22 72 0 100 0 Z',
        )
      })

      it('should convert SVGEllipseElement', () => {
        const ellipse = createVector('ellipse', {
          cx: 100,
          cy: 50,
          rx: 100,
          ry: 50,
        })
        expect(roundPathData(ellipse.convertToPathData())).toEqual(
          'M 100 0 C 155 0 200 22 200 50 C 200 77 155 100 100 100 C 44 100 0 77 0 50 C 0 22 44 0 100 0 Z',
        )
      })

      it('should convert SVGPolygonElement', () => {
        const polygon = createVector('polygon', {
          points: '200,10 250,190 160,210',
        })
        expect(polygon.convertToPathData()).toEqual(
          'M 200 10 L250 190 L160 210 Z',
        )
      })

      it('should convert SVGPolylineElement', () => {
        const polyline = createVector('polyline', {
          points: '100,10 200,10 150,110',
        })
        expect(polyline.convertToPathData()).toEqual(
          'M 100 10 L200 10 L150 110',
        )
      })
    })

    describe('#normalizePath', () => {
      it('should return this for any SVGElement', () => {
        expect(createVector(svgPath).normalizePath()).toBeInstanceOf(Vectorizer)
        expect(createVector(svgPath2).normalizePath()).toBeInstanceOf(
          Vectorizer,
        )
        expect(createVector(svgPath3).normalizePath()).toBeInstanceOf(
          Vectorizer,
        )
        expect(createVector(svgContainer).normalizePath()).toBeInstanceOf(
          Vectorizer,
        )
        expect(createVector(svgGroup).normalizePath()).toBeInstanceOf(
          Vectorizer,
        )
        expect(createVector(svgCircle).normalizePath()).toBeInstanceOf(
          Vectorizer,
        )
        expect(createVector(svgEllipse).normalizePath()).toBeInstanceOf(
          Vectorizer,
        )
        expect(createVector(svgPolygon).normalizePath()).toBeInstanceOf(
          Vectorizer,
        )
        expect(createVector(svgText).normalizePath()).toBeInstanceOf(Vectorizer)
        expect(createVector(svgRectangle).normalizePath()).toBeInstanceOf(
          Vectorizer,
        )
        expect(createVector(svgGroup1).normalizePath()).toBeInstanceOf(
          Vectorizer,
        )
        expect(createVector(svgGroup2).normalizePath()).toBeInstanceOf(
          Vectorizer,
        )
        expect(createVector(svgGroup3).normalizePath()).toBeInstanceOf(
          Vectorizer,
        )
      })

      it('shoule normalize path "d" attribute', () => {
        expect(
          createVector(svgPath).normalizePath().node.hasAttribute('d'),
        ).toBe(true)
        expect(
          createVector(svgPath2).normalizePath().node.hasAttribute('d'),
        ).toBe(true)
        expect(
          createVector(svgPath3).normalizePath().node.hasAttribute('d'),
        ).toBe(true)

        expect(createVector(svgPath).normalizePath().attr('d')).toEqual(
          'M 10 10',
        )
        expect(createVector(svgPath2).normalizePath().attr('d')).toEqual(
          'M 100 100 C 100 100 0 150 100 200 Z',
        )
        expect(createVector(svgPath3).normalizePath().attr('d')).toEqual(
          'M 0 0',
        )
      })

      it('should only normalize SVGPathElement', () => {
        expect(
          createVector(svgContainer).normalizePath().node.hasAttribute('d'),
        ).toBe(false)
        expect(
          createVector(svgGroup).normalizePath().node.hasAttribute('d'),
        ).toBe(false)
        expect(
          createVector(svgCircle).normalizePath().node.hasAttribute('d'),
        ).toBe(false)
        expect(
          createVector(svgEllipse).normalizePath().node.hasAttribute('d'),
        ).toBe(false)
        expect(
          createVector(svgPolygon).normalizePath().node.hasAttribute('d'),
        ).toBe(false)
        expect(
          createVector(svgText).normalizePath().node.hasAttribute('d'),
        ).toBe(false)
        expect(
          createVector(svgRectangle).normalizePath().node.hasAttribute('d'),
        ).toBe(false)
        expect(
          createVector(svgGroup1).normalizePath().node.hasAttribute('d'),
        ).toBe(false)
        expect(
          createVector(svgGroup2).normalizePath().node.hasAttribute('d'),
        ).toBe(false)
        expect(
          createVector(svgGroup3).normalizePath().node.hasAttribute('d'),
        ).toBe(false)
      })
    })
  })
})
