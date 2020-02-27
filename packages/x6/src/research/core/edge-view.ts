import { CellView } from './cell-view'
import { Edge } from './edge'
import { View } from './view'
import { v } from '../../v'
import { Rectangle, Point } from '../../geometry'
import { Polyline } from '../../shape'
import { StringExt } from '../../util'
import { Markup } from './markup'

export class EdgeView extends CellView<Edge> {
  sourceView: CellView | null
  targetView: CellView | null
  toolCache: any
  tool2Cache: any

  confirmUpdate(flag: number, options: any = {}) {
    let ref = flag
    if (this.hasAction(ref, 'source')) {
      if (!this.updateEndProperties(true)) {
        return ref
      }
      ref = this.removeAction(ref, 'source')
    }

    if (this.hasAction(ref, 'target')) {
      if (!this.updateEndProperties(false)) {
        return ref
      }
      ref = this.removeAction(ref, 'target')
    }

    const edge = this.cell
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
        'tools',
        'labels',
      ])
      return ref
    }

    ref = this.handleAction(ref, 'vertices', () => this.renderVertexMarkers())

    ref = this.handleAction(ref, 'update', () =>
      this.update(edge, null, options),
    )

    ref = this.handleAction(ref, 'labels', () =>
      this.onLabelsChange(edge, edge.labels, options),
    )

    ref = this.handleAction(ref, 'tools', () =>
      this.renderTools().updateToolsPosition(),
    )

    return ref
  }

  isLabelsRenderRequired(options: any = {}) {
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
        const labelExists = !!previousLabels[pathArray[1]]
        if (labelExists) {
          if (pathLength === 2) {
            // We are changing the entire label. Need to check if the
            // markup is also being changed.
            return 'markup' in Object(options.propertyValue)
          }
          if (pathArray[2] !== 'markup') {
            // We are changing a label property but not the markup
            return false
          }
        }
      }
    }

    return true
  }

  onLabelsChange(_link, _labels, options: any = {}) {
    // Note: this optimization works in async=false mode only
    if (this.isLabelsRenderRequired(options)) {
      this.renderLabels()
    } else {
      this.updateLabels()
    }

    this.updateLabelPositions()
  }

  // #region render

  protected V: { [selector: string]: Element }
  protected labelCache: { [index: number]: Element }
  protected labelSelectors: { [index: number]: Markup.Selectors }

  render() {
    this.empty()
    this.V = {}
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

  protected renderJSONMarkup(markup: View.JSONMarkup | View.JSONMarkup[]) {
    const ret = this.parseJSONMarkup(markup, this.container)
    this.selectors = ret.selectors
    this.container.append(ret.fragment)
  }

  protected renderStringMarkup(markup: string) {
    const cache = this.V
    const children = v.batch(markup)
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
    const cell = this.cell
    const labels = cell.labels
    const cache = this.V
    let labelContainer = cache.labels

    if (labels.length === 0) {
      if (labelContainer) {
        this.remove(labelContainer)
      }
      return this
    }

    if (labelContainer) {
      this.empty(labelContainer)
    } else {
      const vel = v.create('g').addClass('labels')
      labelContainer = cache.labels = vel.node
    }

    this.labelCache = {}
    this.labelSelectors = {}

    for (let i = 0, ii = labels.length; i < ii; i += 1) {
      const label = labels[i]
      const labelMarkup = this.normalizeLabelMarkup(
        this.getLabelMarkup(label.markup),
      )
      let labelNode
      let selectors
      if (labelMarkup) {
        labelNode = labelMarkup.node
        selectors = labelMarkup.selectors
      } else {
        const builtinDefaultLabel = cell.defaultLabel
        const builtinDefaultLabelMarkup = this.normalizeLabelMarkup(
          this.getLabelMarkup(builtinDefaultLabel.markup),
        )
        const defaultLabel = cell._getDefaultLabel()
        const defaultLabelMarkup = this.normalizeLabelMarkup(
          this.getLabelMarkup(defaultLabel.markup),
        )
        const defaultMarkup = defaultLabelMarkup || builtinDefaultLabelMarkup

        labelNode = defaultMarkup.node
        selectors = defaultMarkup.selectors
      }

      labelNode.setAttribute('data-index', `${i}`)
      labelContainer.appendChild(labelNode)

      const rootSelector = this.rootSelector
      if (selectors[rootSelector]) {
        throw new Error('Ambiguous label root selector.')
      }
      selectors[rootSelector] = labelNode

      this.labelCache[i] = labelNode
      this.labelSelectors[i] = selectors
    }

    if (!labelContainer.parentNode) {
      this.container.appendChild(labelContainer)
    }

    this.updateLabels()

    return this
  }

  protected getLabelMarkup(markup?: View.Markup) {
    if (markup) {
      if (typeof markup === 'string') {
        return this.getLabelStringMarkup(markup)
      }
      return this.parseJSONMarkup(markup)
    }

    return null
  }

  protected getLabelStringMarkup(labelMarkup: string) {
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
      selectors: View.Selectors
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

  updateLabels() {
    if (!this.V.labels) return this

    const cell = this.cell
    const labels = cell.labels
    const canLabelMove = this.can('labelMove')

    const builtinDefaultLabel = cell.defaultLabel
    const builtinDefaultLabelAttrs = builtinDefaultLabel.attrs

    const defaultLabel = cell._getDefaultLabel()
    const defaultLabelMarkup = defaultLabel.markup
    const defaultLabelAttrs = defaultLabel.attrs

    for (let i = 0, n = labels.length; i < n; i += 1) {
      const labelNode = this.labelCache[i]
      const selectors = this.labelSelectors[i]

      labelNode.setAttribute('cursor', canLabelMove ? 'move' : 'default')

      const label = labels[i]
      const labelMarkup = label.markup
      const labelAttrs = label.attrs

      const attrs = this.mergeLabelAttrs(
        labelMarkup || defaultLabelMarkup,
        labelAttrs,
        defaultLabelAttrs,
        builtinDefaultLabelAttrs,
      )

      this.updateAttrs(labelNode, attrs, {
        selectors,
        rootBBox: Rectangle.fromSize(label.size),
      })
    }

    return this
  }

  protected mergeLabelAttrs(
    hasCustomMarkup,
    labelAttrs,
    defaultLabelAttrs,
    builtinDefaultLabelAttrs,
  ) {
    if (labelAttrs == null) {
      return null
    }

    if (labelAttrs == null) {
      if (defaultLabelAttrs === null) return null
      if (defaultLabelAttrs === undefined) {
        if (hasCustomMarkup) return undefined
        return builtinDefaultLabelAttrs
      }

      if (hasCustomMarkup) return defaultLabelAttrs
      return merge({}, builtinDefaultLabelAttrs, defaultLabelAttrs)
    }

    if (hasCustomMarkup) return merge({}, defaultLabelAttrs, labelAttrs)
    return merge({}, builtinDefaultLabelAttrs, defaultLabelAttrs, labelAttrs)
  }

  /**
   * Tools are a group of clickable elements that manipulate the whole link.
   * A good example of this is the remove tool that removes the whole link.
   * Tools appear after hovering the link close to the `source` element/point
   * of the link but are offset a bit so that they don't cover the `marker-arrowhead`.
   */
  renderTools() {
    if (this.V.linkTools == null) {
      return this
    }

    const $tools = this.$(this.V.linkTools.node).empty()
    let toolTemplate = template(this.cell.toolMarkup)
    const tool = V(toolTemplate())

    $tools.append(tool.node)

    // Cache the tool node so that the `updateToolsPosition()` can update the tool position quickly.
    this.toolCache = tool

    // If `doubleLinkTools` is enabled, we render copy of the tools on the other side of the
    // link as well but only if the link is longer than `longLinkLength`.
    if (this.options.doubleLinkTools) {
      let tool2
      const doubleToolMarkup = this.cell.doubleToolMarkup
      if (doubleToolMarkup) {
        toolTemplate = template(doubleToolMarkup)
        tool2 = V(toolTemplate())
      } else {
        tool2 = tool.clone()
      }

      $tools.append(tool2.node)
      this.tool2Cache = tool2
    }

    return this
  }

  renderVertexMarkers() {
    if (this.V.markerVertices == null) {
      return this
    }

    const $markerVertices = this.$(this.V.markerVertices.node).empty()

    // A special markup can be given in the `properties.vertexMarkup` property. This might be handy
    // if default styling (elements) are not desired. This makes it possible to use any
    // SVG elements for .marker-vertex and .marker-vertex-remove tools.
    const markupTemplate = template(this.cell.vertexMarkup)

    this.cell.getVertices().forEach((vertex, idx) => {
      $markerVertices.append(V(markupTemplate(assign({ idx }, vertex))).node)
    })

    return this
  }

  renderArrowheadMarkers() {
    // Custom markups might not have arrowhead markers. Therefore, jump of this function immediately if that's the case.
    if (this.V.markerArrowheads == null) {
      return this
    }

    const $markerArrowheads = this.$(this.V.markerArrowheads.node)

    $markerArrowheads.empty()

    // A special markup can be given in the `properties.vertexMarkup` property. This might be handy
    // if default styling (elements) are not desired. This makes it possible to use any
    // SVG elements for .marker-vertex and .marker-vertex-remove tools.
    const markupTemplate = template(this.cell.arrowheadMarkup)
    this.V.sourceArrowhead = V(markupTemplate({ end: 'source' }))
    this.V.targetArrowhead = V(markupTemplate({ end: 'target' }))

    $markerArrowheads.append(
      this.V.sourceArrowhead.node,
      this.V.targetArrowhead.node,
    )

    return this
  }

  // #endregion

  // #region updating

  update(edge: Edge, attributes, options: any = {}) {
    this.cleanNodesCache()

    // update the link path
    this.updateConnection(options)

    this.updateAttrs(this.container, edge.attrs, {
      selectors: this.selectors,
    })

    this.updateDefaultConnectionPath()

    // update the label position etc.
    this.updateLabelPositions()
    this.updateToolsPosition()
    this.updateArrowheadMarkers()

    this.updateTools(options)

    // *Deprecated*
    // Local perpendicular flag (as opposed to one defined on paper).
    // Could be enabled inside a connector/router. It's valid only
    // during the update execution.
    this.options.perpendicular = null

    return this
  }

  removeRedundantLinearVertices(opt) {
    const SIMPLIFY_THRESHOLD = 0.001

    const edge = this.cell
    const vertices = edge.vertices()
    const routePoints = [this.sourceAnchor, ...vertices, this.targetAnchor]
    const numRoutePoints = routePoints.length

    // put routePoints into a polyline and try to simplify
    const polyline = new Polyline(routePoints)
    polyline.simplify({ threshold: SIMPLIFY_THRESHOLD })
    const polylinePoints = polyline.points.map(point => point.toJSON()) // JSON of points after simplification
    const numPolylinePoints = polylinePoints.length // number of points after simplification

    // shortcut if simplification did not remove any redundant vertices:
    if (numRoutePoints === numPolylinePoints) return 0

    // else: set simplified polyline points as link vertices
    // remove first and last polyline points again (= source/target anchors)
    edge.vertices(polylinePoints.slice(1, numPolylinePoints - 1), opt)
    return numRoutePoints - numPolylinePoints
  }

  updateDefaultConnectionPath() {
    const cache = this.V

    if (cache.connection) {
      cache.connection.attr('d', this.getSerializedConnection())
    }

    if (cache.connectionWrap) {
      cache.connectionWrap.attr('d', this.getSerializedConnection())
    }

    if (cache.markerSource && cache.markerTarget) {
      this._translateAndAutoOrientArrows(cache.markerSource, cache.markerTarget)
    }
  }

  getEndView(type: 'source' | 'target') {
    switch (type) {
      case 'source':
        return this.sourceView || null
      case 'target':
        return this.targetView || null
      default:
        throw new Error('dia.LinkView: type parameter required.')
    }
  }

  getEndAnchor(type: 'source' | 'target') {
    switch (type) {
      case 'source':
        return new Point(this.sourceAnchor)
      case 'target':
        return new Point(this.targetAnchor)
      default:
        throw new Error('dia.LinkView: type parameter required.')
    }
  }

  getEndConnectionPoint(type: 'source' | 'target') {
    switch (type) {
      case 'source':
        return new Point(this.sourcePoint)
      case 'target':
        return new Point(this.targetPoint)
      default:
        throw new Error('dia.LinkView: type parameter required.')
    }
  }

  getEndMagnet(type: 'source' | 'target') {
    switch (type) {
      case 'source':
        const sourceView = this.sourceView
        if (!sourceView) break
        return this.sourceMagnet || sourceView.el
      case 'target':
        const targetView = this.targetView
        if (!targetView) break
        return this.targetMagnet || targetView.el
      default:
        throw new Error('dia.LinkView: type parameter required.')
    }
    return null
  }

  updateConnection(opt: any = {}) {
    const edge = this.cell
    let route
    let path

    if (opt.translateBy && edge.isRelationshipEmbeddedIn(opt.translateBy)) {
      // The link is being translated by an ancestor that will
      // shift source point, target point and all vertices
      // by an equal distance.
      const tx = opt.tx || 0
      const ty = opt.ty || 0

      route = new Polyline(this.route).translate(tx, ty).points

      // translate source and target connection and marker points.
      this._translateConnectionPoints(tx, ty)

      // translate the path itself
      path = this.path
      path.translate(tx, ty)
    } else {
      const vertices = edge.vertices()
      // 1. Find Anchors

      const anchors = this.findAnchors(vertices)
      const sourceAnchor = (this.sourceAnchor = anchors.source)
      const targetAnchor = (this.targetAnchor = anchors.target)

      // 2. Find Route
      route = this.findRoute(vertices, opt)

      // 3. Find Connection Points
      const connectionPoints = this.findConnectionPoints(
        route,
        sourceAnchor,
        targetAnchor,
      )
      const sourcePoint = (this.sourcePoint = connectionPoints.source)
      const targetPoint = (this.targetPoint = connectionPoints.target)

      // 3b. Find Marker Connection Point - Backwards Compatibility
      const markerPoints = this.findMarkerPoints(
        route,
        sourcePoint,
        targetPoint,
      )

      // 4. Find Connection
      path = this.findPath(
        route,
        markerPoints.source || sourcePoint,
        markerPoints.target || targetPoint,
      )
    }

    this.route = route
    this.path = path
    this.metrics = {}
  }

  findMarkerPoints(route, sourcePoint, targetPoint) {
    const firstWaypoint = route[0]
    const lastWaypoint = route[route.length - 1]

    // Move the source point by the width of the marker taking into account
    // its scale around x-axis. Note that scale is the only transform that
    // makes sense to be set in `.marker-source` attributes object
    // as all other transforms (translate/rotate) will be replaced
    // by the `translateAndAutoOrient()` function.
    const cache = this._markerCache
    // cache source and target points
    let sourceMarkerPoint, targetMarkerPoint

    if (this.V.markerSource) {
      cache.sourceBBox = cache.sourceBBox || this.V.markerSource.getBBox()
      sourceMarkerPoint = Point(sourcePoint)
        .move(
          firstWaypoint || targetPoint,
          cache.sourceBBox.width * this.V.markerSource.scale().sx * -1,
        )
        .round()
    }

    if (this.V.markerTarget) {
      cache.targetBBox = cache.targetBBox || this.V.markerTarget.getBBox()
      targetMarkerPoint = Point(targetPoint)
        .move(
          lastWaypoint || sourcePoint,
          cache.targetBBox.width * this.V.markerTarget.scale().sx * -1,
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

  findAnchorsOrdered(firstEndType, firstRef, secondEndType, secondRef) {
    let firstAnchor, secondAnchor
    let firstAnchorRef, secondAnchorRef
    const model = this.model
    const firstDef = model.get(firstEndType)
    const secondDef = model.get(secondEndType)
    const firstView = this.getEndView(firstEndType)
    const secondView = this.getEndView(secondEndType)
    const firstMagnet = this.getEndMagnet(firstEndType)
    const secondMagnet = this.getEndMagnet(secondEndType)

    // Anchor first
    if (firstView) {
      if (firstRef) {
        firstAnchorRef = new Point(firstRef)
      } else if (secondView) {
        firstAnchorRef = secondMagnet
      } else {
        firstAnchorRef = new Point(secondDef)
      }
      firstAnchor = this.getAnchor(
        firstDef.anchor,
        firstView,
        firstMagnet,
        firstAnchorRef,
        firstEndType,
      )
    } else {
      firstAnchor = new Point(firstDef)
    }

    // Anchor second
    if (secondView) {
      secondAnchorRef = new Point(secondRef || firstAnchor)
      secondAnchor = this.getAnchor(
        secondDef.anchor,
        secondView,
        secondMagnet,
        secondAnchorRef,
        secondEndType,
      )
    } else {
      secondAnchor = new Point(secondDef)
    }

    const res = {}
    res[firstEndType] = firstAnchor
    res[secondEndType] = secondAnchor
    return res
  }

  findAnchors(vertices) {
    const model = this.model
    const firstVertex = vertices[0]
    const lastVertex = vertices[vertices.length - 1]

    if (model.target().priority && !model.source().priority) {
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

  findConnectionPoints(route, sourceAnchor, targetAnchor) {
    const firstWaypoint = route[0]
    const lastWaypoint = route[route.length - 1]
    const model = this.model
    const sourceDef = model.get('source')
    const targetDef = model.get('target')
    const sourceView = this.sourceView
    const targetView = this.targetView
    const paperOptions = this.paper.options
    let sourceMagnet, targetMagnet

    // Connection Point Source
    let sourcePoint
    if (sourceView && !sourceView.isNodeConnection(this.sourceMagnet)) {
      sourceMagnet = this.sourceMagnet || sourceView.el
      const sourceConnectionPointDef =
        sourceDef.connectionPoint || paperOptions.defaultConnectionPoint
      const sourcePointRef = firstWaypoint || targetAnchor
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
    // Connection Point Target
    let targetPoint
    if (targetView && !targetView.isNodeConnection(this.targetMagnet)) {
      targetMagnet = this.targetMagnet || targetView.el
      const targetConnectionPointDef =
        targetDef.connectionPoint || paperOptions.defaultConnectionPoint
      const targetPointRef = lastWaypoint || sourceAnchor
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

  getAnchor(anchorDef, cellView, magnet, ref, endType) {
    const isConnection = cellView.isNodeConnection(magnet)
    const paperOptions = this.paper.options
    if (!anchorDef) {
      if (isConnection) {
        anchorDef = paperOptions.defaultLinkAnchor
      } else {
        if (paperOptions.perpendicularLinks || this.options.perpendicular) {
          // Backwards compatibility
          // If `perpendicularLinks` flag is set on the paper and there are vertices
          // on the link, then try to find a connection point that makes the link perpendicular
          // even though the link won't point to the center of the targeted object.
          anchorDef = { name: 'perpendicular' }
        } else {
          anchorDef = paperOptions.defaultAnchor
        }
      }
    }

    if (!anchorDef) throw new Error('Anchor required.')
    let anchorFn
    if (typeof anchorDef === 'function') {
      anchorFn = anchorDef
    } else {
      const anchorName = anchorDef.name
      const anchorNamespace = isConnection
        ? 'linkAnchorNamespace'
        : 'anchorNamespace'
      anchorFn = paperOptions[anchorNamespace][anchorName]
      if (typeof anchorFn !== 'function') {
        throw new Error('Unknown anchor: ' + anchorName)
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
    if (!anchor) return new Point()
    return anchor.round(this.decimalsRounding)
  }

  getConnectionPoint(connectionPointDef, view, magnet, line, endType) {
    let connectionPoint
    const anchor = line.end
    const paperOptions = this.paper.options

    // Backwards compatibility
    if (typeof paperOptions.linkConnectionPoint === 'function') {
      const linkConnectionMagnet = magnet === view.el ? undefined : magnet
      connectionPoint = paperOptions.linkConnectionPoint(
        this,
        view,
        linkConnectionMagnet,
        line.start,
        endType,
      )
      if (connectionPoint) return connectionPoint
    }

    if (!connectionPointDef) return anchor
    let connectionPointFn
    if (typeof connectionPointDef === 'function') {
      connectionPointFn = connectionPointDef
    } else {
      const connectionPointName = connectionPointDef.name
      connectionPointFn =
        paperOptions.connectionPointNamespace[connectionPointName]
      if (typeof connectionPointFn !== 'function') {
        throw new Error('Unknown connection point: ' + connectionPointName)
      }
    }
    connectionPoint = connectionPointFn.call(
      this,
      line,
      view,
      magnet,
      connectionPointDef.args || {},
      endType,
      this,
    )
    if (!connectionPoint) return anchor
    return connectionPoint.round(this.decimalsRounding)
  }

  _translateConnectionPoints(tx, ty) {
    const cache = this._markerCache

    cache.sourcePoint.offset(tx, ty)
    cache.targetPoint.offset(tx, ty)
    this.sourcePoint.offset(tx, ty)
    this.targetPoint.offset(tx, ty)
    this.sourceAnchor.offset(tx, ty)
    this.targetAnchor.offset(tx, ty)
  }

  // if label position is a number, normalize it to a position object
  // this makes sure that label positions can be merged properly
  _normalizeLabelPosition(labelPosition) {
    if (typeof labelPosition === 'number') {
      return { distance: labelPosition, offset: null, angle: 0, args: null }
    }
    return labelPosition
  }

  updateLabelPositions() {
    if (!this.V.labels) return this

    const path = this.path
    if (!path) return this

    // This method assumes all the label nodes are stored in the `this._labelCache` hash table
    // by their indices in the `this.get('labels')` array. This is done in the `renderLabels()` method.

    const model = this.model
    const labels = model.get('labels') || []
    if (!labels.length) return this

    const builtinDefaultLabel = model._builtins.defaultLabel
    const builtinDefaultLabelPosition = builtinDefaultLabel.position

    const defaultLabel = model._getDefaultLabel()
    const defaultLabelPosition = this._normalizeLabelPosition(
      defaultLabel.position,
    )

    const defaultPosition = merge(
      {},
      builtinDefaultLabelPosition,
      defaultLabelPosition,
    )

    for (let idx = 0, n = labels.length; idx < n; idx++) {
      const label = labels[idx]
      const labelPosition = this._normalizeLabelPosition(label.position)
      const position = merge({}, defaultPosition, labelPosition)
      const transformationMatrix = this._getLabelTransformationMatrix(position)
      this.labelCache[idx].setAttribute(
        'transform',
        V.matrixToTransformString(transformationMatrix),
      )
    }

    return this
  }

  updateToolsPosition() {
    if (!this.V.linkTools) return this

    // Move the tools a bit to the target position but don't cover the `sourceArrowhead` marker.
    // Note that the offset is hardcoded here. The offset should be always
    // more than the `this.$('.marker-arrowhead[end="source"]')[0].bbox().width` but looking
    // this up all the time would be slow.

    let scale = ''
    let offset = this.options.linkToolsOffset
    const connectionLength = this.getConnectionLength()

    // Firefox returns connectionLength=NaN in odd cases (for bezier curves).
    // In that case we won't update tools position at all.
    if (!Number.isNaN(connectionLength)) {
      // If the link is too short, make the tools half the size and the offset twice as low.
      if (connectionLength < this.options.shortLinkLength) {
        scale = 'scale(.5)'
        offset /= 2
      }

      let toolPosition = this.getPointAtLength(offset)

      this.toolCache.attr(
        'transform',
        'translate(' + toolPosition.x + ', ' + toolPosition.y + ') ' + scale,
      )

      if (
        this.options.doubleLinkTools &&
        connectionLength >= this.options.longLinkLength
      ) {
        const doubleLinkToolsOffset =
          this.options.doubleLinkToolsOffset || offset

        toolPosition = this.getPointAtLength(
          connectionLength - doubleLinkToolsOffset,
        )
        this.tool2Cache.attr(
          'transform',
          'translate(' + toolPosition.x + ', ' + toolPosition.y + ') ' + scale,
        )
        this.tool2Cache.attr('visibility', 'visible')
      } else if (this.options.doubleLinkTools) {
        this.tool2Cache.attr('visibility', 'hidden')
      }
    }

    return this
  }

  updateArrowheadMarkers() {
    if (!this.V.markerArrowheads) return this

    // getting bbox of an element with `display="none"` in IE9 ends up with access violation
    if ($.css(this.V.markerArrowheads.node, 'display') === 'none') return this

    const sx =
      this.getConnectionLength() < this.options.shortLinkLength ? 0.5 : 1
    this.V.sourceArrowhead.scale(sx)
    this.V.targetArrowhead.scale(sx)

    this._translateAndAutoOrientArrows(
      this.V.sourceArrowhead,
      this.V.targetArrowhead,
    )

    return this
  }

  updateEndProperties(isSource: boolean) {
    const edge = this.cell
    const graph = this.graph
    const endType = isSource ? 'source' : 'target'
    const terminal = isSource ? edge.source : edge.target
    const terminalId = terminal && terminal.id
    const endViewProperty = isSource ? `${endType}View` : `${endType}View`

    if (!terminalId) {
      // terminal is a point
      this[endViewProperty] = null
      this.updateEndMagnet(endType)
      return true
    }

    const endModel = graph.getModelById(terminalId)
    if (!endModel) throw new Error('LinkView: invalid ' + endType + ' cell.')

    const endView = endModel.findView(graph)
    if (!endView) {
      // A view for a model should always exist
      return false
    }

    this[endViewProperty] = endView
    this.updateEndMagnet(endType)
    return true
  }

  updateEndMagnet(endType) {
    const endMagnetProperty = `${endType}Magnet`
    const endView = this.getEndView(endType)
    if (endView) {
      let connectedMagnet = endView.getMagnetFromLinkEnd(
        this.model.get(endType),
      )
      if (connectedMagnet === endView.el) connectedMagnet = null
      this[endMagnetProperty] = connectedMagnet
    } else {
      this[endMagnetProperty] = null
    }
  }

  _translateAndAutoOrientArrows(sourceArrow, targetArrow) {
    // Make the markers "point" to their sticky points being auto-oriented towards
    // `targetPosition`/`sourcePosition`. And do so only if there is a markup for them.
    const route = toArray(this.route)
    if (sourceArrow) {
      sourceArrow.translateAndAutoOrient(
        this.sourcePoint,
        route[0] || this.targetPoint,
        this.paper.cells,
      )
    }

    if (targetArrow) {
      targetArrow.translateAndAutoOrient(
        this.targetPoint,
        route[route.length - 1] || this.sourcePoint,
        this.paper.cells,
      )
    }
  }

  _getLabelPositionAngle(idx) {
    const labelPosition = this.model.label(idx).position || {}
    return labelPosition.angle || 0
  }

  _getLabelPositionArgs(idx) {
    const labelPosition = this.model.label(idx).position || {}
    return labelPosition.args
  }

  _getDefaultLabelPositionArgs() {
    const defaultLabel = this.model._getDefaultLabel()
    const defaultLabelPosition = defaultLabel.position || {}
    return defaultLabelPosition.args
  }

  // merge default label position args into label position args
  // keep `undefined` or `null` because `{}` means something else
  _mergeLabelPositionArgs(labelPositionArgs, defaultLabelPositionArgs) {
    if (labelPositionArgs === null) return null
    if (labelPositionArgs === undefined) {
      if (defaultLabelPositionArgs === null) return null
      return defaultLabelPositionArgs
    }

    return merge({}, defaultLabelPositionArgs, labelPositionArgs)
  }

  // Add default label at given position at end of `labels` array.
  // Four signatures:
  // - obj, obj = point, opt
  // - obj, num, obj = point, angle, opt
  // - num, num, obj = x, y, opt
  // - num, num, num, obj = x, y, angle, opt
  // Assigns relative coordinates by default:
  // `opt.absoluteDistance` forces absolute coordinates.
  // `opt.reverseDistance` forces reverse absolute coordinates (if absoluteDistance = true).
  // `opt.absoluteOffset` forces absolute coordinates for offset.
  // Additional args:
  // `opt.keepGradient` auto-adjusts the angle of the label to match path gradient at position.
  // `opt.ensureLegibility` rotates labels so they are never upside-down.
  addLabel(p1, p2, p3, p4) {
    // normalize data from the four possible signatures
    let localX
    let localY
    let localAngle = 0
    let localOpt
    if (typeof p1 !== 'number') {
      // {x, y} object provided as first parameter
      localX = p1.x
      localY = p1.y
      if (typeof p2 === 'number') {
        // angle and opt provided as second and third parameters
        localAngle = p2
        localOpt = p3
      } else {
        // opt provided as second parameter
        localOpt = p2
      }
    } else {
      // x and y provided as first and second parameters
      localX = p1
      localY = p2
      if (typeof p3 === 'number') {
        // angle and opt provided as third and fourth parameters
        localAngle = p3
        localOpt = p4
      } else {
        // opt provided as third parameter
        localOpt = p3
      }
    }

    // merge label position arguments
    const defaultLabelPositionArgs = this._getDefaultLabelPositionArgs()
    const labelPositionArgs = localOpt
    const positionArgs = this._mergeLabelPositionArgs(
      labelPositionArgs,
      defaultLabelPositionArgs,
    )

    // append label to labels array
    const label = {
      position: this.getLabelPosition(localX, localY, localAngle, positionArgs),
    }
    const idx = -1
    this.model.insertLabel(idx, label, localOpt)
    return idx
  }

  // Add a new vertex at calculated index to the `vertices` array.
  addVertex(x, y, opt) {
    // accept input in form `{ x, y }, opt` or `x, y, opt`
    const isPointProvided = typeof x !== 'number'
    const localX = isPointProvided ? x.x : x
    const localY = isPointProvided ? x.y : y
    const localOpt = isPointProvided ? y : opt

    const vertex = { x: localX, y: localY }
    const idx = this.getVertexIndex(localX, localY)
    this.model.insertVertex(idx, vertex, localOpt)
    return idx
  }

  // Send a token (an SVG element, usually a circle) along the connection path.
  // Example: `link.findView(paper).sendToken(V('circle', { r: 7, fill: 'green' }).node)`
  // `opt.duration` is optional and is a time in milliseconds that the token travels from the source to the target of the link. Default is `1000`.
  // `opt.directon` is optional and it determines whether the token goes from source to target or other way round (`reverse`)
  // `opt.connection` is an optional selector to the connection path.
  // `callback` is optional and is a function to be called once the token reaches the target.
  sendToken(token, opt, callback) {
    function onAnimationEnd(vToken, callback) {
      return function() {
        vToken.remove()
        if (typeof callback === 'function') {
          callback()
        }
      }
    }

    let duration, isReversed, selector
    if (isObject(opt)) {
      duration = opt.duration
      isReversed = opt.direction === 'reverse'
      selector = opt.connection
    } else {
      // Backwards compatibility
      duration = opt
      isReversed = false
      selector = null
    }

    duration = duration || 1000

    const animationAttributes = {
      dur: duration + 'ms',
      repeatCount: 1,
      calcMode: 'linear',
      fill: 'freeze',
    }

    if (isReversed) {
      animationAttributes.keyPoints = '1;0'
      animationAttributes.keyTimes = '0;1'
    }

    const vToken = V(token)
    let connection
    if (typeof selector === 'string') {
      // Use custom connection path.
      connection = this.findBySelector(selector, this.el, this.selectors)[0]
    } else {
      // Select connection path automatically.
      const cache = this.V
      connection = cache.connection
        ? cache.connection.node
        : this.el.querySelector('path')
    }

    if (!(connection instanceof SVGPathElement)) {
      throw new Error(
        'dia.LinkView: token animation requires a valid connection path.',
      )
    }

    vToken
      .appendTo(this.paper.cells)
      .animateAlongPath(animationAttributes, connection)

    setTimeout(onAnimationEnd(vToken, callback), duration)
  }

  findRoute(vertices) {
    vertices || (vertices = [])

    const namespace = routers
    let router = this.model.router()
    const defaultRouter = this.paper.options.defaultRouter

    if (!router) {
      if (defaultRouter) router = defaultRouter
      else return vertices.map(Point) // no router specified
    }

    const routerFn = isFunction(router) ? router : namespace[router.name]
    if (!isFunction(routerFn)) {
      throw new Error('dia.LinkView: unknown router: "' + router.name + '".')
    }

    const args = router.args || {}

    const route = routerFn.call(
      this, // context
      vertices, // vertices
      args, // options
      this, // linkView
    )

    if (!route) return vertices.map(Point)
    return route
  }

  // Return the `d` attribute value of the `<path>` element representing the link
  // between `source` and `target`.
  findPath(route, sourcePoint, targetPoint) {
    const namespace = connectors
    let connector = this.model.connector()
    const defaultConnector = this.paper.options.defaultConnector

    if (!connector) {
      connector = defaultConnector || {}
    }

    const connectorFn = isFunction(connector)
      ? connector
      : namespace[connector.name]
    if (!isFunction(connectorFn)) {
      throw new Error(
        'dia.LinkView: unknown connector: "' + connector.name + '".',
      )
    }

    const args = clone(connector.args || {})
    args.raw = true // Request raw g.Path as the result.

    let path = connectorFn.call(
      this, // context
      sourcePoint, // start point
      targetPoint, // end point
      route, // vertices
      args, // options
      this, // linkView
    )

    if (typeof path === 'string') {
      // Backwards compatibility for connectors not supporting `raw` option.
      path = new Path(V.normalizePathData(path))
    }

    return path
  }

  // #endregion

  getConnection() {
    const path = this.path
    if (!path) return null

    return path.clone()
  }

  getSerializedConnection() {
    const path = this.path
    if (!path) return null

    const metrics = this.metrics
    if (metrics.hasOwnProperty('data')) return metrics.data
    const data = path.serialize()
    metrics.data = data
    return data
  }

  getConnectionSubdivisions() {
    const path = this.path
    if (!path) return null

    const metrics = this.metrics
    if (metrics.hasOwnProperty('segmentSubdivisions')) {
      return metrics.segmentSubdivisions
    }
    const subdivisions = path.getSegmentSubdivisions()
    metrics.segmentSubdivisions = subdivisions
    return subdivisions
  }

  getConnectionLength() {
    const path = this.path
    if (!path) return 0

    const metrics = this.metrics
    if (metrics.hasOwnProperty('length')) return metrics.length
    const length = path.length({
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
    metrics.length = length
    return length
  }

  getPointAtLength(length) {
    const path = this.path
    if (!path) return null

    return path.pointAtLength(length, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  getPointAtRatio(ratio) {
    const path = this.path
    if (!path) return null
    if (isPercentage(ratio)) ratio = parseFloat(ratio) / 100
    return path.pointAt(ratio, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  getTangentAtLength(length) {
    const path = this.path
    if (!path) return null

    return path.tangentAtLength(length, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  getTangentAtRatio(ratio) {
    const path = this.path
    if (!path) return null

    return path.tangentAt(ratio, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  getClosestPoint(point) {
    const path = this.path
    if (!path) return null

    return path.closestPoint(point, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  getClosestPointLength(point) {
    const path = this.path
    if (!path) return null

    return path.closestPointLength(point, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  getClosestPointRatio(point) {
    const path = this.path
    if (!path) return null

    return path.closestPointNormalizedLength(point, {
      segmentSubdivisions: this.getConnectionSubdivisions(),
    })
  }

  // Get label position object based on two provided coordinates, x and y.
  // (Used behind the scenes when user moves labels around.)
  // Two signatures:
  // - num, num, obj = x, y, options
  // - num, num, num, obj = x, y, angle, options
  // Accepts distance/offset options = `absoluteDistance: boolean`, `reverseDistance: boolean`, `absoluteOffset: boolean`
  // - `absoluteOffset` is necessary in order to move beyond connection endpoints
  // Additional options = `keepGradient: boolean`, `ensureLegibility: boolean`
  getLabelPosition(x, y, p3, p4) {
    const position = {}

    // normalize data from the two possible signatures
    let localAngle = 0
    let localOpt
    if (typeof p3 === 'number') {
      // angle and opt provided as third and fourth argument
      localAngle = p3
      localOpt = p4
    } else {
      // opt provided as third argument
      localOpt = p3
    }

    // save localOpt as `args` of the position object that is passed along
    if (localOpt) position.args = localOpt

    // identify distance/offset settings
    const isDistanceRelative = !(localOpt && localOpt.absoluteDistance) // relative by default
    const isDistanceAbsoluteReverse =
      localOpt && localOpt.absoluteDistance && localOpt.reverseDistance // non-reverse by default
    const isOffsetAbsolute = localOpt && localOpt.absoluteOffset // offset is non-absolute by default

    // find closest point t
    const path = this.path
    const pathOpt = { segmentSubdivisions: this.getConnectionSubdivisions() }
    const labelPoint = new Point(x, y)
    const t = path.closestPointT(labelPoint, pathOpt)

    // DISTANCE:
    let labelDistance = path.lengthAtT(t, pathOpt)
    if (isDistanceRelative) {
      labelDistance = labelDistance / this.getConnectionLength() || 0
    } // fix to prevent NaN for 0 length
    if (isDistanceAbsoluteReverse) {
      labelDistance = -1 * (this.getConnectionLength() - labelDistance) || 1
    } // fix for end point (-0 => 1)
    position.distance = labelDistance

    // OFFSET:
    // use absolute offset if:
    // - opt.absoluteOffset is true,
    // - opt.absoluteOffset is not true but there is no tangent
    let tangent
    if (!isOffsetAbsolute) tangent = path.tangentAtT(t)
    let labelOffset
    if (tangent) {
      labelOffset = tangent.pointOffset(labelPoint)
    } else {
      const closestPoint = path.pointAtT(t)
      const labelOffsetDiff = labelPoint.difference(closestPoint)
      labelOffset = { x: labelOffsetDiff.x, y: labelOffsetDiff.y }
    }
    position.offset = labelOffset

    // ANGLE:
    position.angle = localAngle

    return position
  }

  _getLabelTransformationMatrix(labelPosition) {
    let labelDistance
    let labelAngle = 0
    let args = {}
    if (typeof labelPosition === 'number') {
      labelDistance = labelPosition
    } else if (typeof labelPosition.distance === 'number') {
      args = labelPosition.args || {}
      labelDistance = labelPosition.distance
      labelAngle = labelPosition.angle || 0
    } else {
      throw new Error('dia.LinkView: invalid label position distance.')
    }

    const isDistanceRelative = labelDistance > 0 && labelDistance <= 1

    let labelOffset = 0
    const labelOffsetCoordinates = { x: 0, y: 0 }
    if (labelPosition.offset) {
      const positionOffset = labelPosition.offset
      if (typeof positionOffset === 'number') labelOffset = positionOffset
      if (positionOffset.x) labelOffsetCoordinates.x = positionOffset.x
      if (positionOffset.y) labelOffsetCoordinates.y = positionOffset.y
    }

    const isOffsetAbsolute =
      labelOffsetCoordinates.x !== 0 ||
      labelOffsetCoordinates.y !== 0 ||
      labelOffset === 0

    const isKeepGradient = args.keepGradient
    const isEnsureLegibility = args.ensureLegibility

    const path = this.path
    const pathOpt = { segmentSubdivisions: this.getConnectionSubdivisions() }

    const distance = isDistanceRelative
      ? labelDistance * this.getConnectionLength()
      : labelDistance
    const tangent = path.tangentAtLength(distance, pathOpt)

    let translation
    let angle = labelAngle
    if (tangent) {
      if (isOffsetAbsolute) {
        translation = tangent.start
        translation.offset(labelOffsetCoordinates)
      } else {
        const normal = tangent.clone()
        normal.rotate(tangent.start, -90)
        normal.setLength(labelOffset)
        translation = normal.end
      }
      if (isKeepGradient) {
        angle = tangent.angle() + labelAngle
        if (isEnsureLegibility) {
          angle = normalizeAngle(((angle + 90) % 180) - 90)
        }
      }
    } else {
      // fallback - the connection has zero length
      translation = path.start
      if (isOffsetAbsolute) translation.offset(labelOffsetCoordinates)
    }

    return V.createSVGMatrix()
      .translate(translation.x, translation.y)
      .rotate(angle)
  }

  getLabelCoordinates(labelPosition) {
    const transformationMatrix = this._getLabelTransformationMatrix(
      labelPosition,
    )
    return new Point(transformationMatrix.e, transformationMatrix.f)
  }

  getVertexIndex(x, y) {
    const model = this.model
    const vertices = model.vertices()

    const vertexLength = this.getClosestPointLength(new Point(x, y))

    let idx = 0
    for (const n = vertices.length; idx < n; idx++) {
      const currentVertex = vertices[idx]
      const currentVertexLength = this.getClosestPointLength(currentVertex)
      if (vertexLength < currentVertexLength) break
    }

    return idx
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

  pointermove(evt: JQuery.MouseMoveEvent, x: number, y: number) {
    // Backwards compatibility
    const dragData = this._dragData
    if (dragData) this.eventData(evt, dragData)

    const data = this.eventData(evt)
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
      assign(dragData, this.eventData(evt))
    }

    this.notifyPointermove(evt, x, y)
  }

  pointerup(evt: JQuery.MouseUpEvent, x: number, y: number) {
    // Backwards compatibility
    const dragData = this._dragData
    if (dragData) {
      this.eventData(evt, dragData)
      this._dragData = null
    }

    const data = this.eventData(evt)
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

  mouseover(evt: JQuery.MouseOverEvent) {
    super.mouseover(evt)
    this.notify('edge:mouseover', evt)
  }

  mouseout(evt: JQuery.MouseOutEvent) {
    super.mouseout(evt)
    this.notify('edge:mouseout', evt)
  }

  mouseenter(evt: JQuery.MouseEnterEvent) {
    super.mouseenter(evt)
    this.notify('edge:mouseenter', evt)
  }

  mouseleave(evt: JQuery.MouseLeaveEvent) {
    super.mouseleave(evt)
    this.notify('edge:mouseleave', evt)
  }

  mousewheel(evt: JQuery.TriggeredEvent, x: number, y: number, delta: number) {
    super.mousewheel(evt, x, y, delta)
    this.notify('edge:mousewheel', evt, x, y, delta)
  }

  onevent(evt: JQuery.TriggeredEvent, eventName: string, x: number, y: number) {
    // Backwards compatibility
    const linkTool = V(evt.target).findParentByClass('link-tool', this.el)
    if (linkTool) {
      // No further action to be executed
      evt.stopPropagation()

      // Allow `interactive.useLinkTools=false`
      if (this.can('useLinkTools')) {
        if (eventName === 'remove') {
          // Built-in remove event
          this.model.remove({ ui: true })
          // Do not trigger link pointerdown
          return
        }
        // edge:options and other custom events inside the link tools
        this.notify(eventName, evt, x, y)
      }

      this.notifyPointerdown(evt, x, y)
    } else {
      super.onevent(evt, eventName, x, y)
    }
  }

  onlabel(evt, x: number, y: number) {
    this.notifyPointerdown(evt, x, y)
    this.dragLabelStart(evt, x, y)

    const stopPropagation = this.eventData(evt).stopPropagation
    if (stopPropagation) evt.stopPropagation()
  }

  // Drag Start Handlers

  dragConnectionStart(evt, x: number, y: number) {
    if (!this.can('vertexAdd')) return

    // Store the index at which the new vertex has just been placed.
    // We'll be update the very same vertex position in `pointermove()`.
    const vertexIdx = this.addVertex({ x, y }, { ui: true })
    this.eventData(evt, {
      action: 'vertex-move',
      vertexIdx,
    })
  }

  dragLabelStart(evt, _x: number, _y: number) {
    if (this.can('labelMove')) {
      const labelNode = evt.currentTarget
      const labelIdx = parseInt(labelNode.getAttribute('data-index'), 10)

      const positionAngle = this._getLabelPositionAngle(labelIdx)
      const labelPositionArgs = this._getLabelPositionArgs(labelIdx)
      const defaultLabelPositionArgs = this._getDefaultLabelPositionArgs()
      const positionArgs = this._mergeLabelPositionArgs(
        labelPositionArgs,
        defaultLabelPositionArgs,
      )

      this.eventData(evt, {
        action: 'label-move',
        labelIdx,
        positionAngle,
        positionArgs,
        stopPropagation: true,
      })
    } else {
      // Backwards compatibility:
      // If labels can't be dragged no default action is triggered.
      this.eventData(evt, { stopPropagation: true })
    }

    this.paper.delegateDragEvents(this, evt.data)
  }

  dragVertexStart(evt, x: number, y: number) {
    if (!this.can('vertexMove')) return

    const vertexNode = evt.target
    const vertexIdx = parseInt(vertexNode.getAttribute('idx'), 10)
    this.eventData(evt, {
      action: 'vertex-move',
      vertexIdx,
    })
  }

  dragVertexRemoveStart(evt, x: number, y: number) {
    if (!this.can('vertexRemove')) return

    const removeNode = evt.target
    const vertexIdx = parseInt(removeNode.getAttribute('idx'), 10)
    this.model.removeVertex(vertexIdx)
  }

  dragArrowheadStart(evt, x: number, y: number) {
    if (!this.can('arrowheadMove')) return

    const arrowheadNode = evt.target
    const arrowheadType = arrowheadNode.getAttribute('end')
    const data = this.startArrowheadMove(arrowheadType, {
      ignoreBackwardsCompatibility: true,
    })

    this.eventData(evt, data)
  }

  dragStart(evt, x: number, y: number) {
    if (!this.can('linkMove')) return

    this.eventData(evt, {
      action: 'move',
      dx: x,
      dy: y,
    })
  }

  // Drag Handlers
  dragLabel(evt, x: number, y: number) {
    const data = this.eventData(evt)
    const label = {
      position: this.getLabelPosition(
        x,
        y,
        data.positionAngle,
        data.positionArgs,
      ),
    }
    this.model.label(data.labelIdx, label)
  }

  dragVertex(evt, x: number, y: number) {
    const data = this.eventData(evt)
    this.model.vertex(data.vertexIdx, { x, y }, { ui: true })
  }

  dragArrowhead(evt, x: number, y: number) {
    const data = this.eventData(evt)

    if (this.paper.options.snapLinks) {
      this._snapArrowhead(x, y, data)
    } else {
      this._connectArrowhead(this.getEventTarget(evt), x, y, data)
    }
  }

  drag(evt, x: number, y: number) {
    const data = this.eventData(evt)
    this.model.translate(x - data.dx, y - data.dy, { ui: true })
    this.eventData(evt, {
      dx: x,
      dy: y,
    })
  }

  // Drag End Handlers

  dragLabelEnd() {
    // noop
  }

  dragVertexEnd() {
    // noop
  }

  dragArrowheadEnd(evt, x: number, y: number) {
    const data = this.eventData(evt)
    const paper = this.paper

    if (paper.options.snapLinks) {
      this._snapArrowheadEnd(data)
    } else {
      this._connectArrowheadEnd(data, x, y)
    }

    if (!paper.linkAllowed(this)) {
      // If the changed link is not allowed, revert to its previous state.
      this._disallow(data)
    } else {
      this._finishEmbedding(data)
      this._notifyConnectEvent(data, evt)
    }

    this._afterArrowheadMove(data)
  }

  dragEnd() {
    // noop
  }

  _disallow(data) {
    switch (data.whenNotAllowed) {
      case 'remove':
        this.model.remove({ ui: true })
        break

      case 'revert':
      default:
        this.model.set(data.arrowhead, data.initialEnd, { ui: true })
        break
    }
  }

  _finishEmbedding(data) {
    // Reparent the link if embedding is enabled
    if (this.paper.options.embeddingMode && this.model.reparent()) {
      // Make sure we don't reverse to the original 'z' index (see afterArrowheadMove()).
      data.z = null
    }
  }

  _notifyConnectEvent(data, evt) {
    const arrowhead = data.arrowhead
    const initialEnd = data.initialEnd
    const currentEnd = this.model.prop(arrowhead)
    const endChanged = currentEnd && !Link.endsEqual(initialEnd, currentEnd)
    if (endChanged) {
      const paper = this.paper
      if (initialEnd.id) {
        this.notify(
          'edge:disconnect',
          evt,
          paper.findViewByModel(initialEnd.id),
          data.initialMagnet,
          arrowhead,
        )
      }
      if (currentEnd.id) {
        this.notify(
          'edge:connect',
          evt,
          paper.findViewByModel(currentEnd.id),
          data.magnetUnderPointer,
          arrowhead,
        )
      }
    }
  }

  _snapArrowhead(x: number, y: number, data) {
    // checking view in close area of the pointer

    const r = this.paper.options.snapLinks.radius || 50
    const viewsInArea = this.paper.findViewsInArea({
      x: x - r,
      y: y - r,
      width: 2 * r,
      height: 2 * r,
    })

    const prevClosestView = data.closestView || null
    const prevClosestMagnet = data.closestMagnet || null

    data.closestView = data.closestMagnet = null

    let distance
    let minDistance = Number.MAX_VALUE
    const pointer = Point(x, y)
    const paper = this.paper

    viewsInArea.forEach(function(view) {
      // skip connecting to the element in case '.': { magnet: false } attribute present
      if (view.el.getAttribute('magnet') !== 'false') {
        // find distance from the center of the model to pointer coordinates
        distance = view.model
          .getBBox()
          .center()
          .distance(pointer)

        // the connection is looked up in a circle area by `distance < r`
        if (distance < r && distance < minDistance) {
          if (
            prevClosestMagnet === view.el ||
            paper.options.validateConnection.apply(
              paper,
              data.validateConnectionArgs(view, null),
            )
          ) {
            minDistance = distance
            data.closestView = view
            data.closestMagnet = view.el
          }
        }
      }

      view.$('[magnet]').each(
        function(index, magnet) {
          const bbox = view.getNodeBBox(magnet)

          distance = pointer.distance({
            x: bbox.x + bbox.width / 2,
            y: bbox.y + bbox.height / 2,
          })

          if (distance < r && distance < minDistance) {
            if (
              prevClosestMagnet === magnet ||
              paper.options.validateConnection.apply(
                paper,
                data.validateConnectionArgs(view, magnet),
              )
            ) {
              minDistance = distance
              data.closestView = view
              data.closestMagnet = magnet
            }
          }
        }.bind(this),
      )
    }, this)

    let end
    const closestView = data.closestView
    const closestMagnet = data.closestMagnet
    const endType = data.arrowhead
    const newClosestMagnet = prevClosestMagnet !== closestMagnet
    if (prevClosestView && newClosestMagnet) {
      prevClosestView.unhighlight(prevClosestMagnet, {
        connecting: true,
        snapping: true,
      })
    }

    if (closestView) {
      if (!newClosestMagnet) return

      closestView.highlight(closestMagnet, {
        connecting: true,
        snapping: true,
      })
      end = closestView.getLinkEnd(closestMagnet, x, y, this.model, endType)
    } else {
      end = { x, y }
    }

    this.model.set(endType, end || { x, y }, { ui: true })
  }

  _snapArrowheadEnd(data) {
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

  _connectArrowhead(target, x: number, y: number, data) {
    // checking views right under the pointer

    if (data.eventTarget !== target) {
      // Unhighlight the previous view under pointer if there was one.
      if (data.magnetUnderPointer) {
        data.viewUnderPointer.unhighlight(data.magnetUnderPointer, {
          connecting: true,
        })
      }

      data.viewUnderPointer = this.paper.findView(target)
      if (data.viewUnderPointer) {
        // If we found a view that is under the pointer, we need to find the closest
        // magnet based on the real target element of the event.
        data.magnetUnderPointer = data.viewUnderPointer.findMagnet(target)

        if (
          data.magnetUnderPointer &&
          this.paper.options.validateConnection.apply(
            this.paper,
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

    this.model.set(data.arrowhead, { x, y }, { ui: true })
  }

  _connectArrowheadEnd(data, x: number, y: number) {
    const view = data.viewUnderPointer
    const magnet = data.magnetUnderPointer
    if (!magnet || !view) return

    view.unhighlight(magnet, { connecting: true })

    const endType = data.arrowhead
    const end = view.getLinkEnd(magnet, x, y, this.model, endType)
    this.model.set(endType, end, { ui: true })
  }

  _beforeArrowheadMove(data) {
    data.z = this.model.get('z')
    this.model.toFront()

    // Let the pointer propagate through the link view elements so that
    // the `evt.target` is another element under the pointer, not the link itself.
    const style = this.el.style
    data.pointerEvents = style.pointerEvents
    style.pointerEvents = 'none'

    if (this.paper.options.markAvailable) {
      this._markAvailableMagnets(data)
    }
  }

  _afterArrowheadMove(data) {
    if (data.z !== null) {
      this.model.set('z', data.z, { ui: true })
      data.z = null
    }

    // Put `pointer-events` back to its original value. See `_beforeArrowheadMove()` for explanation.
    this.el.style.pointerEvents = data.pointerEvents

    if (this.paper.options.markAvailable) {
      this._unmarkAvailableMagnets(data)
    }
  }

  _createValidateConnectionArgs(arrowhead) {
    // It makes sure the arguments for validateConnection have the following form:
    // (source view, source magnet, target view, target magnet and link view)
    const args = []

    args[4] = arrowhead
    args[5] = this

    let oppositeArrowhead
    let i = 0
    let j = 0

    if (arrowhead === 'source') {
      i = 2
      oppositeArrowhead = 'target'
    } else {
      j = 2
      oppositeArrowhead = 'source'
    }

    const end = this.model.get(oppositeArrowhead)

    if (end.id) {
      const view = (args[i] = this.paper.findViewByModel(end.id))
      let magnet = view.getMagnetFromLinkEnd(end)
      if (magnet === view.el) magnet = undefined
      args[i + 1] = magnet
    }

    function validateConnectionArgs(cellView, magnet) {
      args[j] = cellView
      args[j + 1] = cellView.el === magnet ? undefined : magnet
      return args
    }

    return validateConnectionArgs
  }

  _markAvailableMagnets(data) {
    function isMagnetAvailable(view, magnet) {
      const paper = view.paper
      const validate = paper.options.validateConnection
      return validate.apply(paper, this.validateConnectionArgs(view, magnet))
    }

    const paper = this.paper
    const elements = paper.model.getCells()
    data.marked = {}

    for (let i = 0, n = elements.length; i < n; i++) {
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
        for (let j = 0, m = availableMagnets.length; j < m; j++) {
          view.highlight(availableMagnets[j], { magnetAvailability: true })
        }
        // highlight the entire view
        view.highlight(null, { elementAvailability: true })

        data.marked[view.model.id] = availableMagnets
      }
    }
  }

  _unmarkAvailableMagnets(data) {
    const markedKeys = Object.keys(data.marked)
    let id
    let markedMagnets

    for (let i = 0, n = markedKeys.length; i < n; i++) {
      id = markedKeys[i]
      markedMagnets = data.marked[id]

      const view = this.paper.findViewByModel(id)
      if (view) {
        for (let j = 0, m = markedMagnets.length; j < m; j++) {
          view.unhighlight(markedMagnets[j], { magnetAvailability: true })
        }
        view.unhighlight(null, { elementAvailability: true })
      }
    }

    data.marked = null
  }
  startArrowheadMove(end, opt) {
    opt || (opt = {})

    // Allow to delegate events from an another view to this linkView in order to trigger arrowhead
    // move without need to click on the actual arrowhead dom element.
    const data = {
      action: 'arrowhead-move',
      arrowhead: end,
      whenNotAllowed: opt.whenNotAllowed || 'revert',
      initialMagnet:
        this[end + 'Magnet'] ||
        (this[end + 'View'] ? this[end + 'View'].el : null),
      initialEnd: clone(this.model.get(end)),
      validateConnectionArgs: this._createValidateConnectionArgs(end),
    }

    this._beforeArrowheadMove(data)

    if (opt.ignoreBackwardsCompatibility !== true) {
      this._dragData = data
    }

    return data
  }

  get sourceBBox() {
    const sourceView = this.sourceView
    if (!sourceView) {
      const sourceDef = this.model.source()
      return new Rect(sourceDef.x, sourceDef.y)
    }
    const sourceMagnet = this.sourceMagnet
    if (sourceView.isNodeConnection(sourceMagnet)) {
      return new Rect(this.sourceAnchor)
    }
    return sourceView.getNodeBBox(sourceMagnet || sourceView.el)
  }

  get targetBBox() {
    const targetView = this.targetView
    if (!targetView) {
      const targetDef = this.model.target()
      return new Rect(targetDef.x, targetDef.y)
    }
    const targetMagnet = this.targetMagnet
    if (targetView.isNodeConnection(targetMagnet)) {
      return new Rect(this.targetAnchor)
    }
    return targetView.getNodeBBox(targetMagnet || targetView.el)
  }
}

EdgeView.setDefaults({
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
})
