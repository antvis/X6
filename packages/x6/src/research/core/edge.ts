import { ObjectExt, StringExt } from '../../util'
import { Size, KeyValue } from '../../types'
import { Point, Polyline } from '../../geometry'
import { EdgeAnchor, NodeAnchor } from '../anchor'
import { ConnectionPoint } from '../connection-point'
import { Store } from './store'
import { Cell } from './cell'
import { Node } from './node'
import { Attr } from '../attr'
import { Markup } from './markup'

export class Edge extends Cell {
  protected static defaults: Edge.Defaults = {}
  public readonly store: Store<Edge.Properties>
  protected readonly defaultMarkup = Markup.edgeMarkup
  protected readonly defaultToolMarkup = Markup.edgeToolMarkup
  protected readonly defaultDoubleToolMarkup: Markup
  protected readonly defaultVertexMarkup = Markup.edgeVertexMarkup
  protected readonly defaultArrowheadMarkup = Markup.edgeArrowheadMarkup
  protected readonly defaultLabel = Edge.defaultLabel
  protected sourceCell: Cell | null
  protected targetCell: Cell | null

  constructor(options: Edge.Options = {}) {
    super(options)
  }

  protected setup() {
    super.setup()
    this.store.on('mutated', metadata => {
      const key = metadata.key
      if (key === 'source') {
        this.trigger(
          'change:source',
          this.getChangeEventArgs<Edge.TerminalData>(metadata),
        )
      } else if (key === 'target') {
        this.trigger(
          'change:target',
          this.getChangeEventArgs<Edge.TerminalData>(metadata),
        )
      } else if (key === 'router') {
        this.trigger(
          'change:router',
          this.getChangeEventArgs<Edge.RouterData>(metadata),
        )
      } else if (key === 'connector') {
        this.trigger(
          'change:connector',
          this.getChangeEventArgs<Edge.ConnectorData>(metadata),
        )
      } else if (key === 'vertices') {
        const args = this.getChangeEventArgs<Point.PointLike[]>(metadata)
        this.trigger('change:vertices', args)
        this.onVertexsChanged(args)
      } else if (key === 'labels') {
        const args = this.getChangeEventArgs<Edge.Label[]>(metadata)
        this.trigger('change:labels', args)
        this.onLabelsChanged(args)
      } else if (key === 'defaultLabel') {
        this.trigger(
          'change:defaultLabel',
          this.getChangeEventArgs<Edge.Label>(metadata),
        )
      } else if (key === 'labelMarkup') {
        this.trigger(
          'change:labelMarkup',
          this.getChangeEventArgs<Markup>(metadata),
        )
      } else if (key === 'toolMarkup') {
        this.trigger(
          'change:toolMarkup',
          this.getChangeEventArgs<Markup>(metadata),
        )
      } else if (key === 'doubleToolMarkup') {
        this.trigger(
          'change:doubleToolMarkup',
          this.getChangeEventArgs<Markup>(metadata),
        )
      } else if (key === 'vertexMarkup') {
        this.trigger(
          'change:vertexMarkup',
          this.getChangeEventArgs<Markup>(metadata),
        )
      } else if (key === 'arrowheadMarkup') {
        this.trigger(
          'change:arrowheadMarkup',
          this.getChangeEventArgs<Markup>(metadata),
        )
      }
    })
  }

  isEdge(): this is Edge {
    return true
  }

  // #region terminal

  get source() {
    return this.getSource()
  }

  set source(data: Edge.TerminalData) {
    this.setSource(data)
  }

  getSource() {
    return this.getTerminal('source')
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
    const terminalCellKey = `${type}Cell` as 'sourceCell' | 'targetCell'
    // `source` is a cell
    if (terminal instanceof Cell) {
      this.store.set(
        type,
        ObjectExt.merge({}, args, { cellId: terminal.id }),
        options,
      )
      this[terminalCellKey] = terminal
      return this
    }

    // `source` is a point-like object
    const p = terminal as Point.PointLike
    if (terminal instanceof Point || (p.x != null && p.y != null)) {
      this.store.set(
        type,
        ObjectExt.merge({}, args, { x: p.x, y: p.y }),
        options,
      )
      return this
    }

    // `source` is an object
    this.store.set(
      type,
      ObjectExt.cloneDeep(terminal as Edge.TerminalData),
      options,
    )

    const cellId = (terminal as Edge.TerminalCellData).cellId
    if (cellId && this.model) {
      this[terminalCellKey] = this.model.getCell(cellId)
    }

    return this
  }

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
    const terminalCellKey = `${type}Cell` as 'sourceCell' | 'targetCell'
    let cell = this[terminalCellKey]
    if (cell == null && this.model) {
      const terminal = this[type] as Edge.TerminalCellData
      if (terminal.cellId) {
        cell = this.model.getCell(terminal.cellId)
        this[terminalCellKey] = cell
      }
    }

