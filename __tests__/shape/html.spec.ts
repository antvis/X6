import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Dom } from '../../src/common'
import { Graph } from '../../src/graph/graph'
import { HTML, type HTMLShapeConfig } from '../../src/shape/html'

describe('HTML Shape', () => {
  let graph: Graph
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    graph = new Graph({ container })
  })

  afterEach(() => {
    graph.dispose()
    document.body.removeChild(container)
  })

  describe('HTML.register', () => {
    it('should register HTML shape with basic config', () => {
      const config: HTMLShapeConfig = {
        shape: 'custom-html',
        html: '<div>test</div>',
      }

      const registerSpy = vi.spyOn(Graph, 'registerNode')
      HTML.register(config)

      expect(registerSpy).toHaveBeenCalledWith(
        'custom-html',
        { inherit: 'html' },
        true,
      )
    })

    it('should register HTML shape with custom inherit', () => {
      const config: HTMLShapeConfig = {
        shape: 'custom-html2',
        html: '<div>test</div>',
        inherit: 'custom-base',
      }

      // @ts-expect-error
      const registerSpy = vi
        .spyOn(Graph, 'registerNode')
        .mockImplementation(() => {})
      HTML.register(config)

      expect(registerSpy).toHaveBeenCalledWith(
        'custom-html2',
        { inherit: 'custom-base' },
        true,
      )
    })

    it('should register HTML shape with effect and other properties', () => {
      const config: HTMLShapeConfig = {
        shape: 'custom-html3',
        html: '<div>test</div>',
        effect: ['size', 'position'],
        width: 100,
        height: 50,
      }

      const registerSpy = vi.spyOn(Graph, 'registerNode')
      HTML.register(config)

      expect(registerSpy).toHaveBeenCalledWith(
        'custom-html3',
        { inherit: 'html', width: 100, height: 50 },
        true,
      )
    })

    it('should throw error when shape is not specified', () => {
      const config = {
        html: '<div>test</div>',
      } as HTMLShapeConfig

      expect(() => HTML.register(config)).toThrow(
        'HTML.register should specify `shape` in config.',
      )
    })
  })

  describe('View', () => {
    let node: HTML
    let view: any

    beforeEach(() => {
      HTML.register({
        shape: 'test-html',
        html: '<div>test content</div>',
        effect: ['size'],
      })

      node = graph.addNode({
        shape: 'test-html',
        x: 10,
        y: 20,
        width: 100,
        height: 50,
      }) as HTML

      view = graph.findViewByCell(node)
    })

    it('should re-render when affected property changes', () => {
      const renderSpy = vi.spyOn(view, 'renderHTMLComponent')
      node.resize(200, 100)
      expect(renderSpy).toHaveBeenCalled()
    })

    it('should not re-render when unaffected property changes', () => {
      const renderSpy = vi.spyOn(view, 'renderHTMLComponent')
      node.setPosition(50, 60)
      expect(renderSpy).not.toHaveBeenCalled()
    })

    it('should re-render for any change when no effect specified', () => {
      HTML.register({
        shape: 'test-html-no-effect',
        html: '<div>no effect</div>',
      })

      const nodeNoEffect = graph.addNode({
        shape: 'test-html-no-effect',
        x: 10,
        y: 20,
      }) as HTML

      const viewNoEffect = graph.findViewByCell(nodeNoEffect)
      // @ts-expect-error
      const renderSpy = vi.spyOn(viewNoEffect, 'renderHTMLComponent')

      nodeNoEffect.setPosition(50, 60)
      expect(renderSpy).toHaveBeenCalled()
    })

    it('should render string HTML content', () => {
      const mockContainer = document.createElement('div')
      view.selectors = { foContent: mockContainer }

      view.renderHTMLComponent()
      expect(mockContainer.innerHTML).toBe('<div>test content</div>')
    })

    it('should render HTMLElement content', () => {
      const element = document.createElement('span')
      element.textContent = 'element content'

      HTML.register({
        shape: 'test-html-element',
        html: element,
      })

      const elementNode = graph.addNode({
        shape: 'test-html-element',
      }) as HTML

      const elementView = graph.findViewByCell(elementNode)
      const mockContainer = document.createElement('div')
      // @ts-expect-error
      elementView.selectors = { foContent: mockContainer }

      const appendSpy = vi.spyOn(Dom, 'append')
      // @ts-expect-error
      elementView.renderHTMLComponent()
      expect(appendSpy).toHaveBeenCalledWith(mockContainer, element)
    })

    it('should render function HTML content', () => {
      const htmlFunction = vi.fn(() => '<div>function result</div>')

      HTML.register({
        shape: 'test-html-function',
        html: htmlFunction,
      })

      const functionNode = graph.addNode({
        shape: 'test-html-function',
      }) as HTML

      const functionView = graph.findViewByCell(functionNode)
      const mockContainer = document.createElement('div')
      // @ts-expect-error
      functionView.selectors = { foContent: mockContainer }

      // @ts-expect-error
      functionView.renderHTMLComponent()
      expect(htmlFunction).toHaveBeenCalledWith(functionNode)
      expect(mockContainer.innerHTML).toBe('<div>function result</div>')
    })

    it('should handle function returning HTMLElement', () => {
      const element = document.createElement('div')
      element.textContent = 'function element'
      const htmlFunction = vi.fn(() => element)

      HTML.register({
        shape: 'test-html-function-element',
        html: htmlFunction,
      })

      const functionNode = graph.addNode({
        shape: 'test-html-function-element',
      }) as HTML

      const functionView = graph.findViewByCell(functionNode)
      const mockContainer = document.createElement('div')
      // @ts-expect-error
      functionView.selectors = { foContent: mockContainer }

      const appendSpy = vi.spyOn(Dom, 'append')
      // @ts-expect-error
      functionView.renderHTMLComponent()
      expect(appendSpy).toHaveBeenCalledWith(mockContainer, element)
    })

    it('should handle empty HTML content', () => {
      HTML.register({
        shape: 'test-html-empty',
        html: '',
      })

      const emptyNode = graph.addNode({
        shape: 'test-html-empty',
      }) as HTML

      const emptyView = graph.findViewByCell(emptyNode)
      const mockContainer = document.createElement('div')
      // @ts-expect-error
      emptyView.selectors = { foContent: mockContainer }

      // @ts-expect-error
      emptyView.renderHTMLComponent()
      expect(mockContainer.innerHTML).toBe('')
    })

    it('should handle null HTML function result', () => {
      const htmlFunction = vi.fn(() => null)

      HTML.register({
        shape: 'test-html-null',
        // @ts-expect-error
        html: htmlFunction,
      })

      const nullNode = graph.addNode({
        shape: 'test-html-null',
      }) as HTML

      const nullView = graph.findViewByCell(nullNode)
      const mockContainer = document.createElement('div')
      // @ts-expect-error
      nullView.selectors = { foContent: mockContainer }

      // @ts-expect-error
      nullView.renderHTMLComponent()
      expect(mockContainer.innerHTML).toBe('')
    })

    it('should handle missing container', () => {
      view.selectors = null
      expect(() => view.renderHTMLComponent()).not.toThrow()
    })

    it('should empty container before rendering', () => {
      const mockContainer = document.createElement('div')
      mockContainer.innerHTML = '<span>old content</span>'
      view.selectors = { foContent: mockContainer }

      const emptySpy = vi.spyOn(Dom, 'empty')
      view.renderHTMLComponent()
      expect(emptySpy).toHaveBeenCalledWith(mockContainer)
    })

    it('should dispose event listeners', () => {
      const offSpy = vi.spyOn(node, 'off')
      view.dispose()
      expect(offSpy).toHaveBeenCalledWith(
        'change:*',
        view.onCellChangeAny,
        view,
      )
    })
  })
})
