import { v } from '../../v'
import { Rectangle, Point } from '../../geometry'
import { Dictionary } from '../../struct'
import { Nullable, KeyValue } from '../../types'
import { ArrayExt, ObjectExt } from '../../util'
import { Cell } from './cell'
import { Model } from './model'
import { Edge } from './edge'
import { View } from './view'
import { Markup } from './markup'
// import { Graph } from './graph'
import { Attr } from '../attr'
import { CellViewFlag } from './cell-view-flag'
import { CellViewAttr } from './cell-view-attr'
import { CellViewCache } from './cell-view-cache'
import { ToolsView } from './tools-view'
import { Graph } from './graph'

export class CellView<
  C extends Cell = Cell,
  Options extends CellView.Options = CellView.Options
> extends View {
  protected static defaults: CellView.Options = {
    isSvgElement: true,
    rootSelector: 'root',
    priority: 0,
    bootstrap: [],
    actions: {},
    events: null,
    documentEvents: null,
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
      Object.keys(actions).forEach(key => {
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
  public cell: C
  protected selectors: Markup.Selectors
  protected readonly options: Options
  protected readonly attrManager: CellViewAttr
  protected readonly flagManager: CellViewFlag
  protected readonly cacheManager: CellViewCache
  protected cache: Dictionary<Element, CellViewCache.CacheItem>

  public scalableNode: Element | null
  public rotatableNode: Element | null

  constructor(cell: C, options: Partial<Options> = {}) {
    super()

    this.cell = cell
    this.options = this.ensureOptions(options)
    this.attrManager = new CellViewAttr(this)
    this.flagManager = new CellViewFlag(
      this,
      this.options.actions,
      this.options.bootstrap,
    )
    this.cacheManager = new CellViewCache(this)

    this.setContainer(this.ensureContainer())
    this.setup()
    this.$(this.container).data('view', this)

    CellView.views[this.cid] = this
  }

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

  protected getContainerStyle(): Nullable<
    JQuery.PlainObject<string | number>
  > {}

  protected getContainerAttrs(): Nullable<Attr.SimpleAttrs> {
    return {
      'data-id': this.cell.id,
    }
  }

  protected getContainerClassName(): Nullable<string | string[]> {
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

  render() {
    return this
  }

  remove(elem: Element = this.container) {
    super.remove(elem)
    if (elem === this.container) {
      delete CellView.views[this.cid]
    }
    return this
  }

  protected renderChildren(children: Markup.JSONMarkup[]) {
    if (children) {
      const isSVG = this.container instanceof SVGElement
      const ns = isSVG ? v.ns.svg : v.ns.xhtml
      const ret = Markup.parseJSONMarkup(children, { ns })
      v.empty(this.container)
      v.append(this.container, ret.fragment)
      // this.childNodes = doc.selectors
    }
    return this
  }

  confirmUpdate(flag: number, options: any = {}) {
    return 0
  }

  getBootstrapFlag() {
    return this.flagManager.getBootstrapFlag()
  }

  getFlag(actions: CellViewFlag.Actions) {
    return this.flagManager.getFlag(actions)
  }

  hasAction(flag: number, actions: CellViewFlag.Actions) {
    return this.flagManager.hasAction(flag, actions)
  }

  removeAction(flag: number, actions: CellViewFlag.Actions) {
    return this.flagManager.removeAction(flag, actions)
  }

  handleAction(
    flag: number,
    action: CellViewFlag.Action,
    handle: () => void,
    additionalRemovedActions?: CellViewFlag.Actions | null,
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
    this.cell.on('changed', ({ options }: any) => this.onAttrsChange(options))
  }

  protected onAttrsChange(options: any) {
    let flag = this.flagManager.getChangedFlag()
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
      this.graph.requestViewUpdate(this, flag, this.priority, options)
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

  can(feature: string): boolean {
    let interactive = (this.options as any).interactive
    interactive =
      typeof interactive === 'function' ? interactive(this) : interactive

    const type = typeof interactive

    if (type === 'object') {
      return interactive[feature] !== false
    }

    if (type === 'boolean') {
      return interactive
    }

    return false
  }

  setInteractivity(value: any) {
    const options = this.options as any
    options.interactive = value
  }

  cleanCache() {
    this.cacheManager.clean()
    return this
  }

  getCache(elem: Element) {
    return this.cacheManager.get(elem)
  }

  getNodeData(elem: Element) {
    return this.cacheManager.getData(elem)
  }

  getNodeBoundingRect(elem: Element) {
    return this.cacheManager.getBoundingRect(elem)
  }

  getNodeMatrix(elem: Element) {
    return this.cacheManager.getMatrix(elem)
  }

  getNodeShape(elem: SVGElement) {
    return this.cacheManager.getShape(elem)
  }

  getNodeScale(node: Element, scalableNode?: SVGElement) {
    let sx
    let sy
    if (scalableNode && scalableNode.contains(node)) {
      const scale = v.scale(scalableNode)
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
    return v.transformRect(
      rect,
      translateMatrix.multiply(rotateMatrix).multiply(matrix),
    )
  }

  getNodeUnrotatedBBox(elem: SVGElement) {
    const rect = this.getNodeBoundingRect(elem)
    const matrix = this.getNodeMatrix(elem)
    const translateMatrix = this.getRootTranslateMatrix()
    return v.transformRect(rect, translateMatrix.multiply(matrix))
  }

  getBBox(options: { fromCell?: boolean } = {}) {
    let bbox
    if (options.fromCell) {
      const cell = this.cell
      bbox = cell.getBBox().bbox((cell as any).rotation || 0)
    } else {
      bbox = this.getNodeBBox(this.container)
    }

    return this.graph.localToPaperRect(bbox)
  }

  getRootTranslateMatrix() {
    const pos = (this.cell as any).position
    return v.createSVGMatrix().translate(pos.x, pos.y)
  }

  getRootRotateMatrix() {
    let matrix = v.createSVGMatrix()
    const cell = this.cell
    const angle = (cell as any).rotation
    if (angle) {
      const bbox = cell.getBBox()
      const cx = bbox.width / 2
      const cy = bbox.height / 2
      matrix = matrix
        .translate(cx, cy)
        .rotate(angle)
        .translate(-cx, -cy)
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
    options: Partial<CellViewAttr.UpdateAttrsOptions> = {},
  ) {
    if (options.rootBBox == null) {
      options.rootBBox = new Rectangle()
    }

    if (options.selectors == null) {
      options.selectors = this.selectors
    }

    this.attrManager.updateAttrs(
      rootNode,
      attrs,
      options as CellViewAttr.UpdateAttrsOptions,
    )
  }

  isEdgeElement(magnet?: Element | null) {
    return this.cell.isEdge() && (magnet == null || magnet === this.container)
  }

  highlight(elem?: Element | null, options: CellView.HighlightOptions = {}) {
    const magnet = (elem && this.$(elem)[0]) || this.container
    options.partial = magnet === this.container
    this.notify('cell:highlight', { magnet, options, view: this })
  }

  unhighlight(elem?: Element | null, options: CellView.HighlightOptions = {}) {
    const magnet = (elem && this.$(elem)[0]) || this.container
    options.partial = magnet === this.container
    this.notify('cell:unhighlight', { magnet, options, view: this })
  }

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
    const terminal: Edge.TerminalCellData = { cellId: cell.id }

    if (selector != null) {
      terminal.magnet = selector
    }

    if (portId != null) {
      terminal.portId = portId
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

  protected customizeEdgeTerminal(
    end: Edge.TerminalCellData,
    magnet: Element,
    x: number,
    y: number,
    edge: Edge,
    type: Edge.TerminalType,
  ) {
    const graph = this.graph
    const connectionStrategy = graph.options.connectionStrategy as any
    if (typeof connectionStrategy === 'function') {
      const strategy = connectionStrategy.call(
        graph,
        end,
        this,
        magnet,
        new Point(x, y),
        edge,
        type,
        graph,
      )
      if (strategy) {
        return strategy
      }
    }
    return end
  }

  getMagnetFromEdgeTerminal(terminal: Edge.TerminalData) {
    const cell = this.cell
    const root = this.container
    const portId = (terminal as Edge.TerminalCellData).portId
    let selector = terminal.magnet
    let magnet
    if (portId != null && cell.isNode() && cell.hasPort(portId)) {
      magnet = (this as any).findPortNode(portId, selector) || root
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
  protected toolsView: ToolsView | null
  protected readonly toolsEventHandler = (event: string) => {
    this.onToolEvent(event)
  }

  hasTools(name?: string) {
    const toolsView = this.toolsView
    if (toolsView == null) {
      return false
    }
    if (name == null) {
      return true
    }
    return toolsView.getName() === name
  }

  addTools(toolsView: ToolsView) {
    this.removeTools()
    if (toolsView) {
      this.toolsView = toolsView
      this.graph.on('tools:event', this.toolsEventHandler)
      toolsView.configure({ cellView: this })
      toolsView.mount()
    }
    return this
  }

  updateTools(options: ToolsView.UpdateOptions = {}) {
    const toolsView = this.toolsView
    if (toolsView) {
      toolsView.update(options)
    }
    return this
  }

  removeTools() {
    const toolsView = this.toolsView
    if (toolsView) {
      toolsView.remove()
      this.graph.off('tools:event', this.toolsEventHandler)
      this.toolsView = null
    }
    return this
  }

  hideTools() {
    const toolsView = this.toolsView
    if (toolsView) {
      toolsView.hide()
    }
    return this
  }

  showTools() {
    const toolsView = this.toolsView
    if (toolsView) {
      toolsView.show()
    }
    return this
  }

  protected onToolEvent(event: string) {
    switch (event) {
      case 'remove':
        this.removeTools()
        break
      case 'hide':
        this.hideTools()
        break
      case 'show':
        this.showTools()
        break
    }
  }

  // #endregion

  // #region events

  protected notify(name: string, args: any) {
    this.trigger(name, args)
    this.graph.trigger(name, args)
  }

  onClick(e: JQuery.ClickEvent, x: number, y: number) {
    this.notify('cell:click', { e, x, y, view: this, cell: this.cell })
  }

  onDblClick(e: JQuery.DoubleClickEvent, x: number, y: number) {
    this.notify('cell:dblclick', { e, x, y, view: this, cell: this.cell })
  }

  onContextMenu(e: JQuery.ContextMenuEvent, x: number, y: number) {
    this.notify('cell:contextmenu', { e, x, y, view: this, cell: this.cell })
  }

  protected cachedModelForMouseEvent: Model
  onMouseDown(e: JQuery.MouseDownEvent, x: number, y: number) {
    if (this.cell.model) {
      this.cachedModelForMouseEvent = this.cell.model
      this.cachedModelForMouseEvent.startBatch('mouse')
    }

    this.notify('cell:mousedown', { e, x, y, view: this, cell: this.cell })
  }

  onMouseUp(e: JQuery.MouseUpEvent, x: number, y: number) {
    this.notify('cell:mouseup', { e, x, y, view: this, cell: this.cell })

    if (this.cachedModelForMouseEvent) {
      this.cachedModelForMouseEvent.stopBatch('mouse', { cell: this.cell })
      delete this.cachedModelForMouseEvent
    }
  }

  onMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number) {
    this.notify('cell:mousemove', { e, x, y, view: this, cell: this.cell })
  }

  onMouseOver(e: JQuery.MouseOverEvent) {
    this.notify('cell:mouseover', { e, view: this, cell: this.cell })
  }

  onMouseOut(e: JQuery.MouseOutEvent) {
    this.notify('cell:mouseout', { e, view: this, cell: this.cell })
  }

  onMouseEnter(e: JQuery.MouseEnterEvent) {
    this.notify('cell:mouseenter', { e, view: this, cell: this.cell })
  }

  onMouseLeave(e: JQuery.MouseLeaveEvent) {
    this.notify('cell:mouseleave', { e, view: this, cell: this.cell })
  }

  onMouseWheel(e: JQuery.TriggeredEvent, x: number, y: number, delta: number) {
    this.notify('cell:mousewheel', {
      e,
      x,
      y,
      delta,
      view: this,
      cell: this.cell,
    })
  }

  onCustomEvent(
    e: JQuery.MouseDownEvent,
    eventName: string,
    x: number,
    y: number,
  ) {
    this.notify(eventName, { e, x, y })
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

  protected checkMouseleave(e: JQuery.TriggeredEvent) {
    const graph = this.graph
    if (graph.isAsync()) {
      // Do the updates of the current view synchronously now
      graph.dumpView(this)
    }
    const target = this.getEventTarget(e, { fromPoint: true })
    const view = graph.findView(target)
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
    bootstrap: CellViewFlag.Actions
    actions: KeyValue<CellViewFlag.Actions>
    events: View.Events | null
    documentEvents: View.Events | null
    interactive?: KeyValue<boolean> | ((cellView: CellView) => boolean)
  }

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

export namespace CellView {
  export const views: { [cid: string]: CellView } = {}

  export function getView(cid: string) {
    return views[cid] || null
  }
}

// decorators
// ----
export namespace CellView {
  export function priority(value: number) {
    return function(ctor: typeof CellView) {
      ctor.config({ priority: value })
    }
  }

  export function bootstrap(actions: CellViewFlag.Actions) {
    return function(ctor: typeof CellView) {
      ctor.config({ bootstrap: actions })
    }
  }
}
