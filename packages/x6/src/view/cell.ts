import { Nilable, KeyValue } from '../types'
import { Rectangle, Point } from '../geometry'
import { ArrayExt, ObjectExt, Dom } from '../util'
import { Registry } from '../common'
import { Attr } from '../definition'
import { Cell } from '../model/cell'
import { Edge } from '../model/edge'
import { Model } from '../model/model'
import { Graph } from '../graph/graph'
import { ConnectionStrategy } from '../connection'
import { View } from './view'
import { Flag } from './flag'
import { Cache } from './cache'
import { Markup } from './markup'
import { EdgeView } from './edge'
import { NodeView } from './node'
import { ToolsView } from './tool'
import { AttrManager } from './attr'

export class CellView<
  Entity extends Cell = Cell,
  Options extends CellView.Options = CellView.Options
> extends View<CellView.EventArgs> {
  protected static defaults: CellView.Options = {
    isSvgElement: true,
    rootSelector: 'root',
    priority: 0,
    bootstrap: [],
    actions: {},
  }

  static getDefaults() {
    return this.defaults
  }

  static config<T extends CellView.Options = CellView.Options>(
    options: Partial<T>,
  ) {
    this.defaults = this.getOptions(options)
  }

  static getOptions<T extends CellView.Options = CellView.Options>(
    options: Partial<T>,
  ): T {
    const mergeActions = <T>(arr1: T | T[], arr2?: T | T[]) => {
      if (arr2 != null) {
        return ArrayExt.uniq([
          ...(Array.isArray(arr1) ? arr1 : [arr1]),
          ...(Array.isArray(arr2) ? arr2 : [arr2]),
        ])
      }
      return Array.isArray(arr1) ? [...arr1] : [arr1]
    }

    const ret = ObjectExt.cloneDeep(this.getDefaults())
    const { bootstrap, actions, events, documentEvents, ...others } = options

    if (bootstrap) {
      ret.bootstrap = mergeActions(ret.bootstrap, bootstrap)
    }

    if (actions) {
      Object.keys(actions).forEach((key) => {
        const val = actions[key]
        const raw = ret.actions[key]
        if (val && raw) {
          ret.actions[key] = mergeActions(raw, val)
        } else if (val) {
          ret.actions[key] = mergeActions(val)
        }
      })
    }

    if (events) {
      ret.events = { ...ret.events, ...events }
    }

    if (options.documentEvents) {
      ret.documentEvents = { ...ret.documentEvents, ...documentEvents }
    }

    return ObjectExt.merge(ret, others) as T
  }

  public graph: Graph
  public cell: Entity
  protected selectors: Markup.Selectors
  protected readonly options: Options
  protected readonly flag: Flag
  protected readonly attr: AttrManager
  protected readonly cache: Cache

  public scalableNode: Element | null
  public rotatableNode: Element | null

  constructor(cell: Entity, options: Partial<Options> = {}) {
    super()

    this.cell = cell
    this.options = this.ensureOptions(options)
    this.attr = new AttrManager(this)
    this.flag = new Flag(this, this.options.actions, this.options.bootstrap)
    this.cache = new Cache(this)

    this.setContainer(this.ensureContainer())
    this.setup()
    this.$(this.container).data('view', this)

    this.init()
  }

  protected init() {}

  public get priority() {
    return this.options.priority
  }

  protected get rootSelector() {
    return this.options.rootSelector
  }

  protected getConstructor<T extends typeof CellView>() {
    return (this.constructor as any) as T
  }

  protected ensureOptions(options: Partial<Options>) {
    return this.getConstructor().getOptions(options) as Options
  }

  protected getContainerTagName(): string {
    return this.options.isSvgElement ? 'g' : 'div'
  }

  protected getContainerStyle(): Nilable<
    JQuery.PlainObject<string | number>
  > | void {}

  protected getContainerAttrs(): Nilable<Attr.SimpleAttrs> {
    return {
      'data-cell-id': this.cell.id,
    }
  }

  protected getContainerClassName(): Nilable<string | string[]> {
    return this.prefixClassName('cell')
  }

  protected ensureContainer() {
    return View.createElement(
      this.getContainerTagName(),
      this.options.isSvgElement,
    )
  }

  protected setContainer(container: Element) {
    if (this.container !== container) {
      this.undelegateEvents()
      this.container = container

      if (this.options.events != null) {
        this.delegateEvents(this.options.events)
      }

      const attrs = this.getContainerAttrs()
      if (attrs != null) {
        this.setAttrs(attrs, container)
      }

      const style = this.getContainerStyle()
      if (style != null) {
        this.setStyle(style, container)
      }

      const className = this.getContainerClassName()
      if (className != null) {
        this.addClass(className, container)
      }
    }

    return this
  }

  isNodeView(): this is NodeView {
    return false
  }

  isEdgeView(): this is EdgeView {
    return false
  }

  render() {
    return this
  }

  protected renderChildren(children: Markup.JSONMarkup[]) {
    if (children) {
      const isSVG = this.container instanceof SVGElement
      const ns = isSVG ? Dom.ns.svg : Dom.ns.xhtml
      const ret = Markup.parseJSONMarkup(children, { ns })
      Dom.empty(this.container)
      Dom.append(this.container, ret.fragment)
      // this.childNodes = doc.selectors
    }
    return this
  }

  confirmUpdate(flag: number, options: any = {}) {
    return 0
  }

  getBootstrapFlag() {
    return this.flag.getBootstrapFlag()
  }

  getFlag(actions: Flag.Actions) {
    return this.flag.getFlag(actions)
  }

  hasAction(flag: number, actions: Flag.Actions) {
    return this.flag.hasAction(flag, actions)
  }

  removeAction(flag: number, actions: Flag.Actions) {
    return this.flag.removeAction(flag, actions)
  }

  handleAction(
    flag: number,
    action: Flag.Action,
    handle: () => void,
    additionalRemovedActions?: Flag.Actions | null,
  ) {
    if (this.hasAction(flag, action)) {
      handle()
      const removedFlags = [action]
      if (additionalRemovedActions) {
        if (typeof additionalRemovedActions === 'string') {
          removedFlags.push(additionalRemovedActions)
        } else {
          removedFlags.push(...additionalRemovedActions)
        }
      }
      return this.removeAction(flag, removedFlags)
    }
    return flag
  }

  protected setup() {
    this.cell.on('changed', ({ options }) => this.onAttrsChange(options))
  }

  protected onAttrsChange(options: Cell.MutateOptions) {
    let flag = this.flag.getChangedFlag()
    if (options.updated || !flag) {
      return
    }

    if (options.dirty && this.hasAction(flag, 'update')) {
      flag |= this.getFlag('render')
    }

    // TODO: tool changes does not need to be sync
    // Fix Segments tools
    if (options.tool) {
      options.async = false
    }

    if (this.graph != null) {
      this.graph.renderer.requestViewUpdate(this, flag, this.priority, options)
    }
  }

  parseJSONMarkup(
    markup: Markup.JSONMarkup | Markup.JSONMarkup[],
    rootElem?: Element,
  ) {
    const result = Markup.parseJSONMarkup(markup)
    const selectors = result.selectors
    const rootSelector = this.rootSelector
    if (rootElem && rootSelector) {
      if (selectors[rootSelector]) {
        throw new Error('Invalid root selector')
      }
      selectors[rootSelector] = rootElem
    }
    return result
  }

  can(feature: CellView.InteractiveName): boolean {
    let interactive = this.options.interactive
    interactive =
      typeof interactive === 'function'
        ? interactive.call(this.graph, this)
        : interactive

    if (typeof interactive === 'object') {
      return interactive[feature as CellView.InteractiveName] !== false
    }

    if (typeof interactive === 'boolean') {
      return interactive
    }

    return false
  }

  setInteractivity(value: CellView.Interactive) {
    this.options.interactive = value
  }

  cleanCache() {
    this.cache.clean()
    return this
  }

  getCache(elem: Element) {
    return this.cache.get(elem)
  }

  getNodeData(elem: Element) {
    return this.cache.getData(elem)
  }

  getNodeBoundingRect(elem: Element) {
    return this.cache.getBoundingRect(elem)
  }

  getNodeMatrix(elem: Element) {
    return this.cache.getMatrix(elem)
  }

  getNodeShape(elem: SVGElement) {
    return this.cache.getShape(elem)
  }

  getNodeScale(node: Element, scalableNode?: SVGElement) {
    let sx
    let sy
    if (scalableNode && scalableNode.contains(node)) {
      const scale = Dom.scale(scalableNode)
      sx = 1 / scale.sx
      sy = 1 / scale.sy
    } else {
      sx = 1
      sy = 1
    }

    return { sx, sy }
  }

  getNodeBBox(elem: Element) {
    const rect = this.getNodeBoundingRect(elem)
    const matrix = this.getNodeMatrix(elem)
    const rotateMatrix = this.getRootRotateMatrix()
    const translateMatrix = this.getRootTranslateMatrix()
    return Dom.transformRectangle(
      rect,
      translateMatrix.multiply(rotateMatrix).multiply(matrix),
    )
  }

  getNodeUnrotatedBBox(elem: SVGElement) {
    const rect = this.getNodeBoundingRect(elem)
    const matrix = this.getNodeMatrix(elem)
    const translateMatrix = this.getRootTranslateMatrix()
    return Dom.transformRectangle(rect, translateMatrix.multiply(matrix))
  }

  getBBox(options: { fromCell?: boolean } = {}) {
    let bbox
    if (options.fromCell) {
      const cell = this.cell
      const angle = (cell as any).angle || 0
      bbox = cell.getBBox().bbox(angle)
    } else {
      bbox = this.getNodeBBox(this.container)
    }

    return this.graph.localToGraphRect(bbox)
  }

  getRootTranslateMatrix() {
    const pos = (this.cell as any).position
    return Dom.createSVGMatrix().translate(pos.x, pos.y)
  }

  getRootRotateMatrix() {
    let matrix = Dom.createSVGMatrix()
    const cell = this.cell
    const angle = (cell as any).angle
    if (angle) {
      const bbox = cell.getBBox()
      const cx = bbox.width / 2
      const cy = bbox.height / 2
      matrix = matrix.translate(cx, cy).rotate(angle).translate(-cx, -cy)
    }
    return matrix
  }

  findMagnet(elem: Element = this.container) {
    // If the overall cell has set `magnet === false`, then returns
    // `undefined` to announce there is no magnet found for this cell.
    // This is especially useful to set on cells that have 'ports'.
    // In this case, only the ports have set `magnet === true` and the
    // overall element has `magnet === false`.
    return this.findByAttr('magnet', elem)
  }

  updateAttrs(
    rootNode: Element,
    attrs: Attr.CellAttrs,
    options: Partial<AttrManager.UpdateOptions> = {},
  ) {
    if (options.rootBBox == null) {
      options.rootBBox = new Rectangle()
    }

    if (options.selectors == null) {
      options.selectors = this.selectors
    }

    this.attr.update(rootNode, attrs, options as AttrManager.UpdateOptions)
  }

  isEdgeElement(magnet?: Element | null) {
    return this.cell.isEdge() && (magnet == null || magnet === this.container)
  }

  // #region highlight

  protected prepareHighlight(
    elem?: Element | null,
    options: CellView.HighlightOptions = {},
  ) {
    const magnet = (elem && this.$(elem)[0]) || this.container
    options.partial = magnet === this.container
    return magnet
  }

  highlight(elem?: Element | null, options: CellView.HighlightOptions = {}) {
    const magnet = this.prepareHighlight(elem, options)
    this.notify('cell:highlight', {
      magnet,
      options,
      view: this,
      cell: this.cell,
    })
    if (this.isEdgeView()) {
      this.notify('edge:highlight', {
        magnet,
        options,
        view: this,
        edge: this.cell,
        cell: this.cell,
      })
    } else if (this.isNodeView()) {
      this.notify('node:highlight', {
        magnet,
        options,
        view: this,
        node: this.cell,
        cell: this.cell,
      })
    }
  }

  unhighlight(elem?: Element | null, options: CellView.HighlightOptions = {}) {
    const magnet = this.prepareHighlight(elem, options)
    this.notify('cell:unhighlight', {
      magnet,
      options,
      view: this,
      cell: this.cell,
    })
    if (this.isNodeView()) {
      this.notify('node:unhighlight', {
        magnet,
        options,
        view: this,
        node: this.cell,
        cell: this.cell,
      })
    } else if (this.isEdgeView()) {
      this.notify('edge:unhighlight', {
        magnet,
        options,
        view: this,
        edge: this.cell,
        cell: this.cell,
      })
    }
  }

  notifyUnhighlight(magnet: Element, options: CellView.HighlightOptions) {}

  // #endregion

  getEdgeTerminal(
    magnet: Element,
    x: number,
    y: number,
    edge: Edge,
    type: Edge.TerminalType,
  ) {
    const cell = this.cell
    const portId = this.findAttr('port', magnet)
    const selector = magnet.getAttribute('data-selector')
    const terminal: Edge.TerminalCellData = { cell: cell.id }

    if (selector != null) {
      terminal.magnet = selector
    }

    if (portId != null) {
      terminal.port = portId
      if (cell.isNode()) {
        if (!cell.hasPort(portId) && selector == null) {
          // port created via the `port` attribute (not API)
          terminal.selector = this.getSelector(magnet)
        }
      }
    } else if (selector == null && this.container !== magnet) {
      terminal.selector = this.getSelector(magnet)
    }

    return this.customizeEdgeTerminal(terminal, magnet, x, y, edge, type)
  }

  protected customizeEdgeTerminal<T extends Edge.TerminalCellData>(
    terminal: T,
    magnet: Element,
    x: number,
    y: number,
    edge: Edge,
    type: Edge.TerminalType,
  ): T {
    const stra = edge.getStrategy() || this.graph.options.connecting.strategy
    if (stra) {
      const name = typeof stra === 'string' ? stra : stra.name
      const args = typeof stra === 'string' ? {} : stra.args || {}
      const registry = ConnectionStrategy.registry

      if (name) {
        const fn = registry.get(name)
        if (fn == null) {
          return registry.onNotFound(name)
        }

        const strategy = fn.call(
          this.graph,
          terminal,
          this,
          magnet,
          new Point(x, y),
          edge,
          type,
          args,
        )
        if (strategy) {
          return strategy
        }
      }
    }

    return terminal
  }

  getMagnetFromEdgeTerminal(terminal: Edge.TerminalData) {
    const cell = this.cell
    const root = this.container
    const portId = (terminal as Edge.TerminalCellData).port
    let selector = terminal.magnet
    let magnet
    if (portId != null && cell.isNode() && cell.hasPort(portId)) {
      magnet = (this as any).findPortElem(portId, selector) || root
    } else {
      if (!selector) {
        selector = terminal.selector
      }
      if (!selector && portId != null) {
        selector = `[port="${portId}"]`
      }
      magnet = this.findOne(selector, root, this.selectors)
    }

    return magnet
  }

  // #region tools

  protected tools: ToolsView | null

  hasTools(name?: string) {
    const tools = this.tools
    if (tools == null) {
      return false
    }

    if (name == null) {
      return true
    }

    return tools.name === name
  }

  addTools(options: ToolsView.Options): this
  addTools(tools: ToolsView): this
  addTools(config: ToolsView | ToolsView.Options) {
    this.removeTools()
    if (config) {
      const tools = config instanceof ToolsView ? config : new ToolsView(config)
      this.tools = tools
      this.graph.on('tools:hide', this.hideTools, this)
      this.graph.on('tools:show', this.showTools, this)
      this.graph.on('tools:remove', this.removeTools, this)
      tools.config({ cellView: this })
      tools.mount()
    }
    return this
  }

  updateTools(options: ToolsView.UpdateOptions = {}) {
    if (this.tools) {
      this.tools.update(options)
    }
    return this
  }

  removeTools() {
    if (this.tools) {
      this.tools.remove()
      this.graph.off('tools:hide', this.hideTools, this)
      this.graph.off('tools:show', this.showTools, this)
      this.graph.off('tools:remove', this.removeTools, this)
      this.tools = null
    }
    return this
  }

  hideTools() {
    if (this.tools) {
      this.tools.hide()
    }
    return this
  }

  showTools() {
    if (this.tools) {
      this.tools.show()
    }
    return this
  }

  // #endregion

  // #region events

  notify<Key extends keyof CellView.EventArgs>(
    name: Key,
    args: CellView.EventArgs[Key],
  ): this
  notify(name: Exclude<string, keyof CellView.EventArgs>, args: any): this
  notify<Key extends keyof CellView.EventArgs>(
    name: Key,
    args: CellView.EventArgs[Key],
  ) {
    this.trigger(name, args)
    this.graph.trigger(name, args)
    return this
  }

  protected getEventArgs<E>(e: E): CellView.MouseEventArgs<E>
  protected getEventArgs<E>(
    e: E,
    x: number,
    y: number,
  ): CellView.MousePositionEventArgs<E>
  protected getEventArgs<E>(e: E, x?: number, y?: number) {
    const view = this // tslint:disable-line
    const cell = view.cell
    if (x == null || y == null) {
      return { e, view, cell } as CellView.MouseEventArgs<E>
    }
    return { e, x, y, view, cell } as CellView.MousePositionEventArgs<E>
  }

  onClick(e: JQuery.ClickEvent, x: number, y: number) {
    this.notify('cell:click', this.getEventArgs(e, x, y))
  }

  onDblClick(e: JQuery.DoubleClickEvent, x: number, y: number) {
    this.notify('cell:dblclick', this.getEventArgs(e, x, y))
  }

  onContextMenu(e: JQuery.ContextMenuEvent, x: number, y: number) {
    this.notify('cell:contextmenu', this.getEventArgs(e, x, y))
  }

  protected cachedModelForMouseEvent: Model
  onMouseDown(e: JQuery.MouseDownEvent, x: number, y: number) {
    if (this.cell.model) {
      this.cachedModelForMouseEvent = this.cell.model
      this.cachedModelForMouseEvent.startBatch('mouse')
    }

    this.notify('cell:mousedown', this.getEventArgs(e, x, y))
  }

  onMouseUp(e: JQuery.MouseUpEvent, x: number, y: number) {
    this.notify('cell:mouseup', this.getEventArgs(e, x, y))

    if (this.cachedModelForMouseEvent) {
      this.cachedModelForMouseEvent.stopBatch('mouse', { cell: this.cell })
      delete this.cachedModelForMouseEvent
    }
  }

  onMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number) {
    this.notify('cell:mousemove', this.getEventArgs(e, x, y))
  }

  onMouseOver(e: JQuery.MouseOverEvent) {
    this.notify('cell:mouseover', this.getEventArgs(e))
  }

  onMouseOut(e: JQuery.MouseOutEvent) {
    this.notify('cell:mouseout', this.getEventArgs(e))
  }

  onMouseEnter(e: JQuery.MouseEnterEvent) {
    this.notify('cell:mouseenter', this.getEventArgs(e))
  }

  onMouseLeave(e: JQuery.MouseLeaveEvent) {
    this.notify('cell:mouseleave', this.getEventArgs(e))
  }

  onMouseWheel(e: JQuery.TriggeredEvent, x: number, y: number, delta: number) {
    this.notify('cell:mousewheel', {
      delta,
      ...this.getEventArgs(e, x, y),
    })
  }

  onCustomEvent(e: JQuery.MouseDownEvent, name: string, x: number, y: number) {
    this.notify('cell:customevent', { name, ...this.getEventArgs(e, x, y) })
    this.notify(name, { ...this.getEventArgs(e, x, y) })
  }

  onMagnetMouseDown(
    e: JQuery.MouseDownEvent,
    magnet: Element,
    x: number,
    y: number,
  ) {}

  onMagnetDblClick(
    e: JQuery.DoubleClickEvent,
    magnet: Element,
    x: number,
    y: number,
  ) {}

  onMagnetContextMenu(
    e: JQuery.ContextMenuEvent,
    magnet: Element,
    x: number,
    y: number,
  ) {}

  onLabelMouseDown(e: JQuery.MouseDownEvent, x: number, y: number) {}

  checkMouseleave(e: JQuery.TriggeredEvent) {
    const graph = this.graph
    if (graph.renderer.isAsync()) {
      // Do the updates of the current view synchronously now
      graph.renderer.dumpView(this)
    }
    const target = this.getEventTarget(e, { fromPoint: true })
    const view = graph.renderer.findViewByElem(target)
    if (view === this) {
      return
    }

    // Leaving the current view
    this.onMouseLeave(e as JQuery.MouseLeaveEvent)
    if (!view) {
      return
    }

    // Entering another view
    view.onMouseEnter(e as JQuery.MouseEnterEvent)
  }

  // #endregion
}

