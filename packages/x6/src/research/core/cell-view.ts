import { Dictionary } from '../../struct'
import { v } from '../../v'
import { View } from './view'
import { Cell } from './cell'
import { Attribute } from '../attr'
import { StringExt, ArrayExt, ObjectExt, JSONObject } from '../../util'
import { Point, Line, Rectangle, Ellipse, Polyline, Path } from '../../geometry'

export abstract class CellView<C extends Cell = Cell> extends View {
  protected readonly tagName: string
  protected readonly isSvgElement: boolean
  protected readonly rootSelector: string
  public readonly UPDATE_PRIORITY: number
  public readonly initFlag: string | string[]
  public readonly presentationAttributes: CellView.PresentationAttributes
  protected readonly events: View.Events | null
  protected readonly documentEvents: View.Events | null
  protected cache: Dictionary<Element, CellView.CacheItem>

  protected selectors: View.Selectors

  public cell: C
  public graph: any
  public scalableNode: Element | null
  public rotatableNode: Element | null

  protected flags: { [label: string]: number }
  protected _presentationAttributes: { [name: string]: number } // tslint:disable-line
  protected options: any

  constructor(cell: C) {
    super()

    this.cell = cell

    const config = this.configure()
    this.tagName = config.tagName || 'g'
    this.isSvgElement = config.isSvgElement !== false
    this.rootSelector = config.rootSelector || 'root'
    this.UPDATE_PRIORITY =
      config.UPDATE_PRIORITY != null ? config.UPDATE_PRIORITY : 2
    this.initFlag = config.initFlag || []
    this.presentationAttributes = config.presentationAttributes || {}
    this.events = config.events || null
    this.documentEvents = config.documentEvents || null

    this.setContainer(this.ensureContainer())
    this.initFlags()
    this.cleanCache()
    this.startListening()
    this.$(this.container).data('view', this)

    CellView.views[this.cid] = this
  }

  protected abstract configure(): CellView.Config

  protected ensureContainer() {
    // className
    // style
    // attribute
    return View.createElement(this.tagName, this.isSvgElement)
  }

