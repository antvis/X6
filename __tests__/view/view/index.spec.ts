import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Dom } from '../../../src/common'
import { Config } from '../../../src/config'
import { View } from '../../../src/view/view/index'

class TestView extends View {
  constructor() {
    super()
    this.container = document.createElement('div')
    this.selectors = {}
  }

  testMethod() {
    return 'test'
  }

  onRemove() {
    // Test implementation
  }
}

describe('View', () => {
  let view: TestView
  let container: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = ''
    view = new TestView()
    container = view.container
    document.body.appendChild(container)
  })

  afterEach(() => {
    view.dispose()
    document.body.innerHTML = ''
  })

  describe('constructor', () => {
    it('should generate unique cid', () => {
      const view1 = new TestView()
      const view2 = new TestView()
      expect(view1.cid).toMatch(/^v\d+$/)
      expect(view2.cid).toMatch(/^v\d+$/)
      expect(view1.cid).not.toBe(view2.cid)
      view1.dispose()
      view2.dispose()
    })

    it('should register view', () => {
      const newView = new TestView()
      expect(newView.cid).toBeDefined()
      newView.dispose()
    })
  })

  describe('properties', () => {
    it('should have default priority of 2', () => {
      expect(view.priority).toBe(2)
    })

    it('should have disposeContainer as true by default', () => {
      expect((view as any).disposeContainer).toBe(true)
    })
  })

  describe('confirmUpdate', () => {
    it('should return 0', () => {
      expect(view.confirmUpdate(1, {})).toBe(0)
    })
  })

  describe('empty', () => {
    it('should empty container by default', () => {
      container.innerHTML = '<div>test</div>'
      view.empty()
      expect(container.innerHTML).toBe('')
    })

    it('should empty specified element', () => {
      const elem = document.createElement('div')
      elem.innerHTML = '<span>content</span>'
      view.empty(elem)
      expect(elem.innerHTML).toBe('')
    })

    it('should return this', () => {
      expect(view.empty()).toBe(view)
    })
  })

  describe('unmount', () => {
    it('should remove container by default', () => {
      const parent = document.createElement('div')
      parent.appendChild(container)
      view.unmount()
      expect(parent.contains(container)).toBe(false)
    })

    it('should remove specified element', () => {
      const parent = document.createElement('div')
      const elem = document.createElement('div')
      parent.appendChild(elem)
      view.unmount(elem)
      expect(parent.contains(elem)).toBe(false)
    })

    it('should return this', () => {
      expect(view.unmount()).toBe(view)
    })
  })

  describe('remove', () => {
    it('should call onRemove when removing container', () => {
      const spy = vi.spyOn(view, 'onRemove')
      view.remove()
      expect(spy).toHaveBeenCalled()
    })

    it('should not call onRemove when removing other element', () => {
      const spy = vi.spyOn(view, 'onRemove')
      const elem = document.createElement('div')
      view.remove(elem)
      expect(spy).not.toHaveBeenCalled()
    })

    it('should unmount container when disposeContainer is true', () => {
      const parent = document.createElement('div')
      parent.appendChild(container)
      view.remove()
      expect(parent.contains(container)).toBe(false)
    })

    it('should not unmount container when disposeContainer is false', () => {
      const customView = new (class extends TestView {
        protected get disposeContainer() {
          return false
        }
      })()
      const parent = document.createElement('div')
      parent.appendChild(customView.container)
      customView.remove()
      expect(parent.contains(customView.container)).toBe(true)
      customView.dispose()
    })

    it('should return this', () => {
      expect(view.remove()).toBe(view)
    })
  })

  describe('setClass', () => {
    it('should set single class name', () => {
      view.setClass('test-class')
      expect(container.className).toBe('test-class')
    })

    it('should set multiple class names as array', () => {
      view.setClass(['class1', 'class2'])
      expect(container.className).toBe('class1 class2')
    })

    it('should set class on specified element', () => {
      const elem = document.createElement('div')
      view.setClass('custom-class', elem)
      expect(elem.className).toBe('custom-class')
    })
  })

  describe('addClass', () => {
    it('should add single class name', () => {
      view.addClass('new-class')
      expect(container.classList.contains('new-class')).toBe(true)
    })

    it('should add multiple class names', () => {
      view.addClass(['class1', 'class2'])
      expect(container.classList.contains('class1')).toBe(true)
      expect(container.classList.contains('class2')).toBe(true)
    })

    it('should add class to specified element', () => {
      const elem = document.createElement('div')
      view.addClass('test-class', elem)
      expect(elem.classList.contains('test-class')).toBe(true)
    })

    it('should return this', () => {
      expect(view.addClass('test')).toBe(view)
    })
  })

  describe('removeClass', () => {
    it('should remove single class name', () => {
      container.className = 'test-class other-class'
      view.removeClass('test-class')
      expect(container.classList.contains('test-class')).toBe(false)
      expect(container.classList.contains('other-class')).toBe(true)
    })

    it('should remove multiple class names', () => {
      container.className = 'class1 class2 class3'
      view.removeClass(['class1', 'class2'])
      expect(container.classList.contains('class1')).toBe(false)
      expect(container.classList.contains('class2')).toBe(false)
      expect(container.classList.contains('class3')).toBe(true)
    })

    it('should remove class from specified element', () => {
      const elem = document.createElement('div')
      elem.className = 'test-class'
      view.removeClass('test-class', elem)
      expect(elem.classList.contains('test-class')).toBe(false)
    })

    it('should return this', () => {
      expect(view.removeClass('test')).toBe(view)
    })
  })

  describe('setStyle', () => {
    it('should set styles', () => {
      view.setStyle({ color: 'red', fontSize: '14px' })
      expect(container.style.color).toBe('red')
      expect(container.style.fontSize).toBe('14px')
    })

    it('should set styles on specified element', () => {
      const elem = document.createElement('div')
      view.setStyle({ width: '100px' }, elem)
      expect(elem.style.width).toBe('100px')
    })

    it('should return this', () => {
      expect(view.setStyle({})).toBe(view)
    })
  })

  describe('setAttrs', () => {
    it('should set attributes', () => {
      view.setAttrs({ 'data-test': 'value', id: 'test-id' })
      expect(container.getAttribute('data-test')).toBe('value')
      expect(container.getAttribute('id')).toBe('test-id')
    })

    it('should set attributes on specified element', () => {
      const elem = document.createElement('div')
      view.setAttrs({ 'data-custom': 'custom-value' }, elem)
      expect(elem.getAttribute('data-custom')).toBe('custom-value')
    })

    it('should handle null attrs', () => {
      expect(() => view.setAttrs(null)).not.toThrow()
    })

    it('should handle null element', () => {
      expect(() => view.setAttrs({ test: 'value' }, null as any)).not.toThrow()
    })

    it('should return this', () => {
      expect(view.setAttrs({})).toBe(view)
    })
  })

  describe('findAttr', () => {
    it('should find attribute on element itself', () => {
      container.setAttribute('data-test', 'value')
      expect(view.findAttr('data-test')).toBe('value')
    })

    it('should find attribute on parent element', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      parent.setAttribute('data-parent', 'parent-value')
      parent.appendChild(child)
      container.appendChild(parent)
      expect(view.findAttr('data-parent', child)).toBe('parent-value')
    })

    it('should return null if attribute not found', () => {
      expect(view.findAttr('non-existent')).toBe(null)
    })

    it('should return null when reaching container without finding attr', () => {
      const child = document.createElement('div')
      container.appendChild(child)
      expect(view.findAttr('non-existent', child)).toBe(null)
    })

    it('should handle non-element nodes', () => {
      const textNode = document.createTextNode('text')
      expect(view.findAttr('test', textNode as any)).toBe(null)
    })
  })

  describe('find', () => {
    it('should find elements without selector', () => {
      const child = document.createElement('div')
      container.appendChild(child)
      const result = view.find()
      expect(result).toContain(container)
    })
  })

  describe('findOne', () => {
    it('should return null if no elements found', () => {
      const result = view.findOne('non-existent')
      expect(result).toBe(null)
    })
  })

  describe('findByAttr', () => {
    it('should find element with attribute', () => {
      container.setAttribute('data-magnet', 'true')
      const result = view.findByAttr('data-magnet')
      expect(result).toBe(container)
    })

    it('should find parent element with attribute', () => {
      const child = document.createElement('div')
      container.setAttribute('data-magnet', 'true')
      container.appendChild(child)
      const result = view.findByAttr('data-magnet', child)
      expect(result).toBe(container)
    })

    it('should return null for false attribute', () => {
      container.setAttribute('data-magnet', 'false')
      const result = view.findByAttr('data-magnet')
      expect(result).toBe(null)
    })
  })

  describe('getSelector', () => {
    it('should return undefined for container without prevSelector', () => {
      const result = view.getSelector(container)
      expect(result).toBeUndefined()
    })

    it('should return selector with prevSelector for container', () => {
      const result = view.getSelector(container, 'span')
      expect(result).toBe('> span')
    })

    it('should generate selector for child element', () => {
      const child = document.createElement('div')
      container.appendChild(child)
      const result = view.getSelector(child)
      expect(result).toMatch(/div:nth-child\(\d+\)/)
    })

    it('should generate nested selector', () => {
      const child = document.createElement('div')
      const grandchild = document.createElement('span')
      container.appendChild(child)
      child.appendChild(grandchild)
      const result = view.getSelector(grandchild)
      expect(result).toMatch(/div:nth-child\(\d+\) > span:nth-child\(\d+\)/)
    })

    it('should handle null element', () => {
      const result = view.getSelector(null as any)
      expect(result).toBeUndefined()
    })
  })

  describe('prefixClassName', () => {
    it('should prefix class name', () => {
      const result = view.prefixClassName('test')
      expect(result).toBe(Config.prefix('test'))
    })
  })

  describe('event delegation', () => {
    describe('delegateEvents', () => {
      it('should delegate events', () => {
        const handler = vi.fn()
        view.delegateEvents({
          'click .test': handler,
        })

        container.innerHTML = '<div class="test"></div>'
        const testEl = container.querySelector('.test') as HTMLElement
        testEl.click()

        expect(handler).toHaveBeenCalled()
      })

      it('should delegate events with string handler', () => {
        const spy = vi.spyOn(view, 'testMethod')
        view.delegateEvents({
          'click .test': 'testMethod',
        })

        container.innerHTML = '<div class="test"></div>'
        const testEl = container.querySelector('.test') as HTMLElement
        testEl.click()

        expect(spy).toHaveBeenCalled()
      })

      it('should handle null events', () => {
        expect(() => view.delegateEvents(null as any)).not.toThrow()
      })

      it('should handle invalid event key', () => {
        expect(() => view.delegateEvents({ '': vi.fn() })).not.toThrow()
      })

      it('should handle non-function handler', () => {
        expect(() =>
          view.delegateEvents({ click: 'nonExistentMethod' }),
        ).not.toThrow()
      })

      it('should append events when append is true', () => {
        const handler1 = vi.fn()
        const handler2 = vi.fn()

        view.delegateEvents({ 'click .test1': handler1 })
        view.delegateEvents({ 'click .test2': handler2 }, true)

        container.innerHTML =
          '<div class="test1"></div><div class="test2"></div>'

        const test1 = container.querySelector('.test1') as HTMLElement
        const test2 = container.querySelector('.test2') as HTMLElement

        test1.click()
        test2.click()

        expect(handler1).toHaveBeenCalled()
        expect(handler2).toHaveBeenCalled()
      })

      it('should return this', () => {
        expect(view.delegateEvents({})).toBe(view)
      })
    })

    describe('undelegateEvents', () => {
      it('should undelegate events', () => {
        const handler = vi.fn()
        view.delegateEvents({ 'click .test': handler })
        view.undelegateEvents()

        container.innerHTML = '<div class="test"></div>'
        const testEl = container.querySelector('.test') as HTMLElement
        testEl.click()

        expect(handler).not.toHaveBeenCalled()
      })

      it('should return this', () => {
        expect(view.undelegateEvents()).toBe(view)
      })
    })

    describe('delegateDocumentEvents', () => {
      it('should delegate document events', () => {
        const handler = vi.fn()
        view.delegateDocumentEvents({ click: handler })

        document.body.click()
        expect(handler).toHaveBeenCalled()
      })

      it('should delegate document events with data', () => {
        const handler = vi.fn()
        view.delegateDocumentEvents({ click: handler }, { test: 'data' })

        document.body.click()
        expect(handler).toHaveBeenCalled()
      })

      it('should return this', () => {
        expect(view.delegateDocumentEvents({})).toBe(view)
      })
    })

    describe('undelegateDocumentEvents', () => {
      it('should undelegate document events', () => {
        const handler = vi.fn()
        view.delegateDocumentEvents({ click: handler })
        view.undelegateDocumentEvents()

        document.body.click()
        expect(handler).not.toHaveBeenCalled()
      })

      it('should return this', () => {
        expect(view.undelegateDocumentEvents()).toBe(view)
      })
    })

    describe('delegateEvent', () => {
      it('should delegate single event', () => {
        const handler = vi.fn()
        view.delegateEvent('click', '.test', handler)

        container.innerHTML = '<div class="test"></div>'
        const testEl = container.querySelector('.test') as HTMLElement
        testEl.click()

        expect(handler).toHaveBeenCalled()
      })

      it('should return this', () => {
        expect(view.delegateEvent('click', '.test', vi.fn())).toBe(view)
      })
    })

    describe('undelegateEvent', () => {
      it('should undelegate event without selector', () => {
        const result = view.undelegateEvent('click')
        expect(result).toBe(view)
      })

      it('should undelegate event with selector and listener', () => {
        const handler = vi.fn()
        const result = view.undelegateEvent('click', '.test', handler)
        expect(result).toBe(view)
      })

      it('should undelegate event with non-string selector', () => {
        const handler = vi.fn()
        const result = view.undelegateEvent('click', handler)
        expect(result).toBe(view)
      })
    })
  })

  describe('event utilities', () => {
    describe('getEventTarget', () => {
      it('should return target by default', () => {
        const target = document.createElement('div')
        const event = { target, type: 'click', clientX: 0, clientY: 0 } as any
        expect(view.getEventTarget(event)).toBe(target)
      })
    })

    describe('event propagation', () => {
      it('should stop propagation', () => {
        const event = { data: {} } as any
        view.stopPropagation(event)
        expect(view.isPropagationStopped(event)).toBe(true)
      })

      it('should check propagation stopped', () => {
        const event = { data: {} } as any
        expect(view.isPropagationStopped(event)).toBe(false)
      })

      it('should return this for stopPropagation', () => {
        const event = { data: {} } as any
        expect(view.stopPropagation(event)).toBe(view)
      })
    })

    describe('event data', () => {
      it('should get event data', () => {
        const event = { data: {} } as any
        const data = view.getEventData(event)
        expect(data).toEqual({})
      })

      it('should set event data', () => {
        const event = { data: {} } as any
        const testData = { test: 'value' }
        view.setEventData(event, testData)
        expect(view.getEventData(event)).toEqual(testData)
      })

      it('should merge event data', () => {
        const event = { data: {} } as any
        view.setEventData(event, { a: 1 })
        view.setEventData(event, { b: 2 })
        expect(view.getEventData(event)).toEqual({ a: 1, b: 2 })
      })

      it('should handle null event data', () => {
        const event = {} as any
        const data = view.getEventData(event)
        expect(data).toEqual({})
      })

      it('should throw error for null event', () => {
        expect(() => view.getEventData(null as any)).toThrow(
          'Event object required',
        )
      })
    })

    describe('normalizeEvent', () => {
      it('should normalize event', () => {
        const event = { type: 'click' } as any
        const normalized = view.normalizeEvent(event)
        expect(normalized).toBeDefined()
      })
    })
  })

  describe('helper methods', () => {
    describe('getEventNamespace', () => {
      it('should return event namespace', () => {
        const ns = (view as any).getEventNamespace()
        expect(ns).toMatch(
          new RegExp(`\\.${Config.prefixCls}-event-${view.cid}`),
        )
      })
    })

    describe('getEventHandler', () => {
      it('should return function for function handler', () => {
        const handler = vi.fn()
        const result = (view as any).getEventHandler(handler)
        expect(typeof result).toBe('function')
      })

      it('should return function for string handler', () => {
        const result = (view as any).getEventHandler('testMethod')
        expect(typeof result).toBe('function')
      })

      it('should return undefined for non-existent method', () => {
        const result = (view as any).getEventHandler('nonExistentMethod')
        expect(result).toBeUndefined()
      })
    })

    describe('addEventListeners', () => {
      it('should add event listeners', () => {
        const handler = vi.fn()
        const elem = document.createElement('div')
        view.addEventListeners(elem, { click: handler })

        elem.click()
        expect(handler).toHaveBeenCalled()
      })

      it('should handle null events', () => {
        const elem = document.createElement('div')
        expect(() => view.addEventListeners(elem, null as any)).not.toThrow()
      })

      it('should return this', () => {
        const elem = document.createElement('div')
        expect(view.addEventListeners(elem, {})).toBe(view)
      })
    })

    describe('removeEventListeners', () => {
      it('should remove event listeners', () => {
        const elem = document.createElement('div')
        const result = view.removeEventListeners(elem)
        expect(result).toBe(view)
      })

      it('should handle null element', () => {
        const result = view.removeEventListeners(null as any)
        expect(result).toBe(view)
      })
    })
  })

  describe('dispose', () => {
    it('should dispose view', () => {
      const spy = vi.spyOn(view, 'remove')
      view.dispose()
      expect(spy).toHaveBeenCalled()
    })
  })
})
