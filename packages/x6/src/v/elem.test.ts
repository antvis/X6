import { v } from './v'

describe('v', () => {
  const byId = <T>(id: string) => (document.getElementById(id) as any) as T

  const fixture = document.createElement('div')
  fixture.id = 'test-fixture'
  document.body.appendChild(fixture)

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

  fixture.appendChild(
    v('svg', { id: 'svg-container' }, v.createBatch(svgContent)).node,
  )

  const svgContainer = byId<SVGSVGElement>('svg-container')
  const svgPath = byId<SVGPathElement>('svg-path')
  const svgGroup = byId<SVGGElement>('svg-group')
  const svgCircle = byId<SVGCircleElement>('svg-circle')
  const svgEllipse = byId<SVGEllipseElement>('svg-ellipse')
  const svgPolygon = byId<SVGPolygonElement>('svg-polygon')
  const svgText = byId<SVGTextElement>('svg-text')
  const svgRectangle = byId<SVGRectElement>('svg-rectangle')
  const svgGroup1 = byId<SVGGElement>('svg-group-1')
  const svgGroup2 = byId<SVGGElement>('svg-group-2')
  const svgGroup3 = byId<SVGGElement>('svg-group-3')
  const svgPath2 = byId<SVGPathElement>('svg-path-2')
  const svgPath3 = byId<SVGPathElement>('svg-path-3')
  const svgLinearGradient = byId<SVGLinearGradientElement>(
    'svg-linear-gradient',
  )

  afterAll(() => {
    fixture.parentNode?.removeChild(fixture)
  })

  describe('#index', () => {
    it('should return 0 for the first child', () => {
      expect(v(svgContainer).index()).toEqual(0)
      expect(v(svgPath).index()).toEqual(0)
    })

    it('should return correct index of children', () => {
      expect(v(svgPath).index()).toEqual(0)
      expect(v(svgGroup).index()).toEqual(1)
      expect(v(svgPolygon).index()).toEqual(2)
      expect(v(svgText).index()).toEqual(3)
      expect(v(svgRectangle).index()).toEqual(4)

      expect(v(svgEllipse).index()).toEqual(0)
      expect(v(svgCircle).index()).toEqual(1)
    })
  })

  describe('#tagName', () => {
    it('should return the correct tagName with lowercase', () => {
      expect(v(svgContainer).tagName()).toEqual('svg')
      expect(v(svgPath).tagName()).toEqual('path')
      expect(v(svgGroup).tagName()).toEqual('g')
      expect(v(svgCircle).tagName()).toEqual('circle')
      expect(v(svgEllipse).tagName()).toEqual('ellipse')
      expect(v(svgPolygon).tagName()).toEqual('polygon')
      expect(v(svgText).tagName()).toEqual('text')
      expect(v(svgRectangle).tagName()).toEqual('rect')
      expect(v(svgGroup1).tagName()).toEqual('g')
      expect(v(svgGroup2).tagName()).toEqual('g')
      expect(v(svgGroup3).tagName()).toEqual('g')
      expect(v(svgPath2).tagName()).toEqual('path')
      expect(v(svgPath3).tagName()).toEqual('path')
      expect(v(svgLinearGradient).tagName()).toEqual('lineargradient')
    })
  })
})
