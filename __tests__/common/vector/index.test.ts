import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Dom } from '../../../src/common/dom'
import { Vector } from '../../../src/common/vector'

describe('Vector', () => {
  let rect: Vector

  beforeEach(() => {
    rect = Vector.create('rect', { id: 'my-rect', width: 100, height: 50 })
    rect.size = (w, h) => {
      rect.attr('width', w)
      rect.attr('height', h)
      return rect
    }
    rect.move = (x, y) => {
      rect.attr('x', x)
      rect.attr('y', y)
      return rect
    }
    rect.css = (styles) => {
      Object.entries(styles).forEach(([key, value]) => {
        rect.node.style[key as any] = value
      })
      return rect
    }
    vi.spyOn(Dom, 'addClass')
    vi.spyOn(Dom, 'hasClass')
    vi.spyOn(Dom, 'removeClass')
    vi.spyOn(Dom, 'toggleClass')
    vi.spyOn(Dom, 'find')
    vi.spyOn(Dom, 'findOne')
    vi.spyOn(Dom, 'append')
    vi.spyOn(Dom, 'attr')
    vi.spyOn(Dom, 'setAttribute')
    vi.spyOn(Dom, 'getAttribute')
    vi.spyOn(Dom, 'removeAttribute')
    vi.spyOn(Dom, 'transform')
    vi.spyOn(Dom, 'translate')
    vi.spyOn(Dom, 'rotate')
    vi.spyOn(Dom, 'scale')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  describe('#create', () => {
    it('should create a vector instance with tagName', () => {
      const vel = Vector.create('rect')
      expect(Vector.isVector(vel)).toBe(true)
      expect(vel.node.tagName).toBe('rect')
    })

    it('should create a vector instance with SVGElement', () => {
      const old = Vector.create('rect')
      const vel = Vector.create(old.node)
      expect(Vector.isVector(vel)).toBe(true)
      expect(vel.node.tagName).toBe('rect')
    })

    it('should create a vector instance with another vector', () => {
      const old = Vector.create('rect')
      const vel = Vector.create(old)
      expect(Vector.isVector(vel)).toBe(true)
      expect(vel.node.tagName).toBe('rect')
    })

    it('should create a vector instance with markup', () => {
      const vel = Vector.create(
        '<rect width="100%" height="100%" fill="red" />',
      )
      expect(vel.node.tagName).toBe('rect')
      expect(vel.getAttribute('width')).toEqual('100%')
      expect(vel.getAttribute('height')).toEqual('100%')
      expect(vel.getAttribute('fill')).toEqual('red')
    })

    it('should throw an error with invalid markup', () => {
      const fn = () => Vector.create('<invalid markup>')
      expect(fn).toThrow()
    })

    it('should throw an error with empty markup', () => {
      const fn = () => Vector.create('')
      expect(fn).toThrow()
    })
  })

  describe('#createVectors', () => {
    it('should return an array of vectors', () => {
      const vels = Vector.createVectors(
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
      vels.forEach((vel) => {
        expect(Vector.isVector(vel)).toBe(true)
      })
    })

    it('should fall back to create a vector', () => {
      expect(Vector.createVectors('rect').length).toEqual(1)
    })
  })
  describe('#isVector', () => {
    it('should create vector from string', () => {
      expect(rect).toBeInstanceOf(Vector)
      expect(rect.type).toBe('rect')
      expect(rect.id).toBe('my-rect')
    })

    it('should set and get id', () => {
      rect.id = 'new-id'
      expect(rect.id).toBe('new-id')
    })

    it('should transform (getter and setter)', () => {
      const transformListMock = {
        appendItem: vi.fn(),
        consolidate: vi.fn(() => ({ matrix: {} })),
      }
      rect.node.transform = { baseVal: transformListMock } as any
      rect.transform({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 })
      expect(transformListMock.appendItem).toHaveBeenCalled()
      rect.node.transform.baseVal.consolidate = vi.fn(() => ({
        matrix: { a: 1 },
      }))
      const matrix = new DOMMatrix()
      rect.transform(matrix)
      expect(Dom.transform).toHaveBeenCalledWith(rect.node, matrix, undefined)
      rect.transform()
      expect(Dom.transform).toHaveBeenCalledWith(rect.node)
    })

    it('should translate', () => {
      rect.translate(10, 20)
      expect(Dom.translate).toHaveBeenCalledWith(rect.node, 10, 20, {})
    })

    it('should rotate', () => {
      rect.rotate(45)
      expect(Dom.rotate).toHaveBeenCalledWith(
        rect.node,
        45,
        undefined,
        undefined,
        {},
      )
    })

    it('should scale', () => {
      rect.scale(2, 3)
      expect(Dom.scale).toHaveBeenCalledWith(rect.node, 2, 3)
    })

    it('should set/get/remove attributes', () => {
      rect.setAttribute('fill', 'red')
      expect(Dom.setAttribute).toHaveBeenCalledWith(rect.node, 'fill', 'red')
      rect.getAttribute('fill')
      expect(Dom.getAttribute).toHaveBeenCalledWith(rect.node, 'fill')
      rect.removeAttribute('fill')
      expect(Dom.removeAttribute).toHaveBeenCalledWith(rect.node, 'fill')
    })

    it('should handle attr overloads', () => {
      rect.attr({ fill: 'blue' })
      expect(Dom.attr).toHaveBeenCalledWith(rect.node, { fill: 'blue' })
      rect.attr('width')
      expect(Dom.attr).toHaveBeenCalledWith(rect.node, 'width')
      rect.attr('width', 200)
      expect(Dom.attr).toHaveBeenCalledWith(rect.node, 'width', 200)
      rect.attr()
      expect(Dom.attr).toHaveBeenCalledWith(rect.node)
    })

    it('should append and query children', () => {
      const circle = Vector.create('circle')
      rect.append(circle)
      expect(Dom.append).toHaveBeenCalled()
      expect(rect.first()).not.toBeNull()
    })

    it('should support clone', () => {
      const clone = rect.clone()
      expect(clone).toBeInstanceOf(Vector)
      expect(clone.type).toBe('rect')
    })

    it('should support find/findOne', () => {
      rect.find('circle')
      expect(Dom.find).toHaveBeenCalled()
      rect.findOne('circle')
      expect(Dom.findOne).toHaveBeenCalled()
    })

    it('should support class operations', () => {
      rect.addClass('foo')
      expect(Dom.addClass).toHaveBeenCalledWith(rect.node, 'foo')
      rect.hasClass('foo')
      expect(Dom.hasClass).toHaveBeenCalledWith(rect.node, 'foo')
      rect.removeClass('foo')
      expect(Dom.removeClass).toHaveBeenCalledWith(rect.node, 'foo')
      rect.toggleClass('foo')
      expect(Dom.toggleClass).toHaveBeenCalledWith(rect.node, 'foo', undefined)
    })

    it('should handle Vector.isVector', () => {
      expect(Vector.isVector(rect)).toBe(true)
      expect(Vector.isVector(null)).toBe(false)
    })

    it('should handle Vector.createVectors with markup', () => {
      const vels = Vector.createVectors('<rect id="c1"/>')
      expect(vels[0]).toBeInstanceOf(Vector)
    })

    it('should convert nodes', () => {
      const node = rect.node
      expect(Vector.toNode(rect)).toBe(node)
      expect(Vector.toNodes([rect])[0]).toBe(node)
    })

    it('should set and get attributes', () => {
      rect.attr('width', 100)
      expect(rect.attr('width')).toBe('100')
      rect.attr({ height: 200, fill: 'red' })
      expect(rect.attr('height')).toBe('200')
      expect(rect.attr('fill')).toBe('red')
    })

    it('should set css styles', () => {
      rect.css({ fill: 'blue', stroke: 'black' })
      expect(rect.node.style.fill).toBe('blue')
      expect(rect.node.style.stroke).toBe('black')
    })

    it('should support class operations', () => {
      const addSpy = vi.spyOn(Dom, 'addClass')
      const hasSpy = vi.spyOn(Dom, 'hasClass').mockReturnValue(true)
      const removeSpy = vi.spyOn(Dom, 'removeClass')

      rect.addClass('foo')
      expect(addSpy).toHaveBeenCalledWith(rect.node, 'foo')

      rect.hasClass('foo')
      expect(hasSpy).toHaveBeenCalledWith(rect.node, 'foo')

      rect.removeClass('foo')
      expect(removeSpy).toHaveBeenCalledWith(rect.node, 'foo')
    })

    it('should clone element', () => {
      const cloned = rect.clone()
      expect(cloned).not.toBe(rect)
      expect(cloned.node.tagName).toBe('rect')
    })

    it('should append and remove child', () => {
      const circle = Vector.create('circle')
      rect.append(circle)
      expect(rect.node.firstChild).toBe(circle.node)

      circle.remove()
      expect(rect.node.firstChild).toBeNull()
    })

    it('should support bbox and size/move', () => {
      rect.size(50, 60)
      expect(rect.attr('width')).toBe('50')
      expect(rect.attr('height')).toBe('60')

      rect.move(10, 20)
      expect(rect.attr('x')).toBe('10')
      expect(rect.attr('y')).toBe('20')
    })
  })
})
