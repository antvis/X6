import { v } from '../../v'
import { Attr } from '../attr'
import { KeyValue } from '../../types'
import { StringExt, ObjectExt, NumberExt } from '../../util'
import { Rectangle, Polyline, Point, Angle, Path, Line } from '../../geometry'
import {
  RouterRegistry,
  NodeAnchorRegistry,
  EdgeAnchorRegistry,
  ConnectorRegistry,
  ConnectionPointRegistry,
} from '../registry'
import { Router } from '../router'
import { NodeAnchor } from '../anchor'
import { Connector } from '../connector'
import { ConnectionPoint } from '../connection-point'
import { Edge } from './edge'
import { Markup } from './markup'
import { CellView } from './cell-view'

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

  protected readonly markerCache: {
    sourcePoint?: Point
    targetPoint?: Point
    sourceBBox?: Rectangle
    targetBBox?: Rectangle
  } = {}

  protected toolCache: Element
  protected tool2Cache: Element

  protected getContainerClassName() {
    return [super.getContainerClassName(), this.prefixClassName('edge')].join(
      ' ',
    )
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

  isEdgeView(): this is EdgeView {
    return true
  }

  confirmUpdate(flag: number, options: any = {}) {
    let ref = flag
    if (this.hasAction(ref, 'source')) {
      if (!this.updateTerminalProperties('source')) {
        return ref
      }
      ref = this.removeAction(ref, 'source')
    }

    if (this.hasAction(ref, 'target')) {
      if (!this.updateTerminalProperties('target')) {
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
    const previousLabels = this.cell.previous('labels')
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
        cache[StringExt.camelCase(className) as keyof EdgeView.ContainerCache] =
          child.node
      }
    })

    this.renderTools()
    this.renderVertexMarkers()
    this.renderArrowheadMarkers()

    v.append(this.container, children)
  }

  protected renderLabels() {
    const edge = this.cell
    const labels = edge.getLabels()
    const count = labels.length
    let container = this.containers.labels

    this.labelCache = {}
    this.labelSelectors = {}

    if (count <= 0) {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      return this
    }

    if (container) {
      this.empty(container)
    } else {
      container = v.createSvgElement('g')
      this.addClass('labels', container)
      this.containers.labels = container
    }

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

    if (container.parentNode == null) {
      this.container.appendChild(container)
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
      const attrs = ObjectExt.merge({}, defaultLabel.attrs, label.attrs)
      this.updateAttrs(elem, attrs, {
        selectors,
        rootBBox: label.size ? Rectangle.fromSize(label.size) : undefined,
      })
    }

    return this
  }

  protected mergeLabelAttrs(
    hasCustomMarkup: boolean,
    labelAttrs?: Attr.CellAttrs | null,
    defaultLabelAttrs?: Attr.CellAttrs | null,
  ) {
    if (labelAttrs === null) {
      return null
    }

    if (labelAttrs === undefined) {
      if (defaultLabelAttrs === null) {
        return null
      }
      if (defaultLabelAttrs === undefined) {
        return undefined
      }

      if (hasCustomMarkup) {
        return defaultLabelAttrs
      }

      return ObjectExt.merge({}, defaultLabelAttrs)
    }

    if (hasCustomMarkup) {
      return ObjectExt.merge({}, defaultLabelAttrs, labelAttrs)
    }
  }

  /**
   * Tools are a group of clickable elements that manipulate the whole edge.
   * A good example of this is the remove tool that removes the whole edge.
   * Tools appear after hovering the edge close to the `source` element/point
   * of the edge but are offset a bit so that they don't cover the `marker-arrowhead`.
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
      this.toolCache = tool.node

      // If `doubleTools` is enabled, we render copy of the tools on the
      // other side of the edge as well but only if the edge is longer
      // than `longLength`.
      if (this.options.doubleTools) {
        let tool2
        const doubleToolMarkup = this.cell.doubleToolMarkup
        if (Markup.isStringMarkup(doubleToolMarkup)) {
          template = StringExt.template(doubleToolMarkup)
          tool2 = v.create(template())
        } else {
          tool2 = tool.clone()
        }

        $container.append(tool2.node)
        this.tool2Cache = tool2.node
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

    // Sets simplified polyline points as edge vertices.
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
        containers.sourceMarker,
        containers.targetMarker,
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

  getTerminalMagnet(type: Edge.TerminalType, options: { raw?: boolean } = {}) {
    switch (type) {
      case 'source':
        if (options.raw) {
          return this.sourceMagnet
        }
        const sourceView = this.sourceView
        if (!sourceView) {
          return null
        }
        return this.sourceMagnet || sourceView.container

      case 'target':
        if (options.raw) {
          return this.targetMagnet
        }
        const targetView = this.targetView
        if (!targetView) {
          return null
        }
        return this.targetMagnet || targetView.container
      default:
        throw new Error('Type parameter required.')
    }
  }

  updateConnection(options: any = {}) {
    const edge = this.cell

    // The edge is being translated by an ancestor that will shift
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

      // 1. find anchor points
      const anchors = this.findAnchorPoints(vertices)
      this.sourceAnchor = anchors.source
      this.targetAnchor = anchors.target

      // 2. find route points
      this.routePoints = this.findRoutePoints(vertices)

      // 3. find connection points
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

      // 4. make path
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

    const edge = this.cell
    const firstTerminal = edge[firstType]
    const secondTerminal = edge[secondType]
    const firstView = this.getTerminalView(firstType)
    const secondView = this.getTerminalView(secondType)
    const firstMagnet = this.getTerminalMagnet(firstType)
    const secondMagnet = this.getTerminalMagnet(secondType)

    if (firstView) {
      let firstAnchorRef
      if (firstPoint) {
        firstAnchorRef = Point.create(firstPoint)
      } else if (secondView) {
        firstAnchorRef = secondMagnet
      } else {
        firstAnchorRef = Point.create(secondTerminal as Edge.TerminalPointData)
      }

      firstAnchor = this.getAnchor(
        (firstTerminal as Edge.SetCellTerminalArgs).anchor,
        firstView,
        firstMagnet,
        firstAnchorRef,
        firstType,
      )
    } else {
      firstAnchor = Point.create(firstTerminal as Edge.TerminalPointData)
    }

    if (secondView) {
      const secondAnchorRef = Point.create(secondPoint || firstAnchor)
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
    anchorDef: NodeAnchor.ManaualItem | undefined,
    cellView: CellView,
    magnet: Element | null,
    ref: Point | Element | null,
    endType: Edge.TerminalType,
  ) {
    const isEdge = cellView.isEdgeElement(magnet)
    const options = this.graph.options
    if (!anchorDef) {
      if (isEdge) {
        anchorDef = options.defaultLinkAnchor // tslint:disable-line
      } else {
        // Backwards compatibility
        // If `perpendicularLinks` flag is set on the paper and there are
        // vertices on the link, then try to find a connection point that
        // makes the link perpendicular even though the link won't point
        // to the center of the targeted object.
        if (options.perpendicularLinks || this.options.perpendicular) {
          anchorDef = { name: 'orth' } // tslint:disable-line
        } else {
          anchorDef = options.defaultAnchor // tslint:disable-line
        }
      }
    }

    if (!anchorDef) {
      throw new Error('Anchor required.')
    }

    let anchorFn
    if (typeof anchorDef === 'function') {
      anchorFn = anchorDef
    } else {
      const name = anchorDef.name
      anchorFn = isEdge
        ? EdgeAnchorRegistry.get(name)
        : NodeAnchorRegistry.get(name)
      if (typeof anchorFn !== 'function') {
        throw new Error(`Invalid anchor: "${name}"`)
      }
    }

    const anchor = anchorFn.call(
      this,
      cellView,
      magnet,
      ref,
      anchorDef.args || {},
      endType,
      this,
    )

    return anchor ? anchor.round(this.decimalsRounding) : new Point()
  }

  protected findRoutePoints(vertices: Point.PointLike[] = []) {
    const defaultRouter = this.graph.options.defaultRouter || Router.normal
    const router: Edge.RouterData = this.cell.getRouter() || defaultRouter
    let routePoints

    if (typeof router === 'function') {
      routePoints = (router as any).call(this, vertices, {}, this)
    } else {
      const name = router.name
      const args = router.args || {}

      const fn = name ? RouterRegistry.get(name) : Router.normal
      if (typeof fn !== 'function') {
        throw new Error(`Invalid router: "${name}"`)
      }

      routePoints = fn.call(this, vertices, args, this)
    }

    return routePoints == null
      ? vertices.map(p => Point.create(p))
      : routePoints
  }

  protected findConnectionPoints(
    routePoints: Point[],
    sourceAnchor: Point,
    targetAnchor: Point,
  ) {
    const edge = this.cell
    const graphOptions = this.graph.options
    const sourceTerminal = edge.getSource()
    const targetTerminal = edge.getTarget()
    const sourceView = this.sourceView
    const targetView = this.targetView
    const firstRoutePoint = routePoints[0]
    const lastRoutePoint = routePoints[routePoints.length - 1]

    // source
    let sourcePoint
    if (sourceView && !sourceView.isEdgeElement(this.sourceMagnet)) {
      const sourceMagnet = this.sourceMagnet || sourceView.container
      const sourcePointRef = firstRoutePoint || targetAnchor
      const sourceLine = new Line(sourcePointRef, sourceAnchor)
      const connectionPointDef =
        sourceTerminal.connectionPoint || graphOptions.defaultConnectionPoint
      sourcePoint = this.getConnectionPoint(
        connectionPointDef,
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
    const graphOptions = this.graph.options as any

    // Backwards compatibility
    if (typeof graphOptions.linkConnectionPoint === 'function') {
      const elem = magnet === view.container ? undefined : magnet
      const connectionPoint = graphOptions.linkConnectionPoint.call(
        this,
        view,
        elem,
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
    const path: Path | string = fn.call(
      this,
      sourcePoint,
      targetPoint,
      routePoints,
      { ...args, raw: true },
      this,
    )

    return typeof path === 'string' ? Path.parse(path) : path
  }

  protected translateConnectionPoints(tx: number, ty: number) {
    const cache = this.markerCache
    if (cache.sourcePoint) {
      cache.sourcePoint.translate(tx, ty)
    }
    if (cache.targetPoint) {
      cache.targetPoint.translate(tx, ty)
    }
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
    let offset = this.options.toolsOffset
    const connectionLength = this.getConnectionLength()

    // Firefox returns `connectionLength=NaN` in odd cases (for bezier curves).
    // In that case we won't update tools position at all.
    if (connectionLength != null) {
      // If the edge is too short, make the tools half the
      // size and the offset twice as low.
      if (connectionLength < this.options.shortLength) {
        scale = 'scale(.5)'
        offset /= 2
      }

      let pos = this.getPointAtLength(offset)
      if (pos != null) {
        v.attr(
          this.toolCache,
          'transform',
          `translate(${pos.x},${pos.y}) ${scale}`,
        )
      }

      if (
        this.options.doubleTools &&
        connectionLength >= this.options.longLength
      ) {
        const doubleToolsOffset = this.options.doubleToolsOffset || offset

        pos = this.getPointAtLength(connectionLength - doubleToolsOffset)
        if (pos != null) {
          v.attr(
            this.tool2Cache,
            'transform',
            `translate(${pos.x},${pos.y}) ${scale}`,
          )
        }
        v.attr(this.tool2Cache, 'visibility', 'visible')
      } else if (this.options.doubleTools) {
        v.attr(this.tool2Cache, 'visibility', 'hidden')
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
      const sx = len < this.options.shortLength ? 0.5 : 1
      v.scale(sourceArrowhead as SVGElement, sx)
      v.scale(targetArrowhead as SVGElement, sx)
      this.translateAndAutoOrientArrows(sourceArrowhead, targetArrowhead)
    }

    return this
  }

  updateTerminalProperties(type: Edge.TerminalType) {
    const edge = this.cell
    const graph = this.graph
    const terminal = edge[type]
    const nodeId = terminal && (terminal as Edge.TerminalCellData).cell
    const viewKey = `${type}View` as 'sourceView' | 'targetView'

    // terminal is a point
    if (!nodeId) {
      this[viewKey] = null
      this.updateTerminalMagnet(type)
      return true
    }

    const terminalCell = graph.getCellById(nodeId)
    if (!terminalCell) {
      throw new Error(`Invalid ${type} cell.`)
    }

    const endView = terminalCell.findView(graph)
    if (!endView) {
      return false
    }

    this[viewKey] = endView
    this.updateTerminalMagnet(type)
    return true
  }

  updateTerminalMagnet(type: Edge.TerminalType) {
    const propName = `${type}Magnet` as 'sourceMagnet' | 'targetMagnet'
    const terminalView = this.getTerminalView(type)
    if (terminalView) {
      let magnet = terminalView.getMagnetFromEdgeTerminal(this.cell[type])
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
        this.graph.drawPane,
      )
    }

    if (targetArrow) {
      v.translateAndAutoOrient(
        targetArrow as SVGElement,
        this.targetPoint,
        route[route.length - 1] || this.sourcePoint,
        this.graph.drawPane,
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
    vToken.appendTo(this.graph.drawPane).animateAlongPath(props, path)

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

  // #region events

  protected getEventArgs<E>(e: E): EdgeView.MouseEventArgs<E>
  protected getEventArgs<E>(
    e: E,
    x: number,
    y: number,
  ): EdgeView.PositionEventArgs<E>
  protected getEventArgs<E>(e: E, x?: number, y?: number) {
    const view = this // tslint:disable-line
    const edge = view.cell
    const cell = edge
    if (x == null || y == null) {
      return { e, view, edge, cell } as EdgeView.MouseEventArgs<E>
    }
    return { e, x, y, view, edge, cell } as EdgeView.PositionEventArgs<E>
  }

  notifyMouseDown(e: JQuery.MouseDownEvent, x: number, y: number) {
    super.onMouseDown(e, x, y)
    this.notify('edge:mousedown', this.getEventArgs(e, x, y))
  }

  notifyMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number) {
    super.onMouseMove(e, x, y)
    this.notify('edge:mousemove', this.getEventArgs(e, x, y))
  }

  notifyMouseUp(e: JQuery.MouseUpEvent, x: number, y: number) {
    super.onMouseUp(e, x, y)
    this.notify('edge:mouseup', this.getEventArgs(e, x, y))
  }

  onClick(e: JQuery.ClickEvent, x: number, y: number) {
    super.onClick(e, x, y)
    this.notify('edge:click', this.getEventArgs(e, x, y))
  }

  onDblClick(e: JQuery.DoubleClickEvent, x: number, y: number) {
    super.onDblClick(e, x, y)
    this.notify('edge:dblclick', this.getEventArgs(e, x, y))
  }

  onContextMenu(e: JQuery.ContextMenuEvent, x: number, y: number) {
    super.onContextMenu(e, x, y)
    this.notify('edge:contextmenu', this.getEventArgs(e, x, y))
  }

  onMouseDown(e: JQuery.MouseDownEvent, x: number, y: number) {
    this.notifyMouseDown(e, x, y)
    const className = e.target.getAttribute('class')
    switch (className) {
      case 'vertex':
        this.startVertexDragging(e, x, y)
        return

      case 'vertex-remove':
      case 'vertex-remove-area':
        this.handleVertexRemoving(e, x, y)
        return

      case 'connection':
      case 'connection-wrap':
        this.handleVertexAdding(e, x, y)
        return

      case 'arrowhead':
        this.startArrowheadDragging(e, x, y)
        return

      case 'source-marker':
      case 'target-marker':
        return
    }

    this.startEdgeDragging(e, x, y)
  }

  onMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData(e)
    switch (data.action) {
      case 'drag-vertex':
        this.dragVertex(e, x, y)
        break

      case 'drag-label':
        this.dragLabel(e, x, y)
        break

      case 'drag-arrowhead':
        this.dragArrowhead(e, x, y)
        break

      case 'drag-edge':
        this.dragEdge(e, x, y)
        break
    }

    this.notifyMouseMove(e, x, y)
  }

  onMouseUp(e: JQuery.MouseUpEvent, x: number, y: number) {
    const data = this.getEventData(e)
    switch (data.action) {
      case 'drag-vertex':
        this.stopVertexDragging(e, x, y)
        break

      case 'drag-label':
        this.stopLabelDragging(e, x, y)
        break

      case 'drag-arrowhead':
        this.stopArrowheadDragging(e, x, y)
        break

      case 'drag-edge':
        this.stopEdgeDragging(e, x, y)
    }

    this.notifyMouseUp(e, x, y)
    this.checkMouseleave(e)
  }

  onMouseOver(e: JQuery.MouseOverEvent) {
    super.onMouseOver(e)
    this.notify('edge:mouseover', this.getEventArgs(e))
  }

  onMouseOut(e: JQuery.MouseOutEvent) {
    super.onMouseOut(e)
    this.notify('edge:mouseout', this.getEventArgs(e))
  }

  onMouseEnter(e: JQuery.MouseEnterEvent) {
    super.onMouseEnter(e)
    this.notify('edge:mouseenter', this.getEventArgs(e))
  }

  onMouseLeave(e: JQuery.MouseLeaveEvent) {
    super.onMouseLeave(e)
    this.notify('edge:mouseleave', this.getEventArgs(e))
  }

  onMouseWheel(e: JQuery.TriggeredEvent, x: number, y: number, delta: number) {
    super.onMouseWheel(e, x, y, delta)
    this.notify('edge:mousewheel', {
      delta,
      ...this.getEventArgs(e, x, y),
    })
  }

  onCustomEvent(e: JQuery.MouseDownEvent, name: string, x: number, y: number) {
    // For default edge tool
    const tool = v.findParentByClass(e.target, 'edge-tool', this.container)
    if (tool) {
      e.stopPropagation() // no further action to be executed
      if (this.can('useLinkTools')) {
        if (name === 'edge:remove') {
          this.cell.remove({ ui: true })
          return
        }
        this.notify('edge:customevent', { name, ...this.getEventArgs(e, x, y) })
      }

      this.notifyMouseDown(e as JQuery.MouseDownEvent, x, y)
    } else {
      this.notify('edge:customevent', { name, ...this.getEventArgs(e, x, y) })
      super.onCustomEvent(e, name, x, y)
    }
  }

  onLabelMouseDown(e: JQuery.MouseDownEvent, x: number, y: number) {
    this.notifyMouseDown(e, x, y)
    this.startLabelDragging(e, x, y)

    const stopPropagation = this.getEventData(e).stopPropagation
    if (stopPropagation) {
      e.stopPropagation()
    }
  }

  // #region drag edge

  protected startEdgeDragging(e: JQuery.MouseDownEvent, x: number, y: number) {
    if (!this.can('linkMove')) {
      return
    }

    this.setEventData<EventData.EdgeDragging>(e, {
      x,
      y,
      action: 'drag-edge',
    })
  }

  protected dragEdge(e: JQuery.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData<EventData.EdgeDragging>(e)
    this.cell.translate(x - data.x, y - data.y, { ui: true })
    this.setEventData<Partial<EventData.EdgeDragging>>(e, { x, y })
  }

  protected stopEdgeDragging(e: JQuery.MouseUpEvent, x: number, y: number) {}

  // #endregion

  // #region drag arrowhead

  prepareArrowheadDragging(
    type: Edge.TerminalType,
    options: {
      fallbackAction?: EventData.ArrowheadDragging['fallbackAction']
    } = {},
  ) {
    const magnet = this.getTerminalMagnet(type)
    const data: EventData.ArrowheadDragging = {
      action: 'drag-arrowhead',
      terminalType: type,
      initialMagnet: magnet,
      initialTerminal: ObjectExt.clone(this.cell[type]) as Edge.TerminalData,
      fallbackAction: options.fallbackAction || 'revert',
      getValidateConnectionArgs: this.createValidateConnectionArgs(type),
    }

    this.beforeArrowheadDragging(data)

    return data
  }

  protected createValidateConnectionArgs(type: Edge.TerminalType) {
    const args: EventData.ValidateConnectionArgs = [] as any

    args[4] = type
    args[5] = this

    let opposite: Edge.TerminalType
    let i = 0
    let j = 0

    if (type === 'source') {
      i = 2
      opposite = 'target'
    } else {
      j = 2
      opposite = 'source'
    }

    const terminal = this.cell[opposite]
    const cellId = (terminal as Edge.TerminalCellData).cell
    if (cellId) {
      let magnet
      const view = (args[i] = this.graph.findViewByCell(cellId))
      if (view) {
        magnet = view.getMagnetFromEdgeTerminal(terminal)
        if (magnet === view.container) {
          magnet = undefined
        }
      }
      args[i + 1] = magnet
    }

    return (cellView: CellView, magnet: Element) => {
      args[j] = cellView
      args[j + 1] = cellView.container === magnet ? undefined : magnet
      return args
    }
  }

  protected beforeArrowheadDragging(data: EventData.ArrowheadDragging) {
    data.zIndex = this.cell.zIndex
    this.cell.toFront()

    const style = (this.container as HTMLElement).style
    data.pointerEvents = style.pointerEvents
    style.pointerEvents = 'none'

    if (this.graph.options.markAvailable) {
      this.markAvailableMagnets(data)
    }
  }

  protected afterArrowheadDragging(data: EventData.ArrowheadDragging) {
    if (data.zIndex != null) {
      this.cell.setZIndex(data.zIndex, { ui: true })
      data.zIndex = null
    }

    const container = this.container as HTMLElement
    container.style.pointerEvents = data.pointerEvents || null

    if (this.graph.options.markAvailable) {
      this.unmarkAvailableMagnets(data)
    }
  }

  protected arrowheadDragging(
    target: Element,
    x: number,
    y: number,
    data: EventData.ArrowheadDragging,
  ) {
    // Checking views right under the pointer
    if (data.currentTarget !== target) {
      // Unhighlight the previous view under pointer if there was one.
      if (data.currentMagnet && data.currentView) {
        data.currentView.unhighlight(data.currentMagnet, {
          type: 'connecting',
        })
      }

      data.currentView = this.graph.findView(target)
      if (data.currentView) {
        // If we found a view that is under the pointer, we need to find
        // the closest magnet based on the real target element of the event.
        data.currentMagnet = data.currentView.findMagnet(target)

        if (
          data.currentMagnet &&
          this.graph.options.validateConnection.apply(
            this.graph,
            data.getValidateConnectionArgs(
              data.currentView,
              data.currentMagnet,
            ),
          )
        ) {
          data.currentView.highlight(data.currentMagnet, {
            type: 'connecting',
          })
        } else {
          // This type of connection is not valid. Disregard this magnet.
          data.currentMagnet = null
        }
      } else {
        // Make sure we'll unset previous magnet.
        data.currentMagnet = null
      }
    }

    data.currentTarget = target
    this.cell.prop(data.terminalType, { x, y }, { ui: true })
  }

  protected arrowheadDragged(
    data: EventData.ArrowheadDragging,
    x: number,
    y: number,
  ) {
    const view = data.currentView
    const magnet = data.currentMagnet
    if (!magnet || !view) {
      return
    }

    view.unhighlight(magnet, { type: 'connecting' })

    const type = data.terminalType
    const terminal = view.getEdgeTerminal(magnet, x, y, this.cell, type)
    this.cell.prop(type, terminal, { ui: true })
  }

  protected snapArrowhead(
    x: number,
    y: number,
    data: EventData.ArrowheadDragging,
  ) {
    const graph = this.graph
    const snapLinks = graph.options.snapLinks as any
    const radius = (typeof snapLinks === 'object' && snapLinks.radius) || 50
    const views = graph.findViewsInArea({
      x: x - radius,
      y: y - radius,
      width: 2 * radius,
      height: 2 * radius,
    })

    const prevView = data.closestView || null
    const prevMagnet = data.closestMagnet || null

    data.closestView = null
    data.closestMagnet = null

    let distance
    let minDistance = Number.MAX_SAFE_INTEGER
    const pos = new Point(x, y)

    views.forEach(view => {
      if (view.container.getAttribute('magnet') !== 'false') {
        // Find distance from the center of the cell to pointer coordinates
        distance = view.cell
          .getBBox()
          .getCenter()
          .distance(pos)
        // the connection is looked up in a circle area by `distance < r`
        if (distance < radius && distance < minDistance) {
          if (
            prevMagnet === view.container ||
            graph.options.validateConnection.apply(
              graph,
              data.getValidateConnectionArgs(view, null),
            )
          ) {
            minDistance = distance
            data.closestView = view
            data.closestMagnet = view.container
          }
        }
      }

      view.$('[magnet]').each((index, elem) => {
        const magnet = elem as Element
        const bbox = view.getNodeBBox(magnet)
        distance = pos.distance(bbox.getCenter())
        if (distance < radius && distance < minDistance) {
          if (
            prevMagnet === magnet ||
            graph.options.validateConnection.apply(
              graph,
              data.getValidateConnectionArgs(view, magnet),
            )
          ) {
            minDistance = distance
            data.closestView = view
            data.closestMagnet = magnet
          }
        }
      })
    })

    let terminal
    const type = data.terminalType
    const closestView = (data.closestView as any) as CellView
    const closestMagnet = (data.closestMagnet as any) as Element
    const changed = prevMagnet !== closestMagnet

    if (prevView && changed) {
      prevView.unhighlight(prevMagnet, {
        type: 'connecting',
      })
    }

    if (closestView) {
      if (!changed) {
        return
      }
      closestView.highlight(closestMagnet, {
        type: 'connecting',
      })
      terminal = closestView.getEdgeTerminal(
        closestMagnet,
        x,
        y,
        this.cell,
        type,
      )
    } else {
      terminal = { x, y }
    }

    this.cell.prop(type, terminal || { x, y }, { ui: true })
  }

  protected snapArrowheadEnd(data: EventData.ArrowheadDragging) {
    // Finish off link snapping.
    // Everything except view unhighlighting was already done on pointermove.
    const closestView = data.closestView
    const closestMagnet = data.closestMagnet
    if (closestView && closestMagnet) {
      closestView.unhighlight(closestMagnet, {
        type: 'connecting',
      })
      data.currentMagnet = closestView.findMagnet(closestMagnet)
    }

    data.closestView = null
    data.closestMagnet = null
  }

  protected finishEmbedding(data: EventData.ArrowheadDragging) {
    // Resets parent of the edge if embedding is enabled
    if (this.graph.options.embeddingMode && this.cell.updateParent()) {
      // Make sure we don't reverse to the original 'z' index
      data.zIndex = null
    }
  }

  protected fallbackConnection(data: EventData.ArrowheadDragging) {
    switch (data.fallbackAction) {
      case 'remove':
        this.cell.remove({ ui: true })
        break
      case 'revert':
      default:
        this.cell.prop(data.terminalType, data.initialTerminal, {
          ui: true,
        })
        break
    }
  }

  protected notifyConnectionEvent(
    data: EventData.ArrowheadDragging,
    e: JQuery.MouseUpEvent,
  ) {
    const type = data.terminalType
    const initialTerminal = data.initialTerminal
    const currentTerminal = this.cell[type]
    const changed =
      currentTerminal && !Edge.equalTerminals(initialTerminal, currentTerminal)

    if (changed) {
      const graph = this.graph
      const prevCellId = (initialTerminal as Edge.TerminalCellData).cell
      if (prevCellId) {
        this.notify('edge:disconnected', {
          e,
          type,
          view: graph.findViewByCell(prevCellId) as CellView,
          magnet: data.initialMagnet,
        })
      }

      const currCellId = (currentTerminal as Edge.TerminalCellData).cell
      if (currCellId) {
        this.notify('edge:connected', {
          e,
          type,
          view: graph.findViewByCell(currCellId) as CellView,
          magnet: data.currentMagnet,
        })
      }
    }
  }

  protected markAvailableMagnets(data: EventData.ArrowheadDragging) {
    const graph = this.graph
    const cells = graph.model.getCells()
    data.marked = {}

    for (let i = 0, ii = cells.length; i < ii; i += 1) {
      const view = graph.findViewByCell(cells[i])

      if (!view) {
        continue
      }

      const magnets: Element[] = Array.prototype.slice.call(
        view.container.querySelectorAll('[magnet]'),
      )

      if (view.container.getAttribute('magnet') !== 'false') {
        magnets.push(view.container)
      }

      const validate = graph.options.validateConnection
      const availableMagnets = magnets.filter(magnet =>
        validate.apply(graph, data.getValidateConnectionArgs(view, magnet)),
      )

      if (availableMagnets.length > 0) {
        // highlight all available magnets
        for (let j = 0, jj = availableMagnets.length; j < jj; j += 1) {
          view.highlight(availableMagnets[j], { type: 'magnetAvailability' })
        }

        // highlight the entire view
        view.highlight(null, { type: 'nodeAvailability' })
        data.marked[view.cell.id] = availableMagnets
      }
    }
  }

  protected unmarkAvailableMagnets(data: EventData.ArrowheadDragging) {
    const marked = data.marked || {}
    Object.keys(marked).forEach(id => {
      const view = this.graph.findViewByCell(id)

      if (view) {
        const magnets = marked[id]
        magnets.forEach(magnet => {
          view.unhighlight(magnet, { type: 'magnetAvailability' })
        })

        view.unhighlight(null, { type: 'nodeAvailability' })
      }
    })
    data.marked = null
  }

  protected startArrowheadDragging(
    e: JQuery.MouseDownEvent,
    x: number,
    y: number,
  ) {
    if (!this.can('arrowheadMove')) {
      return
    }

    const elem = e.target
    const type = elem.getAttribute('data-terminal') as Edge.TerminalType
    const data = this.prepareArrowheadDragging(type)
    this.setEventData<EventData.ArrowheadDragging>(e, data)
  }

  protected dragArrowhead(e: JQuery.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData<EventData.ArrowheadDragging>(e)
    if (this.graph.options.snapLinks) {
      this.snapArrowhead(x, y, data)
    } else {
      this.arrowheadDragging(this.getEventTarget(e), x, y, data)
    }
  }

  protected stopArrowheadDragging(
    e: JQuery.MouseUpEvent,
    x: number,
    y: number,
  ) {
    const graph = this.graph
    const data = this.getEventData<EventData.ArrowheadDragging>(e)

    if (graph.options.snapLinks) {
      this.snapArrowheadEnd(data)
    } else {
      this.arrowheadDragged(data, x, y)
    }

    if (!graph.linkAllowed(this)) {
      // If the changed link is not allowed, revert to its previous state.
      this.fallbackConnection(data)
    } else {
      this.finishEmbedding(data)
      this.notifyConnectionEvent(data, e)
    }

    this.afterArrowheadDragging(data)
  }

  // #endregion

  // #region drag lable

  startLabelDragging(e: JQuery.MouseDownEvent, x: number, y: number) {
    if (this.can('labelMove')) {
      const target = e.currentTarget
      const index = parseInt(target.getAttribute('data-index'), 10)
      const positionAngle = this.getLabelPositionAngle(index)
      const labelPositionArgs = this.getLabelPositionArgs(index)
      const defaultLabelPositionArgs = this.getDefaultLabelPositionArgs()
      const positionArgs = this.mergeLabelPositionArgs(
        labelPositionArgs,
        defaultLabelPositionArgs,
      )

      this.setEventData<EventData.LabelDragging>(e, {
        index,
        positionAngle,
        positionArgs,
        stopPropagation: true,
        action: 'drag-label',
      })
    } else {
      // If labels can't be dragged no default action is triggered.
      this.setEventData(e, { stopPropagation: true })
    }

    this.graph.delegateDragEvents(e, this)
  }

  dragLabel(e: JQuery.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData<EventData.LabelDragging>(e)
    const label = {
      position: this.getLabelPosition(
        x,
        y,
        data.positionAngle,
        data.positionArgs,
      ),
    }
    this.cell.setLabelAt(data.index, label)
  }

  stopLabelDragging(e: JQuery.MouseUpEvent, x: number, y: number) {}

  // #endregion

  // #region drag vertex

  handleVertexAdding(e: JQuery.MouseDownEvent, x: number, y: number) {
    if (!this.can('vertexAdd')) {
      return
    }

    // Store the index at which the new vertex has just been placed.
    // We'll be update the very same vertex position in `pointermove()`.
    const index = this.addVertex({ x, y }, { ui: true })
    this.setEventData(e, {
      index,
      action: 'drag-vertex',
    })
  }

  handleVertexRemoving(e: JQuery.MouseDownEvent, x: number, y: number) {
    if (!this.can('vertexRemove')) {
      return
    }

    const target = e.target
    const index = parseInt(target.getAttribute('idx'), 10)
    this.cell.removeVertexAt(index)
  }

  startVertexDragging(e: JQuery.MouseDownEvent, x: number, y: number) {
    if (!this.can('vertexMove')) {
      return
    }

    const target = e.target
    const index = parseInt(target.getAttribute('idx'), 10)
    this.setEventData<EventData.VertexDragging>(e, {
      index,
      action: 'drag-vertex',
    })
  }

  dragVertex(e: JQuery.MouseMoveEvent, x: number, y: number) {
    const data = this.getEventData<EventData.VertexDragging>(e)
    this.cell.setVertexAt(data.index, { x, y }, { ui: true })
  }

  stopVertexDragging(e: JQuery.MouseUpEvent, x: number, y: number) {}

  // #endregion

  // #endregion
}

export namespace EdgeView {
  export interface Options extends CellView.Options {
    perpendicular: boolean
    doubleTools: boolean
    shortLength: number
    longLength: number
    toolsOffset: number
    doubleToolsOffset: number
    sampleInterval: number
  }

  export interface ContainerCache {
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

export namespace EdgeView {
  export interface MouseEventArgs<E> {
    e: E
    edge: Edge
    cell: Edge
    view: EdgeView
  }

  export interface PositionEventArgs<E>
    extends MouseEventArgs<E>,
      CellView.PositionEventArgs {}

  export interface EventArgs {
    'edge:click': PositionEventArgs<JQuery.ClickEvent>
    'edge:dblclick': PositionEventArgs<JQuery.DoubleClickEvent>
    'edge:contextmenu': PositionEventArgs<JQuery.ContextMenuEvent>
    'edge:mousedown': PositionEventArgs<JQuery.MouseDownEvent>
    'edge:mousemove': PositionEventArgs<JQuery.MouseMoveEvent>
    'edge:mouseup': PositionEventArgs<JQuery.MouseUpEvent>
    'edge:mouseover': MouseEventArgs<JQuery.MouseOverEvent>
    'edge:mouseout': MouseEventArgs<JQuery.MouseOutEvent>
    'edge:mouseenter': MouseEventArgs<JQuery.MouseEnterEvent>
    'edge:mouseleave': MouseEventArgs<JQuery.MouseLeaveEvent>
    'edge:mousewheel': PositionEventArgs<JQuery.TriggeredEvent> &
      CellView.MouseDeltaEventArgs

    'edge:customevent': EdgeView.PositionEventArgs<JQuery.MouseDownEvent> & {
      name: string
    }

    'edge:connected': {
      e: JQuery.MouseUpEvent
      type: Edge.TerminalType
      view: CellView
      magnet?: Element | null
    }
    'edge:disconnected': EventArgs['edge:connected']

    'edge:highlight': {
      magnet: Element
      view: EdgeView
      edge: Edge
      cell: Edge
      options: CellView.HighlightOptions
    }
    'edge:unhighlight': EventArgs['edge:highlight']
  }
}

namespace EventData {
  export interface MousemoveEventData {}

  export interface EdgeDragging {
    action: 'drag-edge'
    x: number
    y: number
  }

  export type ValidateConnectionArgs = [
    CellView | null | undefined, // source view
    Element | null | undefined, // source magnet
    CellView | null | undefined, // target view
    Element | null | undefined, // target magnet
    Edge.TerminalType,
    EdgeView,
  ]

  export interface ArrowheadDragging {
    action: 'drag-arrowhead'
    terminalType: Edge.TerminalType
    fallbackAction: 'remove' | 'revert'
    initialMagnet: Element | null
    initialTerminal: Edge.TerminalData
    getValidateConnectionArgs: (
      cellView: CellView,
      magnet: Element | null,
    ) => ValidateConnectionArgs
    zIndex?: number | null
    pointerEvents?: string | null
    /**
     * Current event target.
     */
    currentTarget?: Element
    /**
     * Current view under pointer.
     */
    currentView?: CellView | null
    /**
     * Current magnet under pointer.
     */
    currentMagnet?: Element | null
    closestView?: CellView | null
    closestMagnet?: Element | null
    marked?: KeyValue<Element[]> | null
  }

  export interface LabelDragging {
    action: 'drag-label'
    index: number
    positionAngle: number
    positionArgs?: Edge.LabelPositionOptions | null
    stopPropagation: true
  }

  export interface VertexDragging {
    action: 'drag-vertex'
    index: number
  }
}

EdgeView.config<EdgeView.Options>({
  isSvgElement: true,
  priority: 1,
  bootstrap: ['render', 'source', 'target'],
  actions: {
    view: ['render'],
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
  shortLength: 105,
  longLength: 155,
  toolsOffset: 40,
  doubleTools: false,
  doubleToolsOffset: 65,
  sampleInterval: 50,
})
