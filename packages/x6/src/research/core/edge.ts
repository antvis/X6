import { Size, KeyValue } from '../../types'
import { ObjectExt, StringExt } from '../../util'
import { Point, Polyline } from '../../geometry'
import { EdgeAnchor, NodeAnchor } from '../anchor'
import { ConnectionPoint } from '../connection-point'
import { Attr } from '../attr'
import { Markup } from './markup'
import { Store } from './store'
import { Cell } from './cell'
import { Node } from './node'
import { Model } from './model'
import { EdgeRegistry } from '../registry'

export class Edge<
  Properties extends Edge.Properties = Edge.Properties
> extends Cell<Properties> {
  protected static defaults: Edge.Defaults = {}
  protected readonly store: Store<Edge.Properties>
  protected sourceCell: Cell | null
  protected targetCell: Cell | null

  constructor(options: Edge.Options = {}) {
    super(options)
  }

  protected prepare(options: Edge.Options) {
    const {
      source,
      sourceCell,
      sourcePort,
      sourcePoint,
      target,
      targetCell,
      targetPort,
      targetPoint,
      ...others
    } = options

    const data = others as Edge.BaseOptions

    if (source != null) {
      if (source instanceof Cell) {
        data.source = { cell: source.id }
      } else if (typeof source === 'string') {
        data.source = { cell: source }
      } else if (source instanceof Point) {
        data.source = source.toJSON()
      } else if (Array.isArray(source)) {
        data.source = { x: source[0], y: source[1] }
      } else {
        const cell = (source as Edge.TerminalCellLooseData).cell
        if (cell instanceof Cell) {
          data.source = {
            ...source,
            cell: cell.id,
          }
        } else {
          data.source = source as Edge.TerminalCellData
        }
      }
    }

    if (sourceCell != null || sourcePort != null) {
      let terminal = data.source as Edge.TerminalCellData
      if (sourceCell != null) {
        const id = typeof sourceCell === 'string' ? sourceCell : sourceCell.id
        if (terminal) {
          terminal.cell = id
        } else {
          terminal = data.source = { cell: id }
        }
      }

      if (sourcePort != null && terminal) {
        terminal.port = sourcePort
      }
    } else if (sourcePoint != null) {
      data.source = Point.create(sourcePoint).toJSON()
    }

    if (target != null) {
      if (target instanceof Cell) {
        data.target = { cell: target.id }
      } else if (typeof target === 'string') {
        data.target = { cell: target }
      } else if (target instanceof Point) {
        data.target = target.toJSON()
      } else if (Array.isArray(target)) {
        data.target = { x: target[0], y: target[1] }
      } else {
        const cell = (target as Edge.TerminalCellLooseData).cell
        if (cell instanceof Cell) {
          data.target = {
            ...target,
            cell: cell.id,
          }
        } else {
          data.target = target as Edge.TerminalCellData
        }
      }
    }

    if (targetCell != null || targetPort != null) {
      let terminal = data.target as Edge.TerminalCellData

      if (targetCell != null) {
        const id = typeof targetCell === 'string' ? targetCell : targetCell.id
        if (terminal) {
          terminal.cell = id
        } else {
          terminal = data.target = { cell: id }
        }
      }

      if (targetPort != null && terminal) {
        terminal.port = targetPort
      }
    } else if (targetPoint != null) {
      data.target = Point.create(targetPoint).toJSON()
    }

    return super.prepare(data)
  }

  protected setModel(model: Model | null) {
    if (model) {
      const sourceCellId = this.getSourceCellId()
      const targetCellId = this.getTargetCellId()
      const sourceCell =
        sourceCellId != null ? model.getCell(sourceCellId) : null
      const targetCell =
        targetCellId != null ? model.getCell(targetCellId) : null
      this.reference('source', sourceCell)
      this.reference('target', targetCell)
      this.updateParent()
    }
    super.setModel(model)
  }

  protected setup() {
    super.setup()
    this.on('change:labels', args => this.onLabelsChanged(args))
    this.on('change:vertices', args => this.onVertexsChanged(args))
  }

  isEdge(): this is Edge {
    return true
  }

  // #region terminal

  disconnect(options: Edge.SetOptions = {}) {
    this.store.set(
      {
        source: { x: 0, y: 0 },
        target: { x: 0, y: 0 },
      },
      options,
    )
    this.reference('source', null)
    this.reference('target', null)
    return this
  }

  get source() {
    return this.getSource()
  }

  set source(data: Edge.TerminalData) {
    this.setSource(data)
  }

  getSource() {
    return this.getTerminal('source')
  }

  getSourceCellId() {
    return (this.source as Edge.TerminalCellData).cell
  }

  getSourcePortId() {
    return (this.source as Edge.TerminalCellData).port
  }

  setSource(
    edge: Node,
    args?: Edge.SetCellTerminalArgs,
    options?: Edge.SetOptions,
  ): this
  setSource(
    edge: Edge,
    args?: Edge.SetEdgeTerminalArgs,
    options?: Edge.SetOptions,
  ): this
  setSource(
    point: Point | Point.PointLike,
    args?: Edge.SetTerminalCommonArgs,
    options?: Edge.SetOptions,
  ): this
  setSource(args: Edge.TerminalData, options?: Edge.SetOptions): this
  setSource(
    source: Node | Edge | Point | Point.PointLike | Edge.TerminalData,
    args?: Edge.SetTerminalCommonArgs | Edge.SetOptions,
    options: Edge.SetOptions = {},
  ) {
    return this.setTerminal('source', source, args, options)
  }

  get target() {
    return this.getTarget()
  }

  set target(data: Edge.TerminalData) {
    this.setTarget(data)
  }

  getTarget() {
    return this.getTerminal('target')
  }

  getTargetCellId() {
    return (this.target as Edge.TerminalCellData).cell
  }

  getTargetPortId() {
    return (this.target as Edge.TerminalCellData).port
  }

  setTarget(
    edge: Node,
    args?: Edge.SetCellTerminalArgs,
    options?: Edge.SetOptions,
  ): this
  setTarget(
    edge: Edge,
    args?: Edge.SetEdgeTerminalArgs,
    options?: Edge.SetOptions,
  ): this
  setTarget(
    point: Point | Point.PointLike,
    args?: Edge.SetTerminalCommonArgs,
    options?: Edge.SetOptions,
  ): this
  setTarget(args: Edge.TerminalData, options?: Edge.SetOptions): this
  setTarget(
    target: Node | Edge | Point | Point.PointLike | Edge.TerminalData,
    args?: Edge.SetTerminalCommonArgs | Edge.SetOptions,
    options: Edge.SetOptions = {},
  ) {
    return this.setTerminal('target', target, args, options)
  }

  getTerminal(type: Edge.TerminalType) {
    return { ...this.store.get(type) } as Edge.TerminalData
  }

  setTerminal(
    type: Edge.TerminalType,
    terminal: Node | Edge | Point | Point.PointLike | Edge.TerminalData,
    args?: Edge.SetTerminalCommonArgs | Edge.SetOptions,
    options: Edge.SetOptions = {},
  ): this {
    // `terminal` is a cell
    if (terminal instanceof Cell) {
      this.reference(type, terminal)
      this.store.set(
        type,
        ObjectExt.merge({}, args, { id: terminal.id }),
        options,
      )
      return this
    }

    // `terminal` is a point-like object
    const p = terminal as Point.PointLike
    if (terminal instanceof Point || (p.x != null && p.y != null)) {
      this.reference(type, null)
      this.store.set(
        type,
        ObjectExt.merge({}, args, { x: p.x, y: p.y }),
        options,
      )
      return this
    }

    // `terminal` is an object
    {
      const cellId = (terminal as Edge.TerminalCellData).cell
      const cell = cellId && this.model ? this.model.getCell(cellId) : null
      this.reference(type, cell)

      this.store.set(
        type,
        ObjectExt.cloneDeep(terminal as Edge.TerminalData),
        options,
      )
    }

    return this
  }

  protected reference(type: Edge.TerminalType, cell: Cell | null) {
    const terminalCellKey = `${type}Cell` as 'sourceCell' | 'targetCell'
    const prev = this[terminalCellKey]

    if (prev !== cell) {
      const edgesKey = type === 'source' ? 'outgoings' : 'incomings'

      if (prev) {
        const ref = prev[edgesKey]
        if (ref) {
          const index = ref.indexOf(this)
          if (index >= 0) {
            ref.splice(index, 1)
          }
        }
      }

      if (cell) {
        let ref = cell[edgesKey]
        if (ref == null) {
          ref = cell[edgesKey] = []
        }
        ref.push(this)
      }
    }

    this[terminalCellKey] = cell
  }

  protected unreference(type: Edge.TerminalType) {}

  getSourcePoint() {
    return this.getTerminalPoint('source')
  }

  getTargetPoint() {
    return this.getTerminalPoint('target')
  }

  getTerminalPoint(type: Edge.TerminalType) {
    const terminal = this[type]
    if (Point.isPointLike(terminal)) {
      return Point.create(terminal)
    }
    const cell = this.getTerminalCell(type)
    if (cell) {
      cell.getConnectionPoint(this, type)
    }
    return new Point()
  }

  getSourceCell() {
    return this.getTerminalCell('source')
  }

  getTargetCell() {
    return this.getTerminalCell('target')
  }

  getTerminalCell(type: Edge.TerminalType) {
    const key = `${type}Cell` as 'sourceCell' | 'targetCell'
    return this[key]
  }

  getSourceNode() {
    return this.getTerminalNode('source')
  }

  getTargetNode() {
    return this.getTerminalNode('target')
  }

  getTerminalNode(type: Edge.TerminalType): Cell | null {
    let cell: Cell | null = this // tslint:disable-line
    const visited: { [id: string]: boolean } = {}

    while (cell && cell.isEdge()) {
      if (visited[cell.id]) {
        return null
      }
      visited[cell.id] = true
      cell = cell.getTerminalCell(type)
    }

    return cell
  }

  // #endregion

  // #region router

  get router() {
    return this.getRouter()
  }

  set router(data: Edge.RouterData | undefined) {
    if (data == null) {
      this.removeRouter()
    } else {
      this.setRouter(data)
    }
  }

  getRouter() {
    return this.store.get('router')
  }

  setRouter(name: string, args?: KeyValue, options?: Edge.SetOptions): this
  setRouter(router: Edge.RouterObject, options?: Edge.SetOptions): this
  setRouter(routerFn: Function, options?: Edge.SetOptions): this
  setRouter(
    name?: string | Edge.RouterObject | Function,
    args?: KeyValue,
    options?: Edge.SetOptions,
  ) {
    if (typeof name === 'object' || typeof name === 'function') {
      this.store.set('router', name, args)
    } else {
      this.store.set('router', { name, args }, options)
    }
    return this
  }

  removeRouter(options: Edge.SetOptions = {}) {
    this.store.remove('router', options)
    return this
  }

  // #endregion

  // #region connector

  get connector() {
    return this.getConnector()
  }

  set connector(data: Edge.ConnectorData | undefined) {
    if (data == null) {
      this.removeConnector()
    } else {
      this.setConnector(data)
    }
  }

  getConnector() {
    return this.store.get('connector')
  }

  setConnector(name: string, args?: KeyValue, options?: Edge.SetOptions): this
  setConnector(router: Edge.ConnectorObject, options?: Edge.SetOptions): this
  setConnector(routerFn: Function, options?: Edge.SetOptions): this
  setConnector(
    name?: string | Edge.ConnectorObject | Function,
    args?: KeyValue,
    options?: Edge.SetOptions,
  ) {
    if (typeof name === 'object' || typeof name === 'function') {
      this.store.set('connector', name, args)
    } else {
      this.store.set('connector', { name, args }, options)
    }
    return this
  }

  removeConnector(options: Edge.SetOptions = {}) {
    return this.store.remove('connector', options)
  }

  // #endregion

  // #region labels

  getDefaultLabel() {
    const ctor = this.constructor as typeof Edge
    const defaults = this.store.get('defaultLabel') || ctor.defaultLabel || {}

    const label: Edge.Label = {}
    label.markup = this.store.get('labelMarkup') || defaults.markup
    label.position = defaults.position
    label.attrs = defaults.attrs

    return label
  }

  get labels() {
    return this.getLabels()
  }

  set labels(labels: Edge.Label[]) {
    this.setLabels(labels)
  }

  getLabels() {
    return [...this.store.get('labels', [])]
  }

  setLabels(labels: Edge.Label | Edge.Label[], options: Edge.SetOptions = {}) {
    this.store.set('labels', Array.isArray(labels) ? labels : [labels], options)
    return this
  }

  insertLabel(
    label: Edge.Label,
    index?: number,
    options: Edge.SetOptions = {},
  ) {
    const labels = this.getLabels()
    const len = labels.length
    let idx = index != null && isFinite(index) ? index : len
    if (idx < 0) {
      idx = len + idx + 1
    }

    labels.splice(idx, 0, label)
    return this.setLabels(labels, options)
  }

  appendLabel(label: Edge.Label, options: Edge.SetOptions = {}) {
    return this.insertLabel(label, -1, options)
  }

  getLabelAt(index: number) {
    const labels = this.getLabels()
    if (index != null && isFinite(index)) {
      return labels[index]
    }
    return null
  }

  setLabelAt(index: number, label: Edge.Label, options: Edge.SetOptions = {}) {
    if (index != null && isFinite(index)) {
      const labels = this.getLabels()
      labels[index] = label
      this.setLabels(labels, options)
    }
    return this
  }

  removeLabelAt(index: number, options: Edge.SetOptions = {}) {
    const labels = this.getLabels()
    const idx = index != null && isFinite(index) ? index : -1

    const removed = labels.splice(idx, 1)
    this.setLabels(labels, options)
    return removed.length ? removed[0] : null
  }

  protected onLabelsChanged({
    previous,
    current,
  }: Cell.ChangeArgs<Edge.Label[]>) {
    const added =
      previous && current
        ? current.filter(label1 => {
            if (
              !previous.find(
                label2 =>
                  label1 === label2 || ObjectExt.isEqual(label1, label2),
              )
            ) {
              return label1
            }
          })
        : current
        ? [...current]
        : []

    const removed =
      previous && current
        ? previous.filter(label1 => {
            if (
              !current.find(
                label2 =>
                  label1 === label2 || ObjectExt.isEqual(label1, label2),
              )
            ) {
              return label1
            }
          })
        : previous
        ? [...previous]
        : []

    if (added.length > 0) {
      this.notify('labels:added', { added, cell: this, edge: this })
    }

    if (removed.length > 0) {
      this.notify('labels:removed', { removed, cell: this, edge: this })
    }
  }

  // #endregion

  // #region vertices

  get vertexMarkup() {
    return this.getVertexMarkup()
  }

  set vertexMarkup(markup: Markup) {
    this.setVertexMarkup(markup)
  }

  getDefaultVertexMarkup() {
    return this.store.get('defaultVertexMarkup') || Markup.edgeVertexMarkup
  }

  getVertexMarkup() {
    return this.store.get('vertexMarkup') || this.getDefaultVertexMarkup()
  }

  setVertexMarkup(markup?: Markup, options: Edge.SetOptions = {}) {
    this.store.set('vertexMarkup', Markup.clone(markup), options)
    return this
  }

  get vertices() {
    return this.getVertices()
  }

  set vertices(
    vertices: Point | Point.PointLike | (Point | Point.PointLike)[],
  ) {
    this.setVertices(vertices)
  }

  getVertices() {
    return [...this.store.get('vertices', [])]
  }

  setVertices(
    vertices: Point | Point.PointLike | (Point | Point.PointLike)[],
    options: Edge.SetOptions = {},
  ) {
    const points = Array.isArray(vertices) ? vertices : [vertices]
    this.store.set(
      'vertices',
      points.map(p => Point.toJSON(p)),
      options,
    )
    return this
  }

  insertVertex(
    vertex: Point | Point.PointLike,
    index?: number,
    options: Edge.SetOptions = {},
  ) {
    const vertices = this.getVertices()
    const len = vertices.length
    let idx = index != null && isFinite(index) ? index : len
    if (idx < 0) {
      idx = len + idx + 1
    }

    vertices.splice(idx, 0, Point.toJSON(vertex))
    return this.setVertices(vertices, options)
  }

  appendVertex(vertex: Point | Point.PointLike, options: Edge.SetOptions = {}) {
    return this.insertVertex(vertex, -1, options)
  }

  getVertexAt(index: number) {
    if (index != null && isFinite(index)) {
      const vertices = this.getVertices()
      return vertices[index]
    }
    return null
  }

  setVertexAt(
    index: number,
    vertice: Point | Point.PointLike,
    options: Edge.SetOptions = {},
  ) {
    if (index != null && isFinite(index)) {
      const vertices = this.getVertices()
      vertices[index] = vertice
      this.setVertices(vertices, options)
    }
    return this
  }

  removeVertexAt(index: number, options: Edge.SetOptions = {}) {
    const vertices = this.getVertices()
    const idx = index != null && isFinite(index) ? index : -1
    vertices.splice(idx, 1)
    return this.setVertices(vertices, options)
  }

  protected onVertexsChanged({
    previous,
    current,
  }: Cell.ChangeArgs<Point.PointLike[]>) {
    const added =
      previous && current
        ? current.filter(p1 => {
            if (!previous.find(p2 => Point.equals(p1, p2))) {
              return p1
            }
          })
        : current
        ? [...current]
        : []

    const removed =
      previous && current
        ? previous.filter(p1 => {
            if (!current.find(p2 => Point.equals(p1, p2))) {
              return p1
            }
          })
        : previous
        ? [...previous]
        : []

    if (added.length > 0) {
      this.notify('vertexs:added', { added, cell: this, edge: this })
    }

    if (removed.length > 0) {
      this.notify('vertexs:removed', { removed, cell: this, edge: this })
    }
  }

  // #endregion

  // #region markup

  getDefaultMarkup() {
    return this.store.get('defaultMarkup') || Markup.edgeMarkup
  }

  getMarkup() {
    return super.getMarkup() || this.getDefaultMarkup()
  }

  // #endregion

  // #region toolMarkup

  get toolMarkup() {
    return this.getToolMarkup()
  }

  set toolMarkup(markup: Markup) {
    this.setToolMarkup(markup)
  }

  getDefaultToolMarkup() {
    return this.store.get('defaultToolMarkup') || Markup.edgeToolMarkup
  }

  getToolMarkup() {
    return this.store.get('toolMarkup') || this.getDefaultToolMarkup()
  }

  setToolMarkup(markup?: Markup, options: Edge.SetOptions = {}) {
    this.store.set('toolMarkup', markup, options)
    return this
  }

  get doubleToolMarkup() {
    return this.getDoubleToolMarkup()
  }

  set doubleToolMarkup(markup: Markup | undefined) {
    this.setDoubleToolMarkup(markup)
  }

  getDefaultDoubleToolMarkup() {
    return this.store.get('defaultDoubleToolMarkup')
  }

  getDoubleToolMarkup() {
    return (
      this.store.get('doubleToolMarkup') || this.getDefaultDoubleToolMarkup()
    )
  }

  setDoubleToolMarkup(markup?: Markup, options: Edge.SetOptions = {}) {
    this.store.set('doubleToolMarkup', markup, options)
    return this
  }

  // #endregion

  // #region arrowheadMarkup

  get arrowheadMarkup() {
    return this.getArrowheadMarkup()
  }

  set arrowheadMarkup(markup: Markup) {
    this.setArrowheadMarkup(markup)
  }

  getDefaultArrowheadMarkup() {
    return (
      this.store.get('defaultArrowheadMarkup') || Markup.edgeArrowheadMarkup
    )
  }

  getArrowheadMarkup() {
    return this.store.get('arrowheadMarkup') || this.getDefaultArrowheadMarkup()
  }

  setArrowheadMarkup(markup?: Markup, options: Edge.SetOptions = {}) {
    this.store.set('arrowheadMarkup', markup, options)
    return this
  }

  // #endregion

  // #region transform

  /**
   * Translate the edge vertices (and source and target if they are points)
   * by `tx` pixels in the x-axis and `ty` pixels in the y-axis.
   */
  translate(tx: number, ty: number, options: Cell.TranslateOptions = {}) {
    options.translateBy = options.translateBy || this.id
    options.tx = tx
    options.ty = ty

    return this.applyToPoints(
      p => ({
        x: (p.x || 0) + tx,
        y: (p.y || 0) + ty,
      }),
      options,
    )
  }

  /**
   * Scales the edge's points (vertices) relative to the given origin.
   */
  scale(
    sx: number,
    sy: number,
    origin?: Point | Point.PointLike,
    options: Edge.SetOptions = {},
  ) {
    return this.applyToPoints(p => {
      return Point.create(p)
        .scale(sx, sy, origin)
        .toJSON()
    }, options)
  }

  protected applyToPoints(
    worker: (p: Point.PointLike) => Point.PointLike,
    options: Edge.SetOptions = {},
  ) {
    const attrs: {
      source?: Edge.TerminalPointData
      target?: Edge.TerminalPointData
      vertices?: Point.PointLike[]
    } = {}

    const source = this.getSource()
    const target = this.getTarget()
    if (Point.isPointLike(source)) {
      attrs.source = worker(source)
    }

    if (Point.isPointLike(target)) {
      attrs.target = worker(target)
    }

    const vertices = this.getVertices()
    if (vertices.length > 0) {
      attrs.vertices = vertices.map(worker)
    }

    this.store.set(attrs, options)
    return this
  }

  // #endregion

  // #region common

  getBBox() {
    return this.getPolyline().bbox()
  }

  getConnectionPoint() {
    return this.getPolyline().pointAt(0.5)!
  }

  getPolyline() {
    const points = [this.getSourcePoint(), this.getTargetPoint()]
    const vertices = this.getVertices()
    vertices.forEach(p => points.push(Point.create(p)))
    return new Polyline(points)
  }

  updateParent(options?: Edge.SetOptions) {
    let newParent

    if (this._model) {
      const source = this.getSourceNode()
      const target = this.getTargetNode()
      const prevParent = this.getParent()

      if (source && target) {
        if (source === target || source.isDescendantOf(target)) {
          newParent = target
        } else if (target.isDescendantOf(source)) {
          newParent = source
        } else {
          newParent = this._model.getCommonAncestor(source, target)
        }
      }

      // Unembeds the edge if source and target has no common
      // ancestor or common ancestor changed
      if (prevParent && (!newParent || newParent.id !== prevParent.id)) {
        prevParent.unembed(this, options)
      }

      if (newParent) {
        newParent.embed(this, options)
      }
    }

    return newParent
  }

  hasLoop(options: { deep?: boolean } = {}) {
    const source = this.getSource() as Edge.TerminalCellData
    const target = this.getTarget() as Edge.TerminalCellData
    const sourceId = source.cell
    const targetId = target.cell

    if (!sourceId || !targetId) {
      return false
    }

    let loop = sourceId === targetId

    // Note that there in the deep mode a link can have a loop,
    // even if it connects only a parent and its embed.
    // A loop "target equals source" is valid in both shallow and deep mode.
    if (!loop && options.deep && this.model) {
      const sourceCell = this.getSourceCell()
      const targetCell = this.getTargetCell()

      if (sourceCell && targetCell) {
        loop =
          sourceCell.isAncestorOf(targetCell, options) ||
          targetCell.isAncestorOf(sourceCell, options)
      }
    }

    return loop
  }

  getFragmentAncestor() {
    const cells = [
      this,
      this.getSourceNode(), // null if source is a point
      this.getTargetNode(), // null if target is a point
    ].filter(item => item != null)
    return this.getCommonAncestor(...cells)
  }

  isFragmentDescendantOf(cell: Cell) {
    const ancestor = this.getFragmentAncestor()
    return (
      !!ancestor && (ancestor.id === cell.id || ancestor.isDescendantOf(cell))
    )
  }

  // #endregion
}

