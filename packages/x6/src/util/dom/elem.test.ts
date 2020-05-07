import { Vectorizer } from './vectorizer'
import { createVector, createVectors } from './vector'
import {
  ensureId,
  isSVGGraphicsElement,
  remove,
  tagName,
  createElement,
} from './elem'

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

createVector(
  'svg',
  { id: 'svg-container' },
  createVectors(svgContent),
).appendTo(wrap)

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
  remove(wrap)
}

describe('Dom', () => {
  describe('elem', () => {
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

    describe('#ensureId', () => {
      it('should set a id when id is empty', () => {
        const node = (document.createElement('g') as any) as SVGElement
        expect(node.id).toBe('')

        const id = ensureId(node)
        expect(node.id).toEqual(id)
      })

      it('should not overwrite if id exited', () => {
        const node = (document.createElement('g') as any) as SVGElement
        expect(node.id).toBe('')

        const id = ensureId(node)
        expect(node.id).toEqual(id)
        expect(ensureId(node)).toEqual(id)
      })
    })

    describe('id', () => {
      it('should auto generate id', () => {
        const vel = createVector('rect')
        expect(vel.id).not.toBeNull()
        expect(vel.id).toEqual(vel.node.id)
      })

      it('should set id for node', () => {
        const vel = createVector('rect')
        vel.id = 'xxx'
        expect(vel.id).toEqual('xxx')
        expect(vel.id).toEqual(vel.node.id)
      })
    })

    describe('#isSVGGraphicsElement', () => {
      it('should return true when the given element is a SVGGraphicsElement', () => {
        expect(isSVGGraphicsElement(createVector('circle').node)).toBe(true)
        expect(isSVGGraphicsElement(createVector('rect').node)).toBe(true)
        expect(isSVGGraphicsElement(createVector('path').node)).toBe(true)
      })

      it('should return false when the given element is not a SVGGraphicsElement', () => {
        expect(isSVGGraphicsElement()).toBe(false)
        expect(isSVGGraphicsElement(createVector('linearGradient').node)).toBe(
          false,
        )
      })
    })

    describe('#index', () => {
      it('should return 0 for the first child', () => {
        expect(createVector(svgContainer).index()).toEqual(0)
        expect(createVector(svgPath).index()).toEqual(0)
      })

      it('should return correct index of children', () => {
        expect(createVector(svgPath).index()).toEqual(0)
        expect(createVector(svgGroup).index()).toEqual(1)
        expect(createVector(svgPolygon).index()).toEqual(2)
        expect(createVector(svgText).index()).toEqual(3)
        expect(createVector(svgRectangle).index()).toEqual(4)

        expect(createVector(svgEllipse).index()).toEqual(0)
        expect(createVector(svgCircle).index()).toEqual(1)
      })
    })

    describe('#tagName', () => {
      it('should return the correct tagName with lowercase', () => {
        expect(createVector(svgContainer).tagName()).toEqual('svg')
        expect(createVector(svgPath).tagName()).toEqual('path')
        expect(createVector(svgGroup).tagName()).toEqual('g')
        expect(createVector(svgCircle).tagName()).toEqual('circle')
        expect(createVector(svgEllipse).tagName()).toEqual('ellipse')
        expect(createVector(svgPolygon).tagName()).toEqual('polygon')
        expect(createVector(svgText).tagName()).toEqual('text')
        expect(createVector(svgRectangle).tagName()).toEqual('rect')
        expect(createVector(svgGroup1).tagName()).toEqual('g')
        expect(createVector(svgGroup2).tagName()).toEqual('g')
        expect(createVector(svgGroup3).tagName()).toEqual('g')
        expect(createVector(svgPath2).tagName()).toEqual('path')
        expect(createVector(svgPath3).tagName()).toEqual('path')
        expect(createVector(svgLinearGradient).tagName()).toEqual(
          'lineargradient',
        )
      })

      it('should return uppercase tagName when specified', () => {
        expect(tagName(svgContainer, false)).toEqual('SVG')
      })
    })

    describe('#find', () => {
      it('should return an array of vectorizers', () => {
        const container = createVector(svgContainer)
        const found = container.find('circle')
        expect(found).toBeInstanceOf(Array)
        expect(found.length > 0).toBeTruthy()
        expect(found.every(f => f instanceof Vectorizer)).toBe(true)
      })
    })

    describe('#findOne', () => {
      it('should return the first found vectorizer', () => {
        const container = createVector(svgContainer)
        const found = container.findOne('circle')
        expect(found).toBeInstanceOf(Vectorizer)
        expect(found!.id).toEqual('svg-circle')
      })
    })

    describe('#findParentByClass', () => {
      it('should return parent vectorizer if exists', () => {
        const found = createVector(svgGroup3).findParentByClass('group-1')
        expect(found != null && found.node === svgGroup1).toBe(true)
      })

      it('should return null if none parent matched', () => {
        const found = createVector(svgGroup3).findParentByClass('not-a-parent')
        expect(found == null).toBe(true)
      })

      it('should stopped early', () => {
        const found1 = createVector(svgGroup3).findParentByClass(
          'group-1',
          svgGroup2,
        )
        expect(found1 == null).toBe(true)

        const found2 = createVector(svgGroup3).findParentByClass(
          'group-1',
          svgCircle,
        )
        expect(found2 != null && found2.node === svgGroup1).toBe(true)
      })
    })

    describe('#contains', () => {
      it('...', () => {
        expect(createVector(svgContainer).contains(svgGroup1)).toBe(true)
        expect(createVector(svgGroup1).contains(svgGroup2)).toBe(true)
        expect(createVector(svgGroup1).contains(svgGroup3)).toBe(true)

        expect(createVector(svgGroup3).contains(svgGroup1)).toBe(false)
        expect(createVector(svgGroup2).contains(svgGroup1)).toBe(false)
        expect(createVector(svgGroup1).contains(svgGroup1)).toBe(false)
        expect(createVector(svgGroup1).contains(document as any)).toBe(false)
      })
    })

    describe('#empty', () => {
      const vel = createVector('g')
      beforeEach(() => createVector(svgContainer).append(vel))
      afterEach(() => vel.remove())

      it('should remove all child nodes', () => {
        vel.append([
          createVector('rect'),
          createVector('polygon'),
          createVector('circle'),
        ])
        expect(vel.node.childNodes.length).toEqual(3)
        vel.empty()
        expect(vel.node.childNodes.length).toEqual(0)
      })
    })

    describe('#append', () => {
      const group = createVector(createElement('g') as any)

      beforeEach(() => group.empty())

      it('should append single element', () => {
        group.append(createVector('<rect/>'))
        expect(group.node.childNodes.length).toEqual(1)
        expect(childrenTagNames(group)).toEqual(['rect'])
      })

      it('should append multiple elements', () => {
        group.append(createVectors('<rect/><circle/>'))
        expect(group.node.childNodes.length).toEqual(2)
        expect(childrenTagNames(group)).toEqual(['rect', 'circle'])

        group.append(createVectors('<line/><polygon/>'))
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
        group = createVector(svgGroup)
          .clone()
          .empty()
          .appendTo(svgContainer)
      })

      afterAll(() => group.remove())

      it('should prepend single element', () => {
        group.prepend(createVector('<rect/>'))
        expect(group.node.childNodes.length).toEqual(1)
        expect(childrenTagNames(group)).toEqual(['rect'])
      })

      it('should prepend multiple elements', () => {
        group.prepend(createVectors('<rect/><circle/>'))
        expect(group.node.childNodes.length).toEqual(2)
        expect(childrenTagNames(group)).toEqual(['rect', 'circle'])

        group.prepend(createVectors('<line/><polygon/>'))
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
        group = createVector(svgGroup)
          .clone()
          .empty()
        rect = createVector(svgRectangle)
          .clone()
          .empty()
        group.append(rect)
      })

      afterAll(() => group.remove())

      it('should add single element', () => {
        rect.before(createVector('<circle/>'))
        expect(group.node.childNodes.length).toEqual(2)
        expect(childrenTagNames(group)).toEqual(['circle', 'rect'])

        rect.before(createVector('<line/>'))
        expect(group.node.childNodes.length).toEqual(3)
        expect(childrenTagNames(group)).toEqual(['circle', 'line', 'rect'])
      })

      it('should add multiple elements', () => {
        rect.before(createVectors('<ellipse/><circle/>'))
        expect(group.node.childNodes.length).toEqual(3)
        expect(childrenTagNames(group)).toEqual(['ellipse', 'circle', 'rect'])

        rect.before(createVectors('<line/><polygon/>'))
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
        const children = createVector(svgGroup).children()
        expect(children).toBeInstanceOf(Array)
        expect(children.every(c => c instanceof Vectorizer)).toEqual(true)
      })
    })
  })
})
