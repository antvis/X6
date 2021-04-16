import sinon from 'sinon'
import { createSVGNode, namespaces } from '../util'
import { Circle, G, Rect, Svg, TSpan } from '../vector'
import { Dom } from './dom'
import { Fragment } from '../vector/fragment/fragment'

describe('Dom', () => {
  describe('first()', () => {
    it('should return the first child', () => {
      const g = new G()
      const rect = g.rect()
      g.circle(100)
      expect(g.first()).toBe(rect)
    })

    it('should return `null` if no first child exists', () => {
      expect(new G().first()).toBe(null)
    })
  })

  describe('last()', () => {
    it('should return the last child of the element', () => {
      const g = new G()
      g.rect()
      const rect = g.rect()
      expect(g.last()).toBe(rect)
    })

    it('should return `null` if no last child exists', () => {
      expect(new G().last()).toBe(null)
    })
  })

  describe('get()', () => {
    it('should return the child at the given position', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle(100)
      expect(g.get(0)).toBe(rect)
      expect(g.get(1)).toBe(circle)
      expect(g.get(2)).toBe(null)
    })
  })

  describe('findOne()', () => {
    it('should return the first element matching the given selector', () => {
      const g = new G()
      const rect1 = g.rect()
      const rect2 = g.rect()
      expect(g.findOne('rect') === rect1).toBeTrue()
      expect(g.findOne('rect') === rect2).toBeFalse()
    })

    it('should return `null` when the given selector matching nothing', () => {
      const g = new G()
      expect(g.findOne('rect')).toBeNull()
    })
  })

  describe('find()', () => {
    it('should return an empty if find nothing', () => {
      const g = new G()
      expect(g.find('rect')).toBeInstanceOf(Array)
      expect(g.find('rect').length).toEqual(0)
    })

    it('should return an array of elements matching the given selector', () => {
      const g = new G()
      const rect1 = g.rect()
      const rect2 = g.rect()
      const circle = g.circle(100)

      const rects = g.find('rect')
      const circles = g.find('circle')

      expect(rects.length).toEqual(2)
      expect(rects.includes(rect1)).toBeTrue()
      expect(rects.includes(rect2)).toBeTrue()

      expect(circles.length).toEqual(1)
      expect(circles.includes(circle)).toBeTrue()
    })
  })

  describe('matches()', () => {
    it('should return `true` if the element matching the given selector', () => {
      const g = new G().addClass('foo')
      expect(g.matches('.foo')).toBeTrue()
    })

    it('should return `false` if the element not matching the given selector', () => {
      const g = new G().addClass('foo')
      expect(g.matches('.bar')).toBeFalse()
    })

    it('should return `false` when the node is invalid', () => {
      const node = {}
      const dom = new Dom()
      const mock = dom as any
      mock.node = node
      expect(dom.matches('foo')).toBeFalse()
    })
  })

  describe('children()', () => {
    it('should return an array of children elements', () => {
      const g = new G()

      expect(g.children()).toBeInstanceOf(Array)
      expect(g.children().length).toEqual(0)

      const rect1 = g.rect()
      const rect2 = g.rect()
      const circle = g.circle(100)

      const children = g.children()
      expect(children.length).toEqual(3)
      expect(children.includes(rect1)).toBeTrue()
      expect(children.includes(rect2)).toBeTrue()
      expect(children.includes(circle)).toBeTrue()
    })
  })

  describe('clear()', () => {
    it('should removes all elements from the element', () => {
      const g = new G()
      g.rect()
      g.rect()
      g.circle(100)
      expect(g.children().length).toEqual(3)
      g.clear()
      expect(g.children().length).toEqual(0)
    })
  })

  describe('clone()', () => {
    it('should clone the current element and returns it', () => {
      const rect = new Rect()
      const clone = rect.clone()
      expect(rect).not.toBe(clone)
      expect(clone.type).toBe(rect.type)
    })

    it('should clone the children by default', () => {
      const group = new G()
      const rect = group.rect()
      const clone = group.clone()
      expect(clone.get(0)).not.toBe(rect)
      expect(clone.get(0)?.type).toEqual(rect.type)
    })

    it('should not clone the children when passing false', () => {
      const group = new G()
      group.rect()
      const clone = group.clone(false)
      expect(clone.children()).toEqual([])
    })

    it('should assign a new id to the element and to child elements', () => {
      const group = new G().id('group')
      const rect = group.rect().id('rect')
      const clone = group.clone()
      expect(clone.get(0)!.id()).not.toBe(rect.id())
      expect(clone.id()).not.toBe(group.id())
    })

    it('should return an instance of the same class the method was called on', () => {
      const rect = new Dom('rect')
      expect(rect.constructor).toBe(Dom)
      expect(rect.clone().constructor).toBe(Dom)
    })
  })

  describe('eachChild()', () => {
    it('should iterate over all the children of the element', () => {
      const group = new G()
      const group2 = group.group()
      const circle = group.circle(100)
      const spy = sinon.spy()

      group.eachChild(spy)

      expect(spy.callCount).toEqual(2)
      expect(spy.args[0]).toEqual([group2, 0, [group2, circle]])
      expect(spy.args[1]).toEqual([circle, 1, [group2, circle]])
    })

    it('should iterate over all children recursively and executes the passed function on then when deep is true', () => {
      const group = new G()
      const group2 = group.group()
      const rect = group2.rect()
      const circle = group.circle(100)
      const spy = sinon.spy()

      group.eachChild(spy, true)

      expect(spy.callCount).toEqual(3)
      expect(spy.args[0]).toEqual([group2, 0, [group2, circle]])
      expect(spy.args[1]).toEqual([rect, 0, [rect]])
      expect(spy.args[2]).toEqual([circle, 1, [group2, circle]])
    })
  })

  describe('indexOf()', () => {
    it('should return the position of the passed child', () => {
      const g = new G()
      g.rect()
      const rect = g.rect()
      expect(g.indexOf(rect)).toBe(1)
      expect(g.indexOf(rect.node)).toBe(1)
    })

    it('should return `-1` if element is no child', () => {
      const g = new G()
      const rect = new Rect()
      expect(g.indexOf(rect)).toBe(-1)
    })
  })

  describe('has()', () => {
    it('should return `true` if the element has the passed element as child', () => {
      const g = new G()
      const rect = g.rect()
      expect(g.has(rect)).toBe(true)
    })

    it("should return `false` if the element hasn't the passed element as child", () => {
      const g = new G()
      const rect = new Rect()
      expect(g.has(rect)).toBe(false)
    })
  })

  describe('index()', () => {
    it('should return the position in the parent of the element', () => {
      const g = new G()
      g.rect()
      const rect = g.rect()
      expect(rect.index()).toBe(1)
    })

    it('should return `-1` if the element do not have a parent', () => {
      expect(new G().index()).toBe(-1)
    })
  })

  describe('contains()', () => {
    it('should return `true` if the element is ancestor of the given element', () => {
      const svg = new Svg()
      const group1 = svg.group().addClass('test')
      const group2 = group1.group()
      const rect = group2.rect()

      expect(svg.contains(group1)).toBeTrue()
      expect(svg.contains(group1.node)).toBeTrue()

      expect(svg.contains(group2)).toBeTrue()
      expect(svg.contains(group2.node)).toBeTrue()

      expect(svg.contains(rect)).toBeTrue()
      expect(svg.contains(rect.node)).toBeTrue()
    })

    it('should return `false` if the element is ancestor of the given element', () => {
      expect(new Svg().contains(new G())).toBeFalse()
    })
  })

  describe('id()', () => {
    it('should return current element when called as setter', () => {
      const g = new G()
      expect(g.id('asd')).toBe(g)
    })

    it('should set the id with argument given', () => {
      expect(new G().id('foo').node.id).toBe('foo')
    })

    it('should get the id when no argument given', () => {
      const g = new G({ id: 'foo' })
      expect(g.id()).toBe('foo')
    })

    it('should generate an id on getting if none is set', () => {
      const g = new G()
      expect(g.node.id).toBe('')
      g.id()
      expect(g.node.id).not.toBe('')
    })
  })

  describe('parent()', () => {
    let svg: Svg
    let rect: Rect
    let group1: G
    let group2: G

    beforeEach(() => {
      svg = new Svg().addTo(document.body)
      group1 = svg.group().addClass('test')
      group2 = group1.group()
      rect = group2.rect()
    })

    afterEach(() => {
      svg.remove()
    })

    it('should return the svg parent with no argument given', () => {
      expect(rect.parent()).toBe(group2)
    })

    it('should return the closest parent with the correct type', () => {
      expect(rect.parent(Svg)).toBe(svg)
    })

    it('should return the closest parent matching the selector', () => {
      expect(rect.parent('.test')).toBe(group1)
    })

    it('should return `null` if the element do not have a parent', () => {
      expect(new Svg().parent()).toBe(null)
    })

    it('should return `null` if it cannot find a parent matching the argument', () => {
      expect(rect.parent('.not-there')).toBe(null)
    })

    it('should return `null` if it cannot find a parent matching the argument in a #document-fragment', () => {
      const fragment = document.createDocumentFragment()
      const svg = new Svg().addTo(fragment)
      const rect = svg.rect()
      expect(rect.parent('.not-there')).toBe(null)
    })

    it('should return Dom if parent is #document-fragment', () => {
      const fragment = document.createDocumentFragment()
      const svg = new Svg().addTo(fragment)
      expect(svg.parent()).toBeInstanceOf(Dom)
    })

    it('should return html parents, too', () => {
      expect(svg.parent()!.node).toBe(document.body)
    })
  })

  describe('parents()', () => {
    let div1: Dom
    let div2: Dom
    let svg: Svg
    let rect: Rect
    let group1: G
    let group2: G

    beforeEach(() => {
      div1 = new Dom().appendTo(document.body)
      div2 = new Dom().appendTo(div1)
      svg = new Svg().appendTo(div2)
      group1 = svg.group().addClass('test')
      group2 = group1.group()
      rect = group2.rect()
    })

    afterEach(() => {
      div2.remove()
    })

    it('should return all the ancestors', () => {
      expect(div2.parents().length).toEqual(3)
    })

    it('should return all the ancestors until SVGSVGElement', () => {
      expect(rect.parents()).toEqual([group2, group1])
    })

    it('should return all the ancestors until the specified type', () => {
      expect(rect.parents(Svg)).toEqual([group2, group1])
    })

    it('should return all the ancestors until the specified selector', () => {
      expect(rect.parents('.test')).toEqual([group2])
    })

    it('should return all the ancestors until the specified element', () => {
      expect(rect.parents(group1)).toEqual([group2])
    })

    it('should return all the ancestors until the specified node', () => {
      expect(rect.parents(group1.node)).toEqual([group2])
    })

    it('should return all the ancestors until fragment', () => {
      const fragment = document.createDocumentFragment()
      const div1 = new Dom().appendTo(fragment)
      const div2 = new Dom().appendTo(div1)
      expect(div2.parents()).toEqual([div1])
    })
  })

  describe('add()', () => {
    it('should add an element as child to the end with no second argument given', () => {
      const g = new G()
      g.add(new Rect())
      const rect = new Rect()
      g.add(rect)
      expect(g.children().length).toBe(2)
      expect(g.get(1)).toBe(rect)
    })

    it('should add an element at the specified position with second argument given', () => {
      const g = new G()
      g.add(new Rect())
      g.add(new Rect())
      const rect = new Rect()
      g.add(rect, 1)
      expect(g.children().length).toBe(3)
      expect(g.get(1)).toBe(rect)
    })

    it('should do nothing if element is already the element at that position', () => {
      const g = new G()
      g.rect()
      const rect = g.rect()
      g.add(rect, 1)
      expect(g.get(1)).toBe(rect)
    })

    it('should handle svg string', () => {
      const g = new G()
      g.add('<rect />')
      expect(g.children().length).toBe(1)
      expect(g.get(0)).toBeInstanceOf(Rect)
    })

    it('should handle tagName', () => {
      const g = new G()
      g.add('rect')
      expect(g.children().length).toBe(1)
      expect(g.get(0)).toBeInstanceOf(Rect)
    })

    it('should add a node', () => {
      const g = new G()
      const node = createSVGNode('rect')
      g.add(node)
      expect(g.children().length).toBe(1)
      expect(g.get(0)).toBeInstanceOf(Rect)
    })

    it('should add a SVGSVGElement', () => {
      const g = new G()
      const node = createSVGNode('svg')
      g.add(node)
      expect(g.children().length).toBe(1)
      expect(g.get(0)).toBeInstanceOf(Svg)
    })
  })

  describe('append()', () => {
    it('should append the given element as a child', () => {
      const g = new G()
      const rect = new Rect()
      g.rect()
      g.append(rect)
      expect(rect.index()).toEqual(1)
    })
  })

  describe('prepend()', () => {
    it('should prepend the given element as a child', () => {
      const g = new G()
      const rect = new Rect()
      g.rect()
      g.prepend(rect)
      expect(rect.index()).toEqual(0)
    })
  })

  describe('addTo()', () => {
    it('should return the current element', () => {
      const g = new G()
      const rect = new Rect()
      expect(rect.addTo(g)).toBe(rect)
    })

    it('should put an element innto another element', () => {
      const g = new G()
      const rect = new Rect()
      const spy = spyOn(g, 'put')
      rect.addTo(g, 0)
      expect(spy).toHaveBeenCalledWith(rect, 0)
    })

    it('should work with svg strings', () => {
      const rect = new Rect()
      rect.addTo('<g />')
      expect(rect.parent()).toBeInstanceOf(G)
    })
  })

  describe('appendTo()', () => {})

  describe('put()', () => {
    it('should call `add()` but returns the added element instead', () => {
      const g = new G()
      const rect = new Rect()
      const spy = spyOn(g, 'add').and.callThrough()
      expect(g.put(rect, 0)).toBe(rect)
      expect(spy).toHaveBeenCalledWith(rect, 0)
    })

    it('should create element from svg string', () => {
      const g = new G()
      const rect = '<rect />'
      const spy = sinon.spy(g, 'add')
      const ret = g.put(rect, 0)
      expect(ret).toBeInstanceOf(Rect)
      expect(spy.callCount).toEqual(1)
    })
  })

  describe('putIn()', () => {
    it('should call add on the given parent', () => {
      const g = new G()
      const rect = new Rect()
      const spy = sinon.spy(g, 'add')
      rect.putIn(g, 0)
      expect(spy.callCount).toEqual(1)
    })

    it('should return the passed element', () => {
      const g = new G()
      const rect = new Rect()
      expect(rect.putIn(g, 0)).toBe(g)
    })
  })

  describe('replace()', () => {
    it('should return the new element', () => {
      const g = new G()
      const rect = g.rect()
      const circle = new Circle()
      expect(rect.replace(circle)).toBe(circle)
    })

    it('should replace the child at the correct position', () => {
      const g = new G()
      const rect1 = g.rect()
      const rect2 = g.rect()
      const rect3 = g.rect()
      const circle = new Circle()
      rect2.replace(circle)
      expect(g.children()).toEqual([rect1, circle, rect3])
    })

    it('should also work without a parent', () => {
      const rect = new Rect()
      const circle = new Circle()
      expect(rect.replace(circle)).toBe(circle)
    })
  })

  describe('element()', () => {
    it('should creates an element of given tagName and appends it to the current element', () => {
      const g = new G()
      const rect = g.element('rect')
      expect(rect.type).toBe('rect')
    })

    it('should set the specified attributes passed as second argument', () => {
      const g = new G()
      const rect = g.element('rect', { id: 'foo' })
      expect(rect.id()).toBe('foo')
    })
  })

  describe('remove()', () => {
    it('should return the removed element', () => {
      const g = new G()
      const rect = g.rect()
      expect(rect.remove()).toBe(rect)
    })

    it('should remove the element from the parent', () => {
      const g = new G()
      const rect = g.rect()
      expect(g.children()).toEqual([rect])
      rect.remove()
      expect(g.children()).toEqual([])
    })

    it('should do nothing when element is not attached to the dom', () => {
      const rect = new Rect()
      expect(rect.remove()).toBe(rect)
    })

    it('should also works when direct child of document-fragment', () => {
      const fragment = new Fragment()
      const rect = new Rect().appendTo(fragment)
      expect(fragment.children()).toEqual([rect])
      expect(rect.remove()).toBe(rect)
      expect(fragment.children()).toEqual([])
    })
  })

  describe('removeChild()', () => {
    it('should return the element itself', () => {
      const g = new G()
      const rect = g.rect()
      expect(g.removeChild(rect)).toBe(g)
    })

    it('should remove the given child element', () => {
      const g = new G()
      const rect = g.rect()
      expect(g.removeChild(rect).children()).toEqual([])
    })

    it('should remove the given child node', () => {
      const g = new G()
      const rect = g.rect()
      expect(g.removeChild(rect.node).children()).toEqual([])
    })

    it('should throw error if the given element is not a child', () => {
      const g = new G()
      const rect = new Rect()
      expect(() => g.removeChild(rect)).toThrowError()
    })
  })

  describe('before()', () => {
    it('should add element before me', () => {
      const g = new G()
      g.rect()
      const circle = g.circle()
      g.ellipse()
      const rect = new Rect()
      circle.before(rect)
      expect(rect.parent()).toBe(g)
      expect(rect.index()).toEqual(1)
    })
  })

  describe('after()', () => {
    it('should add element after me', () => {
      const g = new G()
      g.rect()
      const circle = g.circle()
      g.ellipse()
      const rect = new Rect()
      circle.after(rect)
      expect(rect.parent()).toBe(g)
      expect(rect.index()).toEqual(2)
    })
  })

  describe('insertBefore()', () => {
    it('should insert element before me', () => {
      const g = new G()
      g.rect()
      const circle = g.circle()
      g.ellipse()
      const rect = new Rect()
      rect.insertBefore(circle)
      expect(rect.parent()).toBe(g)
      expect(rect.index()).toEqual(1)
    })
  })

  describe('insertAfter()', () => {
    it('should add element after me', () => {
      const g = new G()
      g.rect()
      const circle = g.circle()
      g.ellipse()
      const rect = new Rect()
      rect.insertAfter(circle)
      expect(rect.parent()).toBe(g)
      expect(rect.index()).toEqual(2)
    })
  })

  describe('siblings()', () => {
    it('should return an empty array when element has no parent', () => {
      expect(new G().siblings()).toEqual([])
    })

    it('should return an empty array when element has no siblings', () => {
      const rect = new G().rect()
      expect(rect.siblings()).toEqual([])
    })

    it('should return all siblings', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle()
      const ellipse = g.ellipse()

      expect(circle.siblings()).toEqual([rect, ellipse])
      expect(circle.siblings(false)).toEqual([rect, ellipse])
    })

    it('should return all siblings include me', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle()
      const ellipse = g.ellipse()

      expect(circle.siblings(true)).toEqual([rect, circle, ellipse])
    })

    it('should return all siblings matching the given selector', () => {
      const g = new G()
      g.rect()
      const circle = g.circle().addClass('foo')
      const ellipse = g.ellipse().addClass('foo')

      expect(circle.siblings('.foo')).toEqual([ellipse])
    })

    it('should return all siblings matching the given selector include me', () => {
      const g = new G()
      g.rect()
      const circle = g.circle().addClass('foo')
      const ellipse = g.ellipse().addClass('foo')

      expect(circle.siblings('.foo', true)).toEqual([circle, ellipse])
    })
  })

  describe('next()', () => {
    it('should return the first next sibling', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle()
      const ellipse = g.ellipse()

      expect(g.next()).toBe(null)
      expect(rect.next()).toBe(circle)
      expect(circle.next()).toBe(ellipse)
      expect(ellipse.next()).toBe(null)
    })

    it('should return the first next sibling matching the selector', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle()
      const ellipse = g.ellipse().addClass('foo')

      expect(g.next()).toBe(null)
      expect(rect.next('.foo')).toBe(ellipse)
      expect(circle.next('.foo')).toBe(ellipse)
      expect(ellipse.next()).toBe(null)
    })
  })

  describe('nextAll()', () => {
    it('should return the all the next siblings', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle()
      const ellipse = g.ellipse()

      expect(g.nextAll()).toEqual([])
      expect(rect.nextAll()).toEqual([circle, ellipse])
      expect(circle.nextAll()).toEqual([ellipse])
      expect(ellipse.nextAll()).toEqual([])
    })

    it('should return all the next siblings matching the selector', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle()
      const ellipse1 = g.ellipse().addClass('foo')
      const ellipse2 = g.ellipse().addClass('foo')

      expect(g.nextAll()).toEqual([])
      expect(rect.nextAll('.foo')).toEqual([ellipse1, ellipse2])
      expect(circle.nextAll('.foo')).toEqual([ellipse1, ellipse2])
    })
  })

  describe('prev()', () => {
    it('should return the first previous sibling', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle()
      const ellipse = g.ellipse()

      expect(g.prev()).toBe(null)
      expect(rect.prev()).toBe(null)
      expect(circle.prev()).toBe(rect)
      expect(ellipse.prev()).toBe(circle)
    })

    it('should return the first previous sibling matching the selector', () => {
      const g = new G()
      const rect = g.rect().addClass('foo')
      const circle = g.circle()
      const ellipse = g.ellipse()

      expect(g.prev()).toBe(null)
      expect(rect.prev()).toBe(null)
      expect(circle.prev('.foo')).toBe(rect)
      expect(ellipse.prev('.foo')).toBe(rect)
    })
  })

  describe('prevAll()', () => {
    it('should return the all the previous siblings', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle()
      const ellipse = g.ellipse()

      expect(g.prevAll()).toEqual([])
      expect(rect.prevAll()).toEqual([])
      expect(circle.prevAll()).toEqual([rect])
      expect(ellipse.prevAll()).toEqual([circle, rect])
    })

    it('should return all the previous siblings matching the selector', () => {
      const g = new G()
      const rect1 = g.rect().addClass('foo')
      const rect2 = g.rect().addClass('foo')
      const circle = g.circle()
      const ellipse = g.ellipse()

      expect(g.prevAll()).toEqual([])
      expect(circle.prevAll('.foo')).toEqual([rect2, rect1])
      expect(ellipse.prevAll('.foo')).toEqual([rect2, rect1])
    })
  })

  describe('forward()', () => {
    it('should move forward the element', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle()
      const ellipse = g.ellipse()

      expect(rect.index()).toEqual(0)
      expect(circle.index()).toEqual(1)
      expect(ellipse.index()).toEqual(2)

      circle.forward()

      expect(rect.index()).toEqual(0)
      expect(circle.index()).toEqual(2)
      expect(ellipse.index()).toEqual(1)
    })

    it('should do nothing when the element do not has a parent', () => {
      const g = new G()
      expect(g.index()).toEqual(-1)
      g.forward()
      expect(g.index()).toEqual(-1)
    })
  })

  describe('backward()', () => {
    it('should move backward the element', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle()
      const ellipse = g.ellipse()

      expect(rect.index()).toEqual(0)
      expect(circle.index()).toEqual(1)
      expect(ellipse.index()).toEqual(2)

      circle.backward()

      expect(rect.index()).toEqual(1)
      expect(circle.index()).toEqual(0)
      expect(ellipse.index()).toEqual(2)
    })

    it('should do nothing when the element do not has a parent', () => {
      const g = new G()
      expect(g.index()).toEqual(-1)
      g.forward()
      expect(g.index()).toEqual(-1)
    })
  })

  describe('front()', () => {
    it('should move element to front', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle()
      const ellipse = g.ellipse()

      expect(rect.index()).toEqual(0)
      expect(circle.index()).toEqual(1)
      expect(ellipse.index()).toEqual(2)

      circle.front()

      expect(rect.index()).toEqual(0)
      expect(circle.index()).toEqual(2)
      expect(ellipse.index()).toEqual(1)
    })

    it('should do nothing when the element do not has a parent', () => {
      const g = new G()
      expect(g.index()).toEqual(-1)
      g.forward()
      expect(g.index()).toEqual(-1)
    })
  })

  describe('back()', () => {
    it('should move element to back', () => {
      const g = new G()
      const rect = g.rect()
      const circle = g.circle()
      const ellipse = g.ellipse()

      expect(rect.index()).toEqual(0)
      expect(circle.index()).toEqual(1)
      expect(ellipse.index()).toEqual(2)

      circle.back()

      expect(rect.index()).toEqual(1)
      expect(circle.index()).toEqual(0)
      expect(ellipse.index()).toEqual(2)
    })

    it('should do nothing when the element do not has a parent', () => {
      const g = new G()
      expect(g.index()).toEqual(-1)
      g.forward()
      expect(g.index()).toEqual(-1)
    })
  })

  describe('wrap()', () => {
    let svg: Svg
    let rect: Rect

    beforeEach(function () {
      svg = new Svg()
      rect = svg.rect()
    })

    it('should return the current element', function () {
      expect(rect.wrap(new G())).toBe(rect)
    })

    it('should wrap the passed element around the current element', function () {
      const g = new G()
      expect(rect.wrap(g).parent()).toBe(g)
      expect(g.parent()).toBe(svg)
    })

    it('should wrap also when element is not in the dom', () => {
      const g = new G()
      const rect = new Rect()
      expect(rect.wrap(g).parent()).toBe(g)
      expect(g.parent()).toBe(null)
    })

    it('should insert at the correct position', () => {
      svg.rect()
      rect = svg.rect()
      const position = rect.index()
      const g = new G()
      expect(rect.wrap(g).parent()?.index()).toBe(position)
    })

    it('should allow to pass an svg string as element', () => {
      rect.wrap('<g />')
      expect(rect.parent()).toBeInstanceOf(G)
      expect(rect.parent()!.parent()).toBe(svg)
    })

    it('should allow to pass an svg node as element', () => {
      const node = createSVGNode('g')
      rect.wrap(node)
      expect(rect.parent()).toBeInstanceOf(G)
      expect(rect.parent()!.node).toBe(node)
      expect(rect.parent()!.parent()).toBe(svg)
    })
  })

  describe('words()', () => {
    it('should set the nodes textContent to the given value', () => {
      const tspan = new TSpan().words('Hello World')
      expect(tspan.text()).toBe('Hello World')
    })
  })

  describe('toString()', () => {
    it('should call `id()` and returns its result', () => {
      const rect = new Rect({ id: 'foo' })
      const spy = sinon.spy(rect, 'id')
      expect(rect.toString()).toBe('foo')
      expect(spy.callCount).toEqual(1)
    })
  })

  describe('html()', () => {
    it('should call xml with the html namespace', () => {
      const group = new G()
      const spy = sinon.spy(group, 'xml')
      group.html('<foo>')
      expect(spy.callCount).toEqual(1)
      expect(spy.args[0]).toEqual(['<foo>', undefined, namespaces.html])
    })
  })

  describe('xml()', () => {
    describe('setter', () => {
      it('should return itself', () => {
        const g = new G()
        expect(g.xml('<rect />', undefined, namespaces.svg)).toBe(g)
      })

      it('should import a single element', () => {
        const g = new G().xml('<rect />', undefined, namespaces.svg)
        expect(g.children()[0]).toBeInstanceOf(Rect)
        expect(g.children()[0].node.namespaceURI).toBe(namespaces.svg)
      })

      it('should import multiple elements', () => {
        const g = new G().xml('<rect /><circle />', undefined, namespaces.svg)
        expect(g.children()[0]).toBeInstanceOf(Rect)
        expect(g.children()[1]).toBeInstanceOf(Circle)
      })

      it('should replace the current element with the imported elements with `outerXML` is `true`', () => {
        const svg = new Svg()
        const g = svg.group()
        g.xml('<rect /><circle />', true, namespaces.svg)
        expect(svg.children()[0]).toBeInstanceOf(Rect)
        expect(svg.children()[1]).toBeInstanceOf(Circle)
      })

      it('should return the parent when `outerXML` is `true`', () => {
        const svg = new Svg()
        const g = svg.group()
        expect(g.xml('<rect /><circle />', true, namespaces.svg)).toBe(svg)
        expect(svg.children()[0]).toBeInstanceOf(Rect)
        expect(svg.children()[1]).toBeInstanceOf(Circle)
      })

      it('should work without a parent', () => {
        const svg = new Svg()
        expect(svg.xml('<rect /><circle />', undefined, namespaces.svg)).toBe(
          svg,
        )
      })

      it('should use html namesapce by default', () => {
        const div = new Dom()
        div.xml('<span />')
        expect(div.children()[0].node.namespaceURI).toBe(namespaces.html)
      })
    })

    describe('getter', () => {
      let svg: Svg
      let group: G
      let rect: Rect

      beforeEach(() => {
        svg = new Svg().removeNamespace()
        group = svg.group()
        rect = group.rect(123.456, 234.567)
      })

      it('should return the svg string of the element by default', () => {
        expect(rect.xml()).toBe(
          '<rect width="123.456" height="234.567"></rect>',
        )
        expect(svg.xml()).toBe(
          '<svg><g><rect width="123.456" height="234.567"></rect></g></svg>',
        )
      })

      it('should return the innerHtml when outerHtml = false', () => {
        expect(rect.xml(false)).toBe('')
        expect(svg.xml(false)).toBe(
          '<g><rect width="123.456" height="234.567"></rect></g>',
        )
      })

      it('should run a function on every exported node', () => {
        expect(rect.xml((el) => el.round(1))).toBe(
          '<rect width="123.5" height="234.6"></rect>',
        )
      })

      it('should run a function on every exported node and replaces node with returned node if return value is not falsy', () => {
        expect(rect.xml(() => new Circle())).toBe('<circle></circle>')
        expect(svg.xml(() => new G())).toBe('<g></g>')
        expect(
          svg.xml((el) => {
            if (el instanceof Rect) return new Circle()
            if (el instanceof Svg) el.removeNamespace()
          }),
        ).toBe('<svg><g><circle></circle></g></svg>')
      })

      it('should run a function on every exported node and removes node if return value is false', () => {
        expect(group.xml(() => false)).toBe('')
        expect(svg.xml(() => false)).toBe('')
        expect(
          svg.xml((el) => {
            if (el instanceof Svg) {
              el.removeNamespace()
            } else {
              return false
            }
          }),
        ).toBe('<svg></svg>')
      })

      it('should run a function on every inner node and exports it when `outerXML` is `false`', () => {
        expect(svg.xml(() => false, false)).toBe('')
        expect(svg.xml(() => undefined, false)).toBe(
          '<g><rect width="123.456" height="234.567"></rect></g>',
        )
      })
    })
  })
})