export namespace Edge {
  interface Common extends Cell.Common {
    source?: TerminalData
    target?: TerminalData
    router?: RouterData
    connector?: ConnectorData
    labels?: Label[]
    defaultLabel?: Label
    labelMarkup?: Markup
    vertices?: Point.PointLike[]
    toolMarkup?: Markup
    doubleToolMarkup?: Markup
    vertexMarkup?: Markup
    arrowheadMarkup?: Markup

    defaultMarkup?: Markup
    defaultToolMarkup?: Markup
    defaultDoubleToolMarkup?: Markup
    defaultVertexMarkup?: Markup
    defaultArrowheadMarkup?: Markup
  }

  interface TerminalOptions {
    sourceCell?: Cell | string
    sourcePort?: string
    sourcePoint?: Point | Point.PointLike | Point.PointData
    targetCell?: Cell | string
    targetPort?: string
    targetPoint?: Point | Point.PointLike | Point.PointData
  }

  export interface BaseOptions extends Common, Cell.Options {}

  export interface Options
    extends Omit<BaseOptions, 'source' | 'target'>,
      TerminalOptions {
    source?:
      | string
      | Cell
      | Point
      | Point.PointLike
      | Point.PointData
      | TerminalPointData
      | TerminalCellLooseData
    target?:
      | string
      | Cell
      | Point
      | Point.PointLike
      | Point.PointData
      | TerminalPointData
      | TerminalCellLooseData
  }

