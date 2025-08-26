import { describe, expect, it, vi } from "vitest";
import * as sinon from 'sinon'
import { Dom, Keyboard } from '../../src'
import { createTestGraph } from '../utils/graph-helpers'
import { formatKey, isGraphEvent, isInputEvent } from '../../src/plugin/keyboard/util'

describe('plugin/keyboard', () => {
  it('method and options', () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(
      new Keyboard({
        global: false,
      }),
    )

    const keyboard = graph.getPlugin('keyboard') as Keyboard

    expect(keyboard.options).toEqual({ enabled: true, global: false })
    expect(keyboard.name).toBe('keyboard')
    expect(keyboard.isEnabled()).toBe(true)

    keyboard.enable()
    expect(keyboard.isEnabled()).toBe(true)

    keyboard.disable()
    expect(keyboard.isEnabled()).toBe(false)

    keyboard.toggleEnabled()
    expect(keyboard.isEnabled()).toBe(true)
    keyboard.toggleEnabled(false)
    expect(keyboard.isEnabled()).toBe(false)

    cleanup()
  })

  it('graph api of keyboard', () => {
    const { graph, cleanup } = createTestGraph()
    graph.use(new Keyboard())

    const n = graph.addNode({
      id: 'n1',
      x: 80,
      y: 80,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p1', group: 'r' }],
      },
    })

    expect(graph.isKeyboardEnabled()).toBe(true)

    graph.disableKeyboard()
    expect(graph.isKeyboardEnabled()).toBe(false)

    graph.enableKeyboard()
    expect(graph.isKeyboardEnabled()).toBe(true)

    graph.toggleKeyboard()
    expect(graph.isKeyboardEnabled()).toBe(false)
    graph.toggleKeyboard(true)
    expect(graph.isKeyboardEnabled()).toBe(true)

    const deleteFn = vi.fn()
    const enterFn = vi.fn()

    graph.bindKey('delete', deleteFn, 'keypress')
    graph.bindKey('enter', enterFn, 'keyup')
    graph.triggerKey('delete', 'keypress')
    expect(deleteFn).toHaveBeenCalledTimes(1)
    expect(deleteFn).toHaveBeenCalledWith({}, 'del')

    deleteFn.mockClear()
    graph.unbindKey('delete', 'keypress')
    graph.triggerKey('delete', 'keypress')
    expect(deleteFn).toHaveBeenCalledTimes(0)

    graph.clearKeys();

    graph.triggerKey('enter', 'keyup')
    expect(enterFn).toHaveBeenCalledTimes(0)

    cleanup()
  })

  it('graph api with no keyboard', () => {
    const { graph, cleanup } = createTestGraph()

    const n = graph.addNode({
      id: 'n1',
      x: 80,
      y: 80,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p1', group: 'r' }],
      },
    })

    const fn = vi.fn()

    expect(graph.isKeyboardEnabled()).toBe(false)

    expect(() => {
      graph.bindKey('delete', fn)
    }).not.toThrow()

    expect(() => {
      graph.triggerKey('delete', 'keydown')
    }).not.toThrow()

    expect(() => {
      graph.unbindKey('delete')
    }).not.toThrow()

    expect(() => {
      graph.clearKeys()
    }).not.toThrow()

    expect(() => {
      graph.enableKeyboard()
    }).not.toThrow()

    expect(() => {
      graph.disableKeyboard()
    }).not.toThrow()

    expect(() => {
      graph.toggleKeyboard()
    }).not.toThrow()

    cleanup()
  })

  it('keyboard util', () => {
    expect(formatKey('delete')).toBe('del')
  })
})

describe('plugin/keyboard/util', () => {
  describe('formatKey', () => {
    it('should format key to lowercase', () => {
      const result = formatKey('ArrowUp')
      expect(result).toBe('up')
    })

    it('should remove spaces', () => {
      const result = formatKey('arrow up')
      expect(result).toBe('up')
    })

    it('should replace delete with del', () => {
      const result = formatKey('Delete')
      expect(result).toBe('del')
    })

    it('should replace cmd with command', () => {
      const result = formatKey('cmd')
      expect(result).toBe('command')
    })

    it('should replace arrow keys', () => {
      expect(formatKey('ArrowUp')).toBe('up')
      expect(formatKey('ArrowRight')).toBe('right')
      expect(formatKey('ArrowDown')).toBe('down')
      expect(formatKey('ArrowLeft')).toBe('left')
    })

    it('should apply custom format function when provided', () => {
      const formatFn = sinon.stub().returns('formatted')
      const result = formatKey('test', formatFn)
      expect(result).toBe('formatted')
      expect(formatFn.calledWith('test')).toBe(true)
    })
  })

  describe('isInputEvent', () => {
    it('should return true for input elements', () => {
      const mockEvent = {
        target: document.createElement('input')
      } as any as KeyboardEvent
      
      const result = isInputEvent(mockEvent)
      expect(result).toBe(true)
    })

    it('should return true for textarea elements', () => {
      const mockEvent = {
        target: document.createElement('textarea')
      } as any as KeyboardEvent
      
      const result = isInputEvent(mockEvent)
      expect(result).toBe(true)
    })

    it('should return true for contenteditable elements', () => {
      const div = document.createElement('div')
      div.setAttribute('contenteditable', 'true')
      const mockEvent = {
        target: div
      } as any as KeyboardEvent
      
      expect(isInputEvent(mockEvent)).toBe(true)
    })

    it('should return false for non-input elements', () => {
      const div = document.createElement('div')
      const mockEvent = {
        target: div
      } as any as KeyboardEvent
      
      const result = isInputEvent(mockEvent)
      expect(result).toBe(false)
    })
  })

  describe('isGraphEvent', () => {
    it('should return true when target equals t', () => {
      const mockElement = document.createElement('div')
      const mockEvent = {
        target: mockElement,
        currentTarget: document.createElement('span')
      } as any as KeyboardEvent
      
      const result = isGraphEvent(mockEvent, mockElement, document.createElement('div'))
      expect(result).toBe(true)
    })

    it('should return true when currentTarget equals t', () => {
      const mockElement = document.createElement('div')
      const mockEvent = {
        target: document.createElement('span'),
        currentTarget: mockElement
      } as any as KeyboardEvent
      
      const result = isGraphEvent(mockEvent, mockElement, document.createElement('div'))
      expect(result).toBe(true)
    })

    it('should return true when target is document.body', () => {
      const mockEvent = {
        target: document.body,
        currentTarget: document.createElement('span')
      } as any as KeyboardEvent
      
      const result = isGraphEvent(mockEvent, document.createElement('div'), document.createElement('div'))
      expect(result).toBe(true)
    })

    it('should return false when container does not contain target', () => {
      const container = document.createElement('div')
      const target = document.createElement('span')
      const mockEvent = {
        target,
        currentTarget: document.createElement('div')
      } as any as KeyboardEvent
      
      sinon.stub(Dom, 'contains').returns(false)
      
      const result = isGraphEvent(mockEvent, document.createElement('div'), container)
      expect(result).toBe(false)
      
      sinon.restore()
    })

    it('should return false when target is null', () => {
      const mockEvent = {
        target: null,
        currentTarget: document.createElement('div')
      } as any as KeyboardEvent
      
      const result = isGraphEvent(mockEvent, document.createElement('div'), document.createElement('div'))
      expect(result).toBe(false)
    })
  })
})