export namespace CellView {
  export interface Options {
    priority: number
    isSvgElement: boolean
    rootSelector: string
    bootstrap: Flag.Actions
    actions: KeyValue<Flag.Actions>
    events?: View.Events | null
    documentEvents?: View.Events | null
    interactive?: Interactive
  }

  interface InteractionMap {
    // edge
    edgeMove?: boolean
    labelMove?: boolean
    arrowheadMove?: boolean
    vertexMove?: boolean
    vertexAdd?: boolean
    vertexRemove?: boolean
    useEdgeTools?: boolean
    // node
    nodeMove?: boolean
    addEdgeFromMagnet?: boolean
    stopDelegation?: boolean
  }

  export type InteractiveName = keyof InteractionMap

  export type Interactive =
    | boolean
    | InteractionMap
    | ((this: Graph, cellView: CellView) => InteractionMap | true)

  export interface HighlightOptions {
    highlighter?:
      | string
      | {
          name: string
          args: KeyValue
        }

    type?:
      | 'snapping'
      | 'embedding'
      | 'connecting'
      | 'nodeAvailability'
      | 'magnetAvailability'

    partial?: boolean
  }
}

export namespace CellView {}

export namespace CellView {
  export interface PositionEventArgs {
    x: number
    y: number
  }

  export interface MouseDeltaEventArgs {
    delta: number
  }

