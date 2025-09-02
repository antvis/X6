import * as sinon from 'sinon'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Dom } from '../../../src/common'
import { Rectangle } from '../../../src/geometry'
import { Graph } from '../../../src/graph'
import type { Cell } from '../../../src/model/cell'
import { Edge } from '../../../src/model/edge'
import { Node } from '../../../src/model/node'
import { CellView } from '../../../src/view/cell'
import { ToolsView } from '../../../src/view/tool'

describe('CellView', () => {
  let graph: Graph
  let cell: Cell
  let cellView: CellView

  beforeEach(() => {
    const container = document.createElement('div')
    graph = new Graph({ container })
    cell = new Node({ x: 10, y: 20, width: 100, height: 50 })
    cellView = new CellView(cell, { graph })
  })

  describe('static methods', () => {
    it('should config defaults', () => {
      const newDefaults = { priority: 10 }
      CellView.config(newDefaults)
      expect(CellView.getDefaults().priority).toBe(10)

      // Reset to original
      CellView.config({ priority: 0 })
    })

    it('should merge events and documentEvents', () => {
      const options = CellView.getOptions({
        events: { click: 'onClick' },
        documentEvents: { mousemove: 'onMouseMove' },
      })
      expect(options.events).toEqual({ click: 'onClick' })
      expect(options.documentEvents).toEqual({ mousemove: 'onMouseMove' })
    })
  })

  describe('constructor', () => {
    it('should initialize with cell and options', () => {
      expect(cellView.cell).toBe(cell)
      expect(cellView.graph).toBe(graph)
      expect(cellView.priority).toBe(0)
    })

    it('should setup container', () => {
      expect(cellView.container).toBeDefined()
      expect(cellView.container.tagName.toLowerCase()).toBe('g')
    })
  })

  describe('container methods', () => {
    it('should get container tag name for SVG', () => {
      expect(cellView['getContainerTagName']()).toBe('g')
    })

    it('should get container tag name for HTML', () => {
      const htmlCellView = new CellView(cell, { graph, isSvgElement: false })
      expect(htmlCellView['getContainerTagName']()).toBe('div')
    })

    it('should get container attributes', () => {
      const attrs = cellView['getContainerAttrs']()
      expect(attrs).toEqual({
        'data-cell-id': cell.id,
        'data-shape': cell.shape,
      })
    })

    it('should get container class name', () => {
      const className = cellView['getContainerClassName']()
      expect(className).toBe('x6-cell')
    })

    it('should set container with attributes and styles', () => {
      const container = document.createElement('g')
      const spy1 = sinon.spy(cellView, 'setAttrs')
      const spy2 = sinon.spy(cellView, 'addClass')

      cellView['setContainer'](container)

      expect(spy1.called).toBe(true)
      expect(spy2.called).toBe(true)
      expect(cellView.container).toBe(container)

      spy1.restore()
      spy2.restore()
    })
  })

  describe('view type checks', () => {
    it('should return false for isNodeView', () => {
      expect(cellView.isNodeView()).toBe(false)
    })

    it('should return false for isEdgeView', () => {
      expect(cellView.isEdgeView()).toBe(false)
    })
  })

  describe('render and update', () => {
    it('should render', () => {
      const result = cellView.render()
      expect(result).toBe(cellView)
    })

    it('should confirm update', () => {
      const result = cellView.confirmUpdate(1, {})
      expect(result).toBe(0)
    })
  })

  describe('flag management', () => {
    it('should get bootstrap flag', () => {
      const flag = cellView.getBootstrapFlag()
      expect(typeof flag).toBe('number')
    })

    it('should get flag for actions', () => {
      const flag = cellView.getFlag('render')
      expect(typeof flag).toBe('number')
    })

    it('should handle action with additional removed actions', () => {
      const flag = cellView.getFlag(['render', 'update'])
      const handlerSpy = sinon.spy()

      const newFlag = cellView.handleAction(
        flag,
        'render',
        handlerSpy,
        'update',
      )
      expect(handlerSpy.called).toBe(true)

      const newFlag2 = cellView.handleAction(flag, 'render', handlerSpy, [
        'update',
      ])
      expect(handlerSpy.called).toBe(true)
    })

    it('should not handle action if not present', () => {
      const flag = cellView.getFlag('render')
      const handlerSpy = sinon.spy()

      const newFlag = cellView.handleAction(flag, 'update', handlerSpy)
      expect(handlerSpy.called).toBe(false)
      expect(newFlag).toBe(flag)
    })
  })

  describe('cell change handling', () => {
    it('should handle cell changes', () => {
      const spy = sinon.spy(cellView, 'onAttrsChange')
      cell.trigger('changed', { options: {} })
      expect(spy.called).toBe(true)
      spy.restore()
    })

    it('should handle attrs change with updated flag', () => {
      const requestSpy = sinon.spy(graph.renderer, 'requestViewUpdate')
      cellView['onAttrsChange']({ updated: true })
      expect(requestSpy.called).toBe(false)
      requestSpy.restore()
    })
  })

  describe('markup parsing', () => {
    it('should parse JSON markup', () => {
      const markup = {
        tagName: 'rect',
        selector: 'body',
      }
      const result = cellView.parseJSONMarkup(markup)
      expect(result.selectors).toBeDefined()
      expect(result.fragment).toBeDefined()
    })

    it('should parse JSON markup with root element', () => {
      const markup = { tagName: 'rect', selector: 'body' }
      const rootElem = document.createElement('g')
      const result = cellView.parseJSONMarkup(markup, rootElem)
      expect(result.selectors.root).toBe(rootElem)
    })

    it('should throw error for invalid root selector', () => {
      const markup = { tagName: 'rect', selector: 'root' }
      const rootElem = document.createElement('g')
      expect(() => cellView.parseJSONMarkup(markup, rootElem)).toThrow(
        'Invalid root selector',
      )
    })
  })

  describe('interaction checking', () => {
    it('should check interaction with boolean value', () => {
      graph.options.interacting = true
      expect(cellView.can('nodeMovable')).toBe(true)

      graph.options.interacting = false
      expect(cellView.can('nodeMovable')).toBe(false)
    })

    it('should check interaction with function', () => {
      graph.options.interacting = () => true
      expect(cellView.can('nodeMovable')).toBe(true)
    })

    it('should check interaction with object', () => {
      graph.options.interacting = { nodeMovable: true }
      expect(cellView.can('nodeMovable')).toBe(true)

      graph.options.interacting = { nodeMovable: false }
      expect(cellView.can('nodeMovable')).toBe(false)
    })

    it('should check interaction with function in object', () => {
      graph.options.interacting = { nodeMovable: () => true }
      expect(cellView.can('nodeMovable')).toBe(true)
    })
  })

  describe('cache methods', () => {
    it('should clean cache', () => {
      const spy = sinon.spy(cellView.cache, 'clean')
      const result = cellView.cleanCache()
      expect(spy.called).toBe(true)
      expect(result).toBe(cellView)
      spy.restore()
    })

    it('should get cache data', () => {
      const elem = document.createElement('rect')
      const spy = sinon.spy(cellView.cache, 'get')
      cellView.getCache(elem)
      expect(spy.calledWith(elem)).toBe(true)
      spy.restore()
    })

    it('should get element data', () => {
      const elem = document.createElement('rect')
      const spy = sinon.spy(cellView.cache, 'getData')
      cellView.getDataOfElement(elem)
      expect(spy.calledWith(elem)).toBe(true)
      spy.restore()
    })

    it('should get element matrix', () => {
      const elem = document.createElement('rect')
      const spy = sinon.spy(cellView.cache, 'getMatrix')
      cellView.getMatrixOfElement(elem)
      expect(spy.calledWith(elem)).toBe(true)
      spy.restore()
    })

    it('should get element shape', () => {
      const elem = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )
      const spy = sinon.spy(cellView.cache, 'getShape')
      cellView.getShapeOfElement(elem)
      expect(spy.calledWith(elem)).toBe(true)
      spy.restore()
    })

    it('should get bounding rect', () => {
      const elem = document.createElement('rect')
      const spy = sinon.spy(cellView.cache, 'getBoundingRect')
      cellView.getBoundingRectOfElement(elem)
      expect(spy.calledWith(elem)).toBe(true)
      spy.restore()
    })
  })

  describe('bbox methods', () => {
    it('should get bbox of element', () => {
      const mockRect = new Rectangle(0, 0, 100, 50)
      const mockMatrix = Dom.createSVGMatrix()

      sinon.stub(cellView, 'getBoundingRectOfElement').returns(mockRect)
      sinon.stub(cellView, 'getMatrixOfElement').returns(mockMatrix)
      sinon.stub(cellView, 'getRootRotatedMatrix').returns(mockMatrix)
      sinon.stub(cellView, 'getRootTranslatedMatrix').returns(mockMatrix)

      const bbox = cellView.getBBoxOfElement(cellView.container)
      expect(bbox).toBeInstanceOf(Rectangle)
    })

    it('should get unrotated bbox of element', () => {
      const mockRect = new Rectangle(0, 0, 100, 50)
      const mockMatrix = Dom.createSVGMatrix()
      const elem = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect',
      )

      sinon.stub(cellView, 'getBoundingRectOfElement').returns(mockRect)
      sinon.stub(cellView, 'getMatrixOfElement').returns(mockMatrix)
      sinon.stub(cellView, 'getRootTranslatedMatrix').returns(mockMatrix)

      const bbox = cellView.getUnrotatedBBoxOfElement(elem)
      expect(bbox).toBeInstanceOf(Rectangle)
    })

    it('should get bbox with cell geometry', () => {
      const bbox = cellView.getBBox({ useCellGeometry: true })
      expect(bbox).toBeInstanceOf(Rectangle)
    })

    it('should get bbox without cell geometry', () => {
      const mockRect = new Rectangle(0, 0, 100, 50)
      sinon.stub(cellView, 'getBBoxOfElement').returns(mockRect)
      sinon.stub(graph.coord, 'localToGraphRect').returns(mockRect)

      const bbox = cellView.getBBox()
      expect(bbox).toBeInstanceOf(Rectangle)
    })
  })

  describe('matrix methods', () => {
    it('should get root translated matrix for node', () => {
      const matrix = cellView.getRootTranslatedMatrix()
      expect(matrix.e).toBe(10) // x position
      expect(matrix.f).toBe(20) // y position
    })

    it('should get root translated matrix for edge', () => {
      const edge = new Edge()
      const edgeView = new CellView(edge, { graph })
      const matrix = edgeView.getRootTranslatedMatrix()
      expect(matrix.e).toBe(0)
      expect(matrix.f).toBe(0)
    })

    it('should get root rotated matrix without angle', () => {
      const matrix = cellView.getRootRotatedMatrix()
      expect(matrix.a).toBe(1)
      expect(matrix.d).toBe(1)
    })
  })

  describe('magnet methods', () => {
    it('should find magnet', () => {
      const spy = sinon.spy(cellView, 'findByAttr')
      cellView.findMagnet()
      expect(spy.calledWith('magnet', cellView.container)).toBe(true)
      spy.restore()
    })

    it('should find magnet with custom element', () => {
      const elem = document.createElement('rect')
      const spy = sinon.spy(cellView, 'findByAttr')
      cellView.findMagnet(elem)
      expect(spy.calledWith('magnet', elem)).toBe(true)
      spy.restore()
    })

    it('should update attrs', () => {
      const attrs = { fill: 'red' }
      const spy = sinon.spy(cellView.attr, 'update')
      cellView.updateAttrs(cellView.container, attrs)
      expect(spy.called).toBe(true)
      spy.restore()
    })

    it('should check if element is edge element for edge', () => {
      const edge = new Edge()
      const edgeView = new CellView(edge, { graph })
      expect(edgeView.isEdgeElement()).toBe(true)
      expect(edgeView.isEdgeElement(edgeView.container)).toBe(true)
    })

    it('should check if element is edge element for node', () => {
      expect(cellView.isEdgeElement()).toBe(false)
    })
  })

  describe('highlight methods', () => {
    it('should prepare highlight', () => {
      const elem = document.createElement('rect')
      const options = {}
      const result = cellView['prepareHighlight'](elem, options)
      expect(result).toBe(elem)
      expect(options.partial).toBe(false)
    })

    it('should prepare highlight with container', () => {
      const options = {}
      const result = cellView['prepareHighlight'](null, options)
      expect(result).toBe(cellView.container)
      expect(options.partial).toBe(true)
    })

    it('should unhighlight cell', () => {
      const spy = sinon.spy(cellView, 'notify')
      cellView.unhighlight()
      expect(spy.calledWith('cell:unhighlight')).toBe(true)
      spy.restore()
    })

    it('should call notifyUnhighlight', () => {
      const elem = document.createElement('rect')
      const options = {}
      // Should not throw
      cellView.notifyUnhighlight(elem, options)
    })
  })

  describe('edge terminal methods', () => {
    it('should get edge terminal with port', () => {
      const magnet = document.createElement('rect')
      magnet.setAttribute('port', 'port1')
      magnet.setAttribute('data-selector', 'body')

      const edge = new Edge()
      const terminal = cellView.getEdgeTerminal(magnet, 0, 0, edge, 'source')

      expect(terminal.cell).toBe(cell.id)
      expect(terminal.port).toBe('port1')
      expect(terminal.magnet).toBe('body')
    })

    it('should get edge terminal with selector', () => {
      const magnet = document.createElement('rect')
      magnet.setAttribute('data-selector', 'body')
      sinon.stub(cellView, 'getSelector').returns('rect')

      const edge = new Edge()
      const terminal = cellView.getEdgeTerminal(magnet, 0, 0, edge, 'source')

      expect(terminal.cell).toBe(cell.id)
      expect(terminal.magnet).toBe('body')
    })

    it('should get edge terminal without port or selector', () => {
      const magnet = document.createElement('rect')
      sinon.stub(cellView, 'getSelector').returns('rect')

      const edge = new Edge()
      const terminal = cellView.getEdgeTerminal(magnet, 0, 0, edge, 'source')

      expect(terminal.cell).toBe(cell.id)
      expect(terminal.selector).toBe('rect')
    })

    it('should get magnet from edge terminal with selector', () => {
      const terminal = { selector: 'rect' }
      sinon.stub(cellView, 'findOne').returns(cellView.container)

      const magnet = cellView.getMagnetFromEdgeTerminal(terminal)
      expect(magnet).toBe(cellView.container)
    })

    it('should get magnet from edge terminal with port selector', () => {
      const terminal = { port: 'port1' }
      sinon.stub(cellView, 'findOne').returns(cellView.container)

      const magnet = cellView.getMagnetFromEdgeTerminal(terminal)
      expect(magnet).toBe(cellView.container)
    })
  })

  describe('tools methods', () => {
    it('should check has tools without name', () => {
      expect(cellView.hasTools()).toBe(false)

      cellView.tools = new ToolsView({ tools: [] })
      expect(cellView.hasTools()).toBe(true)
    })

    it('should check has tools with name', () => {
      cellView.tools = new ToolsView({ name: 'test', tools: [] })
      expect(cellView.hasTools('test')).toBe(true)
      expect(cellView.hasTools('other')).toBe(false)
    })

    it('should add tools with ToolsView instance', () => {
      const tools = new ToolsView({ tools: [] })
      const result = cellView.addTools(tools)
      expect(result).toBe(cellView)
      expect(cellView.tools).toBe(tools)
    })

    it('should add tools with options', () => {
      const result = cellView.addTools({ tools: [] })
      expect(result).toBe(cellView)
      expect(cellView.tools).toBeInstanceOf(ToolsView)
    })

    it('should add tools with null', () => {
      cellView.tools = new ToolsView({ tools: [] })
      const result = cellView.addTools(null)
      expect(result).toBe(cellView)
      expect(cellView.tools).toBe(null)
    })

    it('should update tools', () => {
      cellView.tools = new ToolsView({ tools: [] })
      const spy = sinon.spy(cellView.tools, 'update')
      const result = cellView.updateTools()
      expect(spy.called).toBe(true)
      expect(result).toBe(cellView)
      spy.restore()
    })

    it('should update tools when tools is null', () => {
      const result = cellView.updateTools()
      expect(result).toBe(cellView)
    })

    it('should remove tools', () => {
      cellView.tools = new ToolsView({ tools: [] })
      const spy = sinon.spy(cellView.tools, 'remove')
      const result = cellView.removeTools()
      expect(spy.called).toBe(true)
      expect(cellView.tools).toBe(null)
      expect(result).toBe(cellView)
      spy.restore()
    })

    it('should hide tools', () => {
      cellView.tools = new ToolsView({ tools: [] })
      const spy = sinon.spy(cellView.tools, 'hide')
      cellView.hideTools()
      expect(spy.called).toBe(true)
      spy.restore()
    })

    it('should show tools', () => {
      cellView.tools = new ToolsView({ tools: [] })
      const spy = sinon.spy(cellView.tools, 'show')
      cellView.showTools()
      expect(spy.called).toBe(true)
      spy.restore()
    })

    it('should render tools', () => {
      sinon.stub(cell, 'getTools').returns({ tools: [] })
      const spy = sinon.spy(cellView, 'addTools')
      const result = cellView['renderTools']()
      expect(spy.called).toBe(true)
      expect(result).toBe(cellView)
      spy.restore()
    })
  })

  describe('event methods', () => {
    it('should notify events', () => {
      const spy1 = sinon.spy(cellView, 'trigger')
      const spy2 = sinon.spy(graph, 'trigger')

      const args = { view: cellView, cell }
      cellView.notify('cell:click', args)

      expect(spy1.calledWith('cell:click', args)).toBe(true)
      expect(spy2.calledWith('cell:click', args)).toBe(true)

      spy1.restore()
      spy2.restore()
    })

    it('should get event args without position', () => {
      const e = new Event('click')
      const args = cellView['getEventArgs'](e)
      expect(args).toEqual({ e, view: cellView, cell })
    })

    it('should get event args with position', () => {
      const e = new Event('click')
      const args = cellView['getEventArgs'](e, 10, 20)
      expect(args).toEqual({ e, x: 10, y: 20, view: cellView, cell })
    })

    it('should handle onClick', () => {
      const spy = sinon.spy(cellView, 'notify')
      const e = new Event('click') as Dom.ClickEvent
      cellView.onClick(e, 10, 20)
      expect(spy.calledWith('cell:click')).toBe(true)
      spy.restore()
    })

    it('should handle onDblClick', () => {
      const spy = sinon.spy(cellView, 'notify')
      const e = new Event('dblclick') as Dom.DoubleClickEvent
      cellView.onDblClick(e, 10, 20)
      expect(spy.calledWith('cell:dblclick')).toBe(true)
      spy.restore()
    })

    it('should handle onContextMenu', () => {
      const spy = sinon.spy(cellView, 'notify')
      const e = new Event('contextmenu') as Dom.ContextMenuEvent
      cellView.onContextMenu(e, 10, 20)
      expect(spy.calledWith('cell:contextmenu')).toBe(true)
      spy.restore()
    })

    it('should handle onMouseDown', () => {
      const spy = sinon.spy(cellView, 'notify')
      const e = new Event('mousedown') as Dom.MouseDownEvent
      cellView.onMouseDown(e, 10, 20)
      expect(spy.calledWith('cell:mousedown')).toBe(true)
      spy.restore()
    })

    it('should handle onMouseDown with model batch', () => {
      const mockModel = { startBatch: sinon.spy(), stopBatch: sinon.spy() }
      cell.model = mockModel as any

      const e = new Event('mousedown') as Dom.MouseDownEvent
      cellView.onMouseDown(e, 10, 20)
      expect(mockModel.startBatch.calledWith('mouse')).toBe(true)
      expect(cellView['cachedModelForMouseEvent']).toBe(mockModel)
    })

    it('should handle onMouseUp', () => {
      const spy = sinon.spy(cellView, 'notify')
      const e = new Event('mouseup') as Dom.MouseUpEvent
      cellView.onMouseUp(e, 10, 20)
      expect(spy.calledWith('cell:mouseup')).toBe(true)
      spy.restore()
    })

    it('should handle onMouseUp with model batch', () => {
      const mockModel = { startBatch: sinon.spy(), stopBatch: sinon.spy() }
      cellView['cachedModelForMouseEvent'] = mockModel as any

      const e = new Event('mouseup') as Dom.MouseUpEvent
      cellView.onMouseUp(e, 10, 20)
      expect(mockModel.stopBatch.calledWith('mouse', { cell })).toBe(true)
      expect(cellView['cachedModelForMouseEvent']).toBe(null)
    })

    it('should handle onMouseMove', () => {
      const spy = sinon.spy(cellView, 'notify')
      const e = new Event('mousemove') as Dom.MouseMoveEvent
      cellView.onMouseMove(e, 10, 20)
      expect(spy.calledWith('cell:mousemove')).toBe(true)
      spy.restore()
    })

    it('should handle onMouseOver', () => {
      const spy = sinon.spy(cellView, 'notify')
      const e = new Event('mouseover') as Dom.MouseOverEvent
      cellView.onMouseOver(e)
      expect(spy.calledWith('cell:mouseover')).toBe(true)
      spy.restore()
    })

    it('should handle onMouseOut', () => {
      const spy = sinon.spy(cellView, 'notify')
      const e = new Event('mouseout') as Dom.MouseOutEvent
      cellView.onMouseOut(e)
      expect(spy.calledWith('cell:mouseout')).toBe(true)
      spy.restore()
    })

    it('should handle onMouseEnter', () => {
      const spy = sinon.spy(cellView, 'notify')
      const e = new Event('mouseenter') as Dom.MouseEnterEvent
      cellView.onMouseEnter(e)
      expect(spy.calledWith('cell:mouseenter')).toBe(true)
      spy.restore()
    })

    it('should handle onMouseLeave', () => {
      const spy = sinon.spy(cellView, 'notify')
      const e = new Event('mouseleave') as Dom.MouseLeaveEvent
      cellView.onMouseLeave(e)
      expect(spy.calledWith('cell:mouseleave')).toBe(true)
      spy.restore()
    })

    it('should handle onMouseWheel', () => {
      const spy = sinon.spy(cellView, 'notify')
      const e = new Event('wheel')
      cellView.onMouseWheel(e, 10, 20, 1)
      expect(spy.calledWith('cell:mousewheel')).toBe(true)
      spy.restore()
    })

    it('should handle onCustomEvent', () => {
      const spy = sinon.spy(cellView, 'notify')
      const e = new Event('mousedown') as Dom.MouseDownEvent
      cellView.onCustomEvent(e, 'custom:event', 10, 20)
      expect(spy.calledWith('cell:customevent')).toBe(true)
      expect(spy.calledWith('custom:event')).toBe(true)
      spy.restore()
    })

    it('should handle magnet events - empty implementations', () => {
      const e = new Event('mousedown') as Dom.MouseDownEvent
      const magnet = document.createElement('rect')

      // These should not throw
      cellView.onMagnetMouseDown(e, magnet, 10, 20)
      cellView.onMagnetDblClick(e as any, magnet, 10, 20)
      cellView.onMagnetContextMenu(e as any, magnet, 10, 20)
      cellView.onLabelMouseDown(e, 10, 20)
    })

    it('should check mouse leave with same view', () => {
      const e = new Event('mouseleave')
      sinon.stub(cellView, 'getEventTarget').returns(cellView.container)
      sinon.stub(graph, 'findViewByElem').returns(cellView)

      const spy = sinon.spy(cellView, 'onMouseLeave')
      cellView.checkMouseleave(e)
      expect(spy.called).toBe(false)
      spy.restore()
    })

    it('should check mouse leave with different view', () => {
      const e = new Event('mouseleave')
      const otherView = new CellView(new Node(), { graph })

      sinon
        .stub(cellView, 'getEventTarget')
        .returns(document.createElement('div'))
      sinon.stub(graph, 'findViewByElem').returns(otherView)

      const spy1 = sinon.spy(cellView, 'onMouseLeave')
      const spy2 = sinon.spy(otherView, 'onMouseEnter')

      cellView.checkMouseleave(e)
      expect(spy1.called).toBe(true)
      expect(spy2.called).toBe(true)

      spy1.restore()
      spy2.restore()
    })

    it('should check mouse leave with no view', () => {
      const e = new Event('mouseleave')
      sinon
        .stub(cellView, 'getEventTarget')
        .returns(document.createElement('div'))
      sinon.stub(graph, 'findViewByElem').returns(null)

      const spy = sinon.spy(cellView, 'onMouseLeave')
      cellView.checkMouseleave(e)
      expect(spy.called).toBe(true)
      spy.restore()
    })
  })

  describe('dispose', () => {
    it('should remove cell event listener on dispose', () => {
      const spy = sinon.spy(cell, 'off')
      cellView.dispose()
      expect(
        spy.calledWith('changed', cellView['onCellChanged'], cellView),
      ).toBe(true)
      spy.restore()
    })
  })

  describe('toStringTag', () => {
    it('should have correct toString tag', () => {
      expect(cellView[Symbol.toStringTag]).toBe('X6._CellView')
    })
  })

  describe('protected init method', () => {
    it('should call init during construction', () => {
      const spy = sinon.spy(CellView.prototype, 'init')
      new CellView(cell, { graph })
      expect(spy.called).toBe(true)
      spy.restore()
    })
  })

  describe('onRemove', () => {
    it('should remove tools on remove', () => {
      const spy = sinon.spy(cellView, 'removeTools')
      cellView['onRemove']()
      expect(spy.called).toBe(true)
      spy.restore()
    })
  })
})
