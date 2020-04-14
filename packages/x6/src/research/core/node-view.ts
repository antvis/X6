import { ArrayExt } from '../../util'
import { Rectangle, Point } from '../../geometry'
import { v } from '../../v'
import { Attr } from '../attr'
import { View } from './view'
import { Cell } from './cell'
import { Node } from './node'
import { Graph } from './graph'
import { CellView } from './cell-view'
import { EdgeView } from './edge-view'
import { Markup } from './markup'
import { Globals } from './globals'
import { PortData } from './port-data'
import { CellViewAttr } from './cell-view-attr'
import { snapToGrid } from '../../geometry/util'

export class NodeView<
  C extends Node = Node,
  Options extends NodeView.Options = NodeView.Options
> extends CellView<C, Options> {
  protected readonly portMarkup = Markup.portMarkup
  protected readonly portLabelMarkup = Markup.portLabelMarkup
  protected readonly portContainerMarkup = Markup.portContainerMarkup
  protected readonly rotatableSelector: string = 'rotatable'
  protected readonly scalableSelector: string = 'scalable'
  public scalableNode: Element | null = null
  public rotatableNode: Element | null = null

  protected portsCache: { [id: string]: NodeView.PortCache } = {}

  protected getContainerClassName() {
    return [super.getContainerClassName(), this.prefixClassName('node')].join(
      ' ',
    )
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
      // this.updateTools(opt)
      ret = this.removeAction(ret, [
        'render',
        'update',
        'resize',
        'translate',
        'rotate',
        'ports',
      ])
    } else {
      ret = this.handleAction(
        ret,
        'resize',
        () => this.resize(options),
        'update', // Resize method is calling `update()` internally
      )

      ret = this.handleAction(
        ret,
        'update',
        () => this.update(),
        // `update()` will render ports when useCSSSelectors are enabled
        Globals.useCSSSelector ? 'ports' : null,
      )

      ret = this.handleAction(ret, 'translate', () => this.translate())
      ret = this.handleAction(ret, 'rotate', () => this.rotate())
      ret = this.handleAction(ret, 'ports', () => this.renderPorts())
    }

    if (this.hasAction(ret, 'tools')) {
      // this.updateTools(options)
      ret = this.removeAction(ret, 'tools')
    }

    return ret
  }

  update(partialAttrs?: Attr.CellAttrs) {
    this.cleanCache()

    // When CSS selector strings are used, make sure no rule matches port nodes.
    if (Globals.useCSSSelector) {
      this.removePorts()
    }

    const node = this.cell
    const size = node.size
    const attrs = node.attrs || {}
    this.updateAttrs(this.container, attrs, {
      attrs: partialAttrs === attrs ? null : partialAttrs,
      rootBBox: new Rectangle(0, 0, size.width, size.height),
      selectors: this.selectors,
      scalableNode: this.scalableNode,
      rotatableNode: this.rotatableNode,
    })

    if (Globals.useCSSSelector) {
      this.renderPorts()
    }
  }

  protected renderMarkup() {
    const markup = this.cell.markup
    if (markup) {
      if (typeof markup === 'string') {
        return this.renderStringMarkup(markup)
      }

      return this.renderJSONMarkup(markup)
    }

    throw new TypeError('Invalid node markup.')
  }

  protected renderJSONMarkup(markup: Markup.JSONMarkup | Markup.JSONMarkup[]) {
    const ret = this.parseJSONMarkup(markup, this.container)
    const one = (elems: Element | Element[] | null) =>
      Array.isArray(elems) ? elems[0] : elems
    this.selectors = ret.selectors
    this.rotatableNode = one(this.selectors[this.rotatableSelector])
    this.scalableNode = one(this.selectors[this.scalableSelector])
    this.container.appendChild(ret.fragment)
  }

  protected renderStringMarkup(markup: string) {
    v.append(this.container, v.batch(markup))
    this.rotatableNode = v.findOne(this.container, `.${this.rotatableSelector}`)
    this.scalableNode = v.findOne(this.container, `.${this.scalableSelector}`)
    this.selectors = {}
    if (this.rootSelector) {
      this.selectors[this.rootSelector] = this.container
    }
  }

  render() {
    this.empty()
    this.renderMarkup()

    if (this.scalableNode) {
      // Double update is necessary for elements with the scalable group only
      // Note the resize() triggers the other `update`.
      this.update()
    }

    this.resize()

    if (this.rotatableNode) {
      // Translate transformation is applied on `this.el` while the rotation
      // transformation on `this.rotatableNode`
      this.rotate()
      this.translate()
    } else {
      this.updateTransform()
    }

    if (!Globals.useCSSSelector) {
      this.renderPorts()
    }

    return this
  }

  resize(opt: any = {}) {
    if (this.scalableNode) {
      return this.updateSize(opt)
    }

    if (this.cell.rotation) {
      this.rotate()
    }

    this.update()
  }

  translate() {
    if (this.rotatableNode) {
      return this.updateTranslation()
    }

    this.updateTransform()
  }

  rotate() {
    if (this.rotatableNode) {
      this.updateRotation()
      // It's necessary to call the update for the nodes outside
      // the rotatable group referencing nodes inside the group
      this.update()
      return
    }

    this.updateTransform()
  }

  protected getTranslationString() {
    const position = this.cell.position
    return `translate(${position.x},${position.y})`
  }

  protected getRotationString() {
    const rotation = this.cell.rotation
    if (rotation) {
      const size = this.cell.size
      return `rotate(${rotation},${size.width / 2},${size.height / 2})`
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

  protected updateRotation() {
    if (this.rotatableNode != null) {
      const transform = this.getRotationString()
      if (transform != null) {
        this.rotatableNode.setAttribute('transform', transform)
      } else {
        this.rotatableNode.removeAttribute('transform')
      }
    }
  }

  protected updateTranslation() {
    this.container.setAttribute('transform', this.getTranslationString())
  }

  protected updateSize(opt: any = {}) {
    const cell = this.cell
    const size = cell.size
    const angle = cell.rotation
    const scalableNode = this.scalableNode!

    // Getting scalable group's bbox.
    // Due to a bug in webkit's native SVG .getBBox implementation, the
    // bbox of groups with path children includes the paths' control points.
    // To work around the issue, we need to check whether there are any path
    // elements inside the scalable group.
    let recursive = false
    if (scalableNode.getElementsByTagName('path').length > 0) {
      // If scalable has at least one descendant that is a path, we need
      // toswitch to recursive bbox calculation. Otherwise, group bbox
      // calculation works and so we can use the (faster) native function.
      recursive = true
    }
    const scalableBBox = v.getBBox(scalableNode as SVGElement, { recursive })

    // Make sure `scalableBbox.width` and `scalableBbox.height` are not zero
    // which can happen if the element does not have any content.
    const sx = size.width / (scalableBBox.width || 1)
    const sy = size.height / (scalableBBox.height || 1)
    scalableNode.setAttribute('transform', `scale(${sx},${sy})`)

    // Now the interesting part. The goal is to be able to store the object geometry via just `x`, `y`, `angle`, `width` and `height`
    // Order of transformations is significant but we want to reconstruct the object always in the order:
    // resize(), rotate(), translate() no matter of how the object was transformed. For that to work,
    // we must adjust the `x` and `y` coordinates of the object whenever we resize it (because the origin of the
    // rotation changes). The new `x` and `y` coordinates are computed by canceling the previous rotation
    // around the center of the resized object (which is a different origin then the origin of the previous rotation)
    // and getting the top-left corner of the resulting object. Then we clean up the rotation back to what it originally was.

    // Cancel the rotation but now around a different origin, which is the center of the scaled object.
    const rotatableNode = this.rotatableNode
    if (rotatableNode != null) {
      const transform = rotatableNode.getAttribute('transform')
      if (transform) {
        rotatableNode.setAttribute(
          'transform',
          `${transform} rotate(${-angle},${size.width / 2},${size.height / 2})`,
        )
        const rotatableBBox = v.getBBox(scalableNode as SVGElement, {
          target: this.graph.drawPane,
        })

        // Store new x, y and perform rotate() again against the new rotation origin.
        cell.store.set(
          'position',
          { x: rotatableBBox.x, y: rotatableBBox.y },
          { updated: true, ...opt },
        )
        this.translate()
        this.rotate()
      }
    }

    // Update must always be called on non-rotated element. Otherwise,
    // relative positioning would work with wrong (rotated) bounding boxes.
    this.update()
  }

  // #region ports

  // fineElemInPort
  findPortNode(portId: string, selector?: string) {
    const cache = this.portsCache[portId]
    if (!cache) {
      return null
    }
    const portRoot = cache.portContentElement
    const portSelectors = cache.portContentSelectors || {}
    return this.findOne(selector, portRoot, portSelectors)
  }

  protected initializePorts() {
    this.cleanPortsCache()
  }

  protected refreshPorts() {
    this.removePorts()
    this.cleanPortsCache()
    this.renderPorts()
  }

  protected cleanPortsCache() {
    this.portsCache = {}
  }

  protected removePorts() {
    Object.keys(this.portsCache).forEach(portId => {
      const cached = this.portsCache[portId]
      v.remove(cached.portElement)
    })
  }

  protected renderPorts() {
    const container = this.getPortsContainer()

    // references to rendered elements without z-index
    const references: Element[] = []
    container.childNodes.forEach(child => {
      references.push(child as Element)
    })

    const portsGropsByZ = ArrayExt.groupBy(
      this.cell.portData.getPorts(),
      'zIndex',
    )

    const autoZIndexKey = 'auto'
    // render non-z first
    if (portsGropsByZ[autoZIndexKey]) {
      portsGropsByZ[autoZIndexKey].forEach(port => {
        const portElement = this.getPortElement(port)
        container.append(portElement)
        references.push(portElement)
      })
    }

    Object.keys(portsGropsByZ).forEach(key => {
      if (key !== autoZIndexKey) {
        const zIndex = parseInt(key, 10)
        this.appendPorts(portsGropsByZ[key], zIndex, references)
      }
    })

    this.updatePorts()
  }

  protected getPortsContainer() {
    return this.rotatableNode || this.container
  }

  protected appendPorts(
    ports: PortData.Port[],
    zIndex: number,
    refs: Element[],
  ) {
    const elems = ports.map(p => this.getPortElement(p))
    if (refs[zIndex] || zIndex < 0) {
      v.before(refs[Math.max(zIndex, 0)], elems)
    } else {
      v.append(this.getPortsContainer(), elems)
    }
  }

  protected getPortElement(port: PortData.Port) {
    const cached = this.portsCache[port.id]
    if (cached) {
      return cached.portElement
    }
    return this.createPortElement(port)
  }

  protected createPortElement(port: PortData.Port) {
    let renderResult = Markup.renderMarkup(this.getPortContainerMarkup())
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

    renderResult = Markup.renderMarkup(this.getPortLabelMarkup(port.label))
    const portLabelElement = renderResult.elem
    const portLabelSelectors = renderResult.selectors

    if (portLabelElement == null) {
      throw new Error('Invalid port label markup.')
    }

    let portSelectors: Markup.Selectors | undefined
    if (portContentSelectors && portLabelSelectors) {
      for (const key in portLabelSelectors) {
        if (portContentSelectors[key] && key !== this.rootSelector) {
          throw new Error('Selectors within port must be unique.')
        }
      }
      portSelectors = {
        ...portContentSelectors,
        ...portLabelSelectors,
      }
    } else {
      portSelectors = portContentSelectors || portLabelSelectors
    }

    v.addClass(portElement, 'x6-port')
    v.addClass(portContentElement, 'x6-port-body')
    v.addClass(portLabelElement, 'x6-port-label')

    portElement.appendChild(portContentElement)
    portElement.appendChild(portLabelElement)

    this.portsCache[port.id] = {
      portElement,
      portSelectors,
      portLabelElement,
      portLabelSelectors,
      portContentElement,
      portContentSelectors,
    }

    return portElement
  }

  protected updatePorts() {
    // layout ports without group
    this.updatePortGroup()
    // layout ports with explicit group
    Object.keys(this.cell.portData.groups).forEach(groupName =>
      this.updatePortGroup(groupName),
    )
  }

  protected updatePortGroup(groupName?: string) {
    const bbox = Rectangle.fromSize(this.cell.size)
    const portsMetrics = this.cell.portData.getPortsLayoutByGroup(
      groupName,
      bbox,
    )

    for (let i = 0, n = portsMetrics.length; i < n; i += 1) {
      const metrics = portsMetrics[i]
      const portId = metrics.portId
      const cached = this.portsCache[portId] || {}
      const portLayout = metrics.portLayout
      this.applyPortTransform(cached.portElement, portLayout)
      if (metrics.portAttrs != null) {
        const options: Partial<CellViewAttr.UpdateAttrsOptions> = {
          selectors: cached.portSelectors || {},
        }

        if (metrics.portSize) {
          options.rootBBox = Rectangle.fromSize(metrics.portSize)
        }

        this.updateAttrs(cached.portElement, metrics.portAttrs, options)
      }

      const portLabelLayout = metrics.portLabelLayout
      if (portLabelLayout) {
        this.applyPortTransform(
          cached.portLabelElement,
          portLabelLayout,
          -portLayout.angle || 0,
        )

        if (portLabelLayout.attrs) {
          const options: Partial<CellViewAttr.UpdateAttrsOptions> = {
            selectors: cached.portLabelSelectors || {},
          }

          if (metrics.labelSize) {
            options.rootBBox = Rectangle.fromSize(metrics.labelSize)
          }

          this.updateAttrs(
            cached.portLabelElement,
            portLabelLayout.attrs,
            options,
          )
        }
      }
    }
  }

  protected applyPortTransform(
    element: Element,
    transformData: View.TransformData,
    initialAngle: number = 0,
  ) {
    const matrix = v
      .createSVGMatrix()
      .rotate(initialAngle)
      .translate(transformData.x || 0, transformData.y || 0)
      .rotate(transformData.angle || 0)

    v.transform(element as SVGElement, matrix, { absolute: true })
  }

  protected getPortContainerMarkup() {
    return this.cell.portContainerMarkup || this.portContainerMarkup
  }

  protected getPortMarkup(port: PortData.Port) {
    return port.markup || this.cell.portMarkup || this.portMarkup
  }

  protected getPortLabelMarkup(label: PortData.Label) {
    return label.markup || this.cell.portLabelMarkup || this.portLabelMarkup
  }

  // #endregion

  // #region events

  protected getEventArgs<E>(e: E): NodeView.MouseEventArgs<E>
  protected getEventArgs<E>(
    e: E,
    x: number,
    y: number,
  ): NodeView.PositionEventArgs<E>
  protected getEventArgs<E>(e: E, x?: number, y?: number) {
    const view = this // tslint:disable-line
    const edge = view.cell
    const cell = edge
    if (x == null || y == null) {
      return { e, view, edge, cell } as NodeView.MouseEventArgs<E>
    }
    return { e, x, y, view, edge, cell } as NodeView.PositionEventArgs<E>
  }

  notifyMouseDown(e: JQuery.MouseDownEvent, x: number, y: number) {
    super.onMouseDown(e, x, y)
    this.notify('node:mousedown', this.getEventArgs(e, x, y))
  }

  notifyMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number) {
    super.onMouseMove(e, x, y)
    this.notify('node:mousemove', this.getEventArgs(e, x, y))
  }

  notifyMouseUp(e: JQuery.MouseUpEvent, x: number, y: number) {
    super.onMouseUp(e, x, y)
    this.notify('node:mouseup', this.getEventArgs(e, x, y))
  }

  onClick(e: JQuery.ClickEvent, x: number, y: number) {
    super.onClick(e, x, y)
    this.notify('node:click', this.getEventArgs(e, x, y))
  }

  onDblClick(e: JQuery.DoubleClickEvent, x: number, y: number) {
    super.onDblClick(e, x, y)
    this.notify('node:dblclick', this.getEventArgs(e, x, y))
  }

  onContextMenu(e: JQuery.ContextMenuEvent, x: number, y: number) {
    super.onContextMenu(e, x, y)
    this.notify('node:contextmenu', this.getEventArgs(e, x, y))
  }

  onMouseDown(e: JQuery.MouseDownEvent, x: number, y: number) {
    if (this.isPropagationStopped(e)) {
      return
    }
    this.notifyMouseDown(e, x, y)
    this.startNodeDragging(e, x, y)
  }

  onMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData<EventData.Mousemove>(e)
    const action = data.action
    if (action === 'magnet') {
      this.dragMagnet(e, x, y)
    } else {
      this.notifyMouseMove(e, x, y)
      if (action === 'move') {
        const view = (data as EventData.Moving).targetView || this
        view.dragNode(e, x, y)
      }
    }

    this.setEventData<EventData.Mousemove>(e, data)
  }

  onMouseUp(e: JQuery.MouseUpEvent, x: number, y: number) {
    const data = this.getEventData<EventData.Mousemove>(e)
    const action = data.action
    if (action === 'magnet') {
      this.stopMagnetDragging(e, x, y)
    } else {
      this.notifyMouseUp(e, x, y)
      if (action === 'move') {
        const view = (data as EventData.Moving).targetView || this
        view.stopNodeDragging(e, x, y)
      }
    }

    const magnet = (data as EventData.Magnet).targetMagnet
    if (magnet) {
      this.onMagnetClick(e, magnet, x, y)
    }

    this.checkMouseleave(e)
  }

  onMouseOver(e: JQuery.MouseOverEvent) {
    super.onMouseOver(e)
    this.notify('node:mouseover', this.getEventArgs(e))
  }

  onMouseOut(e: JQuery.MouseOutEvent) {
    super.onMouseOut(e)
    this.notify('node:mouseout', this.getEventArgs(e))
  }

  onMouseEnter(e: JQuery.MouseEnterEvent) {
    super.onMouseEnter(e)
    this.notify('node:mouseenter', this.getEventArgs(e))
  }

  onMouseLeave(e: JQuery.MouseLeaveEvent) {
    super.onMouseLeave(e)
    this.notify('node:mouseleave', this.getEventArgs(e))
  }

  onMouseWheel(e: JQuery.TriggeredEvent, x: number, y: number, delta: number) {
    super.onMouseWheel(e, x, y, delta)
    this.notify('node:mousewheel', {
      delta,
      ...this.getEventArgs(e, x, y),
    })
  }

  onMagnetClick(e: JQuery.MouseUpEvent, magnet: Element, x: number, y: number) {
    if (this.graph.getMouseMovedCount(e) > this.graph.options.clickThreshold) {
      return
    }
    this.notify('node:magnet:click', {
      magnet,
      ...this.getEventArgs(e, x, y),
    })
  }

  onMagnetDblClick(
    e: JQuery.DoubleClickEvent,
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
    e: JQuery.ContextMenuEvent,
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
    e: JQuery.MouseDownEvent,
    magnet: Element,
    x: number,
    y: number,
  ) {
    this.startMagnetDragging(e, x, y)
  }

  onCustomEvent(e: JQuery.MouseDownEvent, name: string, x: number, y: number) {
    this.notify('node:customevent', { name, ...this.getEventArgs(e, x, y) })
    super.onCustomEvent(e, name, x, y)
  }

  protected prepareEmbedding(data: EventData.MovingTargetNode) {
    const cell = data.cell || this.cell
    const graph = data.graph || this.graph
    const model = graph.model

    model.startBatch('to-front')

    // Bring the model to the front with all his embeds.
    cell.toFront({ deep: true, ui: true })

    const maxZ = model
      .getNodes()
      .reduce((max, cell) => Math.max(max, cell.getZIndex() || 0), 0)

    const connectedEdges = model.getConnectedEdges(cell, {
      deep: true,
      enclosed: true,
    })

    connectedEdges.forEach(edge => {
      const zIndex = edge.getZIndex() || 0
      if (zIndex <= maxZ) {
        edge.setZIndex(maxZ + 1, { ui: true })
      }
    })

    model.stopBatch('to-front')

    // Before we start looking for suitable parent we remove the current one.
    const parent = cell.getParent()
    if (parent) {
      parent.unembed(cell, { ui: true })
    }
  }

  protected processEmbedding(data: EventData.MovingTargetNode) {
    const cell = data.cell || this.cell
    const graph = data.graph || this.graph
    const graphOptions = graph.options
    const findParentBy = graphOptions.findParentBy as any

    let candidates: Cell[]
    if (typeof findParentBy === 'function') {
      const parents = findParentBy.call(graph.model, this) as Cell[]
      candidates = parents.filter(cell => {
        return (
          cell instanceof Cell &&
          this.cell.id !== cell.id &&
          !cell.isDescendantOf(this.cell)
        )
      })
    } else {
      candidates = graph.model.getNodesUnderNode(cell, {
        by: graphOptions.findParentBy as Rectangle.KeyPoint,
      })
    }

    if (graphOptions.frontParentOnly) {
      // pick the element with the highest `z` index
      candidates = candidates.slice(-1)
    }

    let newCandidateView = null
    const prevCandidateView = data.candidateEmbedView
    const validateEmbedding = graphOptions.validateEmbedding

    // iterate over all candidates starting from the last one (has the highest z-index).
    for (let i = candidates.length - 1; i >= 0; i -= 1) {
      const candidate = candidates[i]

      if (prevCandidateView && prevCandidateView.cell.id === candidate.id) {
        // candidate remains the same
        newCandidateView = prevCandidateView
        break
      } else {
        const view = candidate.findView(graph) as NodeView
        if (validateEmbedding.call(graph, this, view)) {
          // flip to the new candidate
          newCandidateView = view
          break
        }
      }
    }

    // A new candidate view found. Highlight the new one.
    if (newCandidateView && newCandidateView !== prevCandidateView) {
      this.clearEmbedding(data)
      newCandidateView.highlight(null, { type: 'embedding' })
      data.candidateEmbedView = newCandidateView
    }

    // No candidate view found. Unhighlight the previous candidate.
    if (!newCandidateView && prevCandidateView) {
      this.clearEmbedding(data)
    }
  }

  protected clearEmbedding(data: EventData.MovingTargetNode) {
    const candidateView = data.candidateEmbedView
    if (candidateView) {
      // No candidate view found. Unhighlight the previous candidate.
      candidateView.unhighlight(null, { type: 'embedding' })
      data.candidateEmbedView = null
    }
  }

  protected finalizeEmbedding(data: EventData.MovingTargetNode) {
    const cell = data.cell || this.cell
    const graph = data.graph || this.graph
    const candidateView = data.candidateEmbedView
    if (candidateView) {
      // We finished embedding. Candidate view is chosen to become the parent of the model.
      candidateView.cell.insertChild(cell, undefined, { ui: true })
      candidateView.unhighlight(null, { type: 'embedding' })
      data.candidateEmbedView = null
    }

    graph.model.getConnectedEdges(cell, { deep: true }).forEach(edge => {
      edge.updateParent({ ui: true })
    })
  }

  protected getDelegatedView() {
    let cell = this.cell
    let view: NodeView = this // tslint:disable-line

    while (view) {
      if (cell.isEdge()) {
        break
      }
      if (!cell.hasParent() || view.can('stopDelegation')) {
        return view
      }
      cell = cell.getParent() as C
      view = this.graph.findViewByCell(cell) as NodeView
    }

    return null
  }

  protected startMagnetDragging(
    e: JQuery.MouseDownEvent,
    x: number,
    y: number,
  ) {
    if (!this.can('addLinkFromMagnet')) {
      return
    }

    e.stopPropagation()

    const magnet = e.currentTarget
    const graph = this.graph

    this.setEventData<Partial<EventData.Magnet>>(e, {
      targetMagnet: magnet,
    })

    if (graph.options.validateMagnet(this, magnet, e)) {
      if (graph.options.magnetThreshold <= 0) {
        this.startConnectting(e, magnet, x, y)
      }

      this.setEventData<Partial<EventData.Magnet>>(e, {
        action: 'magnet',
      })
      this.stopPropagation(e)
    } else {
      this.onMouseDown(e, x, y)
    }

    graph.delegateDragEvents(e, this)
  }

  protected startConnectting(
    e: JQuery.MouseDownEvent,
    magnet: Element,
    x: number,
    y: number,
  ) {
    this.graph.model.startBatch('add-edge')
    const edgeView = this.createEdgeFromMagnet(magnet, x, y)
    edgeView.notifyMouseDown(e, x, y) // backwards compatibility events
    edgeView.setEventData(
      e,
      edgeView.prepareArrowheadDragging('target', { fallbackAction: 'remove' }),
    )
    this.setEventData<Partial<EventData.Magnet>>(e, { edgeView })
  }

  protected createEdgeFromMagnet(magnet: Element, x: number, y: number) {
    const graph = this.graph
    const model = graph.model
    const edge = graph.getDefaultEdge(this, magnet)

    edge.setSource(this.getEdgeTerminal(magnet, x, y, edge, 'source'))
    edge.setTarget({ x, y })
    edge.addTo(model, { async: false, ui: true })

    return edge.findView(graph) as EdgeView
  }

  protected dragMagnet(e: JQuery.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData<EventData.Magnet>(e)
    const edgeView = data.edgeView
    if (edgeView) {
      edgeView.onMouseMove(e, x, y)
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
      } else {
        // magnetThreshold defined as a number of movements
        if (graph.getMouseMovedCount(e) <= magnetThreshold) {
          return
        }
      }
      this.startConnectting(e as any, targetMagnet, x, y)
    }
  }

  protected stopMagnetDragging(e: JQuery.MouseUpEvent, x: number, y: number) {
    const data = this.eventData<EventData.Magnet>(e)
    const edgeView = data.edgeView
    if (edgeView) {
      edgeView.onMouseUp(e, x, y)
      this.graph.model.stopBatch('add-edge')
    }
  }

  protected startNodeDragging(e: JQuery.MouseDownEvent, x: number, y: number) {
    const targetView = this.getDelegatedView()
    if (targetView == null || !targetView.can('elementMove')) {
      return
    }

    this.setEventData<EventData.Moving>(e, {
      targetView,
      action: 'move',
    })

    const position = Point.create(targetView.cell.getPosition())
    targetView.setEventData<EventData.MovingTargetNode>(e, {
      offset: position.diff(x, y),
      restrictedArea: this.graph.getRestrictedArea(targetView),
    })
  }

  protected dragNode(e: JQuery.MouseMoveEvent, x: number, y: number) {
    const node = this.cell
    const graph = this.graph
    const gridSize = graph.options.gridSize
    const data = this.getEventData<EventData.MovingTargetNode>(e)
    const offset = data.offset
    const restrictedArea = data.restrictedArea
    let embedding = data.embedding

    const nextX = snapToGrid(x + offset.x, gridSize)
    const nextY = snapToGrid(y + offset.y, gridSize)
    node.setPosition(nextX, nextY, { restrictedArea, deep: true, ui: true })

    if (graph.options.embeddingMode) {
      if (!embedding) {
        // Prepare the node for embedding only if the mouse moved.
        // We don't want to do unnecessary action with the element
        // if an user only clicks/dblclicks on it.
        this.prepareEmbedding(data)
        embedding = true
      }
      this.processEmbedding(data)
    }

    this.setEventData<Partial<EventData.MovingTargetNode>>(e, {
      embedding,
    })
  }

  protected stopNodeDragging(e: JQuery.MouseUpEvent, x: number, y: number) {
    const data = this.getEventData<EventData.MovingTargetNode>(e)
    if (data.embedding) {
      this.finalizeEmbedding(data)
    }
  }

  // #ednregion
}