  export interface MouseEventArgs<E> {
    e: E
    view: CellView
    cell: Cell
  }

  export interface MousePositionEventArgs<E>
    extends MouseEventArgs<E>,
      PositionEventArgs {}

  export interface EventArgs extends NodeView.EventArgs, EdgeView.EventArgs {
    'cell:click': MousePositionEventArgs<JQuery.ClickEvent>
    'cell:dblclick': MousePositionEventArgs<JQuery.DoubleClickEvent>
    'cell:contextmenu': MousePositionEventArgs<JQuery.ContextMenuEvent>
    'cell:mousedown': MousePositionEventArgs<JQuery.MouseDownEvent>
    'cell:mousemove': MousePositionEventArgs<JQuery.MouseMoveEvent>
    'cell:mouseup': MousePositionEventArgs<JQuery.MouseUpEvent>
    'cell:mouseover': MouseEventArgs<JQuery.MouseOverEvent>
    'cell:mouseout': MouseEventArgs<JQuery.MouseOutEvent>
    'cell:mouseenter': MouseEventArgs<JQuery.MouseEnterEvent>
    'cell:mouseleave': MouseEventArgs<JQuery.MouseLeaveEvent>
    'cell:mousewheel': MousePositionEventArgs<JQuery.TriggeredEvent> &
      MouseDeltaEventArgs
    'cell:customevent': MousePositionEventArgs<JQuery.MouseDownEvent> & {
      name: string
    }
    'cell:highlight': {
      magnet: Element
      view: CellView
      cell: Cell
      options: CellView.HighlightOptions
    }
    'cell:unhighlight': EventArgs['cell:highlight']
  }
}

// decorators
// ----
export namespace CellView {
  export function priority(value: number) {
    return function (ctor: typeof CellView) {
      ctor.config({ priority: value })
    }
  }

  export function bootstrap(actions: Flag.Actions) {
    return function (ctor: typeof CellView) {
      ctor.config({ bootstrap: actions })
    }
  }
}

export namespace CellView {
  export const registry = Registry.create<new (...args: any[]) => CellView>({
    type: 'view',
  })
}
