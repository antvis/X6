import { ObjectExt } from '../../util'
import { v, Attributes } from '../../v'
import { BaseView } from './base-view'
import { config } from './config'
import { Cell } from './cell'
import { Rectangle } from '../../geometry'

export class CellView<C extends Cell = Cell> extends BaseView {
  protected readonly tagName: 'g'
  protected readonly isSvgElement: boolean = true
  protected readonly events: BaseView.Events | null = null
  protected readonly documentEvents: BaseView.Events | null = null

  public readonly presentationAttributes: CellView.PresentationAttributes = {}
  public readonly initFlag: string | string[]
  public readonly UPDATE_PRIORITY: number = 2

  selector: 'root'
  metrics: any

  paper: any
  cell: C
  rotatableNode: any
  selectors: { [key: string]: Element | Element[] }

  _flags: { [name: string]: number } // tslint:disable-line
  _presentationAttributes: { [name: string]: number } // tslint:disable-line

  options: any

  constructor() {
    super()
    CellView.views[this.cid] = this
    this.setContainer(this.ensureContainer())
    this.init()
  }

  protected ensureContainer() {
    return BaseView.createElement(this.tagName, this.isSvgElement)
  }

  protected setContainer(container: Element) {
    this.undelegateEvents()
    this.container = container
    if (this.events != null) {
      this.delegateEvents(this.events)
    }
    return this
  }

  protected init() {
    this.setFlags()
    this.cleanNodesCache()
    this.$(this.container).data('view', this)
    this.startListening()
  }

  render() {
    return this
  }

  unmount() {
    v.remove(this.container)
  }

  remove() {
    this.cleanEventListeners(document)
    this.unmount()
    delete CellView.views[this.cid]
    return this
  }

  protected renderChildren(children: BaseView.JSONElement[]) {
    if (children) {
      const isSVG = this.container instanceof SVGElement
      const ns = isSVG ? v.ns.svg : v.ns.xhtml
      const doc = BaseView.parseDOMJSON(children, { ns })
      v.empty(this.container)
      v.append(this.container, doc.fragment)
      // this.childNodes = doc.selectors
    }
    return this
  }

  addClass(className: string | string[]) {
    v.addClass(
      this.container,
      Array.isArray(className) ? className.join(' ') : className,
    )
    return this
  }

  removeClass(className: string | string[]) {
    v.removeClass(
      this.container,
      Array.isArray(className) ? className.join(' ') : className,
    )
    return this
  }

  setStyle(style: any) {
    this.$(this.container).css(style)
  }

  setAttributes(attrs: Attributes) {
    if (this.container instanceof SVGElement) {
      v.attr(this.container, attrs)
    } else {
      this.$(this.container).attr(attrs)
    }
  }

  /**
   * Returns the value of the specified attribute of `node`.
   *
   * If the node does not set a value for attribute, start recursing up
   * the DOM tree from node to lookup for attribute at the ancestors of
   * node. If the recursion reaches CellView's root node and attribute
   * is not found even there, return `null`.
   */
  protected findAttribute(name: string, node: Element) {
    let current = node
    while (current && current.nodeType === 1) {
      const value = current.getAttribute(name)
      if (value != null) {
        return value
      }

      if (current === this.container) {
        return null
      }

      current = current.parentNode as Element
    }

    return null
  }

  confirmUpdate(flag: number, options: any = {}) {
    return 0
  }

  // initFlags
  setFlags() {
    const flags: { [key: string]: number } = {}
    const attributes: { [key: string]: number } = {}

    let shift = 0
    Object.keys(this.presentationAttributes).forEach(name => {
      let labels = this.presentationAttributes[name]
      if (!Array.isArray(labels)) {
        labels = [labels]
      }

      labels.forEach(label => {
        let flag = flags[label]
        if (!flag) {
          shift += 1
          flag = flags[label] = 1 << shift
        }
        attributes[name] |= flag
      })
    })

    let initFlag = this.initFlag
    if (!Array.isArray(initFlag)) {
      initFlag = [initFlag]
    }

    initFlag.forEach(label => {
      if (!flags[label]) {
        shift += 1
        flags[label] = 1 << shift
      }
    })

    // 26 - 30 are reserved for paper flags
    // 31+ overflows maximal number
    if (shift > 25) {
      throw new Error('Maximum number of flags exceeded.')
    }

    this._flags = flags
    this._presentationAttributes = attributes
  }

