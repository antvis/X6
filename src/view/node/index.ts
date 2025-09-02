import { ArrayExt, Dom, FunctionExt } from '../../common'
import { Config } from '../../config'
import { GeometryUtil, Point, Rectangle } from '../../geometry'
import type { Graph } from '../../graph'
import { Cell } from '../../model/cell'
import type { Edge } from '../../model/edge'
import type { Node } from '../../model/node'
import type { PortManager } from '../../model/port'
import type { SimpleAttrs, PortLayout } from '../../registry'
import type { AttrManagerUpdateOptions } from '../attr'
import { CellView } from '../cell'
import type { EdgeView } from '../edge'
import { Markup, type MarkupJSONMarkup, type MarkupSelectors } from '../markup'
import type {
  EventDataMagnet,
  EventDataMousemove,
  EventDataMoving,
  EventDataMovingTargetNode,
  NodeViewEventArgs,
  NodeViewMouseEventArgs,
  NodeViewOptions,
  NodeViewPortCache,
  NodeViewPositionEventArgs,
} from './type'

export class NodeView<
  Entity extends Node = Node,
  Options extends NodeViewOptions = NodeViewOptions,
> extends CellView<Entity, Options> {
  protected portsCache: { [id: string]: NodeViewPortCache } = {}

  public static isNodeView(instance: any): instance is NodeView {
    if (instance == null) {
      return false
    }

    if (instance instanceof NodeView) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const view = instance as NodeView

    if (
      (tag == null || tag === NodeViewToStringTag) &&
      typeof view.isNodeView === 'function' &&
      typeof view.isEdgeView === 'function' &&
      typeof view.confirmUpdate === 'function' &&
      typeof view.update === 'function' &&
      typeof view.findPortElem === 'function' &&
      typeof view.resize === 'function' &&
      typeof view.rotate === 'function' &&
      typeof view.translate === 'function'
    ) {
      return true
    }

    return false
  }

  protected get [Symbol.toStringTag]() {
    return NodeView.toStringTag
  }

  protected getContainerClassName() {
    const classList = [
      super.getContainerClassName(),
      this.prefixClassName('node'),
    ]
    if (!this.can('nodeMovable')) {
      classList.push(this.prefixClassName('node-immovable'))
    }
    return classList.join(' ')
  }

  protected updateClassName(e: Dom.MouseEnterEvent) {
    const target = e.target
    if (target.hasAttribute('magnet')) {
      // port
      const className = this.prefixClassName('port-unconnectable')
      if (this.can('magnetConnectable')) {
        Dom.removeClass(target, className)
      } else {
        Dom.addClass(target, className)
      }
    } else {
      // node
      const className = this.prefixClassName('node-immovable')
      if (this.can('nodeMovable')) {
        this.removeClass(className)
      } else {
        this.addClass(className)
      }
    }
  }

  isNodeView(): this is NodeView {
    return true
  }

  confirmUpdate(flag: number, options: any = {}) {
    let ret = flag
    if (this.hasAction(ret, 'ports')) {
      this.removePorts()
      this.cleanPortsCache()
    }

    if (this.hasAction(ret, 'render')) {
      this.render()
      ret = this.removeAction(ret, [
        'render',
        'update',
        'resize',
        'translate',
        'rotate',
        'ports',
        'tools',
      ])
    } else {
      ret = this.handleAction(
        ret,
        'resize',
        () => this.resize(),
        'update', // Resize method is calling `update()` internally
      )

      ret = this.handleAction(
        ret,
        'update',
        () => this.update(),
        // `update()` will render ports when useCSSSelectors are enabled
        Config.useCSSSelector ? 'ports' : null,
      )

      ret = this.handleAction(ret, 'translate', () => this.translate())
      ret = this.handleAction(ret, 'rotate', () => this.rotate())
      ret = this.handleAction(ret, 'ports', () => this.renderPorts())
      ret = this.handleAction(ret, 'tools', () => {
        if (this.getFlag('tools') === flag) {
          this.renderTools()
        } else {
          this.updateTools(options)
        }
      })
    }

    return ret
  }

  update(partialAttrs?: CellAttrs) {
    this.cleanCache()

    // When CSS selector strings are used, make sure no rule matches port nodes.
    if (Config.useCSSSelector) {
      this.removePorts()
    }

    const node = this.cell
    const size = node.getSize()
    const attrs = node.getAttrs()
    this.updateAttrs(this.container, attrs, {
      attrs: partialAttrs === attrs ? null : partialAttrs,
      rootBBox: new Rectangle(0, 0, size.width, size.height),
      selectors: this.selectors,
    })

    if (Config.useCSSSelector) {
      this.renderPorts()
    }
  }

  protected renderMarkup() {
    const markup = this.cell.markup
    if (markup) {
      if (typeof markup === 'string') {
        throw new TypeError('Not support string markup.')
      }

      return this.renderJSONMarkup(markup)
    }

    throw new TypeError('Invalid node markup.')
  }

  protected renderJSONMarkup(markup: MarkupJSONMarkup | MarkupJSONMarkup[]) {
    const ret = this.parseJSONMarkup(markup, this.container)
    this.selectors = ret.selectors
    this.container.appendChild(ret.fragment)
  }

  render() {
    this.empty()
    this.renderMarkup()

    this.resize()
    this.updateTransform()

    if (!Config.useCSSSelector) {
      this.renderPorts()
    }

    this.renderTools()

    return this
  }

  resize() {
    if (this.cell.getAngle()) {
      this.rotate()
    }

    this.update()
  }

  translate() {
    this.updateTransform()
  }

  rotate() {
    this.updateTransform()
  }

  protected getTranslationString() {
    const position = this.cell.getPosition()
    return `translate(${position.x},${position.y})`
  }

  protected getRotationString() {
    const angle = this.cell.getAngle()
    if (angle) {
      const size = this.cell.getSize()
      return `rotate(${angle},${size.width / 2},${size.height / 2})`
    }
  }

  protected updateTransform() {
    let transform = this.getTranslationString()
    const rot = this.getRotationString()
    if (rot) {
      transform += ` ${rot}`
    }
    this.container.setAttribute('transform', transform)
  }

  // #region ports

  findPortElem(portId?: string, selector?: string) {
    const cache = portId ? this.portsCache[portId] : null
    if (!cache) {
      return null
    }
    const portRoot = cache.portContentElement
    const portSelectors = cache.portContentSelectors || {}
    return this.findOne(selector, portRoot, portSelectors)
  }

  protected cleanPortsCache() {
    this.portsCache = {}
  }

  protected removePorts() {
    Object.values(this.portsCache).forEach((cached) => {
      Dom.remove(cached.portElement)
    })
  }

  protected renderPorts() {
    const container = this.container
    // References to rendered elements without z-index
    const references: Element[] = []
    container.childNodes.forEach((child) => {
      references.push(child as Element)
    })
    const parsedPorts = this.cell.getParsedPorts()
    const portsGropsByZ = ArrayExt.groupBy(parsedPorts, 'zIndex')
    const autoZIndexKey = 'auto'

    // render non-z first
    if (portsGropsByZ[autoZIndexKey]) {
      portsGropsByZ[autoZIndexKey].forEach((port: PortManager.Port) => {
        const portElement = this.getPortElement(port)
        container.append(portElement)
        references.push(portElement)
      })
    }

    Object.keys(portsGropsByZ).forEach((key) => {
      if (key !== autoZIndexKey) {
        const zIndex = parseInt(key, 10)
        this.appendPorts(portsGropsByZ[key], zIndex, references)
      }
    })

    this.updatePorts()
  }

  protected appendPorts(
    ports: PortManager.Port[],
    zIndex: number,
    refs: Element[],
  ) {
    const elems = ports.map((p) => this.getPortElement(p))
    if (refs[zIndex] || zIndex < 0) {
      Dom.before(refs[Math.max(zIndex, 0)], elems)
    } else {
      Dom.append(this.container, elems)
    }
  }

  protected getPortElement(port: PortManager.Port) {
    const cached = this.portsCache[port.id]
    if (cached) {
      return cached.portElement
    }

    return this.createPortElement(port)
  }

  protected createPortElement(port: PortManager.Port) {
    let renderResult = Markup.renderMarkup(this.cell.getPortContainerMarkup())
    const portElement = renderResult.elem
    if (portElement == null) {
      throw new Error('Invalid port container markup.')
    }

    renderResult = Markup.renderMarkup(this.getPortMarkup(port))
    const portContentElement = renderResult.elem
    const portContentSelectors = renderResult.selectors

    if (portContentElement == null) {
      throw new Error('Invalid port markup.')
    }

    this.setAttrs(
      {
        port: port.id,
        'port-group': port.group,
      },
      portContentElement,
    )

    let portClass = 'x6-port'
    if (port.group) {
      portClass += ` x6-port-${port.group}`
    }
    Dom.addClass(portElement, portClass)
    Dom.addClass(portElement, 'x6-port')
    Dom.addClass(portContentElement, 'x6-port-body')
    portElement.appendChild(portContentElement)

    let portSelectors: MarkupSelectors | undefined = portContentSelectors
    let portLabelElement: Element | undefined
    let portLabelSelectors: MarkupSelectors | null | undefined
    const existLabel = this.existPortLabel(port)
    if (existLabel) {
      renderResult = Markup.renderMarkup(this.getPortLabelMarkup(port.label))
      portLabelElement = renderResult.elem
      portLabelSelectors = renderResult.selectors
      if (portLabelElement == null) {
        throw new Error('Invalid port label markup.')
      }
      if (portContentSelectors && portLabelSelectors) {
        // eslint-disable-next-line
        for (const key in portLabelSelectors) {
          if (portContentSelectors[key] && key !== this.rootSelector) {
            throw new Error('Selectors within port must be unique.')
          }
        }
        portSelectors = {
          ...portContentSelectors,
          ...portLabelSelectors,
        }
      }
      Dom.addClass(portLabelElement, 'x6-port-label')
      portElement.appendChild(portLabelElement)
    }

    this.portsCache[port.id] = {
      portElement,
      portSelectors,
      portLabelElement,
      portLabelSelectors,
      portContentElement,
      portContentSelectors,
    }

    if (this.graph.options.onPortRendered) {
      this.graph.options.onPortRendered({
        port,
        node: this.cell,
        container: portElement,
        selectors: portSelectors,
        labelContainer: portLabelElement,
        labelSelectors: portLabelSelectors,
        contentContainer: portContentElement,
        contentSelectors: portContentSelectors,
      })
    }

    return portElement
  }

  protected updatePorts() {
    const groups = this.cell.getParsedGroups()
    const groupList = Object.keys(groups)
    if (groupList.length === 0) {
      this.updatePortGroup()
    } else {
      groupList.forEach((groupName) => {
        this.updatePortGroup(groupName)
      })
    }
  }

  protected updatePortGroup(groupName?: string) {
    const bbox = Rectangle.fromSize(this.cell.getSize())
    const metrics = this.cell.getPortsLayoutByGroup(groupName, bbox)

    for (let i = 0, n = metrics.length; i < n; i += 1) {
      const metric = metrics[i]
      const portId = metric.portId
      const cached = this.portsCache[portId] || {}
      const portLayout = metric.portLayout
      // @ts-expect-error
      this.applyPortTransform(cached.portElement, portLayout)
      if (metric.portAttrs != null) {
        const options: Partial<AttrManagerUpdateOptions> = {
          // @ts-expect-error
          selectors: cached.portSelectors || {},
        }

        if (metric.portSize) {
          options.rootBBox = Rectangle.fromSize(metric.portSize)
        }

        // @ts-expect-error
        this.updateAttrs(cached.portElement, metric.portAttrs, options)
      }

      const labelLayout = metric.labelLayout
      // @ts-expect-error
      if (labelLayout && cached.portLabelElement) {
        this.applyPortTransform(
          // @ts-expect-error
          cached.portLabelElement,
          labelLayout,
          -(portLayout.angle || 0),
        )

        if (labelLayout.attrs) {
          const options: Partial<AttrManagerUpdateOptions> = {
            // @ts-expect-error
            selectors: cached.portLabelSelectors || {},
          }

          if (metric.labelSize) {
            options.rootBBox = Rectangle.fromSize(metric.labelSize)
          }

          // @ts-expect-error
          this.updateAttrs(cached.portLabelElement, labelLayout.attrs, options)
        }
      }
    }
  }

  protected applyPortTransform(
    element: Element,
    layout: PortLayout.Result,
    initialAngle = 0,
  ) {
    const angle = layout.angle
    const position = layout.position
    const matrix = Dom.createSVGMatrix()
      .rotate(initialAngle)
      .translate(position.x || 0, position.y || 0)
      .rotate(angle || 0)

    Dom.transform(element as SVGElement, matrix, { absolute: true })
  }

  protected getPortMarkup(port: PortManager.Port) {
    return port.markup || this.cell.portMarkup
  }

  protected getPortLabelMarkup(label: PortManager.Label) {
    return label.markup || this.cell.portLabelMarkup
  }

  protected existPortLabel(port: PortManager.Port) {
    return port.attrs && port.attrs.text
  }

  // #endregion

  // #region events

  protected getEventArgs<E>(e: E): NodeViewMouseEventArgs<E>
  protected getEventArgs<E>(
    e: E,
    x: number,
    y: number,
  ): NodeViewPositionEventArgs<E>
  protected getEventArgs<E>(e: E, x?: number, y?: number) {
    const view = this // eslint-disable-line
    const node = view.cell
    const cell = node
    if (x == null || y == null) {
      return { e, view, node, cell } as NodeViewMouseEventArgs<E>
    }
    return { e, x, y, view, node, cell } as NodeViewPositionEventArgs<E>
  }

  protected getPortEventArgs<E>(
    e: E,
    port: string,
    pos?: { x: number; y: number },
  ): NodeViewPositionEventArgs<E> | NodeViewMouseEventArgs<E> {
    const view = this // eslint-disable-line
    const node = view.cell
    const cell = node
    if (pos) {
      return {
        e,
        x: pos.x,
        y: pos.y,
        view,
        node,
        cell,
        port,
      } as NodeViewPositionEventArgs<E>
    }
    return { e, view, node, cell, port } as NodeViewMouseEventArgs<E>
  }

  notifyMouseDown(e: Dom.MouseDownEvent, x: number, y: number) {
    super.onMouseDown(e, x, y)
    this.notify('node:mousedown', this.getEventArgs(e, x, y))
  }

  notifyMouseMove(e: Dom.MouseMoveEvent, x: number, y: number) {
    super.onMouseMove(e, x, y)
    this.notify('node:mousemove', this.getEventArgs(e, x, y))
  }

  notifyMouseUp(e: Dom.MouseUpEvent, x: number, y: number) {
    super.onMouseUp(e, x, y)
    this.notify('node:mouseup', this.getEventArgs(e, x, y))
  }

  notifyPortEvent(
    name: string,
    e: Dom.EventObject,
    pos?: { x: number; y: number },
  ) {
    const port = this.findAttr('port', e.target)
    if (port) {
      const originType = e.type
      if (name === 'node:port:mouseenter') {
        e.type = 'mouseenter'
      } else if (name === 'node:port:mouseleave') {
        e.type = 'mouseleave'
      }
      this.notify(name, this.getPortEventArgs(e, port, pos))
      e.type = originType
    }
  }

  onClick(e: Dom.ClickEvent, x: number, y: number) {
    super.onClick(e, x, y)
    this.notify('node:click', this.getEventArgs(e, x, y))
    this.notifyPortEvent('node:port:click', e, { x, y })
  }

  onDblClick(e: Dom.DoubleClickEvent, x: number, y: number) {
    super.onDblClick(e, x, y)
    this.notify('node:dblclick', this.getEventArgs(e, x, y))
    this.notifyPortEvent('node:port:dblclick', e, { x, y })
  }

  onContextMenu(e: Dom.ContextMenuEvent, x: number, y: number) {
    super.onContextMenu(e, x, y)
    this.notify('node:contextmenu', this.getEventArgs(e, x, y))
    this.notifyPortEvent('node:port:contextmenu', e, { x, y })
  }

  onMouseDown(e: Dom.MouseDownEvent, x: number, y: number) {
    if (this.isPropagationStopped(e)) {
      return
    }
    this.notifyMouseDown(e, x, y)
    this.notifyPortEvent('node:port:mousedown', e, { x, y })
    this.startNodeDragging(e, x, y)
  }

  onMouseMove(e: Dom.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData<EventDataMousemove>(e)
    const action = data.action
    if (action === 'magnet') {
      this.dragMagnet(e, x, y)
    } else {
      if (action === 'move') {
        const meta = data as EventDataMoving
        const view = meta.targetView || this
        view.dragNode(e, x, y)
        view.notify('node:moving', {
          e,
          x,
          y,
          view,
          cell: view.cell,
          node: view.cell,
        })
      }
      this.notifyMouseMove(e, x, y)
      this.notifyPortEvent('node:port:mousemove', e, { x, y })
    }

    this.setEventData<EventDataMousemove>(e, data)
  }

  onMouseUp(e: Dom.MouseUpEvent, x: number, y: number) {
    const data = this.getEventData<EventDataMousemove>(e)
    const action = data.action
    if (action === 'magnet') {
      this.stopMagnetDragging(e, x, y)
    } else {
      this.notifyMouseUp(e, x, y)
      this.notifyPortEvent('node:port:mouseup', e, { x, y })
      if (action === 'move') {
        const meta = data as EventDataMoving
        const view = meta.targetView || this
        view.stopNodeDragging(e, x, y)
      }
    }

    const magnet = (data as EventDataMagnet).targetMagnet
    if (magnet) {
      this.onMagnetClick(e, magnet, x, y)
    }

    this.checkMouseleave(e)
  }

  onMouseOver(e: Dom.MouseOverEvent) {
    super.onMouseOver(e)
    this.notify('node:mouseover', this.getEventArgs(e))
    // mock mouseenter event,so we can get correct trigger time when move mouse from node to port
    // wo also need to change e.type for use get correct event args
    this.notifyPortEvent('node:port:mouseenter', e)
    this.notifyPortEvent('node:port:mouseover', e)
  }

  onMouseOut(e: Dom.MouseOutEvent) {
    super.onMouseOut(e)
    this.notify('node:mouseout', this.getEventArgs(e))
    // mock mouseleave event,so we can get correct trigger time when move mouse from port to node
    // wo also need to change e.type for use get correct event args
    this.notifyPortEvent('node:port:mouseleave', e)
    this.notifyPortEvent('node:port:mouseout', e)
  }

  onMouseEnter(e: Dom.MouseEnterEvent) {
    this.updateClassName(e)
    super.onMouseEnter(e)
    this.notify('node:mouseenter', this.getEventArgs(e))
  }

  onMouseLeave(e: Dom.MouseLeaveEvent) {
    super.onMouseLeave(e)
    this.notify('node:mouseleave', this.getEventArgs(e))
  }

  onMouseWheel(e: Dom.EventObject, x: number, y: number, delta: number) {
    super.onMouseWheel(e, x, y, delta)
    this.notify('node:mousewheel', {
      delta,
      ...this.getEventArgs(e, x, y),
    })
  }

  onMagnetClick(e: Dom.MouseUpEvent, magnet: Element, x: number, y: number) {
    const graph = this.graph
    const count = graph.view.getMouseMovedCount(e)
    if (count > graph.options.clickThreshold) {
      return
    }
    this.notify('node:magnet:click', {
      magnet,
      ...this.getEventArgs(e, x, y),
    })
  }

  onMagnetDblClick(
    e: Dom.DoubleClickEvent,
    magnet: Element,
    x: number,
    y: number,
  ) {
    this.notify('node:magnet:dblclick', {
      magnet,
      ...this.getEventArgs(e, x, y),
    })
  }

  onMagnetContextMenu(
    e: Dom.ContextMenuEvent,
    magnet: Element,
    x: number,
    y: number,
  ) {
    this.notify('node:magnet:contextmenu', {
      magnet,
      ...this.getEventArgs(e, x, y),
    })
  }

  onMagnetMouseDown(
    e: Dom.MouseDownEvent,
    magnet: Element,
    x: number,
    y: number,
  ) {
    this.startMagnetDragging(e, x, y)
  }

  onCustomEvent(e: Dom.MouseDownEvent, name: string, x: number, y: number) {
    this.notify('node:customevent', { name, ...this.getEventArgs(e, x, y) })
    super.onCustomEvent(e, name, x, y)
  }

  protected prepareEmbedding(e: Dom.MouseMoveEvent) {
    const graph = this.graph
    const data = this.getEventData<EventDataMovingTargetNode>(e)
    const node = data.cell || this.cell
    const view = graph.findViewByCell(node)
    const localPoint = graph.snapToGrid(e.clientX, e.clientY)

    this.notify('node:embed', {
      e,
      node,
      view,
      cell: node,
      x: localPoint.x,
      y: localPoint.y,
      currentParent: node.getParent(),
    })
  }

  processEmbedding(e: Dom.MouseMoveEvent, data: EventDataMovingTargetNode) {
    const cell = data.cell || this.cell
    const graph = data.graph || this.graph
    const options = graph.options.embedding
    const findParent = options.findParent

    let candidates =
      typeof findParent === 'function'
        ? (
            FunctionExt.call(findParent, graph, {
              view: this,
              node: this.cell,
            }) as Cell[]
          ).filter((c) => {
            return (
              Cell.isCell(c) &&
              this.cell.id !== c.id &&
              !c.isDescendantOf(this.cell)
            )
          })
        : graph.model.getNodesUnderNode(cell, {
            by: findParent as Rectangle.KeyPoint,
          })

    // Picks the node with the highest `z` index
    if (options.frontOnly) {
      if (candidates.length > 0) {
        const zIndexMap = ArrayExt.groupBy(candidates, 'zIndex')
        const maxZIndex = ArrayExt.max(
          Object.keys(zIndexMap).map((z) => parseInt(z, 10)),
        )
        if (maxZIndex) {
          candidates = zIndexMap[maxZIndex]
        }
      }
    }

    // Filter the nodes which is invisiable
    candidates = candidates.filter((candidate) => candidate.visible)

    let newCandidateView = null
    const prevCandidateView = data.candidateEmbedView
    const validateEmbeding = options.validate
    for (let i = candidates.length - 1; i >= 0; i -= 1) {
      const candidate = candidates[i]

      if (prevCandidateView && prevCandidateView.cell.id === candidate.id) {
        // candidate remains the same
        newCandidateView = prevCandidateView
        break
      } else {
        const view = candidate.findView(graph) as NodeView
        if (
          validateEmbeding &&
          FunctionExt.call(validateEmbeding, graph, {
            child: this.cell,
            parent: view.cell,
            childView: this,
            parentView: view,
          })
        ) {
          // flip to the new candidate
          newCandidateView = view
          break
        }
      }
    }

    this.clearEmbedding(data)
    if (newCandidateView) {
      newCandidateView.highlight(null, { type: 'embedding' })
    }
    data.candidateEmbedView = newCandidateView

    const localPoint = graph.snapToGrid(e.clientX, e.clientY)
    this.notify('node:embedding', {
      e,
      cell,
      node: cell,
      view: graph.findViewByCell(cell),
      x: localPoint.x,
      y: localPoint.y,
      currentParent: cell.getParent(),
      candidateParent: newCandidateView ? newCandidateView.cell : null,
    })
  }

  clearEmbedding(data: EventDataMovingTargetNode) {
    const candidateView = data.candidateEmbedView
    if (candidateView) {
      candidateView.unhighlight(null, { type: 'embedding' })
      data.candidateEmbedView = null
    }
  }

  finalizeEmbedding(e: Dom.MouseUpEvent, data: EventDataMovingTargetNode) {
    this.graph.startBatch('embedding')
    const cell = data.cell || this.cell
    const graph = data.graph || this.graph
    const view = graph.findViewByCell(cell)
    const parent = cell.getParent()
    const candidateView = data.candidateEmbedView
    if (candidateView) {
      // Candidate view is chosen to become the parent of the node.
      candidateView.unhighlight(null, { type: 'embedding' })
      data.candidateEmbedView = null
      if (parent == null || parent.id !== candidateView.cell.id) {
        candidateView.cell.insertChild(cell, undefined, { ui: true })
      }
    } else if (parent) {
      parent.unembed(cell, { ui: true })
    }

    graph.model.getConnectedEdges(cell, { deep: true }).forEach((edge) => {
      edge.updateParent({ ui: true })
    })

    if (view && candidateView) {
      const localPoint = graph.snapToGrid(e.clientX, e.clientY)
      view.notify('node:embedded', {
        e,
        cell,
        x: localPoint.x,
        y: localPoint.y,
        node: cell,
        view: graph.findViewByCell(cell),
        previousParent: parent,
        currentParent: cell.getParent(),
      })
    }

    this.graph.stopBatch('embedding')
  }

  getDelegatedView() {
    let cell = this.cell
    let view: NodeView = this // eslint-disable-line

    while (view) {
      if (cell.isEdge()) {
        break
      }
      if (!cell.hasParent() || view.can('stopDelegateOnDragging')) {
        return view
      }
      cell = cell.getParent() as Entity
      view = this.graph.findViewByCell(cell) as NodeView
    }

    return null
  }

  protected validateMagnet(
    cellView: CellView,
    magnet: Element,
    e: Dom.MouseDownEvent | Dom.MouseEnterEvent,
  ) {
    if (magnet.getAttribute('magnet') !== 'passive') {
      const validate = this.graph.options.connecting.validateMagnet
      if (validate) {
        return FunctionExt.call(validate, this.graph, {
          e,
          magnet,
          view: cellView,
          cell: cellView.cell,
        })
      }
      return true
    }
    return false
  }

  protected startMagnetDragging(e: Dom.MouseDownEvent, x: number, y: number) {
    if (!this.can('magnetConnectable')) {
      return
    }

    e.stopPropagation()

    const magnet = e.currentTarget
    const graph = this.graph

    this.setEventData<Partial<EventDataMagnet>>(e, {
      targetMagnet: magnet,
    })

    if (this.validateMagnet(this, magnet, e)) {
      // @ts-expect-error
      if (graph.options.magnetThreshold <= 0) {
        this.startConnectting(e, magnet, x, y)
      }

      this.setEventData<Partial<EventDataMagnet>>(e, {
        action: 'magnet',
      })
      this.stopPropagation(e)
    } else {
      this.onMouseDown(e, x, y)
    }

    graph.view.delegateDragEvents(e, this)
  }

  protected startConnectting(
    e: Dom.MouseDownEvent,
    magnet: Element,
    x: number,
    y: number,
  ) {
    this.graph.model.startBatch('add-edge')
    const edgeView = this.createEdgeFromMagnet(magnet, x, y)
    edgeView.setEventData(
      e,
      edgeView.prepareArrowheadDragging('target', {
        x,
        y,
        isNewEdge: true,
        fallbackAction: 'remove',
      }),
    )
    this.setEventData<Partial<EventDataMagnet>>(e, { edgeView })
    edgeView.notifyMouseDown(e, x, y)
  }

  protected getDefaultEdge(sourceView: CellView, sourceMagnet: Element) {
    let edge: Edge | undefined | null | void

    const create = this.graph.options.connecting.createEdge
    if (create) {
      edge = FunctionExt.call(create, this.graph, {
        sourceMagnet,
        sourceView,
        sourceCell: sourceView.cell,
      })
    }

    return edge as Edge
  }

  protected createEdgeFromMagnet(magnet: Element, x: number, y: number) {
    const graph = this.graph
    const model = graph.model
    const edge = this.getDefaultEdge(this, magnet)

    edge.setSource({
      ...edge.getSource(),
      ...this.getEdgeTerminal(magnet, x, y, edge, 'source'),
    })
    edge.setTarget({ ...edge.getTarget(), x, y })
    edge.addTo(model, { async: false, ui: true })

    return edge.findView(graph) as EdgeView
  }

  protected dragMagnet(e: Dom.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData<EventDataMagnet>(e)
    const edgeView = data.edgeView
    if (edgeView) {
      edgeView.onMouseMove(e, x, y)
      this.autoScrollGraph(e.clientX, e.clientY)
    } else {
      const graph = this.graph
      const magnetThreshold = graph.options.magnetThreshold as any
      const currentTarget = this.getEventTarget(e)
      const targetMagnet = data.targetMagnet

      // magnetThreshold when the pointer leaves the magnet
      if (magnetThreshold === 'onleave') {
        if (
          targetMagnet === currentTarget ||
          targetMagnet.contains(currentTarget)
        ) {
          return
        }
        // eslint-disable-next-line no-lonely-if
      } else {
        // magnetThreshold defined as a number of movements
        if (graph.view.getMouseMovedCount(e) <= magnetThreshold) {
          return
        }
      }
      this.startConnectting(e as any, targetMagnet, x, y)
    }
  }

  protected stopMagnetDragging(e: Dom.MouseUpEvent, x: number, y: number) {
    const data = this.eventData<EventDataMagnet>(e)
    const edgeView = data.edgeView
    if (edgeView) {
      edgeView.onMouseUp(e, x, y)
      this.graph.model.stopBatch('add-edge')
    }
  }

  protected notifyUnhandledMouseDown(
    e: Dom.MouseDownEvent,
    x: number,
    y: number,
  ) {
    this.notify('node:unhandled:mousedown', {
      e,
      x,
      y,
      view: this,
      cell: this.cell,
      node: this.cell,
    })
  }

  protected notifyNodeMove<Key extends keyof NodeViewEventArgs>(
    name: Key,
    e: Dom.MouseMoveEvent | Dom.MouseUpEvent,
    x: number,
    y: number,
    cell: Cell,
  ) {
    let cells = [cell]

    const selection = this.graph.getPlugin<any>('selection')
    if (selection && selection.isSelectionMovable()) {
      const selectedCells = selection.getSelectedCells()
      if (selectedCells.includes(cell)) {
        cells = selectedCells.filter((c: Cell) => c.isNode())
      }
    }

    cells.forEach((c: Cell) => {
      this.notify(name, {
        e,
        x,
        y,
        cell: c,
        node: c,
        view: c.findView(this.graph),
      })
    })
  }

  protected getRestrictArea(view?: NodeView): Rectangle.RectangleLike | null {
    const restrict = this.graph.options.translating.restrict
    const area =
      typeof restrict === 'function'
        ? FunctionExt.call(restrict, this.graph, view!)
        : restrict

    if (typeof area === 'number') {
      return this.graph.transform.getGraphArea().inflate(area)
    }

    if (area === true) {
      return this.graph.transform.getGraphArea()
    }

    return area || null
  }

  protected startNodeDragging(e: Dom.MouseDownEvent, x: number, y: number) {
    const targetView = this.getDelegatedView()
    if (targetView == null || !targetView.can('nodeMovable')) {
      return this.notifyUnhandledMouseDown(e, x, y)
    }

    this.setEventData<EventDataMoving>(e, {
      targetView,
      action: 'move',
    })

    const position = Point.create(targetView.cell.getPosition())
    targetView.setEventData<EventDataMovingTargetNode>(e, {
      moving: false,
      offset: position.diff(x, y),
      restrict: this.getRestrictArea(targetView),
    })
  }

  protected dragNode(e: Dom.MouseMoveEvent, x: number, y: number) {
    const node = this.cell
    const graph = this.graph
    const gridSize = graph.getGridSize()
    const data = this.getEventData<EventDataMovingTargetNode>(e)
    const offset = data.offset
    const restrict = data.restrict

    if (!data.moving) {
      data.moving = true
      this.addClass('node-moving')
      this.notifyNodeMove('node:move', e, x, y, this.cell)
    }

    this.autoScrollGraph(e.clientX, e.clientY)

    const posX = GeometryUtil.snapToGrid(x + offset.x, gridSize)
    const posY = GeometryUtil.snapToGrid(y + offset.y, gridSize)
    node.setPosition(posX, posY, {
      restrict,
      deep: true,
      ui: true,
    })

    if (graph.options.embedding.enabled) {
      if (!data.embedding) {
        this.prepareEmbedding(e)
        data.embedding = true
      }
      this.processEmbedding(e, data)
    }
  }

  protected autoOffsetNode() {
    const node = this.cell
    const graph = this.graph
    const nodePosition = { id: node.id, ...node.getPosition() }
    const allNodes = graph.getNodes()
    const restNodePositions = allNodes
      .map((node) => {
        const pos = node.getPosition()
        return { id: node.id, x: pos.x, y: pos.y }
      })
      .filter((pos) => {
        return pos.id !== nodePosition.id
      })
    /** offset directions: right bottom, right top, left bottom, left top */
    const directions = [
      [1, 1], // offset to right bottom
      [1, -1], // offset to right top
      [-1, 1], // offset to left bottom
      [-1, -1], // offset to left top
    ]
    let step = graph.getGridSize()
    const hasSamePosition = (position: { x: number; y: number }) =>
      restNodePositions.some((pos) => {
        return pos.x === position.x && pos.y === position.y
      })
    while (hasSamePosition(nodePosition)) {
      let found = false
      for (let i = 0; i < directions.length; i += 1) {
        const dir = directions[i]
        const position = {
          x: nodePosition.x + dir[0] * step,
          y: nodePosition.y + dir[1] * step,
        }
        if (!hasSamePosition(position)) {
          node.translate(dir[0] * step, dir[1] * step)
          found = true
          break
        }
      }
      if (found) {
        break
      }
      step += graph.getGridSize()
    }
  }

  protected stopNodeDragging(e: Dom.MouseUpEvent, x: number, y: number) {
    const data = this.getEventData<EventDataMovingTargetNode>(e)
    const graph = this.graph
    if (data.embedding) {
      this.finalizeEmbedding(e, data)
    }

    if (data.moving) {
      const autoOffset = graph.options.translating.autoOffset
      if (autoOffset) {
        this.autoOffsetNode()
      }
      this.removeClass('node-moving')
      this.notifyNodeMove('node:moved', e, x, y, this.cell)
    }

    data.moving = false
    data.embedding = false
  }

  // eslint-disable-next-line
  protected autoScrollGraph(x: number, y: number) {
    const scroller = this.graph.getPlugin<any>('scroller')
    if (scroller) {
      scroller.autoScroll(x, y)
    }
  }

  // #endregion
}

export const NodeViewToStringTag = `X6.${NodeView.name}`

NodeView.config({
  isSvgElement: true,
  priority: 0,
  bootstrap: ['render'],
  actions: {
    view: ['render'],
    markup: ['render'],
    attrs: ['update'],
    size: ['resize', 'ports', 'tools'],
    angle: ['rotate', 'tools'],
    position: ['translate', 'tools'],
    ports: ['ports'],
    tools: ['tools'],
  },
})

NodeView.registry.register('node', NodeView, true)
