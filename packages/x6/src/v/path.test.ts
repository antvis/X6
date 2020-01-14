import { v } from './v'
import { Vectorizer } from './vectorizer'

describe('v', () => {
  let fixture: HTMLDivElement
  let svgContainer: SVGSVGElement
  let svgPath: SVGPathElement
  let svgGroup: SVGGElement
  let svgCircle: SVGCircleElement
  let svgEllipse: SVGEllipseElement
  let svgPolygon: SVGPolygonElement
  let svgText: SVGTextElement
  let svgRectangle: SVGRectElement
  let svgGroup1: SVGGElement
  let svgGroup2: SVGGElement
  let svgGroup3: SVGGElement
  let svgPath2: SVGPathElement
  let svgPath3: SVGPathElement

  const byId = <T>(id: string) => (document.getElementById(id) as any) as T

  beforeAll(async done => {
    fixture = document.createElement('div')
    fixture.id = 'test-fixture'

    const svgContent =
      '<path id="svg-path" d="M10 10"/>' +
      '<!-- comment -->' +
      '<g id="svg-group">' +
      '  <ellipse id="svg-ellipse" x="10" y="10" rx="30" ry="30"/>' +
      '  <circle id="svg-circle" cx="10" cy="10" r="2" fill="red"/>' +
      '</g>' +
      '<polygon id="svg-polygon" points="200,10 250,190 160,210"/>' +
      '<text id="svg-text" x="0" y="15" fill="red">Test</text>' +
      '<rect id="svg-rectangle" x="100" y="100" width="50" height="100"/>' +
      '<g id="svg-group-1" class="group-1">' +
      '  <g id="svg-group-2" class="group-2">' +
      '    <g id="svg-group-3" class="group3">' +
      '      <path id="svg-path-2" d="M 100 100 C 100 100 0 150 100 200 Z"/>' +
      '    </g>' +
      '  </g>' +
      '</g>' +
      '<path id="svg-path-3"/>' +
      '<linearGradient id= "svg-linear-gradient"><stop/></linearGradient>'

    document.body.appendChild(fixture)
    fixture.appendChild(
      v('svg', { id: 'svg-container' }, v.createBatch(svgContent)).node,
    )

    svgContainer = byId<SVGSVGElement>('svg-container')
    svgPath = byId<SVGPathElement>('svg-path')
    svgGroup = byId<SVGGElement>('svg-group')
    svgCircle = byId<SVGCircleElement>('svg-circle')
    svgEllipse = byId<SVGEllipseElement>('svg-ellipse')
    svgPolygon = byId<SVGPolygonElement>('svg-polygon')
    svgText = byId<SVGTextElement>('svg-text')
    svgRectangle = byId<SVGRectElement>('svg-rectangle')
    svgGroup1 = byId<SVGGElement>('svg-group-1')
    svgGroup2 = byId<SVGGElement>('svg-group-2')
    svgGroup3 = byId<SVGGElement>('svg-group-3')
    svgPath2 = byId<SVGPathElement>('svg-path-2')
    svgPath3 = byId<SVGPathElement>('svg-path-3')

    done()
  })

  describe('#convertToPathData', () => {
    function roundPathData(pathData: string | null) {
      return pathData != null
        ? pathData
            .split(' ')
            .map(command => {
              const number = parseInt(command, 10)
              if (isNaN(number)) return command
              return number.toFixed(0)
            })
            .join(' ')
        : null
    }

    it('should throw an exception on convert an invalid SvgElement', () => {
      expect(() => {
        const group = v('<group/>')
        v.convertToPathData(group.node as any)
      }).toThrowError()
    })

    it('should convert SVGPathElement', () => {
      const path = v('path', { d: 'M 100 50 L 200 150' })
      expect(path.convertToPathData()).toEqual('M 100 50 L 200 150')
    })

    it('should convert SVGLineElement', () => {
      const line = v('line', { x1: 100, y1: 50, x2: 200, y2: 150 })
      expect(line.convertToPathData()).toEqual('M 100 50 L 200 150')
    })

    it('should convert SVGRectElement', () => {
      const rect = v('rect', {
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
      const rect = v('<rect/>', {
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
      const circle = v('circle', { cx: 100, cy: 50, r: 50 })
      expect(roundPathData(circle.convertToPathData())).toEqual(
        'M 100 0 C 127 0 150 22 150 50 C 150 77 127 100 100 100 C 72 100 50 77 50 50 C 50 22 72 0 100 0 Z',
      )
    })

    it('should convert SVGEllipseElement', () => {
      const ellipse = v('ellipse', {
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
      const polygon = v('polygon', {
        points: '200,10 250,190 160,210',
      })
      expect(polygon.convertToPathData()).toEqual(
        'M 200 10 L250 190 L160 210 Z',
      )
    })

    it('should convert SVGPolylineElement', () => {
      const polyline = v('polyline', {
        points: '100,10 200,10 150,110',
      })
      expect(polyline.convertToPathData()).toEqual('M 100 10 L200 10 L150 110')
    })
  })

  describe('#normalizePath', () => {
    it('should return this for any SVGElement', () => {
      expect(v(svgPath).normalizePath()).toBeInstanceOf(Vectorizer)
      expect(v(svgPath2).normalizePath()).toBeInstanceOf(Vectorizer)
      expect(v(svgPath3).normalizePath()).toBeInstanceOf(Vectorizer)
      expect(v(svgContainer).normalizePath()).toBeInstanceOf(Vectorizer)
      expect(v(svgGroup).normalizePath()).toBeInstanceOf(Vectorizer)
      expect(v(svgCircle).normalizePath()).toBeInstanceOf(Vectorizer)
      expect(v(svgEllipse).normalizePath()).toBeInstanceOf(Vectorizer)
      expect(v(svgPolygon).normalizePath()).toBeInstanceOf(Vectorizer)
      expect(v(svgText).normalizePath()).toBeInstanceOf(Vectorizer)
      expect(v(svgRectangle).normalizePath()).toBeInstanceOf(Vectorizer)
      expect(v(svgGroup1).normalizePath()).toBeInstanceOf(Vectorizer)
      expect(v(svgGroup2).normalizePath()).toBeInstanceOf(Vectorizer)
      expect(v(svgGroup3).normalizePath()).toBeInstanceOf(Vectorizer)
    })

    it('shoule normalize path "d" attribute', () => {
      expect(
        v(svgPath)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(true)
      expect(
        v(svgPath2)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(true)
      expect(
        v(svgPath3)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(true)

      expect(
        v(svgPath)
          .normalizePath()
          .attr('d'),
      ).toEqual('M 10 10')
      expect(
        v(svgPath2)
          .normalizePath()
          .attr('d'),
      ).toEqual('M 100 100 C 100 100 0 150 100 200 Z')
      expect(
        v(svgPath3)
          .normalizePath()
          .attr('d'),
      ).toEqual('M 0 0')
    })

    it('should only normalize SVGPathElement', () => {
      expect(
        v(svgContainer)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(false)
      expect(
        v(svgGroup)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(false)
      expect(
        v(svgCircle)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(false)
      expect(
        v(svgEllipse)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(false)
      expect(
        v(svgPolygon)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(false)
      expect(
        v(svgText)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(false)
      expect(
        v(svgRectangle)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(false)
      expect(
        v(svgGroup1)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(false)
      expect(
        v(svgGroup2)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(false)
      expect(
        v(svgGroup3)
          .normalizePath()
          .node.hasAttribute('d'),
      ).toBe(false)
    })
  })
})