  hasFlag(flag: number, label: string | string[]) {
    return flag & this.getFlag(label)
  }

  removeFlag(flag: number, label: string | string[]) {
    return flag ^ (flag & this.getFlag(label))
  }

  getFlag(label: string | string[]) {
    const flags = this._flags
    if (flags == null) {
      return 0
    }

    if (Array.isArray(label)) {
      return label.reduce((memo, key) => memo | flags[key], 0)
    }

    return flags[label] | 0
  }

  attributes() {
    const cell = this.cell
    return {
      'model-id': cell.id,
      'data-type': cell.attrs!.type,
    }
  }

  startListening() {
    this.cell.on('change', this.onAttributesChange, this)
  }

  onAttributesChange(cell: C, opt: any) {
    let flag = cell.getChangeFlag(this._presentationAttributes)
    if (opt.updateHandled || !flag) {
      return
    }

    if (opt.dirty && this.hasFlag(flag, 'UPDATE')) {
      flag |= this.getFlag('RENDER')
    }

    // TODO: tool changes does not need to be sync
    // Fix Segments tools
    if (opt.tool) {
      opt.async = false
    }

    if (this.paper != null) {
      this.paper.requestViewUpdate(this, flag, this.UPDATE_PRIORITY, opt)
    }
  }

  parseDOMJSON(markup: BaseView.JSONElement[], root?: Element) {
    const doc = BaseView.parseDOMJSON(markup)
    const selectors = doc.selectors

    if (root) {
      const rootSelector = this.selector
      if (selectors[rootSelector]) {
        throw new Error('Invalid root selector')
      }
      selectors[rootSelector] = root
    }

    return { selectors, fragment: doc.fragment }
  }

  can(feature: string): boolean {
    let interactive = this.options.interactive
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
    this.options.interactive = value
  }

  findBySelector(
    selector?: string,
    root: Element = this.container,
    selectors: { [key: string]: Element | Element[] } = this.selectors,
  ) {
    // These are either descendants of `this.$el` of `this.$el` itself.
    // `.` is a special selector used to select the wrapping `<g>` element.
    if (!selector || selector === '.') {
      return [root]
    }

    if (selectors) {
      const nodes = selectors[selector]
      if (nodes) {
        if (Array.isArray(nodes)) {
          return nodes
        }

        return [nodes]
      }
    }

    if (config.useCSSSelectors) {
      return this.$(root)
        .find(selector)
        .toArray()
    }

    return []
  }

  notify(eventName: string, ...args: any[]) {}

  getBBox(opt: any) {
    let bbox
    if (opt && opt.useModelGeometry) {
      const cell = this.cell
      bbox = cell.getBBox().bbox((cell as any).rotation || 0)
    } else {
      bbox = this.getNodeBBox(this.container)
    }

    return this.paper.localToPaperRect(bbox)
  }

  getNodeBBox(magnet: Element) {
    const rect = this.getNodeBoundingRect(magnet)
    const magnetMatrix = this.getNodeMatrix(magnet)
    const translateMatrix = this.getRootTranslateMatrix()
    const rotateMatrix = this.getRootRotateMatrix()
    return v.transformRect(
      rect,
      translateMatrix.multiply(rotateMatrix).multiply(magnetMatrix),
    )
  }

  getNodeUnrotatedBBox(magnet: SVGElement) {
    const rect = this.getNodeBoundingRect(magnet)
    const magnetMatrix = this.getNodeMatrix(magnet)
    const translateMatrix = this.getRootTranslateMatrix()
    return v.transformRect(rect, translateMatrix.multiply(magnetMatrix))
  }