export namespace NodeView {
  export interface Options extends CellView.Options {}

  export interface PortCache {
    portElement: Element
    portSelectors?: Markup.Selectors | null
    portLabelElement: Element
    portLabelSelectors?: Markup.Selectors | null
    portContentElement: Element
    portContentSelectors?: Markup.Selectors | null
  }
}

export namespace NodeView {
  interface NodeMagnetEventArgs {
    magnet: Element
  }

  export interface MouseEventArgs<E> {
    e: E
    edge: Node
    cell: Node
    view: NodeView
  }

  export interface PositionEventArgs<E>
    extends MouseEventArgs<E>,
      CellView.PositionEventArgs {}

  export interface EventArgs {
    'node:click': PositionEventArgs<JQuery.ClickEvent>
    'node:dblclick': PositionEventArgs<JQuery.DoubleClickEvent>
    'node:contextmenu': PositionEventArgs<JQuery.ContextMenuEvent>
    'node:mousedown': PositionEventArgs<JQuery.MouseDownEvent>
    'node:mousemove': PositionEventArgs<JQuery.MouseMoveEvent>
    'node:mouseup': PositionEventArgs<JQuery.MouseUpEvent>
    'node:mouseover': MouseEventArgs<JQuery.MouseOverEvent>
    'node:mouseout': MouseEventArgs<JQuery.MouseOutEvent>
    'node:mouseenter': MouseEventArgs<JQuery.MouseEnterEvent>
    'node:mouseleave': MouseEventArgs<JQuery.MouseLeaveEvent>
    'node:mousewheel': PositionEventArgs<JQuery.TriggeredEvent> &
      CellView.MouseDeltaEventArgs
    'node:customevent': PositionEventArgs<JQuery.MouseDownEvent> & {
      name: string
    }
    'node:highlight': {
      magnet: Element
      view: NodeView
      node: Node
      cell: Node
      options: CellView.HighlightOptions
    }
    'node:unhighlight': EventArgs['node:highlight']

    'node:magnet:click': PositionEventArgs<JQuery.MouseUpEvent> &
      NodeMagnetEventArgs
    'node:magnet:dblclick': PositionEventArgs<JQuery.DoubleClickEvent> &
      NodeMagnetEventArgs
    'node:magnet:contextmenu': PositionEventArgs<JQuery.ContextMenuEvent> &
      NodeMagnetEventArgs
  }
}

namespace EventData {
  export type Mousemove = Moving | Magnet

  export interface Magnet {
    action: 'magnet'
    targetMagnet: Element
    edgeView?: EdgeView
  }

  export interface Moving {
    action: 'move'
    targetView: NodeView
  }

  export interface MovingTargetNode {
    offset: Point.PointLike
    restrictedArea: Rectangle.RectangleLike
    embedding?: boolean
    candidateEmbedView?: NodeView | null
    cell?: Node
    graph?: Graph
  }
}

NodeView.config({
  isSvgElement: true,
  priority: 0,
  bootstrap: ['render'],
  actions: {
    view: ['render'],
    markup: ['render'],
    attrs: ['update'],
    size: ['resize', 'ports', 'tools'],
    rotation: ['rotate', 'tools'],
    position: ['translate', 'tools'],
    ports: ['ports'],
  },
})
