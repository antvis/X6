import { v } from '../../v'
import { Attr } from '../attr'
import { KeyValue } from '../../types'
import { StringExt, ObjectExt, NumberExt } from '../../util'
import { Rectangle, Polyline, Point, Angle, Path, Line } from '../../geometry'
import { CellView } from './cell-view'
import { Edge } from './edge'
import { Markup } from './markup'
import { NodeAnchor } from '../anchor'
import { Router } from '../router'
import { Connector } from '../connector'
import { ConnectionPoint } from '../connection-point'
import {
  EdgeAnchorRegistry,
  NodeAnchorRegistry,
  RouterRegistry,
  ConnectionPointRegistry,
  ConnectorRegistry,
} from '../registry'

export class EdgeView<
  C extends Edge = Edge,
  Options extends EdgeView.Options = EdgeView.Options
> extends CellView<C, Options> {
  protected readonly decimalsRounding = 2

  path: Path
  routePoints: Point[]
  sourceAnchor: Point
  targetAnchor: Point
  sourcePoint: Point
  targetPoint: Point
  sourceView: CellView | null
  targetView: CellView | null
  sourceMagnet: Element | null
  targetMagnet: Element | null

  protected toolCache: any
  protected tool2Cache: any
  protected markerCache: any

  confirmUpdate(flag: number, options: any = {}) {
    let ref = flag
    if (this.hasAction(ref, 'source')) {
      if (!this.updateEndProperties('source')) {
        return ref
      }
      ref = this.removeAction(ref, 'source')
    }

    if (this.hasAction(ref, 'target')) {
      if (!this.updateEndProperties('target')) {
        return ref
      }
      ref = this.removeAction(ref, 'target')
    }

    const graph = this.graph
    const sourceView = this.sourceView
    const targetView = this.targetView

    if (
      graph &&
      ((sourceView && !graph.isViewMounted(sourceView)) ||
        (targetView && !graph.isViewMounted(targetView)))
    ) {
      // Wait for the sourceView and targetView to be rendered.
      return ref
    }

    if (this.hasAction(ref, 'render')) {
      this.render()
      ref = this.removeAction(ref, [
        'render',
        'update',
        'vertices',
        'labels',
        'tools',
      ])
      return ref
    }

    ref = this.handleAction(ref, 'vertices', () => this.renderVertexMarkers())
    ref = this.handleAction(ref, 'update', () => this.update(null, options))
    ref = this.handleAction(ref, 'labels', () => this.onLabelsChange(options))
    ref = this.handleAction(ref, 'tools', () =>
      this.renderTools().updateToolsPosition(),
    )

    return ref
  }

  onLabelsChange(options: any = {}) {
    // Note: this optimization works in async=false mode only
    if (this.shouldRerenderLabels(options)) {
      this.renderLabels()
    } else {
      this.updateLabels()
    }

    this.updateLabelPositions()
  }

  protected shouldRerenderLabels(options: any = {}) {
    const previousLabels = this.cell.store.getPrevious<Edge.Label[]>('labels')
    if (previousLabels == null) {
      return true
    }

    // Here is an optimization for cases when we know, that change does
    // not require re-rendering of all labels.
    if ('propertyPathArray' in options && 'propertyValue' in options) {
      // The label is setting by `prop()` method
      const pathArray = options.propertyPathArray || []
      const pathLength = pathArray.length
      if (pathLength > 1) {
        // We are changing a single label here e.g. 'labels/0/position'
        const index = pathArray[1]
        if (previousLabels[index]) {
          if (pathLength === 2) {
            // We are changing the entire label. Need to check if the
            // markup is also being changed.
            return (
              typeof options.propertyValue === 'object' &&
              ObjectExt.has(options.propertyValue, 'markup')
            )
          }

          // We are changing a label property but not the markup
          if (pathArray[2] !== 'markup') {
            return false
          }
        }
      }
    }

    return true
  }

  // #region render

  protected containers: EdgeView.ContainerCache
  protected labelCache: { [index: number]: Element }
  protected labelSelectors: { [index: number]: Markup.Selectors }

  render() {
    this.empty()
    this.containers = {}
    this.renderMarkup()
    this.renderLabels()
    this.update()

    return this
  }

  protected renderMarkup() {
    const markup = this.cell.markup
    if (markup) {
      if (typeof markup === 'string') {
        return this.renderStringMarkup(markup)
      }
      return this.renderJSONMarkup(markup)
    }
    throw new TypeError('Invalid edge markup.')
  }

  protected renderJSONMarkup(markup: Markup.JSONMarkup | Markup.JSONMarkup[]) {
    const ret = this.parseJSONMarkup(markup, this.container)
    this.selectors = ret.selectors
    this.container.append(ret.fragment)
  }

  protected renderStringMarkup(markup: string) {
    const cache = this.containers
    const children = v.batch(markup)
    // Cache children elements for quicker access.
    children.forEach(child => {
      const className = child.attr('class')
      if (className) {
        cache[StringExt.camelCase(className)] = child.node
      }
    })

    this.renderTools()
    this.renderVertexMarkers()
    this.renderArrowheadMarkers()

    v.append(this.container, children)
  }

  protected renderLabels() {
    const container = this.containers.labels
    if (container == null) {
      return this
    }

    this.empty(container)

    const edge = this.cell
    const labels = edge.getLabels()
    if (labels.length === 0) {
      return this
    }

    this.labelCache = {}
    this.labelSelectors = {}

    for (let i = 0, ii = labels.length; i < ii; i += 1) {
      const label = labels[i]
      const normalized = this.normalizeLabelMarkup(
        this.parseLabelMarkup(label.markup),
      )
      let labelNode
      let selectors
      if (normalized) {
        labelNode = normalized.node
        selectors = normalized.selectors
      } else {
        const defaultLabel = edge.getDefaultLabel()
        const normalized = this.normalizeLabelMarkup(
          this.parseLabelMarkup(defaultLabel.markup),
        )!

        labelNode = normalized.node
        selectors = normalized.selectors
      }

      labelNode.setAttribute('data-index', `${i}`)
      container.appendChild(labelNode)

      const rootSelector = this.rootSelector
      if (selectors[rootSelector]) {
        throw new Error('Ambiguous label root selector.')
      }
      selectors[rootSelector] = labelNode

      this.labelCache[i] = labelNode
      this.labelSelectors[i] = selectors
    }

    this.updateLabels()

    return this
  }

  protected parseLabelMarkup(markup?: Markup) {
    if (markup) {
      if (typeof markup === 'string') {
        return this.parseLabelStringMarkup(markup)
      }
      return this.parseJSONMarkup(markup)
    }

    return null
  }

  protected parseLabelStringMarkup(labelMarkup: string) {
    const children = v.batch(labelMarkup)
    const fragment = document.createDocumentFragment()
    for (let i = 0, n = children.length; i < n; i += 1) {
      const currentChild = children[i].node
      fragment.appendChild(currentChild)
    }

    return { fragment, selectors: {} }
  }

  protected normalizeLabelMarkup(
    markup?: {
      fragment: DocumentFragment
      selectors: Markup.Selectors
    } | null,
  ) {
    if (markup == null) {
      return
    }

    const fragment = markup.fragment
    if (!(fragment instanceof DocumentFragment) || !fragment.hasChildNodes()) {
      throw new Error('Invalid label markup.')
    }

    let vel
    const childNodes = fragment.childNodes
    if (childNodes.length > 1 || childNodes[0].nodeName.toUpperCase() !== 'G') {
      // default markup fragment is not wrapped in <g />
      // add a <g /> container
      vel = v.create('g').append(fragment)
    } else {
      vel = v.create(childNodes[0] as SVGElement)
    }

    vel.addClass('label')

    return { node: vel.node, selectors: markup.selectors }
  }

  protected updateLabels() {
    if (this.containers.labels == null) {
      return this
    }

    const edge = this.cell
    const labels = edge.labels
    const canLabelMove = this.can('labelMove')
    const defaultLabel = edge.getDefaultLabel()

    for (let i = 0, n = labels.length; i < n; i += 1) {
      const elem = this.labelCache[i]
      const selectors = this.labelSelectors[i]

      elem.setAttribute('cursor', canLabelMove ? 'move' : 'default')

      const label = labels[i]
      const attrs = ObjectExt.merge({}, label.attrs, defaultLabel.attrs)
      this.updateAttrs(elem, attrs, {
        selectors,
        rootBBox: label.size ? Rectangle.fromSize(label.size) : undefined,
      })
    }

    return this
  }

  /**
   * Tools are a group of clickable elements that manipulate the whole link.
   * A good example of this is the remove tool that removes the whole link.
   * Tools appear after hovering the link close to the `source` element/point
   * of the link but are offset a bit so that they don't cover the `marker-arrowhead`.
   */
  renderTools() {
    const container = this.containers.tools
    if (container == null) {
      return this
    }

    const markup = this.cell.toolMarkup
    const $container = this.$(container).empty()

    if (Markup.isStringMarkup(markup)) {
      let template = StringExt.template(markup)
      const tool = v.create(template())

      $container.append(tool.node)

      this.toolCache = tool

      // If `doubleLinkTools` is enabled, we render copy of the tools on the
      // other side of the edge as well but only if the edge is longer than
      // `longLinkLength`.
      if (this.options.doubleLinkTools) {
        let tool2
        const doubleToolMarkup = this.cell.doubleToolMarkup
        if (Markup.isStringMarkup(doubleToolMarkup)) {
          template = StringExt.template(doubleToolMarkup)
          tool2 = v.create(template())
        } else {
          tool2 = tool.clone()
        }

        $container.append(tool2.node)
        this.tool2Cache = tool2
      }
    }

    return this
  }

  renderVertexMarkers() {
    const container = this.containers.vertices
    if (container == null) {
      return this
    }

    const markup = this.cell.vertexMarkup
    const $container = this.$(container).empty()
    if (Markup.isStringMarkup(markup)) {
      const template = StringExt.template(markup)
      this.cell.getVertices().forEach((vertex, index) => {
        $container.append(v.create(template({ index, ...vertex })).node)
      })
    }

    return this
  }

  renderArrowheadMarkers() {
    const container = this.containers.arrowheads
    if (container == null) {
      return this
    }

    const markup = this.cell.arrowheadMarkup
    const $container = this.$(container).empty()

    if (Markup.isStringMarkup(markup)) {
      const template = StringExt.template(markup)
      const sourceArrowhead = v.create(template({ end: 'source' })).node
      const targetArrowhead = v.create(template({ end: 'target' })).node

      this.containers.sourceArrowhead = sourceArrowhead
      this.containers.targetArrowhead = targetArrowhead

      $container.append(sourceArrowhead, targetArrowhead)
    }

    return this
  }

  // #endregion

  // #region updating

  update(partialAttrs?: Attr.CellAttrs | null, options: any = {}) {
    this.cleanCache()
    this.updateConnection(options)

    const attrs = this.cell.attrs
    if (attrs != null) {
      this.updateAttrs(this.container, attrs, {
        attrs: partialAttrs === attrs ? null : partialAttrs,
        selectors: this.selectors,
      })
    }

    this.updateDefaultConnectionPath()
    this.updateLabelPositions()
    this.updateToolsPosition()
    this.updateArrowheadMarkers()
    this.updateTools(options)

    // *Deprecated*
    // Local perpendicular flag (as opposed to one defined on paper).
    // Could be enabled inside a connector/router. It's valid only
    // during the update execution.
    this.options.perpendicular = false

    return this
  }

  removeRedundantLinearVertices(options: Edge.SetOptions = {}) {
    const edge = this.cell
    const vertices = edge.getVertices()
    const routePoints = [this.sourceAnchor, ...vertices, this.targetAnchor]
    const rawCount = routePoints.length

    // Puts the route points into a polyline and try to simplify.
    const polyline = new Polyline(routePoints)
    polyline.simplify({ threshold: 0.01 })
    const simplifiedPoints = polyline.points.map(point => point.toJSON())
    const simplifiedCount = simplifiedPoints.length

    // If simplification did not remove any redundant vertices.
    if (rawCount === simplifiedCount) {
      return 0
    }

    // Sets simplified polyline points as link vertices.
    // Removes first and last polyline points again (source/target anchors).
    edge.setVertices(simplifiedPoints.slice(1, simplifiedCount - 1), options)
    return rawCount - simplifiedCount
  }

  updateDefaultConnectionPath() {
    const containers = this.containers
    if (containers.connection) {
      const pathData = this.getConnectionPathData()
      containers.connection.setAttribute('d', pathData)
    }

    if (containers.connectionWrap) {
      const pathData = this.getConnectionPathData()
      containers.connectionWrap.setAttribute('d', pathData)
    }

    if (containers.sourceMarker && containers.targetMarker) {
      this.translateAndAutoOrientArrows(
        containers.markerSource,
        containers.markerTarget,
      )
    }
  }

  getTerminalView(type: Edge.TerminalType) {
    switch (type) {
      case 'source':
        return this.sourceView || null
      case 'target':
        return this.targetView || null
      default:
        throw new Error('Type parameter required.')
    }
  }

  getTerminalAnchor(type: Edge.TerminalType) {
    switch (type) {
      case 'source':
        return Point.create(this.sourceAnchor)
      case 'target':
        return Point.create(this.targetAnchor)
      default:
        throw new Error('Type parameter required.')
    }
  }

  getTerminalConnectionPoint(type: Edge.TerminalType) {
    switch (type) {
      case 'source':
        return Point.create(this.sourcePoint)
      case 'target':
        return Point.create(this.targetPoint)
      default:
        throw new Error('Type parameter required.')
    }
  }

  getTerminalMagnet(type: Edge.TerminalType) {
    switch (type) {
      case 'source':
        const sourceView = this.sourceView
        if (!sourceView) {
          break
        }
        return this.sourceMagnet || sourceView.container
      case 'target':
        const targetView = this.targetView
        if (!targetView) {
          break
        }
        return this.targetMagnet || targetView.container
      default:
        throw new Error('Type parameter required.')
    }
    return null
  }

  updateConnection(options: any = {}) {
    const edge = this.cell

    // The link is being translated by an ancestor that will shift
    // source, target and vertices by an equal distance.
    if (
      options.translateBy &&
      edge.isFragmentDescendantOf(options.translateBy)
    ) {
      const tx = options.tx || 0
      const ty = options.ty || 0
      this.routePoints = new Polyline(this.routePoints).translate(tx, ty).points
      this.translateConnectionPoints(tx, ty)
      this.path.translate(tx, ty)
    } else {
      const vertices = edge.getVertices()

      // 1. Find Anchors
      const anchors = this.findAnchorPoints(vertices)
      this.sourceAnchor = anchors.source
      this.targetAnchor = anchors.target

      // 2. Find Route
      this.routePoints = this.findRoutePoints(vertices)

      // 3. Find Connection Points
      const connectionPoints = this.findConnectionPoints(
        this.routePoints,
        this.sourceAnchor,
        this.targetAnchor,
      )
      this.sourcePoint = connectionPoints.source
      this.targetPoint = connectionPoints.target

      // 3b. Find Marker Connection Point - Backwards Compatibility
      const markerPoints = this.findMarkerPoints(
        this.routePoints,
        this.sourcePoint,
        this.targetPoint,
      )

      // 4. Find Connection
      this.path = this.findPath(
        this.routePoints,
        markerPoints.source || this.sourcePoint,
        markerPoints.target || this.targetPoint,
      )
    }

    this.cleanCache()
  }

  protected findAnchorPoints(vertices: Point.PointLike[]) {
    const edge = this.cell
    const firstVertex = vertices[0]
    const lastVertex = vertices[vertices.length - 1]

    if (edge.target.priority && !edge.source.priority) {
      // Reversed order
      return this.findAnchorsOrdered(
        'target',
        lastVertex,
        'source',
        firstVertex,
      )
    }

    // Usual order
    return this.findAnchorsOrdered('source', firstVertex, 'target', lastVertex)
  }

  protected findAnchorsOrdered(
    firstType: Edge.TerminalType,
    firstPoint: Point.PointLike,
    secondType: Edge.TerminalType,
    secondPoint: Point.PointLike,
  ) {
    let firstAnchor: Point
    let secondAnchor: Point
    let firstAnchorRef
    let secondAnchorRef

    const edge = this.cell
    const firstTerminal = edge[firstType]
    const secondTerminal = edge[secondType]
    const firstView = this.getTerminalView(firstType)
    const secondView = this.getTerminalView(secondType)
    const firstMagnet = this.getTerminalMagnet(firstType)
    const secondMagnet = this.getTerminalMagnet(secondType)

    if (firstView) {
      if (firstPoint) {
        firstAnchorRef = Point.create(firstPoint)
      } else if (secondView) {
        firstAnchorRef = secondMagnet
      } else {
        firstAnchorRef = Point.isPointLike(secondTerminal)
          ? Point.create(secondTerminal)
          : new Point()
      }
      firstAnchor = this.getAnchor(
        (firstTerminal as Edge.SetCellTerminalArgs).anchor,
        firstView,
        firstMagnet,
        firstAnchorRef,
        firstType,
      )
    } else {
      firstAnchor = Point.isPointLike(firstTerminal)
        ? Point.create(firstTerminal)
        : new Point()
    }

    if (secondView) {
      secondAnchorRef = Point.create(secondPoint || firstAnchor)
      secondAnchor = this.getAnchor(
        (secondTerminal as Edge.SetCellTerminalArgs).anchor,
        secondView,
        secondMagnet,
        secondAnchorRef,
        secondType,
      )
    } else {
      secondAnchor = Point.isPointLike(secondTerminal)
        ? Point.create(secondTerminal)
        : new Point()
    }

    return {
      [firstType]: firstAnchor,
      [secondType]: secondAnchor,
    }
  }

  protected getAnchor(
    anchor: NodeAnchor.ManaualItem | undefined,
    cellView: CellView,
    magnet: Element | null,
    ref: Point | Element | null,
    endType: Edge.TerminalType,
  ) {
    const isEdge = cellView.isEdgeElement(magnet)
    const options = this.graph.options
    if (!anchor) {
      if (isEdge) {
        anchor = options.defaultLinkAnchor // tslint:disable-line
      } else {
        // Backwards compatibility
        // If `perpendicularLinks` flag is set on the paper and there are
        // vertices on the link, then try to find a connection point that
        // makes the link perpendicular even though the link won't point
        // to the center of the targeted object.
        if (options.perpendicularLinks || this.options.perpendicular) {
          anchor = { name: 'orth' } // tslint:disable-line
        } else {
          anchor = options.defaultAnchor // tslint:disable-line
        }
      }
    }

    if (!anchor) {
      throw new Error('Anchor required.')
    }

    let anchorFn
    if (typeof anchor === 'function') {
      anchorFn = anchor
    } else {
      const anchorName = anchor.name
      anchorFn = isEdge
        ? EdgeAnchorRegistry.get(anchorName)
        : NodeAnchorRegistry.get(anchorName)
      if (typeof anchorFn !== 'function') {
        throw new Error(`Invalid anchor: "${anchorName}"`)
      }
    }
    const anchorPoint = anchorFn.call(
      this,
      cellView,
      magnet,
      ref,
      anchor.args || {},
      endType,
      this,
    )

    return anchorPoint ? anchorPoint.round(this.decimalsRounding) : new Point()
  }

  protected findRoutePoints(vertices: Point.PointLike[] = []) {
    const router: Edge.RouterData =
      this.cell.getRouter() || this.graph.options.defaultRouter || Router.normal

    let routePoints
    if (typeof router === 'function') {
      routePoints = router.call(this, vertices, {}, this)
    } else {
      const name = router.name
      const args = router.args || {}

      const fn = name ? RouterRegistry.get(name) : Router.normal
      if (typeof fn !== 'function') {
        throw new Error(`Invalid router: "${name}"`)
      }

      routePoints = fn.call(this, vertices, args, this)
    }

    if (routePoints == null) {
      return vertices.map(p => Point.create(p))
    }

    return routePoints
  }

  protected findConnectionPoints(
    routePoints: Point[],
    sourceAnchor: Point,
    targetAnchor: Point,
  ) {
    const edge = this.cell
    const sourceTerminal = edge.getSource()
    const targetTerminal = edge.getTarget()
    const sourceView = this.sourceView
    const targetView = this.targetView
    const firstRoutePoint = routePoints[0]
    const lastRoutePoint = routePoints[routePoints.length - 1]
    const graphOptions = this.graph.options

    // source
    let sourcePoint
    if (sourceView && !sourceView.isEdgeElement(this.sourceMagnet)) {
      const sourceMagnet = this.sourceMagnet || sourceView.container
      const sourceConnectionPointDef =
        sourceTerminal.connectionPoint || graphOptions.defaultConnectionPoint
      const sourcePointRef = firstRoutePoint || targetAnchor
      const sourceLine = new Line(sourcePointRef, sourceAnchor)
      sourcePoint = this.getConnectionPoint(
        sourceConnectionPointDef,
        sourceView,
        sourceMagnet,
        sourceLine,
        'source',
      )
    } else {
      sourcePoint = sourceAnchor
    }

    // target
    let targetPoint
    if (targetView && !targetView.isEdgeElement(this.targetMagnet)) {
      const targetMagnet = this.targetMagnet || targetView.container
      const targetConnectionPointDef =
        targetTerminal.connectionPoint || graphOptions.defaultConnectionPoint
      const targetPointRef = lastRoutePoint || sourceAnchor
      const targetLine = new Line(targetPointRef, targetAnchor)
      targetPoint = this.getConnectionPoint(
        targetConnectionPointDef,
        targetView,
        targetMagnet,
        targetLine,
        'target',
      )
    } else {
      targetPoint = targetAnchor
    }

    return {
      source: sourcePoint,
      target: targetPoint,
    }
  }

  protected getConnectionPoint(
    connectionPointDef: ConnectionPoint.ManaualItem,
    view: CellView,
    magnet: Element,
    line: Line,
    endType: Edge.TerminalType,
  ) {
    const anchor = line.end
    const graphOptions = this.graph.options

    // Backwards compatibility
    if (typeof graphOptions.linkConnectionPoint === 'function') {
      const linkConnectionMagnet =
        magnet === view.container ? undefined : magnet
      const connectionPoint = graphOptions.linkConnectionPoint.call(
        this,
        view,
        linkConnectionMagnet,
        line.start,
        endType,
      )
      if (connectionPoint) {
        return connectionPoint
      }
    }

    if (connectionPointDef == null) {
      return anchor
    }

    let connectionPointFn
    if (typeof connectionPointDef === 'function') {
      connectionPointFn = connectionPointDef
    } else {
      const name = connectionPointDef.name
      connectionPointFn = ConnectionPointRegistry.get(name)
      if (typeof connectionPointFn !== 'function') {
        throw new Error(`Invalid connection point: ${name}`)
      }
    }

    const connectionPoint = connectionPointFn.call(
      this,
      line,
      view,
      magnet,
      connectionPointDef.args || {},
      endType,
      this,
    )

    return connectionPoint
      ? connectionPoint.round(this.decimalsRounding)
      : anchor
  }

  protected findMarkerPoints(
    routePoints: Point[],
    sourcePoint: Point,
    targetPoint: Point,
  ) {
    const firstRoutePoint = routePoints[0]
    const lastRoutePoint = routePoints[routePoints.length - 1]

    const cache = this.markerCache

    const sourceMarkerContainer = this.containers.sourceMarker as SVGElement
    const targetMarkerContainer = this.containers.targetMarker as SVGElement
    let sourceMarkerPoint
    let targetMarkerPoint

    // Move the source point by the width of the marker taking into account
    // its scale around x-axis. Note that scale is the only transform that
    // makes sense to be set in `.marker-source` attributes object
    // as all other transforms (translate/rotate) will be replaced
    // by the `translateAndAutoOrient()` function.
    if (sourceMarkerContainer) {
      cache.sourceBBox = cache.sourceBBox || v.getBBox(sourceMarkerContainer)
      const scale = v.scale(sourceMarkerContainer)
      sourceMarkerPoint = sourcePoint
        .clone()
        .move(
          firstRoutePoint || targetPoint,
          cache.sourceBBox.width * scale.sx * -1,
        )
        .round()
    }

    if (targetMarkerContainer) {
      cache.targetBBox = cache.targetBBox || v.getBBox(targetMarkerContainer)
      const scale = v.scale(targetMarkerContainer)
      targetMarkerPoint = targetPoint
        .clone()
        .move(
          lastRoutePoint || sourcePoint,
          cache.targetBBox.width * scale.sx * -1,
        )
        .round()
    }

    // if there was no markup for the marker, use the connection point.
    cache.sourcePoint = sourceMarkerPoint || sourcePoint.clone()
    cache.targetPoint = targetMarkerPoint || targetPoint.clone()

    return {
      source: sourceMarkerPoint,
      target: targetMarkerPoint,
    }
  }

  protected findPath(
    routePoints: Point[],
    sourcePoint: Point,
    targetPoint: Point,
  ) {
    const def: Edge.ConnectorData =
      this.cell.getConnector() ||
      this.graph.options.defaultConnector ||
      Connector.normal

    const fn =
      typeof def === 'function'
        ? def
        : def.name
        ? ConnectorRegistry.get(def.name)
        : Connector.normal

    if (typeof fn !== 'function') {
      throw new Error(`Invalid connector: "${def.name}"`)
    }

    const args = typeof def === 'function' ? {} : def.args || {}
    const path = fn.call(
      this,
      sourcePoint,
      targetPoint,
      routePoints,
      { ...args, raw: true },
      this,
    ) as Path

    return path
  }

  protected translateConnectionPoints(tx: number, ty: number) {
    const cache = this.markerCache
    cache.sourcePoint.translate(tx, ty)
    cache.targetPoint.translate(tx, ty)
    this.sourcePoint.translate(tx, ty)
    this.targetPoint.translate(tx, ty)
    this.sourceAnchor.translate(tx, ty)
    this.targetAnchor.translate(tx, ty)
  }

  updateLabelPositions() {
    if (this.containers.labels == null) {
      return this
    }

    const path = this.path
    if (!path) {
      return this
    }

    const edge = this.cell
    const labels = edge.getLabels()
    if (labels.length === 0) {
      return this
    }

    const defaultLabel = edge.getDefaultLabel()
    const defaultPosition = this.normalizeLabelPosition(
      defaultLabel.position as Edge.LabelPosition,
    )

    for (let i = 0, ii = labels.length; i < ii; i += 1) {
      const label = labels[i]
      const labelPosition = this.normalizeLabelPosition(
        label.position as Edge.LabelPosition,
      )
      const pos = ObjectExt.merge({}, defaultPosition, labelPosition)
      const matrix = this.getLabelTransformationMatrix(pos)
      this.labelCache[i].setAttribute(
        'transform',
        v.matrixToTransformString(matrix),
      )
    }

    return this
  }

  updateToolsPosition() {
    if (this.containers.tools == null) {
      return this
    }

    // Move the tools a bit to the target position but don't cover the
    // `sourceArrowhead` marker. Note that the offset is hardcoded here.
    // The offset should be always more than the
    // `this.$('.marker-arrowhead[end="source"]')[0].bbox().width` but looking
    // this up all the time would be slow.

    let scale = ''
    let offset = this.options.linkToolsOffset
    const connectionLength = this.getConnectionLength()

    // Firefox returns `connectionLength=NaN` in odd cases (for bezier curves).
    // In that case we won't update tools position at all.
    if (connectionLength != null) {
      // If the link is too short, make the tools half the
      // size and the offset twice as low.
      if (connectionLength < this.options.shortLinkLength) {
        scale = 'scale(.5)'
        offset /= 2
      }

      let pos = this.getPointAtLength(offset)
      if (pos != null) {
        this.toolCache.attr(
          'transform',
          `translate(${pos.x},${pos.y}) ${scale}`,
        )
      }

      if (
        this.options.doubleLinkTools &&
        connectionLength >= this.options.longLinkLength
      ) {
        const doubleLinkToolsOffset =
          this.options.doubleLinkToolsOffset || offset

        pos = this.getPointAtLength(connectionLength - doubleLinkToolsOffset)
        if (pos != null) {
          this.tool2Cache.attr(
            'transform',
            `translate(${pos.x},${pos.y}) ${scale}`,
          )
        }
        this.tool2Cache.attr('visibility', 'visible')
      } else if (this.options.doubleLinkTools) {
        this.tool2Cache.attr('visibility', 'hidden')
      }
    }

    return this
  }

  updateArrowheadMarkers() {
    const container = this.containers.arrowheads
    if (container == null) {
      return this
    }

    if ((container as HTMLElement).style.display === 'none') {
      return this
    }

    const sourceArrowhead = this.containers.sourceArrowhead
    const targetArrowhead = this.containers.targetArrowhead
    if (sourceArrowhead && targetArrowhead) {
      const len = this.getConnectionLength() || 0
      const sx = len < this.options.shortLinkLength ? 0.5 : 1
      v.scale(sourceArrowhead as SVGElement, sx)
      v.scale(targetArrowhead as SVGElement, sx)
      this.translateAndAutoOrientArrows(sourceArrowhead, targetArrowhead)
    }

    return this
  }

  updateEndProperties(endType: Edge.TerminalType) {
    const edge = this.cell
    const graph = this.graph
    const terminal = edge[endType]
    const terminalId = terminal && (terminal as Edge.TerminalCellData).cellId
    const endViewProperty = `${endType}View` as 'sourceView' | 'targetView'

    // terminal is a point
    if (!terminalId) {
      this[endViewProperty] = null
      this.updateTerminalMagnet(endType)
      return true
    }

    const terminalCell = graph.getModelById(terminalId)
    if (!terminalCell) {
      throw new Error(`Invalid ${endType} cell.`)
    }

    const endView = terminalCell.findView(graph)
    if (!endView) {
      return false
    }

    this[endViewProperty] = endView
    this.updateTerminalMagnet(endType)
    return true
  }

  protected updateTerminalMagnet(endType: Edge.TerminalType) {
    const propName = `${endType}Magnet` as 'sourceMagnet' | 'targetMagnet'
    const terminalView = this.getTerminalView(endType)
    if (terminalView) {
      let magnet = terminalView.getMagnetFromLinkEnd(this.cell[endType])
      if (magnet === terminalView.container) {
        magnet = null
      }

      this[propName] = magnet
    } else {
      this[propName] = null
    }
  }

  protected translateAndAutoOrientArrows(
    sourceArrow?: Element,
    targetArrow?: Element,
  ) {
    const route = this.routePoints
    if (sourceArrow) {
      v.translateAndAutoOrient(
        sourceArrow as SVGElement,
        this.sourcePoint,
        route[0] || this.targetPoint,
        this.graph.cells,
      )
    }

    if (targetArrow) {
      v.translateAndAutoOrient(
        targetArrow as SVGElement,
        this.targetPoint,
        route[route.length - 1] || this.sourcePoint,
        this.graph.cells,
      )
    }
  }

  protected getLabelPositionAngle(idx: number) {
    const label = this.cell.getLabelAt(idx)
    if (label && label.position && typeof label.position === 'object') {
      return label.position.rotation || 0
    }
    return 0
  }

  protected getLabelPositionArgs(idx: number) {
    const label = this.cell.getLabelAt(idx)
    if (label && label.position && typeof label.position === 'object') {
      return label.position.options
    }
  }

  protected getDefaultLabelPositionArgs() {
    const defaultLabel = this.cell.getDefaultLabel()
    if (
      defaultLabel &&
      defaultLabel.position &&
      typeof defaultLabel.position === 'object'
    ) {
      return defaultLabel.position.options
    }
  }

  // merge default label position args into label position args
  // keep `undefined` or `null` because `{}` means something else
  protected mergeLabelPositionArgs(
    labelPositionArgs?: Edge.LabelPositionOptions,
    defaultLabelPositionArgs?: Edge.LabelPositionOptions,
  ) {
    if (labelPositionArgs === null) {
      return null
    }
    if (labelPositionArgs === undefined) {
      if (defaultLabelPositionArgs === null) {
        return null
      }
      return defaultLabelPositionArgs
    }

    return ObjectExt.merge({}, defaultLabelPositionArgs, labelPositionArgs)
  }

  // Add default label at given position at end of `labels` array.
  // Assigns relative coordinates by default:
  // `opt.absoluteDistance` forces absolute coordinates.
  // `opt.reverseDistance` forces reverse absolute coordinates (if absoluteDistance = true).
  // `opt.absoluteOffset` forces absolute coordinates for offset.
  // Additional args:
  // `opt.keepGradient` auto-adjusts the angle of the label to match path gradient at position.
  // `opt.ensureLegibility` rotates labels so they are never upside-down.
  addLabel(
    x: number,
    y: number,
    options?: Edge.LabelPositionOptions & Edge.SetOptions,
  ): number
  addLabel(
    x: number,
    y: number,
    angle: number,
    options?: Edge.LabelPositionOptions & Edge.SetOptions,
  ): number
  addLabel(
    p: Point | Point.PointLike,
    options?: Edge.LabelPositionOptions & Edge.SetOptions,
  ): number
  addLabel(
    p: Point | Point.PointLike,
    angle: number,
    options?: Edge.LabelPositionOptions & Edge.SetOptions,
  ): number
  addLabel(
    p1: number | Point | Point.PointLike,
    p2?: number | (Edge.LabelPositionOptions & Edge.SetOptions),
    p3?: number | (Edge.LabelPositionOptions & Edge.SetOptions),
    options?: Edge.LabelPositionOptions & Edge.SetOptions,
  ) {
    let localX: number
    let localY: number
    let localAngle = 0
    let localOptions

    if (typeof p1 !== 'number') {
      localX = p1.x
      localY = p1.y
      if (typeof p2 === 'number') {
        localAngle = p2
        localOptions = p3
      } else {
        localOptions = p2
      }
    } else {
      localX = p1
      localY = p2 as number
      if (typeof p3 === 'number') {
        localAngle = p3
        localOptions = options
      } else {
        localOptions = p3
      }
    }

    // merge label position arguments
    const defaultLabelPositionArgs = this.getDefaultLabelPositionArgs()
    const labelPositionArgs = localOptions as Edge.LabelPositionOptions
    const positionArgs = this.mergeLabelPositionArgs(
      labelPositionArgs,
      defaultLabelPositionArgs,
    )

    // append label to labels array
    const label = {
      position: this.getLabelPosition(localX, localY, localAngle, positionArgs),
    }
    const index = -1
    this.cell.insertLabel(label, index, localOptions as Edge.SetOptions)
    return index
  }

  addVertex(p: Point | Point.PointLike, options?: Edge.SetOptions): number
  addVertex(x: number, y: number, options?: Edge.SetOptions): number
  addVertex(
    x: number | Point | Point.PointLike,
    y?: number | Edge.SetOptions,
    options?: Edge.SetOptions,
  ) {
    const isPoint = typeof x !== 'number'
    const localX = isPoint ? (x as Point).x : (x as number)
    const localY = isPoint ? (x as Point).y : (y as number)
    const localOptions = isPoint ? (y as Edge.SetOptions) : options
    const vertex = { x: localX, y: localY }
    const index = this.getVertexIndex(localX, localY)
    this.cell.insertVertex(vertex, index, localOptions)
    return index
  }

  // Send a token (an SVG element, usually a circle) along the connection path.
  // Example: `link.findView(paper).sendToken(V('circle', { r: 7, fill: 'green' }).node)`
  // `opt.duration` is optional and is a time in milliseconds that the token travels from the source to the target of the link. Default is `1000`.
  // `opt.directon` is optional and it determines whether the token goes from source to target or other way round (`reverse`)
  // `opt.connection` is an optional selector to the connection path.
  sendToken(
    token: string | SVGElement,
    options?:
      | number
      | {
          duration?: number
          reversed?: boolean
          selector?: string
        },
    callback?: () => any,
  ) {
    let duration
    let reversed
    let selector
    if (typeof options === 'object') {
      duration = options.duration
      reversed = options.reversed === true
      selector = options.selector
    } else {
      duration = options
      reversed = false
      selector = null
    }

    duration = duration || 1000

    const props: { [key: string]: string } = {
      dur: `${duration}ms`,
      repeatCount: '1',
      calcMode: 'linear',
      fill: 'freeze',
    }

    if (reversed) {
      props.keyPoints = '1;0'
      props.keyTimes = '0;1'
    }

    let path
    if (typeof selector === 'string') {
      path = this.findOne(selector, this.container, this.selectors)
    } else {
      // Select connection path automatically.
      path = this.containers.connection
        ? this.containers.connection
        : this.container.querySelector('path')
    }

    if (!(path instanceof SVGPathElement)) {
      throw new Error('Token animation requires a valid connection path.')
    }

    const vToken = v.create(token)
    vToken.appendTo(this.graph.cells).animateAlongPath(props, path)

    setTimeout(() => {
      vToken.remove()
      if (typeof callback === 'function') {
        callback()
      }
    }, duration)
  }

  // #endregion

  getConnection() {
    return this.path != null ? this.path.clone() : null
  }

  getConnectionPathData() {
    if (this.path == null) {
      return ''
    }

    const cache = this.cacheManager.pathCache
    if (!ObjectExt.has(cache, 'data')) {
      cache.data = this.path.serialize()
    }
    return cache.data || ''
  }

  getConnectionSubdivisions() {
    if (this.path == null) {
      return null
    }

    const cache = this.cacheManager.pathCache
    if (!ObjectExt.has(cache, 'segmentSubdivisions')) {
      cache.segmentSubdivisions = this.path.getSegmentSubdivisions()
    }
    return cache.segmentSubdivisions
  }

  getConnectionLength() {
    if (this.path == null) {
      return 0
    }

    const cache = this.cacheManager.pathCache
    if (!ObjectExt.has(cache, 'length')) {
      cache.length = this.path.length({
        segmentSubdivisions: this.getConnectionSubdivisions(),
      })
    }
    return cache.length
  }

  getPointAtLength(length: number) {
    if (this.path == null) {
      return null
    }

    return this.path.pointAtLength(length, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  getPointAtRatio(ratio: number) {
    if (this.path == null) {
      return null
    }

    if (NumberExt.isPercentage(ratio)) {
      // tslint:disable-next-line
      ratio = parseFloat(ratio) / 100
    }

    return this.path.pointAt(ratio, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  getTangentAtLength(length: number) {
    if (this.path == null) {
      return null
    }

    return this.path.tangentAtLength(length, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  getTangentAtRatio(ratio: number) {
    if (this.path == null) {
      return null
    }

    return this.path.tangentAt(ratio, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  getClosestPoint(point: Point | Point.PointLike | Point.PointData) {
    if (this.path == null) {
      return null
    }

    return this.path.closestPoint(point, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  getClosestPointLength(point: Point | Point.PointLike | Point.PointData) {
    if (this.path == null) {
      return null
    }

    return this.path.closestPointLength(point, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  getClosestPointRatio(point: Point | Point.PointLike | Point.PointData) {
    if (this.path == null) {
      return null
    }

    return this.path.closestPointNormalizedLength(point, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  // Get label position object based on two provided coordinates, x and y.
  getLabelPosition(
    x: number,
    y: number,
    options?: Edge.LabelPositionOptions | null,
  ): Edge.LabelPositionObject
  getLabelPosition(
    x: number,
    y: number,
    angle: number,
    options?: Edge.LabelPositionOptions | null,
  ): Edge.LabelPositionObject
  getLabelPosition(
    x: number,
    y: number,
    p3?: number | Edge.LabelPositionOptions | null,
    p4?: Edge.LabelPositionOptions | null,
  ): Edge.LabelPositionObject {
    const pos: Edge.LabelPositionObject = { distance: 0 }

    // normalize data from the two possible signatures
    let angle = 0
    let options
    if (typeof p3 === 'number') {
      angle = p3
      options = p4
    } else {
      options = p3
    }

    if (options != null) {
      pos.options = options
    }

    // identify distance/offset settings
    const isDistanceRelative = !(options && options.absoluteDistance)
    const isDistanceAbsoluteReverse =
      options && options.absoluteDistance && options.reverseDistance
    const isOffsetAbsolute = options && options.absoluteOffset

    // find closest point t
    const path = this.path
    const pathOptions = {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    }

    const labelPoint = new Point(x, y)
    const t = path.closestPointT(labelPoint, pathOptions)!

    // distance
    const totalLength = this.getConnectionLength() || 0
    let labelDistance = path.lengthAtT(t, pathOptions)
    if (isDistanceRelative) {
      labelDistance = totalLength > 0 ? labelDistance / totalLength : 0
    }

    if (isDistanceAbsoluteReverse) {
      // fix for end point (-0 => 1)
      labelDistance = -1 * (totalLength - labelDistance) || 1
    }
    pos.distance = labelDistance

    // offset
    // use absolute offset if:
    // - opt.absoluteOffset is true,
    // - opt.absoluteOffset is not true but there is no tangent
    let tangent
    if (!isOffsetAbsolute) tangent = path.tangentAtT(t)
    let labelOffset
    if (tangent) {
      labelOffset = tangent.pointOffset(labelPoint)
    } else {
      const closestPoint = path.pointAtT(t)!
      const labelOffsetDiff = labelPoint.diff(closestPoint)
      labelOffset = { x: labelOffsetDiff.x, y: labelOffsetDiff.y }
    }

    pos.offset = labelOffset
    pos.rotation = angle

    return pos
  }

  protected normalizeLabelPosition(): undefined
  protected normalizeLabelPosition(
    pos: Edge.LabelPosition,
  ): Edge.LabelPositionObject
  protected normalizeLabelPosition(
    pos?: Edge.LabelPosition,
  ): Edge.LabelPositionObject | undefined {
    if (typeof pos === 'number') {
      return { distance: pos }
    }

    return pos
  }

  protected getLabelTransformationMatrix(labelPosition: Edge.LabelPosition) {
    const pos = this.normalizeLabelPosition(labelPosition)
    const options = pos.options || {}
    const labelAngle = pos.rotation || 0
    const labelDistance = pos.distance
    const isDistanceRelative = labelDistance > 0 && labelDistance <= 1

    let labelOffset = 0
    const offsetCoord = { x: 0, y: 0 }
    const offset = pos.offset
    if (offset) {
      if (typeof offset === 'number') {
        labelOffset = offset
      } else {
        if (offset.x != null) {
          offsetCoord.x = offset.x
        }
        if (offset.y != null) {
          offsetCoord.y = offset.y
        }
      }
    }

    const isOffsetAbsolute =
      offsetCoord.x !== 0 || offsetCoord.y !== 0 || labelOffset === 0

    const isKeepGradient = options.keepGradient
    const isEnsureLegibility = options.ensureLegibility

    const path = this.path
    const pathOpt = { segmentSubdivisions: this.getConnectionSubdivisions() }

    const distance = isDistanceRelative
      ? labelDistance * this.getConnectionLength()!
      : labelDistance
    const tangent = path.tangentAtLength(distance, pathOpt)

    let translation
    let angle = labelAngle
    if (tangent) {
      if (isOffsetAbsolute) {
        translation = tangent.start
        translation.translate(offsetCoord)
      } else {
        const normal = tangent.clone()
        normal.rotate(-90, tangent.start)
        normal.setLength(labelOffset)
        translation = normal.end
      }
      if (isKeepGradient) {
        angle = tangent.angle() + labelAngle
        if (isEnsureLegibility) {
          angle = Angle.normalize(((angle + 90) % 180) - 90)
        }
      }
    } else {
      // fallback - the connection has zero length
      translation = path.start!
      if (isOffsetAbsolute) {
        translation.translate(offsetCoord)
      }
    }

    return v
      .createSVGMatrix()
      .translate(translation.x, translation.y)
      .rotate(angle)
  }

  getLabelCoordinates(pos: Edge.LabelPosition) {
    const matrix = this.getLabelTransformationMatrix(pos)
    return new Point(matrix.e, matrix.f)
  }

  getVertexIndex(x: number, y: number) {
    const edge = this.cell
    const vertices = edge.getVertices()
    const vertexLength = this.getClosestPointLength(new Point(x, y))

    let index = 0

    if (vertexLength != null) {
      for (const ii = vertices.length; index < ii; index += 1) {
        const currentVertex = vertices[index]
        const currentLength = this.getClosestPointLength(currentVertex)
        if (currentLength != null && vertexLength < currentLength) {
          break
        }
      }
    }

    return index
  }

  // Interaction. The controller part.
  // ---------------------------------

  notifyPointerdown(evt: JQuery.MouseDownEvent, x: number, y: number) {
    super.pointerdown(evt, x, y)
    this.notify('edge:pointerdown', evt, x, y)
  }

  notifyPointermove(evt: JQuery.MouseMoveEvent, x: number, y: number) {
    super.pointermove(evt, x, y)
    this.notify('edge:pointermove', evt, x, y)
  }

  notifyPointerup(evt: JQuery.MouseUpEvent, x: number, y: number) {
    this.notify('edge:pointerup', evt, x, y)
    super.pointerup(evt, x, y)
  }

  pointerdblclick(evt: JQuery.DoubleClickEvent, x: number, y: number) {
    super.pointerdblclick(evt, x, y)
    this.notify('edge:pointerdblclick', evt, x, y)
  }

  pointerclick(evt: JQuery.ClickEvent, x: number, y: number) {
    super.pointerclick(evt, x, y)
    this.notify('edge:pointerclick', evt, x, y)
  }

  contextmenu(evt: JQuery.ContextMenuEvent, x: number, y: number) {
    super.contextmenu(evt, x, y)
    this.notify('edge:contextmenu', evt, x, y)
  }

  pointerdown(evt: JQuery.MouseDownEvent, x: number, y: number) {
    this.notifyPointerdown(evt, x, y)

    // Backwards compatibility for the default markup
    const className = evt.target.getAttribute('class')
    switch (className) {
      case 'marker-vertex':
        this.dragVertexStart(evt, x, y)
        return

      case 'marker-vertex-remove':
      case 'marker-vertex-remove-area':
        this.dragVertexRemoveStart(evt, x, y)
        return

      case 'marker-arrowhead':
        this.dragArrowheadStart(evt, x, y)
        return

      case 'connection':
      case 'connection-wrap':
        this.dragConnectionStart(evt, x, y)
        return

      case 'marker-source':
      case 'marker-target':
        return
    }

    this.dragStart(evt, x, y)
  }

  protected dragData: any
  protected pointermove(evt: JQuery.MouseMoveEvent, x: number, y: number) {
    // Backwards compatibility
    const dragData = this.dragData
    if (dragData) {
      this.setEventData(evt, dragData)
    }

    const data = this.getEventData(evt)
    switch (data.action) {
      case 'vertex-move':
        this.dragVertex(evt, x, y)
        break

      case 'label-move':
        this.dragLabel(evt, x, y)
        break

      case 'arrowhead-move':
        this.dragArrowhead(evt, x, y)
        break

      case 'move':
        this.drag(evt, x, y)
        break
    }

    // Backwards compatibility
    if (dragData) {
      Object.assign(dragData, this.eventData(evt))
    }

    this.notifyPointermove(evt, x, y)
  }

  protected pointerup(evt: JQuery.MouseUpEvent, x: number, y: number) {
    // Backwards compatibility
    const dragData = this.dragData
    if (dragData) {
      this.setEventData(evt, dragData)
      this.dragData = null
    }

    const data = this.getEventData(evt)
    switch (data.action) {
      case 'vertex-move':
        this.dragVertexEnd(evt, x, y)
        break

      case 'label-move':
        this.dragLabelEnd(evt, x, y)
        break

      case 'arrowhead-move':
        this.dragArrowheadEnd(evt, x, y)
        break

      case 'move':
        this.dragEnd(evt, x, y)
    }

    this.notifyPointerup(evt, x, y)
    this.checkMouseleave(evt)
  }

  protected mouseover(evt: JQuery.MouseOverEvent) {
    super.mouseover(evt)
    this.notify('edge:mouseover', evt)
  }

  protected mouseout(evt: JQuery.MouseOutEvent) {
    super.mouseout(evt)
    this.notify('edge:mouseout', evt)
  }

  protected mouseenter(evt: JQuery.MouseEnterEvent) {
    super.mouseenter(evt)
    this.notify('edge:mouseenter', evt)
  }

  protected mouseleave(evt: JQuery.MouseLeaveEvent) {
    super.mouseleave(evt)
    this.notify('edge:mouseleave', evt)
  }

  protected mousewheel(
    evt: JQuery.TriggeredEvent,
    x: number,
    y: number,
    delta: number,
  ) {
    super.mousewheel(evt, x, y, delta)
    this.notify('edge:mousewheel', evt, x, y, delta)
  }

  protected onevent(
    evt: JQuery.TriggeredEvent,
    eventName: string,
    x: number,
    y: number,
  ) {
    // Backwards compatibility
    const linkTool = v.findParentByClass(
      evt.target,
      'link-tool',
      this.container,
    )
    if (linkTool) {
      // No further action to be executed
      evt.stopPropagation()

      // Allow `interactive.useLinkTools=false`
      if (this.can('useLinkTools')) {
        if (eventName === 'remove') {
          // Built-in remove event
          // this.cell.remove({ ui: true })
          // Do not trigger link pointerdown
          return
        }
        // edge:options and other custom events inside the link tools
        this.notify(eventName, evt, x, y)
      }

      this.notifyPointerdown(evt as JQuery.MouseDownEvent, x, y)
    } else {
      super.onevent(evt, eventName, x, y)
    }
  }

  onlabel(evt: JQuery.MouseDownEvent, x: number, y: number) {
    this.notifyPointerdown(evt, x, y)
    this.dragLabelStart(evt, x, y)

    const stopPropagation = this.getEventData(evt).stopPropagation
    if (stopPropagation) {
      evt.stopPropagation()
    }
  }

  // Drag Start Handlers

  dragConnectionStart(evt: JQuery.MouseDownEvent, x: number, y: number) {
    if (!this.can('vertexAdd')) {
      return
    }

    // Store the index at which the new vertex has just been placed.
    // We'll be update the very same vertex position in `pointermove()`.
    const vertexIdx = this.addVertex({ x, y }, { ui: true })
    this.setEventData(evt, {
      vertexIdx,
      action: 'vertex-move',
    })
  }

  dragLabelStart(evt: JQuery.MouseDownEvent, x: number, y: number) {
    if (this.can('labelMove')) {
      const labelNode = evt.currentTarget
      const labelIndex = parseInt(labelNode.getAttribute('data-index'), 10)
      const positionAngle = this.getLabelPositionAngle(labelIndex)
      const labelPositionArgs = this.getLabelPositionArgs(labelIndex)
      const defaultLabelPositionArgs = this.getDefaultLabelPositionArgs()
      const positionArgs = this.mergeLabelPositionArgs(
        labelPositionArgs,
        defaultLabelPositionArgs,
      )

      this.setEventData(evt, {
        labelIndex,
        positionAngle,
        positionArgs,
        stopPropagation: true,
        action: 'label-move',
      })
    } else {
      // Backwards compatibility:
      // If labels can't be dragged no default action is triggered.
      this.setEventData(evt, { stopPropagation: true })
    }

    this.graph.delegateDragEvents(this, evt.data)
  }

  dragVertexStart(evt: JQuery.MouseDownEvent, x: number, y: number) {
    if (!this.can('vertexMove')) {
      return
    }

    const vertexNode = evt.target
    const vertexIndex = parseInt(vertexNode.getAttribute('idx'), 10)
    this.setEventData(evt, {
      vertexIndex,
      action: 'vertex-move',
    })
  }

  dragVertexRemoveStart(evt: JQuery.MouseDownEvent, x: number, y: number) {
    if (!this.can('vertexRemove')) {
      return
    }

    const removeNode = evt.target
    const vertexIndex = parseInt(removeNode.getAttribute('idx'), 10)
    this.cell.removeVertexAt(vertexIndex)
  }

  dragArrowheadStart(evt: JQuery.MouseDownEvent, x: number, y: number) {
    if (!this.can('arrowheadMove')) {
      return
    }

    const arrowheadNode = evt.target
    const arrowheadType = arrowheadNode.getAttribute('end') as Edge.TerminalType
    const data = this.startArrowheadMove(arrowheadType, {
      ignoreBackwardsCompatibility: true,
    })

    this.setEventData(evt, data)
  }

  dragStart(evt: JQuery.MouseDownEvent, x: number, y: number) {
    if (!this.can('linkMove')) {
      return
    }

    this.setEventData(evt, {
      action: 'move',
      dx: x,
      dy: y,
    })
  }

  // Drag Handlers
  dragLabel(evt: JQuery.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData(evt)
    const label = {
      position: this.getLabelPosition(
        x,
        y,
        data.positionAngle,
        data.positionArgs,
      ),
    }
    this.cell.setLabelAt(data.labelIndex, label)
  }

  dragVertex(evt: JQuery.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData(evt)
    this.cell.setVertexAt(data.vertexIndex, { x, y }, { ui: true })
  }

  dragArrowhead(evt: JQuery.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData(evt)
    if (this.graph.options.snapLinks) {
      this.snapArrowhead(x, y, data)
    } else {
      this.connectArrowhead(this.getEventTarget(evt), x, y, data)
    }
  }

  drag(evt: JQuery.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData(evt)
    this.cell.translate(x - data.dx, y - data.dy, { ui: true })
    this.setEventData(evt, {
      dx: x,
      dy: y,
    })
  }

  // Drag End Handlers

  dragLabelEnd(evt: JQuery.MouseUpEvent, x: number, y: number) {}

  dragVertexEnd(evt: JQuery.MouseUpEvent, x: number, y: number) {}

  dragArrowheadEnd(evt: JQuery.MouseUpEvent, x: number, y: number) {
    const data = this.getEventData(evt)
    const graph = this.graph

    if (graph.options.snapLinks) {
      this.snapArrowheadEnd(data)
    } else {
      this.connectArrowheadEnd(data, x, y)
    }

    if (!graph.linkAllowed(this)) {
      // If the changed link is not allowed, revert to its previous state.
      this.disallow(data)
    } else {
      this.finishEmbedding(data)
      this.notifyConnectEvent(data, evt)
    }

    this.afterArrowheadMove(data)
  }

  dragEnd(evt: JQuery.MouseUpEvent, x: number, y: number) {}

  protected disallow(data: KeyValue<any>) {
    switch (data.whenNotAllowed) {
      case 'remove':
        // this.model.remove({ ui: true })
        break

      case 'revert':
      default:
        // this.model.set(data.arrowhead, data.initialEnd, { ui: true })
        break
    }
  }

  protected finishEmbedding(data: KeyValue<any>) {
    // Resets parent of the edge if embedding is enabled
    if (this.graph.options.embeddingMode && this.cell.updateParent()) {
      // Make sure we don't reverse to the original 'z' index (see afterArrowheadMove()).
      data.z = null
    }
  }

  protected notifyConnectEvent(data: KeyValue<any>, evt: JQuery.MouseUpEvent) {
    // const arrowhead = data.arrowhead
    // const initialEnd = data.initialEnd
    // const currentEnd = this.cell.prop(arrowhead)
    // const endChanged = currentEnd && !Link.endsEqual(initialEnd, currentEnd)
    // if (endChanged) {
    //   const paper = this.graph
    //   if (initialEnd.id) {
    //     this.notify(
    //       'edge:disconnect',
    //       evt,
    //       paper.findViewByModel(initialEnd.id),
    //       data.initialMagnet,
    //       arrowhead,
    //     )
    //   }
    //   if (currentEnd.id) {
    //     this.notify(
    //       'edge:connect',
    //       evt,
    //       paper.findViewByModel(currentEnd.id),
    //       data.magnetUnderPointer,
    //       arrowhead,
    //     )
    //   }
    // }
  }

  protected snapArrowhead(x: number, y: number, data: KeyValue<any>) {
    // checking view in close area of the pointer
    // const r = this.graph.options.snapLinks.radius || 50
    // const viewsInArea = this.graph.findViewsInArea({
    //   x: x - r,
    //   y: y - r,
    //   width: 2 * r,
    //   height: 2 * r,
    // })
    // const prevClosestView = data.closestView || null
    // const prevClosestMagnet = data.closestMagnet || null
    // data.closestView = data.closestMagnet = null
    // let distance
    // let minDistance = Number.MAX_VALUE
    // const pointer = new Point(x, y)
    // const paper = this.graph
    // viewsInArea.forEach(view => {
    //   // skip connecting to the element in case '.': { magnet: false } attribute present
    //   if (view.el.getAttribute('magnet') !== 'false') {
    //     // find distance from the center of the model to pointer coordinates
    //     distance = view.model
    //       .getBBox()
    //       .center()
    //       .distance(pointer)
    //     // the connection is looked up in a circle area by `distance < r`
    //     if (distance < r && distance < minDistance) {
    //       if (
    //         prevClosestMagnet === view.el ||
    //         paper.options.validateConnection.apply(
    //           paper,
    //           data.validateConnectionArgs(view, null),
    //         )
    //       ) {
    //         minDistance = distance
    //         data.closestView = view
    //         data.closestMagnet = view.el
    //       }
    //     }
    //   }
    //   view.$('[magnet]').each((index, magnet) => {
    //     const bbox = view.getNodeBBox(magnet)
    //     distance = pointer.distance({
    //       x: bbox.x + bbox.width / 2,
    //       y: bbox.y + bbox.height / 2,
    //     })
    //     if (distance < r && distance < minDistance) {
    //       if (
    //         prevClosestMagnet === magnet ||
    //         paper.options.validateConnection.apply(
    //           paper,
    //           data.validateConnectionArgs(view, magnet),
    //         )
    //       ) {
    //         minDistance = distance
    //         data.closestView = view
    //         data.closestMagnet = magnet
    //       }
    //     }
    //   })
    // }, this)
    // let end
    // const closestView = data.closestView
    // const closestMagnet = data.closestMagnet
    // const endType = data.arrowhead
    // const newClosestMagnet = prevClosestMagnet !== closestMagnet
    // if (prevClosestView && newClosestMagnet) {
    //   prevClosestView.unhighlight(prevClosestMagnet, {
    //     connecting: true,
    //     snapping: true,
    //   })
    // }
    // if (closestView) {
    //   if (!newClosestMagnet) return
    //   closestView.highlight(closestMagnet, {
    //     connecting: true,
    //     snapping: true,
    //   })
    //   end = closestView.getLinkEnd(closestMagnet, x, y, this.model, endType)
    // } else {
    //   end = { x, y }
    // }
    // this.model.set(endType, end || { x, y }, { ui: true })
  }

  protected snapArrowheadEnd(data: KeyValue<any>) {
    // Finish off link snapping.
    // Everything except view unhighlighting was already done on pointermove.
    const closestView = data.closestView
    const closestMagnet = data.closestMagnet
    if (closestView && closestMagnet) {
      closestView.unhighlight(closestMagnet, {
        connecting: true,
        snapping: true,
      })
      data.magnetUnderPointer = closestView.findMagnet(closestMagnet)
    }

    data.closestView = data.closestMagnet = null
  }

  protected connectArrowhead(
    target: Element,
    x: number,
    y: number,
    data: KeyValue<any>,
  ) {
    // checking views right under the pointer

    if (data.eventTarget !== target) {
      // Unhighlight the previous view under pointer if there was one.
      if (data.magnetUnderPointer) {
        data.viewUnderPointer.unhighlight(data.magnetUnderPointer, {
          connecting: true,
        })
      }

      data.viewUnderPointer = this.graph.findView(target)
      if (data.viewUnderPointer) {
        // If we found a view that is under the pointer, we need to find the closest
        // magnet based on the real target element of the event.
        data.magnetUnderPointer = data.viewUnderPointer.findMagnet(target)

        if (
          data.magnetUnderPointer &&
          this.graph.options.validateConnection.apply(
            this.graph,
            data.validateConnectionArgs(
              data.viewUnderPointer,
              data.magnetUnderPointer,
            ),
          )
        ) {
          // If there was no magnet found, do not highlight anything and assume there
          // is no view under pointer we're interested in reconnecting to.
          // This can only happen if the overall element has the attribute `'.': { magnet: false }`.
          if (data.magnetUnderPointer) {
            data.viewUnderPointer.highlight(data.magnetUnderPointer, {
              connecting: true,
            })
          }
        } else {
          // This type of connection is not valid. Disregard this magnet.
          data.magnetUnderPointer = null
        }
      } else {
        // Make sure we'll unset previous magnet.
        data.magnetUnderPointer = null
      }
    }

    data.eventTarget = target

    this.cell.store.set(data.arrowhead, { x, y }, { ui: true })
  }

  protected connectArrowheadEnd(data: KeyValue<any>, x: number, y: number) {
    const view = data.viewUnderPointer
    const magnet = data.magnetUnderPointer
    if (!magnet || !view) return

    view.unhighlight(magnet, { connecting: true })

    const endType = data.arrowhead
    const end = view.getLinkEnd(magnet, x, y, this.cell, endType)
    this.cell.store.set(endType, end, { ui: true })
  }

  protected beforeArrowheadMove(data: KeyValue<any>) {
    data.z = this.cell.zIndex
    this.cell.toFront()

    // Let the pointer propagate through the link view elements so that
    // the `evt.target` is another element under the pointer, not the link itself.
    const style = (this.container as HTMLElement).style
    data.pointerEvents = style.pointerEvents
    style.pointerEvents = 'none'

    if (this.graph.options.markAvailable) {
      this.markAvailableMagnets(data)
    }
  }

  protected afterArrowheadMove(data: KeyValue<any>) {
    if (data.z !== null) {
      this.cell.setZIndex(data.z, { ui: true })
      data.z = null
    }

    const container = this.container as HTMLElement
    // Put `pointer-events` back to its original value. See `_beforeArrowheadMove()` for explanation.
    container.style.pointerEvents = data.pointerEvents

    if (this.graph.options.markAvailable) {
      this.unmarkAvailableMagnets(data)
    }
  }

  protected createValidateConnectionArgs(arrowhead: Edge.TerminalType) {
    // It makes sure the arguments for validateConnection have the following form:
    // (source view, source magnet, target view, target magnet and link view)
    const args: any[] = []

    args[4] = arrowhead
    args[5] = this

    let oppositeArrowhead: Edge.TerminalType
    let i = 0
    let j = 0

    if (arrowhead === 'source') {
      i = 2
      oppositeArrowhead = 'target'
    } else {
      j = 2
      oppositeArrowhead = 'source'
    }

    const end = this.cell[oppositeArrowhead]
    const cellId = (end as Edge.TerminalCellData).cellId
    if (cellId) {
      const view = (args[i] = this.graph.findViewByModel(cellId))
      let magnet = view.getMagnetFromLinkEnd(end)
      if (magnet === view.el) magnet = undefined
      args[i + 1] = magnet
    }

    return (cellView: CellView, magnet: Element) => {
      args[j] = cellView
      args[j + 1] = cellView.container === magnet ? undefined : magnet
      return args
    }
  }

  protected markAvailableMagnets(data: KeyValue<any>) {
    function isMagnetAvailable(view: CellView, magnet: Element) {
      const paper = view.graph
      const validate = paper.options.validateConnection
      return validate.apply(paper, this.validateConnectionArgs(view, magnet))
    }

    const paper = this.graph
    const elements = paper.model.getCells()
    data.marked = {}

    for (let i = 0, n = elements.length; i < n; i += 1) {
      const view = elements[i].findView(paper)

      if (!view) {
        continue
      }

      const magnets = Array.prototype.slice.call(
        view.el.querySelectorAll('[magnet]'),
      )
      if (view.el.getAttribute('magnet') !== 'false') {
        // Element wrapping group is also a magnet
        magnets.push(view.el)
      }

      const availableMagnets = magnets.filter(
        isMagnetAvailable.bind(data, view),
      )

      if (availableMagnets.length > 0) {
        // highlight all available magnets
        for (let j = 0, m = availableMagnets.length; j < m; j += 1) {
          view.highlight(availableMagnets[j], { magnetAvailability: true })
        }
        // highlight the entire view
        view.highlight(null, { elementAvailability: true })

        data.marked[view.model.id] = availableMagnets
      }
    }
  }

  protected unmarkAvailableMagnets(data: KeyValue<any>) {
    const markedKeys = Object.keys(data.marked)
    let id
    let markedMagnets

    for (let i = 0, n = markedKeys.length; i < n; i += 1) {
      id = markedKeys[i]
      markedMagnets = data.marked[id]

      const view = this.graph.findViewByModel(id)
      if (view) {
        for (let j = 0, m = markedMagnets.length; j < m; j += 1) {
          view.unhighlight(markedMagnets[j], { magnetAvailability: true })
        }
        view.unhighlight(null, { elementAvailability: true })
      }
    }

    data.marked = null
  }

  protected startArrowheadMove(
    end: Edge.TerminalType,
    options: {
      whenNotAllowed?: string
      ignoreBackwardsCompatibility?: boolean
    } = {},
  ) {
    // Allow to delegate events from an another view to this linkView in order to trigger arrowhead
    // move without need to click on the actual arrowhead dom element.
    const endView = `${end}View` as 'sourceView' | 'targetView'
    const endMagnet = `${end}Magnet` as 'sourceMagnet' | 'targetMagnet'
    const data = {
      action: 'arrowhead-move',
      arrowhead: end,
      whenNotAllowed: options.whenNotAllowed || 'revert',
      initialMagnet:
        this[endMagnet] || (this[endView] ? this[endView]?.container : null),
      initialEnd: ObjectExt.clone(this.cell[end]),
      validateConnectionArgs: this.createValidateConnectionArgs(end),
    }

    this.beforeArrowheadMove(data)

    if (options.ignoreBackwardsCompatibility !== true) {
      this.dragData = data
    }

    return data
  }

  get sourceBBox() {
    const sourceView = this.sourceView
    if (!sourceView) {
      const sourceDef = this.cell.getSource() as Edge.TerminalPointData
      return new Rectangle(sourceDef.x, sourceDef.y)
    }
    const sourceMagnet = this.sourceMagnet
    if (sourceView.isEdgeElement(sourceMagnet)) {
      return new Rectangle(this.sourceAnchor.x, this.sourceAnchor.y)
    }
    return sourceView.getNodeBBox(sourceMagnet || sourceView.container)
  }

  get targetBBox() {
    const targetView = this.targetView
    if (!targetView) {
      const targetDef = this.cell.getTarget() as Edge.TerminalPointData
      return new Rectangle(targetDef.x, targetDef.y)
    }
    const targetMagnet = this.targetMagnet
    if (targetView.isEdgeElement(targetMagnet)) {
      return new Rectangle(this.targetAnchor.x, this.targetAnchor.y)
    }
    return targetView.getNodeBBox(targetMagnet || targetView.container)
  }
}

export namespace EdgeView {
  export interface Options extends CellView.Options {
    perpendicular: boolean
    doubleLinkTools: boolean
    shortLinkLength: number
    longLinkLength: number
    linkToolsOffset: number
    doubleLinkToolsOffset: number
    sampleInterval: number
  }

  export interface ContainerCache extends KeyValue<Element | undefined> {
    connection?: Element
    connectionWrap?: Element
    sourceMarker?: Element
    targetMarker?: Element
    labels?: Element
    vertices?: Element
    arrowheads?: Element
    sourceArrowhead?: Element
    targetArrowhead?: Element
    tools?: Element
  }
}

EdgeView.setDefaults<EdgeView.Options>({
  isSvgElement: true,
  priority: 1,
  bootstrap: ['render', 'source', 'target'],
  actions: {
    markup: ['render'],
    attrs: ['update'],
    router: ['update'],
    connector: ['update'],
    smooth: ['update'],
    manhattan: ['update'],
    source: ['source', 'update'],
    target: ['target', 'update'],
    labels: ['labels'],
    labelMarkup: ['labels'],
    vertices: ['vertices', 'update'],
    vertexMarkup: ['vertices'],
    toolMarkup: ['tools'],
  },
  shortLinkLength: 105,
  longLinkLength: 155,
  linkToolsOffset: 40,
  doubleLinkTools: false,
  doubleLinkToolsOffset: 65,
  sampleInterval: 50,
})
