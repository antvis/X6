import { beforeEach, describe, expect, it } from 'vitest'
import { Vector } from '../../../src/common/vector'

describe('Vector', () => {
  let svgElement: SVGElement
  let vector: Vector

  beforeEach(() => {
    document.body.innerHTML = '<div id="container"></div>'
    svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    vector = new Vector(svgElement)
  })

  describe('constructor', () => {
    it('should create vector from SVG element', () => {
      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      const v = new Vector(rect)
      expect(v.node).toBe(rect)
    })

    it('should create vector from another vector', () => {
      const v1 = new Vector('rect')
      const v2 = new Vector(v1)
      expect(v2.node).toBe(v1.node)
    })

    it('should create vector from tag name', () => {
      const v = new Vector('rect')
      expect(v.node.tagName).toBe('rect')
    })

    it('should create SVG document when tag is "svg"', () => {
      const v = new Vector('svg')
      expect(v.node.tagName).toBe('svg')
    })

    it('should create vector from markup string', () => {
      const v = new Vector('<rect width="100" height="50"/>')
      expect(v.node.tagName).toBe('rect')
      expect(v.node.getAttribute('width')).toBe('100')
      expect(v.node.getAttribute('height')).toBe('50')
    })

    it('should throw error for invalid element', () => {
      expect(() => new Vector(null as any)).toThrow(
        'Invalid element to create vector',
      )
      expect(() => new Vector(undefined as any)).toThrow(
        'Invalid element to create vector',
      )
      expect(() => new Vector('' as any)).toThrow(
        'Invalid element to create vector',
      )
    })

    it('should set attributes when provided', () => {
      const v = new Vector('rect', { width: 100, height: 50 })
      expect(v.node.getAttribute('width')).toBe('100')
      expect(v.node.getAttribute('height')).toBe('50')
    })

    it('should append children when provided', () => {
      const child = new Vector('circle')
      const v = new Vector('g', null, child)
      expect(v.node.children.length).toBe(1)
      expect(v.node.children[0]).toBe(child.node)
    })

    it('should append multiple children', () => {
      const child1 = new Vector('circle')
      const child2 = new Vector('rect')
      const v = new Vector('g', null, [child1, child2])
      expect(v.node.children.length).toBe(2)
    })
  })

  describe('properties', () => {
    it('should have correct Symbol.toStringTag', () => {
      expect(vector[Symbol.toStringTag]).toBe('X6.Vector')
    })

    it('should return correct type', () => {
      expect(vector.type).toBe('rect')
    })

    it('should get and set id', () => {
      vector.id = 'test-id'
      expect(vector.id).toBe('test-id')
      expect(vector.node.id).toBe('test-id')
    })
  })

  describe('static methods', () => {
    describe('isVector', () => {
      it('should return false for null/undefined', () => {
        expect(Vector.isVector(null)).toBe(false)
        expect(Vector.isVector(undefined)).toBe(false)
      })

      it('should return true for Vector instance', () => {
        expect(Vector.isVector(vector)).toBe(true)
      })

      it('should return true for vector-like object', () => {
        const vectorLike = {
          [Symbol.toStringTag]: 'X6.Vector',
          node: svgElement,
          sample: () => [],
          toPath: () => new Vector('path'),
        }
        expect(Vector.isVector(vectorLike)).toBe(true)
      })

      it('should return false for invalid objects', () => {
        expect(Vector.isVector({})).toBe(false)
        expect(Vector.isVector({ node: svgElement })).toBe(false)
        expect(Vector.isVector('string')).toBe(false)
      })
    })

    describe('create', () => {
      it('should create vector with element', () => {
        const v = Vector.create('rect')
        expect(v).toBeInstanceOf(Vector)
        expect(v.type).toBe('rect')
      })

      it('should create vector with attributes and children', () => {
        const child = new Vector('circle')
        const v = Vector.create('g', { id: 'test' }, child)
        expect(v.id).toBe('test')
        expect(v.node.children.length).toBe(1)
      })
    })

    describe('createVectors', () => {
      it('should create vectors from markup', () => {
        const markup = '<g><rect/><circle/></g>'
        const vectors = Vector.createVectors(markup)
        expect(vectors).toHaveLength(1)
        expect(vectors[0].type).toBe('g')
      })

      it('should create single vector from tag name', () => {
        const vectors = Vector.createVectors('rect')
        expect(vectors).toHaveLength(1)
        expect(vectors[0].type).toBe('rect')
      })
    })

    describe('toNode', () => {
      it('should return node from Vector', () => {
        const node = Vector.toNode(vector)
        expect(node).toBe(vector.node)
      })

      it('should return element itself', () => {
        const node = Vector.toNode(svgElement)
        expect(node).toBe(svgElement)
      })
    })

    describe('toNodes', () => {
      it('should convert single element to array', () => {
        const nodes = Vector.toNodes(vector)
        expect(nodes).toEqual([vector.node])
      })

      it('should convert array of elements', () => {
        const vector2 = new Vector('circle')
        const nodes = Vector.toNodes([vector, vector2])
        expect(nodes).toEqual([vector.node, vector2.node])
      })
    })
  })

  describe('transform methods', () => {
    it('should get current transform', () => {
      const matrix = vector.transform()
      expect(matrix).toBeInstanceOf(DOMMatrix)
    })

    it('should get current translation', () => {
      const translation = vector.translate()
      expect(translation).toHaveProperty('tx')
      expect(translation).toHaveProperty('ty')
    })

    it('should set translation', () => {
      const result = vector.translate(10, 20)
      expect(result).toBe(vector)
    })

    it('should set translation with default ty', () => {
      const result = vector.translate(10)
      expect(result).toBe(vector)
    })

    it('should get current rotation', () => {
      const rotation = vector.rotate()
      expect(rotation).toHaveProperty('angle')
    })

    it('should set rotation', () => {
      const result = vector.rotate(45, 50, 50)
      expect(result).toBe(vector)
    })

    it('should get current scale', () => {
      const scale = vector.scale()
      expect(scale).toHaveProperty('sx')
      expect(scale).toHaveProperty('sy')
    })

    it('should set scale', () => {
      const result = vector.scale(2, 3)
      expect(result).toBe(vector)
    })
  })

  describe('attribute methods', () => {
    it('should remove attribute', () => {
      vector.node.setAttribute('test', 'value')
      const result = vector.removeAttribute('test')
      expect(result).toBe(vector)
      expect(vector.node.getAttribute('test')).toBeNull()
    })

    it('should get attribute', () => {
      vector.node.setAttribute('test', 'value')
      expect(vector.getAttribute('test')).toBe('value')
    })

    it('should set attribute', () => {
      const result = vector.setAttribute('test', 'value')
      expect(result).toBe(vector)
      expect(vector.node.getAttribute('test')).toBe('value')
    })

    it('should set multiple attributes', () => {
      const result = vector.setAttributes({ width: 100, height: 50 })
      expect(result).toBe(vector)
      expect(vector.node.getAttribute('width')).toBe('100')
      expect(vector.node.getAttribute('height')).toBe('50')
    })

    describe('attr method', () => {
      it('should get all attributes', () => {
        vector.node.setAttribute('width', '100')
        const attrs = vector.attr()
        expect(attrs).toHaveProperty('width', '100')
      })

      it('should get single attribute', () => {
        vector.node.setAttribute('width', '100')
        expect(vector.attr('width')).toBe('100')
      })

      it('should set single attribute', () => {
        const result = vector.attr('width', 100)
        expect(result).toBe(vector)
        expect(vector.node.getAttribute('width')).toBe('100')
      })

      it('should set multiple attributes via object', () => {
        const result = vector.attr({ width: 100, height: 50 })
        expect(result).toBe(vector)
        expect(vector.node.getAttribute('width')).toBe('100')
        expect(vector.node.getAttribute('height')).toBe('50')
      })
    })
  })

  describe('DOM methods', () => {
    it('should get svg root', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.appendChild(vector.node)
      const root = vector.svg()
      expect(root.node).toBe(svg)
    })

    it('should return self if already svg', () => {
      const svgVector = new Vector('svg')
      expect(svgVector.svg()).toBe(svgVector)
    })

    it('should get or create defs', () => {
      const svg = new Vector('svg')
      const defs = svg.defs()
      expect(defs.type).toBe('defs')
    })

    it('should get existing defs', () => {
      const svg = new Vector('svg')
      const existingDefs = new Vector('defs')
      svg.append(existingDefs)
      const defs = svg.defs()
      expect(defs.node).toBe(existingDefs.node)
    })

    it('should set text content', () => {
      const result = vector.text('Hello World')
      expect(result).toBe(vector)
    })

    it('should get tag name', () => {
      expect(vector.tagName()).toBe('rect')
    })

    it('should clone vector', () => {
      const clone = vector.clone()
      expect(clone).not.toBe(vector)
      expect(clone.type).toBe(vector.type)
    })

    it('should remove from DOM', () => {
      const parent = new Vector('g')
      parent.append(vector)
      const result = vector.remove()
      expect(result).toBe(vector)
    })

    it('should empty contents', () => {
      const child = new Vector('circle')
      vector.append(child)
      const result = vector.empty()
      expect(result).toBe(vector)
      expect(vector.node.children.length).toBe(0)
    })
  })

  describe('DOM manipulation', () => {
    it('should append element', () => {
      const child = new Vector('circle')
      const result = vector.append(child)
      expect(result).toBe(vector)
      expect(vector.node.children.length).toBe(1)
    })

    it('should append to parent', () => {
      const parent = new Vector('g')
      const result = vector.appendTo(parent)
      expect(result).toBe(vector)
      expect(parent.node.children.length).toBe(1)
    })

    it('should prepend element', () => {
      const child1 = new Vector('circle')
      const child2 = new Vector('rect')
      vector.append(child1)
      const result = vector.prepend(child2)
      expect(result).toBe(vector)
      expect(vector.node.firstChild).toBe(child2.node)
    })

    it('should insert before', () => {
      const parent = new Vector('g')
      const sibling = new Vector('circle')
      parent.append(vector)
      parent.append(sibling)
      const newElement = new Vector('rect')
      const result = sibling.before(newElement)
      expect(result).toBe(sibling)
      expect(parent.node.children[1]).toBe(newElement.node)
    })

    it('should replace element', () => {
      const parent = new Vector('g')
      parent.append(vector)
      const replacement = new Vector('circle')
      const result = vector.replace(replacement)
      expect(result.node).toBe(replacement.node)
      expect(parent.node.children[0]).toBe(replacement.node)
    })
  })

  describe('navigation methods', () => {
    it('should get first child', () => {
      const child = new Vector('circle')
      vector.append(child)
      const first = vector.first()
      expect(first?.node).toBe(child.node)
    })

    it('should return null for first child when no children', () => {
      const first = vector.first()
      expect(first).toBeNull()
    })

    it('should get last child', () => {
      const child1 = new Vector('circle')
      const child2 = new Vector('rect')
      vector.append(child1)
      vector.append(child2)
      const last = vector.last()
      expect(last?.node).toBe(child2.node)
    })

    it('should return null for last child when no children', () => {
      const last = vector.last()
      expect(last).toBeNull()
    })

    it('should get child by index', () => {
      const child = new Vector('circle')
      vector.append(child)
      const found = vector.get(0)
      expect(found?.node).toBe(child.node)
    })

    it('should return null for invalid index', () => {
      const found = vector.get(10)
      expect(found).toBeNull()
    })

    it('should get index of child', () => {
      const parent = new Vector('g')
      const child1 = new Vector('circle')
      const child2 = new Vector('rect')
      parent.append(child1)
      parent.append(child2)
      expect(parent.indexOf(child2)).toBe(1)
    })

    it('should find elements by selector', () => {
      const g = new Vector('g')
      const rect1 = new Vector('rect', { class: 'test' })
      const rect2 = new Vector('rect', { class: 'test' })
      g.append(rect1)
      g.append(rect2)
      const found = g.find('.test')
      expect(found).toHaveLength(2)
    })

    it('should find one element by selector', () => {
      const g = new Vector('g')
      const rect = new Vector('rect', { class: 'test' })
      g.append(rect)
      const found = g.findOne('.test')
      expect(found?.node).toBe(rect.node)
    })

    it('should return null when findOne finds nothing', () => {
      const found = vector.findOne('.nonexistent')
      expect(found).toBeNull()
    })

    it('should find parent by class', () => {
      const parent = new Vector('g', { class: 'parent' })
      parent.append(vector)
      const found = vector.findParentByClass('parent')
      expect(found?.node).toBe(parent.node)
    })

    it('should return null when parent not found', () => {
      const found = vector.findParentByClass('nonexistent')
      expect(found).toBeNull()
    })
  })

  describe('CSS class methods', () => {
    it('should check if has class', () => {
      vector.node.setAttribute('class', 'test-class')
      expect(vector.hasClass('test-class')).toBe(true)
      expect(vector.hasClass('other-class')).toBe(false)
    })

    it('should add class', () => {
      const result = vector.addClass('test-class')
      expect(result).toBe(vector)
      expect(vector.hasClass('test-class')).toBe(true)
    })

    it('should remove class', () => {
      vector.addClass('test-class')
      const result = vector.removeClass('test-class')
      expect(result).toBe(vector)
      expect(vector.hasClass('test-class')).toBe(false)
    })

    it('should remove all classes', () => {
      vector.addClass('class1')
      vector.addClass('class2')
      const result = vector.removeClass()
      expect(result).toBe(vector)
    })

    it('should toggle class', () => {
      const result = vector.toggleClass('test-class')
      expect(result).toBe(vector)
      expect(vector.hasClass('test-class')).toBe(true)
      vector.toggleClass('test-class')
      expect(vector.hasClass('test-class')).toBe(false)
    })

    it('should toggle class with state', () => {
      vector.toggleClass('test-class', true)
      expect(vector.hasClass('test-class')).toBe(true)
      vector.toggleClass('test-class', false)
      expect(vector.hasClass('test-class')).toBe(false)
    })
  })

  describe('utility methods', () => {
    it('should match selector', () => {
      vector.node.setAttribute('class', 'test-class')
      expect(vector.matches('.test-class')).toBe(true)
      expect(vector.matches('.other-class')).toBe(false)
    })

    it('should check contains', () => {
      const child = new Vector('circle')
      vector.append(child)
      expect(vector.contains(child)).toBe(true)
      expect(vector.contains(child.node)).toBe(true)
    })

    it('should wrap element', () => {
      const parent = new Vector('g')
      parent.append(vector)
      const wrapper = new Vector('g', { class: 'wrapper' })
      const result = vector.wrap(wrapper)
      expect(result.node).toBe(wrapper.node)
      expect(wrapper.node.children[0]).toBe(vector.node)
    })

    it('should get parent', () => {
      const parent = new Vector('g')
      parent.append(vector)
      const foundParent = vector.parent()
      expect(foundParent?.node).toBe(parent.node)
    })

    it('should return null for no parent', () => {
      const parent = vector.parent()
      expect(parent).toBeNull()
    })

    it('should get parent by type', () => {
      const grandparent = new Vector('svg')
      const parent = new Vector('g')
      grandparent.append(parent)
      parent.append(vector)
      const foundParent = vector.parent('svg')
      expect(foundParent?.node).toBe(grandparent.node)
    })

    it('should get children', () => {
      const child1 = new Vector('circle')
      const child2 = new Vector('rect')
      vector.append(child1)
      vector.append(child2)
      const children = vector.children()
      expect(children).toHaveLength(2)
      expect(children[0].node).toBe(child1.node)
      expect(children[1].node).toBe(child2.node)
    })

    it('should iterate each child', () => {
      const child1 = new Vector('circle')
      const child2 = new Vector('rect')
      vector.append(child1)
      vector.append(child2)
      const visited: Vector[] = []
      const result = vector.eachChild(function (child) {
        visited.push(child)
        expect(this).toBe(child)
      })
      expect(result).toBe(vector)
      expect(visited).toHaveLength(2)
    })

    it('should iterate each child deeply', () => {
      const child = new Vector('g')
      const grandchild = new Vector('circle')
      child.append(grandchild)
      vector.append(child)
      const visited: Vector[] = []
      vector.eachChild((child) => {
        visited.push(child)
      }, true)
      expect(visited).toHaveLength(2)
    })

    it('should get index', () => {
      const parent = new Vector('g')
      const child1 = new Vector('circle')
      const child2 = new Vector('rect')
      parent.append(child1)
      parent.append(child2)
      expect(child2.index()).toBe(1)
    })
  })

  describe('path methods', () => {
    it('should convert to path', () => {
      const path = vector.toPath()
      expect(path).toBeInstanceOf(Vector)
    })

    it('should get path data', () => {
      const pathData = vector.toPathData()
      expect(typeof pathData).toBe('string')
    })
  })
})
