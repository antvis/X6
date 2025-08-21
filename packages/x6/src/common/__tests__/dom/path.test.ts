import { Vector } from '../../vector'
import { Dom } from '../../dom'

describe('Dom', () => {
  describe('path', () => {
    describe('#toPath', () => {
      it('should convert SVGPathElement', () => {
        const path = Vector.create('path', { d: 'M 100 50 L 200 150' })
        expect(path.toPath().getAttribute('d')).toBe('M 100 50 L 200 150')
      })
    })

    describe('#toPathData', () => {
      function roundPathData(pathData: string | null) {
        return pathData != null
          ? pathData
              .split(' ')
              .map((command) => {
                const number = parseInt(command, 10)
                if (Number.isNaN(number)) {
                  return command
                }
                return number.toFixed(0)
              })
              .join(' ')
          : null
      }

      it('should throw an exception on convert an invalid SvgElement', () => {
        expect(() => {
          const group = Vector.create('<group/>')
          Dom.toPathData(group.node as any)
        }).toThrowError()
      })

      it('should convert SVGPathElement', () => {
        const path = Vector.create('path', { d: 'M 100 50 L 200 150' })
        expect(path.toPathData()).toEqual('M 100 50 L 200 150')
      })

      it('should convert SVGLineElement', () => {
        const line = Vector.create('line', {
          x1: 100,
          y1: 50,
          x2: 200,
          y2: 150,
        })
        expect(line.toPathData()).toEqual('M 100 50 L 200 150')
      })

      it('should convert SVGRectElement', () => {
        const rect = Vector.create('rect', {
          x: 100,
          y: 50,
          width: 200,
          height: 150,
        })
        expect(rect.toPathData()).toEqual('M 100 50 H 300 V 200 H 100 V 50 Z')
      })

      it('should convert SVGRectElement with `rx` and `ry` attributes', () => {
        const rect = Vector.create('<rect/>', {
          x: 100,
          y: 50,
          width: 200,
          height: 150,
          rx: 200,
          ry: 200,
        })
        expect(rect.toPathData()).toEqual(
          'M 100 125 v 0 a 100 75 0 0 0 100 75 h 0 a 100 75 0 0 0 100 -75 v 0 a 100 75 0 0 0 -100 -75 h 0 a 100 75 0 0 0 -100 75 Z',
        )
      })

      it('should convert SVGCircleElement', () => {
        const circle = Vector.create('circle', { cx: 100, cy: 50, r: 50 })
        expect(roundPathData(circle.toPathData())).toEqual(
          'M 100 0 C 127 0 150 22 150 50 C 150 77 127 100 100 100 C 72 100 50 77 50 50 C 50 22 72 0 100 0 Z',
        )
      })

      it('should convert SVGEllipseElement', () => {
        const ellipse = Vector.create('ellipse', {
          cx: 100,
          cy: 50,
          rx: 100,
          ry: 50,
        })
        expect(roundPathData(ellipse.toPathData())).toEqual(
          'M 100 0 C 155 0 200 22 200 50 C 200 77 155 100 100 100 C 44 100 0 77 0 50 C 0 22 44 0 100 0 Z',
        )
      })

      it('should convert SVGPolygonElement', () => {
        const polygon = Vector.create('polygon', {
          points: '200,10 250,190 160,210',
        })
        expect(polygon.toPathData()).toEqual('M 200 10 L250 190 L160 210 Z')
      })

      it('should convert SVGPolylineElement', () => {
        const polyline = Vector.create('polyline', {
          points: '100,10 200,10 150,110',
        })
        expect(polyline.toPathData()).toEqual('M 100 10 L200 10 L150 110')
      })
    })

    describe('#createSlicePathData', () => {
      it('should return the path string of a part of sector', () => {
        expect(Dom.createSlicePathData(5, 10, 0, Math.PI / 2)).toBe(
          'M10,0A10,10 0 0,1 6.123233995736766e-16,10L3.061616997868383e-16,5A5,5 0 0,0 5,0Z',
        )
      })
    })
  })
})
