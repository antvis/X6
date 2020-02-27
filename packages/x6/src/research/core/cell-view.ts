import { Nullable, KeyValue } from '../../types'
import { Dictionary } from '../../struct'
import { v } from '../../v'
import { View } from './view'
import { Cell } from './cell'
// import { Graph } from './graph'
import { Attr } from '../attr'
import { ArrayExt, JSONObject } from '../../util'
import { Line, Rectangle, Ellipse, Polyline, Path } from '../../geometry'
import { CellViewFlag } from './cell-view-flag'
import { CellViewAttr } from './cell-view-attr'
import { CellViewCache } from './cell-view-cache'

export abstract class CellView<C extends Cell = Cell> extends View {
  protected static defaults: CellView.Options = {
    isSvgElement: true,
    rootSelector: 'root',
    priority: 0,
    bootstrap: [],
    actions: {},
    events: null,
    documentEvents: null,
  }

  static getDefaults(): CellView.Options {
    return this.defaults as CellView.Options
  }

  static setDefaults(options: Partial<CellView.Options>) {
    this.defaults = this.getOptions(options)
  }

  static getOptions(options: Partial<CellView.Options>): CellView.Options {
    const defaults = { ...this.getDefaults() }
    if (options.isSvgElement != null) {
      defaults.isSvgElement = options.isSvgElement
    }

    if (options.rootSelector != null) {
      defaults.rootSelector = options.rootSelector
    }

    if (options.priority != null) {
      defaults.priority = options.priority
    }

    if (options.bootstrap != null) {
      defaults.bootstrap = ArrayExt.uniq([
        ...(Array.isArray(defaults.bootstrap)
          ? defaults.bootstrap
          : [defaults.bootstrap]),
        ...(Array.isArray(options.bootstrap)
          ? options.bootstrap
          : [options.bootstrap]),
      ])
    }

    defaults.actions = {
      ...defaults.actions,
      ...options.actions,
    }

    if (options.events) {
      defaults.events = {
        ...defaults.events,
        ...options.events,
      }
    }

    if (options.documentEvents) {
      defaults.documentEvents = {
        ...defaults.documentEvents,
        ...options.documentEvents,
      }
    }

    return defaults
  }

  public graph: any
  public cell: C
  protected selectors: View.Selectors
  protected readonly options: CellView.Options
  protected readonly attrManager: CellViewAttr
  protected readonly flagManager: CellViewFlag
  protected readonly cacheManager: CellViewCache
  protected cache: Dictionary<Element, CellView.CacheItem>

  public scalableNode: Element | null
  public rotatableNode: Element | null

  constructor(cell: C, options: Partial<CellView.Options> = {}) {
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
    this.startListening()
    this.$(this.container).data('view', this)

    CellView.views[this.cid] = this
  }

  public get priority() {
    return this.options.priority
  }

  protected get rootSelector() {
    return this.options.rootSelector
  }

  protected ensureOptions(options: Partial<CellView.Options>) {
    return this.getConstructor().getOptions(options)
  }

  protected getConstructor<T extends typeof CellView>() {
    return (this.constructor as any) as T
  }

  protected getContainerTagName(): string {
    return this.options.isSvgElement ? 'g' : 'div'
  }

  protected getContainerStyle(): Nullable<
    JQuery.PlainObject<string | number>
  > {}

  protected getContainerAttrs(): Nullable<Attr.SimpleAttrs> {}

  attributes() {
    const cell = this.cell
    return {
      'model-id': cell.id,
      'data-type': cell.attrs!.type,
    }
  }

  protected getContainerClassName(): Nullable<string | string[]> {}

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

  remove() {
    super.remove()
    delete CellView.views[this.cid]
    return this
  }

  protected renderChildren(children: View.JSONMarkup[]) {
    if (children) {
      const isSVG = this.container instanceof SVGElement
      const ns = isSVG ? v.ns.svg : v.ns.xhtml
      const doc = View.parseJSONMarkup(children, { ns })
      v.empty(this.container)
      v.append(this.container, doc.fragment)
      // this.childNodes = doc.selectors
    }
    return this
  }

  confirmUpdate(flag: number, options: any = {}) {
    return 0
  }

  getFlag(actions: CellViewFlag.Actions) {
    return this.flagManager.getFlag(actions)
  }

  getBootstrapFlag() {
    return this.flagManager.getBootstrapFlag()
  }

  hasAction(flag: number, actions: CellViewFlag.Actions) {
    return this.flagManager.hasFlag(flag, actions)
  }