  export interface Defaults extends Common, Cell.Defaults {}
  export interface Properties extends Cell.Properties, BaseOptions {}
  export interface Metadata extends Options, KeyValue {}
}

export namespace Edge {
  export interface SetOptions extends Cell.SetOptions {}

  export type TerminalType = 'source' | 'target'

  export interface SetTerminalCommonArgs {
    selector?: string
    magnet?: string
    connectionPoint?: ConnectionPoint.ManaualItem
    priority?: number
  }

  export interface SetCellTerminalArgs extends SetTerminalCommonArgs {
    port?: string
    anchor?: NodeAnchor.ManaualItem
  }

  export interface SetEdgeTerminalArgs extends SetTerminalCommonArgs {
    anchor?: EdgeAnchor.ManaualItem | EdgeAnchor.NativeItem
  }

  export interface TerminalPointData
    extends SetTerminalCommonArgs,
      Point.PointLike {}

  export interface TerminalCellData extends SetCellTerminalArgs {
    cell: string
    port?: string
  }

  export interface TerminalCellLooseData extends SetCellTerminalArgs {
    cell: string | Cell
    port?: string
  }

  export type TerminalData = TerminalPointData | TerminalCellData

  export function equalTerminals(a: TerminalData, b: TerminalData) {
    const a1 = a as TerminalCellData
    const b1 = b as TerminalCellData
    if (a1.cell === b1.cell) {
      return a1.port === b1.port || (a1.port == null && b1.port == null)
    }
    return false
  }
}

