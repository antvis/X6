import { v } from './v'
import { Vectorizer } from './vectorizer'

describe('v', () => {
  describe('#create', () => {
    it('should create a vectorizer instance with tagName', () => {
      const vel = v.create('rect')
      expect(v.isVectorizer(vel)).toBe(true)
      expect(vel.node).toBeInstanceOf(SVGRectElement)
    })

    it('should create a vectorizer instance with SVGElement', () => {
      const old = v.create('rect')
      const vel = v.create(old.node)
      expect(v.isVectorizer(vel)).toBe(true)
      expect(vel.node).toBeInstanceOf(SVGRectElement)
    })

    it('should create a vectorizer instance with another vectorizer', () => {
      const old = v.create('rect')
      const vel = v.create(old)
      expect(v.isVectorizer(vel)).toBe(true)
      expect(vel.node).toBeInstanceOf(SVGRectElement)
    })

    it('should create a vectorizer instance with markup', () => {
      const vel = v.create('<rect width="100%" height="100%" fill="red" />')
      expect(vel.node).toBeInstanceOf(SVGRectElement)
      expect(vel.getAttribute('width')).toEqual('100%')
      expect(vel.getAttribute('height')).toEqual('100%')
      expect(vel.getAttribute('fill')).toEqual('red')
    })

    it('should throw an error with invalid markup', () => {
      const fn = () => v.create('<invalid markup>')
      expect(fn).toThrowError()
    })

    it('should throw an error with empty markup', () => {
      const fn = () => v.create('')
      expect(fn).toThrowError()
    })
  })

  describe('#createBatch', () => {
    it('should return an array of vectorizers', () => {
      const vels = v.createBatch(
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
          '<linearGradient id= "svg-linear-gradient"><stop/></linearGradient>',
      )

      expect(Array.isArray(vels)).toBe(true)
      expect(vels.length).toEqual(9)
      vels.forEach(vel => {
        expect(vel).toBeInstanceOf(Vectorizer)
      })
    })

    it('should fall back to create a vectorizer', () => {
      expect(v.createBatch('rect').length).toEqual(1)
    })
  })

  describe('#ensureId', () => {
    it('should set a id when id is empty', () => {
      const node = (document.createElement('g') as any) as SVGElement
      expect(node.id).toBe('')

      const id = v.ensureId(node)
      expect(node.id).toEqual(id)
    })

    it('should not overwrite if id exited', () => {
      const node = (document.createElement('g') as any) as SVGElement
      expect(node.id).toBe('')

      const id = v.ensureId(node)
      expect(node.id).toEqual(id)
      expect(v.ensureId(node)).toEqual(id)
    })
  })

  describe('id', () => {
    it('should auto generate id', () => {
      const vel = v('rect')
      expect(vel.id).not.toBeNull()
      expect(vel.id).toEqual(vel.node.id)
    })

    it('should set id for node', () => {
      const vel = v('rect')
      vel.id = 'xxx'
      expect(vel.id).toEqual('xxx')
      expect(vel.id).toEqual(vel.node.id)
    })
  })

  describe('#isSVGGraphicsElement', () => {
    it('should return true when the given element is a SVGGraphicsElement', () => {
      expect(v.isSVGGraphicsElement(v('circle'))).toBe(true)
      expect(v.isSVGGraphicsElement(v('rect').node)).toBe(true)
      expect(v.isSVGGraphicsElement(v('path'))).toBe(true)
    })

    it('should return false when the given element is not a SVGGraphicsElement', () => {
      expect(v.isSVGGraphicsElement()).toBe(false)
      expect(v.isSVGGraphicsElement(v('linearGradient'))).toBe(false)
    })
  })
})