  protected setContainer(container: Element) {
    this.undelegateEvents()
    this.container = container
    if (this.events != null) {
      this.delegateEvents(this.events)
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

  initFlags() {
    const flags: { [key: string]: number } = {}
    const attrs: { [key: string]: number } = {}

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
        attrs[name] |= flag
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

    this.flags = flags
    this._presentationAttributes = attrs
  }

  hasFlag(flag: number, label: string | string[]) {
    return flag & this.getFlag(label)
  }

  removeFlag(flag: number, label: string | string[]) {
    return flag ^ (flag & this.getFlag(label))
  }

  getFlag(label: string | string[]) {
    const flags = this.flags
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

  onAttributesChange(cell: C, options: any) {
    let flag = cell.getChangeFlag(this._presentationAttributes)
    if (options.updated || !flag) {
      return
    }

    if (options.dirty && this.hasFlag(flag, CellView.Flag.update)) {
      flag |= this.getFlag(CellView.Flag.render)
    }

    // TODO: tool changes does not need to be sync
    // Fix Segments tools
    if (options.tool) {
      options.async = false
    }

    if (this.graph != null) {
      this.graph.requestViewUpdate(this, flag, this.UPDATE_PRIORITY, options)
    }
  }

  parseJSONMarkup(
    markup: View.JSONMarkup | View.JSONMarkup[],
    rootElem?: Element,
  ) {
    const result = View.parseJSONMarkup(markup)
    if (rootElem && this.rootSelector) {
      const selectors = result.selectors
      const rootSelector = this.rootSelector
      if (selectors[rootSelector]) {
        throw new Error('Invalid root selector')
      }
      selectors[rootSelector] = rootElem
    }
    return result
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

  notify(eventName: string, ...args: any[]) {}

  protected cleanCache() {
    if (this.cache) {
      this.cache.dispose()
    }
    this.cache = new Dictionary()
  }

  protected getCache(elem: Element) {
    const cache = this.cache
    if (!cache.has(elem)) {
      this.cache.set(elem, {})
    }
    return this.cache.get(elem)!
  }

  getNodeData(elem: Element) {
    const meta = this.getCache(elem)
    if (!meta.data) {
      meta.data = {}
    }
    return meta.data
  }

  getNodeBoundingRect(elem: Element) {
    const meta = this.getCache(elem)
    if (meta.boundingRect == null) {
      meta.boundingRect = v.getBBox(elem as SVGElement)
    }
    return meta.boundingRect.clone()
  }

  getNodeMatrix(elem: Element) {
    const meta = this.getCache(elem)
    if (meta.matrix == null) {
      const target = this.rotatableNode || this.container
      meta.matrix = v.getTransformToElement(elem as any, target as SVGElement)
    }

    return v.createSVGMatrix(meta.matrix)
  }

  getNodeShape(elem: SVGElement) {
    const meta = this.getCache(elem)
    if (meta.shape == null) {
      meta.shape = v.toGeometryShape(elem)
    }
    return meta.shape.clone()
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

    return this.findByAttribute('magnet')
  }

  protected getAttributeDefinition(
    attrName: string,
  ): Attribute.Definition | null {
    return this.cell.getAttributeDefinition(attrName)
  }

  protected processNodeAttributes(
    node: Element,
    raw: Attribute.ComplexAttributes,
  ): CellView.ProcessedAttributes {
    let normal: Attribute.SimpleAttributes | undefined
    let set: Attribute.ComplexAttributes | undefined
    let offset: Attribute.ComplexAttributes | undefined
    let position: Attribute.ComplexAttributes | undefined

    const specials: { name: string; definition: Attribute.Definition }[] = []

    // divide the attributes between normal and special
    Object.keys(raw).forEach(name => {
      const val = raw[name]
      const definition = this.getAttributeDefinition(name)
      const isValid = Attribute.isValidDefinition(definition, val, {
        node,
        attrs: raw,
        view: this,
      })

      if (definition && isValid) {
        if (typeof definition === 'string') {
          if (normal == null) {
            normal = {}
          }
          normal[definition] = val as Attribute.SimpleAttributeValue
        } else if (val !== null) {
          specials.push({ name, definition })
        }
      } else {
        if (normal == null) {
          normal = {}
        }
        normal[
          StringExt.kebabCase(name)
        ] = val as Attribute.SimpleAttributeValue
      }
    })

    specials.forEach(({ name, definition }) => {
      const val = raw[name]

      const setDefine = definition as Attribute.SetDefinition
      if (typeof setDefine.set === 'function') {
        if (set == null) {
          set = {}
        }
        set[name] = val
      }

      const offsetDefine = definition as Attribute.OffsetDefinition
      if (typeof offsetDefine.offset === 'function') {
        if (offset == null) {
          offset = {}
        }
        offset[name] = val
      }

      const positionDefine = definition as Attribute.PositionDefinition
      if (typeof positionDefine.position === 'function') {
        if (position == null) {
          position = {}
        }
        position[name] = val
      }
    })

    return {
      raw,
      normal,
      set,
      offset,
      position,
    }
  }

  protected mergeProcessedAttributes(
    allProcessedAttrs: CellView.ProcessedAttributes,
    roProcessedAttrs: CellView.ProcessedAttributes,
  ) {
    allProcessedAttrs.set = {
      ...allProcessedAttrs.set,
      ...roProcessedAttrs.set,
    }

    allProcessedAttrs.position = {
      ...allProcessedAttrs.position,
      ...roProcessedAttrs.position,
    }

    allProcessedAttrs.offset = {
      ...allProcessedAttrs.offset,
      ...roProcessedAttrs.offset,
    }

    // Handle also the special transform property.
    const transform =
      allProcessedAttrs.normal && allProcessedAttrs.normal.transform
    if (transform != null && roProcessedAttrs.normal) {
      roProcessedAttrs.normal.transform = transform
    }
    allProcessedAttrs.normal = roProcessedAttrs.normal
  }

  protected findNodesAttributes(
    cellAttrs: Attribute.CellAttributes,
    rootNode: Element,
    selectorCache: { [selector: string]: Element[] },
    selectors: View.Selectors,
  ) {
    const merge: Element[] = []
    const result: Dictionary<
      Element,
      {
        node: Element
        array: boolean
        length: number | number[]
        attrs: Attribute.ComplexAttributes | Attribute.ComplexAttributes[]
      }
    > = new Dictionary()

    Object.keys(cellAttrs).forEach(selector => {
      const attrs = cellAttrs[selector]
      if (!ObjectExt.isPlainObject(attrs)) {
        return
      }

      selectorCache[selector] = this.find(selector, rootNode, selectors)

      const nodes = selectorCache[selector]
      for (let i = 0, l = nodes.length; i < l; i += 1) {
        const node = nodes[i]
        const unique = selectors && selectors[selector] === node
        const prev = result.get(node)
        if (prev) {
          if (!prev.array) {
            merge.push(node)
            prev.array = true
            prev.attrs = [prev.attrs as Attribute.ComplexAttributes]
            prev.length = [prev.length as number]
          }

          const attributes = prev.attrs as Attribute.ComplexAttributes[]
          const selectedLength = prev.length as number[]
          if (unique) {
            // node referenced by `selector`
            attributes.unshift(attrs)
            selectedLength.unshift(-1)
          } else {
            // node referenced by `groupSelector`
            const sortIndex = ArrayExt.sortedIndex(selectedLength, l)
            attributes.splice(sortIndex, 0, attrs)
            selectedLength.splice(sortIndex, 0, l)
          }
        } else {
          result.set(node, {
            node,
            attrs,
            length: unique ? -1 : l,
            array: false,
          })
        }
      }
    })

    merge.forEach(node => {
      const item = result.get(node)!
      const arr = item.attrs as Attribute.ComplexAttributes[]
      item.attrs = arr.reduceRight(
        (memo, attrs) => ({
          ...memo,
          ...attrs,
        }),
        {},
      )
    })

    return result as Dictionary<
      Element,
      {
        node: Element
        array: boolean
        length: number | number[]
        attrs: Attribute.ComplexAttributes
      }
    >
  }

  protected updateRelativeAttributes(
    node: Element,
    processedAttrs: CellView.ProcessedAttributes,
    refBBox: Rectangle,
    options: CellView.UpdateDOMSubtreeAttributesOptions = {},
  ) {
    const rawAttrs = processedAttrs.raw || {}
    let nodeAttrs = processedAttrs.normal || {}
    const setAttrs = processedAttrs.set
    const positionAttrs = processedAttrs.position
    const offsetAttrs = processedAttrs.offset
    const getOptions = () => ({
      node,
      view: this,
      attrs: rawAttrs,
      refBBox: refBBox.clone(),
    })

    if (setAttrs != null) {
      Object.keys(setAttrs).forEach(name => {
        const val = setAttrs[name]
        const def = this.getAttributeDefinition(name)
        if (def != null) {
          const ret = (def as Attribute.SetDefinition).set(val, getOptions())
          if (typeof ret === 'object') {
            nodeAttrs = {
              ...nodeAttrs,
              ...ret,
            }
          } else if (ret != null) {
            nodeAttrs[name] = ret
          }
        }
      })
    }

    if (node instanceof HTMLElement) {
      // TODO: setting the `transform` attribute on HTMLElements
      // via `node.style.transform = 'matrix(...)';` would introduce
      // a breaking change (e.g. basic.TextBlock).
      this.setAttributes(nodeAttrs, node)
      return
    }

    // The final translation of the subelement.
    const nodeTransform = nodeAttrs.transform
    const transform = nodeTransform ? `${nodeTransform}` : null
    const nodeMatrix = v.transformStringToMatrix(transform)
    const nodePosition = new Point(nodeMatrix.e, nodeMatrix.f)
    if (nodeTransform) {
      delete nodeAttrs.transform
      nodeMatrix.e = 0
      nodeMatrix.f = 0
    }

    // Calculates node scale determined by the scalable group.
    let sx = 1
    let sy = 1
    if (positionAttrs || offsetAttrs) {
      const scale = this.getNodeScale(node, options.scalableNode as SVGElement)
      sx = scale.sx
      sy = scale.sy
    }

    let positioned = false
    if (positionAttrs != null) {
      Object.keys(positionAttrs).forEach(name => {
        const val = positionAttrs[name]
        const def = this.getAttributeDefinition(name)
        if (def != null) {
          const ts = (def as Attribute.PositionDefinition).position(
            val,
            getOptions(),
          )

          if (ts != null) {
            positioned = true
            nodePosition.translate(Point.create(ts).scale(sx, sy))
          }
        }
      })
    }

    // The node bounding box could depend on the `size`
    // set from the previous loop.
    this.setAttributes(nodeAttrs, node)

    let offseted = false
    if (offsetAttrs != null) {
      // Check if the node is visible
      const nodeBoundingRect = this.getNodeBoundingRect(node)
      if (nodeBoundingRect.width > 0 && nodeBoundingRect.height > 0) {
        const nodeBBox = v
          .transformRect(nodeBoundingRect, nodeMatrix)
          .scale(1 / sx, 1 / sy)

        Object.keys(offsetAttrs).forEach(name => {
          const val = offsetAttrs[name]
          const def = this.getAttributeDefinition(name)
          if (def != null) {
            const ts = (def as Attribute.OffsetDefinition).offset(val, {
              node,
              view: this,
              attrs: rawAttrs,
              refBBox: nodeBBox,
            })

            if (ts != null) {
              offseted = true
              nodePosition.translate(Point.create(ts).scale(sx, sy))
            }
          }
        })
      }
    }

    if (nodeTransform != null || positioned || offseted) {
      nodePosition.round(1)
      nodeMatrix.e = nodePosition.x
      nodeMatrix.f = nodePosition.y
      node.setAttribute('transform', v.matrixToTransformString(nodeMatrix))
    }
  }

  protected updateDOMSubtreeAttributes(
    rootNode: Element,
    attrs: Attribute.CellAttributes,
    options: CellView.UpdateDOMSubtreeAttributesOptions = {},
  ) {
    if (options.rootBBox == null) {
      options.rootBBox = new Rectangle()
    }

    if (options.selectors == null) {
      options.selectors = this.selectors
    }

    const selectorCache: { [selector: string]: Element[] } = {}
    const nodesAttrs = this.findNodesAttributes(
      options.attrs || attrs,
      rootNode,
      selectorCache,
      options.selectors,
    )

    // `nodesAttrs` are different from all attributes, when
    // rendering only attributes sent to this method.
    const nodesAllAttrs = options.attrs
      ? this.findNodesAttributes(
          attrs,
          rootNode,
          selectorCache,
          options.selectors,
        )
      : nodesAttrs

    const specialItems: {
      node: Element
      refNode: Element | null
      attributes: Attribute.ComplexAttributes | null
      processedAttributes: CellView.ProcessedAttributes
    }[] = []

    nodesAttrs.each(data => {
      const node = data.node
      const nodeAttrs = data.attrs
      const processed = this.processNodeAttributes(node, nodeAttrs)
      if (
        processed.set == null &&
        processed.position == null &&
        processed.offset == null
      ) {
        this.setAttributes(processed.normal, node)
      } else {
        const data = nodesAllAttrs.get(node)
        const nodeAllAttrs = data ? data.attrs : null
        const refSelector =
          nodeAllAttrs && nodeAttrs.ref == null
            ? nodeAllAttrs.ref
            : nodeAttrs.ref

        let refNode: Element | null
        if (refSelector) {
          refNode = (selectorCache[refSelector as string] ||
            this.find(refSelector as string, rootNode, options.selectors))[0]
          if (!refNode) {
            throw new Error(`"${refSelector}" reference does not exist.`)
          }
        } else {
          refNode = null
        }

        const item = {
          node,
          refNode,
          attributes: nodeAllAttrs,
          processedAttributes: processed,
        }

        // If an element in the list is positioned relative to this one, then
        // we want to insert this one before it in the list.
        const index = specialItems.findIndex(item => item.refNode === node)
        if (index > -1) {
          specialItems.splice(index, 0, item)
        } else {
          specialItems.push(item)
        }
      }
    })

    const bboxCache: Dictionary<Element, Rectangle> = new Dictionary()
    let rotatableMatrix: DOMMatrix
    specialItems.forEach(item => {
      const node = item.node
      const refNode = item.refNode

      let unrotatedRefBBox: Rectangle | undefined
      const isRefNodeRotatable =
        refNode != null &&
        options.rotatableNode != null &&
        v.contains(options.rotatableNode, refNode)

      // Find the reference element bounding box. If no reference was
      // provided, we use the optional bounding box.
      if (refNode) {
        unrotatedRefBBox = bboxCache.get(refNode)
      }

      if (!unrotatedRefBBox) {
        const target = (isRefNodeRotatable
          ? options.rotatableNode!
          : rootNode) as SVGElement

        unrotatedRefBBox = refNode
          ? v.getBBox(refNode as SVGElement, { target })
          : options.rootBBox

        if (refNode) {
          bboxCache.set(refNode, unrotatedRefBBox!)
        }
      }

      let processedAttrs
      if (options.attrs && item.attributes) {
        // If there was a special attribute affecting the position amongst
        // passed-in attributes we have to merge it with the rest of the
        // element's attributes as they are necessary to update the position
        // relatively (i.e `ref-x` && 'ref-dx').
        processedAttrs = this.processNodeAttributes(node, item.attributes)
        this.mergeProcessedAttributes(processedAttrs, item.processedAttributes)
      } else {
        processedAttrs = item.processedAttributes
      }

      let refBBox = unrotatedRefBBox!
      if (
        isRefNodeRotatable &&
        options.rotatableNode != null &&
        !options.rotatableNode.contains(node)
      ) {
        // If the referenced node is inside the rotatable group while the
        // updated node is outside, we need to take the rotatable node
        // transformation into account.
        if (!rotatableMatrix) {
          rotatableMatrix = v.transformStringToMatrix(
            v.attr(options.rotatableNode, 'transform'),
          )
        }
        refBBox = v.transformRect(unrotatedRefBBox!, rotatableMatrix)
      }

      this.updateRelativeAttributes(node, processedAttrs, refBBox, options)
    })
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
    const paper = this.graph
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
  export enum Flag {
    render = 'render',
    update = 'update',
    resize = 'resize',
    rotate = 'rotate',
    translate = 'translate',
    ports = 'ports',
    tools = 'tools',
  }

  export interface ProcessedAttributes {
    raw: Attribute.ComplexAttributes
    normal?: Attribute.SimpleAttributes | undefined
    set?: Attribute.ComplexAttributes | undefined
    offset?: Attribute.ComplexAttributes | undefined
    position?: Attribute.ComplexAttributes | undefined
  }

  export interface UpdateDOMSubtreeAttributesOptions {
    rootBBox?: Rectangle
    selectors?: View.Selectors
    scalableNode?: Element | null
    rotatableNode?: Element | null
    /**
     * Rendering only attributes.
     */
    attrs?: Attribute.CellAttributes | null
  }

  export interface PresentationAttributes {
    [attributeName: string]: string | string[]
  }

  export interface Config {
    tagName?: string
    isSvgElement?: boolean
    rootSelector?: string
    UPDATE_PRIORITY?: number
    initFlag?: string | string[]
    presentationAttributes?: PresentationAttributes
    events?: View.Events
    documentEvents?: View.Events
  }

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