export namespace Edge {
  export interface RouterObject {
    name?: string
    args?: KeyValue
  }

  export type RouterData = Function | RouterObject
}

export namespace Edge {
  export interface ConnectorObject {
    name?: string
    args?: KeyValue
  }

  export type ConnectorData = Function | ConnectorObject
}

export namespace Edge {
  export interface Label {
    markup?: Markup
    attrs?: Attr.CellAttrs
    /**
     * If the distance is in the `[0,1]` range (inclusive), then the position
     * of the label is defined as a percentage of the total length of the edge
     * (the normalized length). For example, passing the number `0.5` positions
     * the label to the middle of the edge.
     *
     * If the distance is larger than `1` (exclusive), the label will be
     * positioned distance pixels away from the beginning of the path along
     * the edge.
     *
     * If the distance is a negative number, the label will be positioned
     * distance pixels away from the end of the path along the edge.
     */
    position?: LabelPosition
    size?: Size
  }

  export interface LabelPositionOptions {
    absoluteDistance?: boolean
    reverseDistance?: boolean
    absoluteOffset?: boolean
    keepGradient?: boolean
    ensureLegibility?: boolean
  }

  export interface LabelPositionObject {
    distance: number
    rotation?: number
    offset?:
      | number
      | {
          x?: number
          y?: number
        }
    options?: LabelPositionOptions
  }

