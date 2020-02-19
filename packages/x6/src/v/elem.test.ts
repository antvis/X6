import { v } from './v'
import { Vectorizer } from './vectorizer'

const wrap = document.createElement('div')
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

v('svg', { id: 'svg-container' }, v.batch(svgContent)).appendTo(wrap)

export function setupTest() {
  document.body.appendChild(wrap)
  const byId = <T>(id: string) => (document.getElementById(id) as any) as T
  return {
    wrap,
    svgContainer: byId<SVGSVGElement>('svg-container'),
    svgDefs: byId<SVGPathElement>('svg-defs'),
    svgPath: byId<SVGPathElement>('svg-path'),
    svgGroup: byId<SVGGElement>('svg-group'),
    svgCircle: byId<SVGCircleElement>('svg-circle'),
    svgEllipse: byId<SVGEllipseElement>('svg-ellipse'),
    svgPolygon: byId<SVGPolygonElement>('svg-polygon'),
    svgText: byId<SVGTextElement>('svg-text'),
    svgRectangle: byId<SVGRectElement>('svg-rectangle'),
    svgGroup1: byId<SVGGElement>('svg-group-1'),
    svgGroup2: byId<SVGGElement>('svg-group-2'),
    svgGroup3: byId<SVGGElement>('svg-group-3'),
    svgPath2: byId<SVGPathElement>('svg-path-2'),
    svgPath3: byId<SVGPathElement>('svg-path-3'),
    svgLinearGradient: byId<SVGLinearGradientElement>('svg-linear-gradient'),
  }
}

export function clearnTest() {
  v.remove(wrap)
}

describe('v', () => {
  const childrenTagNames = (vel: Vectorizer) => {
    const tagNames: string[] = []
    vel.node.childNodes.forEach(childNode => {
      tagNames.push((childNode as HTMLElement).tagName.toLowerCase())
    })
    return tagNames
  }

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
    svgLinearGradient,
  } = setupTest()

  afterAll(() => clearnTest())

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

    it('should return uppercase tagName when specified', () => {
      expect(v.tagName(svgContainer, false)).toEqual('SVG')
    })
  })

  describe('#find', () => {
    it('should return an array of vectorizers', () => {
      const container = v(svgContainer)
      const found = container.find('circle')
      expect(found).toBeInstanceOf(Array)
      expect(found.length > 0).toBeTruthy()
      expect(found.every(f => f instanceof Vectorizer)).toBe(true)
    })
  })

  describe('#findOne', () => {
    it('should return the first found vectorizer', () => {
      const container = v(svgContainer)
      const found = container.findOne('circle')
      expect(found).toBeInstanceOf(Vectorizer)
      expect(found!.id).toEqual('svg-circle')
    })
  })

  describe('#findParentByClass', () => {
    it('should return parent vectorizer if exists', () => {
      const found = v(svgGroup3).findParentByClass('group-1')
      expect(found != null && found.node === svgGroup1).toBe(true)
    })

    it('should return null if none parent matched', () => {
      const found = v(svgGroup3).findParentByClass('not-a-parent')
      expect(found == null).toBe(true)
    })

    it('should stopped early', () => {
      const found1 = v(svgGroup3).findParentByClass('group-1', svgGroup2)
      expect(found1 == null).toBe(true)

      const found2 = v(svgGroup3).findParentByClass('group-1', svgCircle)
      expect(found2 != null && found2.node === svgGroup1).toBe(true)
    })
  })

  describe('#contains', () => {
    it('...', () => {
      expect(v(svgContainer).contains(svgGroup1)).toBe(true)
      expect(v(svgGroup1).contains(svgGroup2)).toBe(true)
      expect(v(svgGroup1).contains(svgGroup3)).toBe(true)

      expect(v(svgGroup3).contains(svgGroup1)).toBe(false)
      expect(v(svgGroup2).contains(svgGroup1)).toBe(false)
      expect(v(svgGroup1).contains(svgGroup1)).toBe(false)
      expect(v(svgGroup1).contains(document as any)).toBe(false)
    })
  })

  describe('#empty', () => {
    const vel = v('g')
    beforeEach(() => v(svgContainer).append(vel))
    afterEach(() => vel.remove())

    it('should remove all child nodes', () => {
      vel.append([v('rect'), v('polygon'), v('circle')])
      expect(vel.node.childNodes.length).toEqual(3)
      vel.empty()
      expect(vel.node.childNodes.length).toEqual(0)
    })
  })

  describe('#append', () => {
    const group = v(v.createElement('g') as any)

    beforeEach(() => group.empty())

    it('should append single element', () => {
      group.append(v('<rect/>'))
      expect(group.node.childNodes.length).toEqual(1)
      expect(childrenTagNames(group)).toEqual(['rect'])
    })

    it('should append multiple elements', () => {
      group.append(v.batch('<rect/><circle/>'))
      expect(group.node.childNodes.length).toEqual(2)
      expect(childrenTagNames(group)).toEqual(['rect', 'circle'])

      group.append(v.batch('<line/><polygon/>'))
      expect(group.node.childNodes.length).toEqual(4)
      expect(childrenTagNames(group)).toEqual([
        'rect',
        'circle',
        'line',
        'polygon',
      ])
    })
  })

  describe('#prepend', () => {
    let group: Vectorizer

    beforeEach(() => {
      group = v(svgGroup)
        .clone()
        .empty()
        .appendTo(svgContainer)
    })

    afterAll(() => group.remove())

    it('should prepend single element', () => {
      group.prepend(v('<rect/>'))
      expect(group.node.childNodes.length).toEqual(1)
      expect(childrenTagNames(group)).toEqual(['rect'])
    })

    it('should prepend multiple elements', () => {
      group.prepend(v.batch('<rect/><circle/>'))
      expect(group.node.childNodes.length).toEqual(2)
      expect(childrenTagNames(group)).toEqual(['rect', 'circle'])

      group.prepend(v.batch('<line/><polygon/>'))
      expect(group.node.childNodes.length).toEqual(4)
      expect(childrenTagNames(group)).toEqual([
        'line',
        'polygon',
        'rect',
        'circle',
      ])
    })
  })

  describe('#before', () => {
    let group: Vectorizer
    let rect: Vectorizer

    beforeEach(() => {
      group = v(svgGroup)
        .clone()
        .empty()
      rect = v(svgRectangle)
        .clone()
        .empty()
      group.append(rect)
    })

    afterAll(() => group.remove())

    it('should add single element', () => {
      rect.before(v('<circle/>'))
      expect(group.node.childNodes.length).toEqual(2)
      expect(childrenTagNames(group)).toEqual(['circle', 'rect'])

      rect.before(v('<line/>'))
      expect(group.node.childNodes.length).toEqual(3)
      expect(childrenTagNames(group)).toEqual(['circle', 'line', 'rect'])
    })

    it('should add multiple elements', () => {
      rect.before(v.batch('<ellipse/><circle/>'))
      expect(group.node.childNodes.length).toEqual(3)
      expect(childrenTagNames(group)).toEqual(['ellipse', 'circle', 'rect'])

      rect.before(v.batch('<line/><polygon/>'))
      expect(group.node.childNodes.length).toEqual(5)
      expect(childrenTagNames(group)).toEqual([
        'ellipse',
        'circle',
        'line',
        'polygon',
        'rect',
      ])
    })
  })

  describe('#children', () => {
    it('should return a array for vectorizers', () => {
      const children = v(svgGroup).children()
      expect(children).toBeInstanceOf(Array)
      expect(children.every(c => c instanceof Vectorizer)).toEqual(true)
    })
  })
})