  removeAction(flag: number, actions: CellViewFlag.Actions) {
    return this.flagManager.removeFlag(flag, actions)
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

  protected startListening() {
    this.cell.on('changed', ({ options }: any) => this.onAttrsChange(options))
  }

  protected onAttrsChange(options: any) {
    let flag = this.flagManager.getChangeFlag()
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
    markup: View.JSONMarkup | View.JSONMarkup[],
    rootElem?: Element,
  ) {
    const result = View.parseJSONMarkup(markup)
    const selectors = result.selectors
    const rootSelector = this.options.rootSelector
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
    (this.options as any).interactive = value
  }

  notify(eventName: string, ...args: any[]) {}

  cleanCache() {
    this.cacheManager.clean()
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

  getBBox(options: { useModelGeometry?: boolean } = {}) {
    let bbox
    if (options.useModelGeometry) {
      const cell = this.cell
      bbox = cell.getBBox().bbox((cell as any).rotation || 0)
    } else {
      bbox = this.getNodeBBox(this.container)
    }

    return this.graph.localToPaperRect(bbox)
  }

  getNodeBBox(elem: Element) {
    const rect = this.getNodeBoundingRect(elem)
    const matrix = this.getNodeMatrix(elem)
    const translateMatrix = this.getRootTranslateMatrix()
    const rotateMatrix = this.getRootRotateMatrix()
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
    options: CellView.UpdateAttrsOptions = {},
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

  pointerdblclick(evt: JQuery.DoubleClickEvent, x: number, y: number) {
    this.trigger('cell:pointerdblclick', evt, x, y)
  }

  pointerclick(evt: JQuery.ClickEvent, x: number, y: number) {
    this.trigger('cell:pointerclick', evt, x, y)
  }

  contextmenu(evt: JQuery.ContextMenuEvent, x: number, y: number) {
    this.trigger('cell:contextmenu', evt, x, y)
  }

  pointerdown(evt: JQuery.MouseDownEvent, x: number, y: number) {
    // if (this.model.graph) {
    //   this.model.startBatch('pointer')
    //   this._graph = this.model.graph
    // }

    this.trigger('cell:pointerdown', evt, x, y)
  }

  pointermove(evt: JQuery.MouseMoveEvent, x: number, y: number) {
    this.trigger('cell:pointermove', evt, x, y)
  }

  pointerup(evt: JQuery.MouseUpEvent, x: number, y: number) {
    this.trigger('cell:pointerup', evt, x, y)

    // if (this._graph) {
    //   // we don't want to trigger event on model as model doesn't
    //   // need to be member of collection anymore (remove)
    //   this._graph.stopBatch('pointer', { cell: this.model })
    //   delete this._graph
    // }
  }

  mouseover(evt: JQuery.MouseOverEvent) {
    this.trigger('cell:mouseover', evt)
  }

  mouseout(evt: JQuery.MouseOutEvent) {
    this.trigger('cell:mouseout', evt)
  }

  mouseenter(evt: JQuery.MouseEnterEvent) {
    this.trigger('cell:mouseenter', evt)
  }

  mouseleave(evt: JQuery.MouseLeaveEvent) {
    this.trigger('cell:mouseleave', evt)
  }

  mousewheel(evt: JQuery.TriggeredEvent, x: number, y: number, delta: number) {
    this.trigger('cell:mousewheel', evt, x, y, delta)
  }

  onevent(evt: JQuery.TriggeredEvent, eventName: string, x: number, y: number) {
    this.trigger(eventName, evt, x, y)
  }

  onmagnet() {}

  magnetpointerdblclick() {}

  magnetcontextmenu() {}

  checkMouseleave(evt: JQuery.MouseLeaveEvent) {
    const paper = this.graph as any
    if (paper.isAsync()) {
      // Do the updates of the current view synchronously now
      paper.dumpView(this)
    }
    const target = this.getEventTarget(evt, { fromPoint: true })
    const view = paper.findView(target)
    if (view === this) return
    // Leaving the current view
    this.mouseleave(evt)
    if (!view) return
    // Entering another view
    view.mouseenter(evt)
  }
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
  }

  export type UpdateAttrsOptions = Partial<CellViewAttr.UpdateAttrsOptions>

  export interface CacheItem {
    data?: JSONObject
    matrix?: DOMMatrix
    boundingRect?: Rectangle
    shape?: Rectangle | Ellipse | Polyline | Path | Line
  }
}

export namespace CellView {
  export const views: { [cid: string]: CellView } = {}

  export function getView(cid: string) {
    return views[cid] || null
  }
}