  export type LabelPosition = number | LabelPositionObject

  export const defaultLabel: Label = {
    markup: [
      {
        tagName: 'rect',
        selector: 'rect',
      },
      {
        tagName: 'text',
        selector: 'text',
      },
    ],
    attrs: {
      text: {
        fill: '#000000',
        fontSize: 14,
        textAnchor: 'middle',
        yAlignment: 'middle',
        pointerEvents: 'none',
      },
      rect: {
        ref: 'text',
        fill: '#ffffff',
        rx: 3,
        ry: 3,
        refWidth: 1,
        refHeight: 1,
        refX: 0,
        refY: 0,
      },
    },
    position: {
      distance: 0.5,
    },
  }
}

export namespace Edge {
  export type Defintion = typeof Edge & (new (...args: any[]) => Edge)

  export interface DefintionOptions extends Defaults, Cell.DefintionOptions {}

  let counter = 0
  function getClassName(name?: string) {
    if (name) {
      return StringExt.pascalCase(name)
    }
    counter += 1
    return `CustomEdge${counter}`
  }

  export function define(options: DefintionOptions) {
    const { name, attrDefinitions, ...defaults } = options
    const className = getClassName(name)
    const base = this as Defintion
    const shape = ObjectExt.createClass<Defintion>(className, base)
    shape.config(defaults, attrDefinitions)
    return shape
  }

  export function create(metadata: Edge | Edge.Metadata) {
    const { type, ...options } = metadata
    let define
    if (type) {
      define = EdgeRegistry.get(type)
      if (define == null) {
        return EdgeRegistry.notExistError(type)
      }
    } else {
      define = Edge
    }
    return new define(options)
  }
}