    return cell
  }

  getSourceNode() {
    return this.getTerminalNode('source')
  }

  getTargetNode() {
    return this.getTerminalNode('target')
  }

  getTerminalNode(type: Edge.TerminalType) {
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
    const defaults = this.store.get('defaultLabel') || this.defaultLabel || {}

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
      this.trigger('labels:added', { added, edge: this })
    }

    if (removed.length > 0) {
      this.trigger('labels:removed', { removed, edge: this })
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

  getVertexMarkup() {
    return this.store.get('vertexMarkup') || this.defaultVertexMarkup
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
      this.trigger('vertexs:added', { added, edge: this })
    }

    if (removed.length > 0) {
      this.trigger('vertexs:removed', { removed, edge: this })
    }
  }

  // #endregion

  // #region toolMarkup

  get toolMarkup() {
    return this.getToolMarkup()
  }

  set toolMarkup(markup: Markup) {
    this.setToolMarkup(markup)
  }

  getToolMarkup() {
    return this.store.get('toolMarkup') || this.defaultToolMarkup
  }

  setToolMarkup(markup?: Markup, options: Edge.SetOptions = {}) {
    this.store.set('toolMarkup', markup, options)
    return this
  }

  get doubleToolMarkup() {
    return this.getDoubleToolMarkup()
  }

  set doubleToolMarkup(markup: Markup) {
    this.setDoubleToolMarkup(markup)
  }

  getDoubleToolMarkup() {
    return this.store.get('doubleToolMarkup') || this.defaultDoubleToolMarkup
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

  getArrowheadMarkup() {
    return this.store.get('arrowheadMarkup') || this.defaultArrowheadMarkup
  }

  setArrowheadMarkup(markup?: Markup, options: Edge.SetOptions = {}) {
    this.store.set('arrowheadMarkup', markup, options)
    return this
  }

  // #endregion

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

  disconnect(options: Edge.SetOptions = {}) {
    this.store.set(
      {
        source: { x: 0, y: 0 },
        target: { x: 0, y: 0 },
      },
      options,
    )
    return this
  }

  getPolyline() {
    const points = [this.getSourcePoint(), this.getTargetPoint()]
    const vertices = this.getVertices()
    vertices.forEach(p => points.push(Point.create(p)))
    return new Polyline(points)
  }

  getBBox() {
    return this.getPolyline().bbox()
  }

  getConnectionPoint() {
    return this.getPolyline().pointAt(0.5)!
  }

  updateParent(options?: Edge.SetOptions) {
    let newParent

    if (this.model) {
      const source = this.getSourceNode()
      const target = this.getTargetNode()
      const prevParent = this.getParent()

      if (source && target) {
        if (source === target || source.isDescendantOf(target)) {
          newParent = target
        } else if (target.isDescendantOf(source)) {
          newParent = source
        } else {
          newParent = this.model.getCommonAncestor(source, target)
        }
      }

      // Unembeds the edge if source and target has no common
      // ancestor or common ancestor changed
      if (prevParent && (!newParent || newParent.id !== prevParent.id)) {
        this.removeFromParent(options)
      }

      if (newParent) {
        this.setParent(newParent, options)
      }
    }

    return newParent
  }

  hasLoop(options: { deep?: boolean } = {}) {
    const source = this.getSource() as Edge.TerminalCellData
    const target = this.getTarget() as Edge.TerminalCellData
    const sourceId = source.cellId
    const targetId = target.cellId

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
  }

  export interface Options extends Common, Cell.Options {}

  export interface Defaults extends Common, Cell.Defaults {}

  export interface Properties extends Cell.Properties, Options {}

  export interface SetOptions extends Cell.SetOptions {}
}

export namespace Edge {
  export type TerminalType = 'source' | 'target'

  export interface SetTerminalCommonArgs {
    selector?: string
    magnet?: string
    connectionPoint?: ConnectionPoint.ManaualItem
    priority?: number
  }

  export interface SetCellTerminalArgs extends SetTerminalCommonArgs {
    portId?: string
    anchor?: NodeAnchor.ManaualItem
  }

  export interface SetEdgeTerminalArgs extends SetTerminalCommonArgs {
    anchor?: EdgeAnchor.ManaualItem
  }

  export interface TerminalPointData
    extends SetTerminalCommonArgs,
      Point.PointLike {}

  export interface TerminalCellData extends SetTerminalCommonArgs {
    cellId: string
    portId?: string
  }

  export type TerminalData = TerminalPointData | TerminalCellData
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
    offset?: number | { x: number; y: number }
    rotation?: number
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
  export type Defintion = Function & typeof Edge

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
}