  getRootTranslateMatrix() {
    const position = (this.cell as any).position
    const mt = v.createSVGMatrix().translate(position.x, position.y)
    return mt
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

  findMagnet(elem: Element) {
    let $elem = this.$(elem)
    const $root = this.$(this.container)

    if ($elem.length === 0) {
      $elem = $root
    }

    do {
      const magnet = $elem.attr('magnet')
      if ((magnet || $elem.is($root as any)) && magnet !== 'false') {
        return $elem[0]
      }

      $elem = $elem.parent()
    } while ($elem.length > 0)

    // If the overall cell has set `magnet === false`, then return `undefined` to
    // announce there is no magnet found for this cell.
    // This is especially useful to set on cells that have 'ports'. In this case,
    // only the ports have set `magnet === true` and the overall element has `magnet === false`.
    return undefined
  }

  getSelector(elem: Element, prevSelector?: string): string | undefined {
    let selector

    if (elem === this.container) {
      if (typeof prevSelector === 'string') {
        selector = `> ${prevSelector}`
      }
      return selector
    }

    if (elem) {
      const nthChild = v.index(elem) + 1
      selector = `${elem.tagName}:nth-child(${nthChild})`
      if (prevSelector) {
        selector += ` > ${prevSelector}`
      }

      selector = this.getSelector(elem.parentNode as Element, selector)
    }

    return selector
  }

  getAttributeDefinition(attrName: string) {
    // return this.model.constructor.getAttributeDefinition(attrName)
  }

  setNodeAttributes(node: Element, attrs: Attributes) {
    if (!ObjectExt.isEmpty(attrs)) {
      if (node instanceof SVGElement) {
        v.attr(node, attrs)
      } else {
        $(node).attr(attrs)
      }
    }
  }

  cleanNodesCache() {
    this.metrics = {}
  }

  nodeCache(magnet: Element) {
    const metrics = this.metrics
    // Don't use cache? It most likely a custom view with overridden update.
    if (!metrics) {
      return {}
    }

    // 可以使用 weakmap 代替 id:value
    const id = v.ensureId(magnet as any)
    let value = metrics[id]
    if (!value) {
      value = metrics[id] = {}
    }
    return value
  }

  getNodeData(magnet: Element) {
    const metrics = this.nodeCache(magnet)
    if (!metrics.data) metrics.data = {}
    return metrics.data
  }

  getNodeBoundingRect(magnet: Element) {
    const metrics = this.nodeCache(magnet)
    if (metrics.boundingRect == null) {
      metrics.boundingRect = v(magnet as any).getBBox()
    }

    return new Rectangle(metrics.boundingRect)
  }

  getNodeMatrix(magnet: Element) {
    const metrics = this.nodeCache(magnet)
    if (metrics.magnetMatrix === undefined) {
      const target = this.rotatableNode || this.container
      metrics.magnetMatrix = v.getTransformToElement(magnet as any, target)
    }

    return v.createSVGMatrix(metrics.magnetMatrix)
  }

  getNodeShape(magnet: SVGElement) {
    const metrics = this.nodeCache(magnet)
    if (metrics.geometryShape === undefined) {
      metrics.geometryShape = v.toGeometryShape(magnet)
    }
    return metrics.geometryShape.clone()
  }

  getEventTarget(
    evt: JQuery.TriggeredEvent,
    opt: { fromPoint?: boolean } = {},
  ) {
    // Touchmove/Touchend event's target is not reflecting the element under
    // the coordinates as mousemove does.
    // It holds the element when a touchstart triggered.
    const { target, type, clientX = 0, clientY = 0 } = evt
    if (opt.fromPoint || type === 'touchmove' || type === 'touchend') {
      return document.elementFromPoint(clientX, clientY)
    }

    return target
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
    const paper = this.paper
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
  export interface ProcessedAttributes {
    set?: Attributes
    position?: Attributes
    offset?: Attributes
    normal?: Attributes
  }

  export interface PresentationAttributes {
    [name: string]: string | string[]
  }

  export const views: { [cid: string]: CellView } = {}
}
