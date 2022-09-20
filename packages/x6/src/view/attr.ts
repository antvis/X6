import {
  ObjectExt,
  ArrayExt,
  Dom,
  FunctionExt,
  StringExt,
  Scheduler,
} from '../util'
import { Rectangle, Point } from '../geometry'
import { Dictionary } from '../common'
import { Attr } from '../registry/attr'
import { View } from './view'
import { Markup } from './markup'
import { CellView } from './cell'

export class AttrManager {
  constructor(protected view: CellView) {}

  protected get cell() {
    return this.view.cell
  }

  protected getDefinition(attrName: string): Attr.Definition | null {
    return this.cell.getAttrDefinition(attrName)
  }

  protected processAttrs(
    elem: Element,
    raw: Attr.ComplexAttrs,
  ): AttrManager.ProcessedAttrs {
    let normal: Attr.SimpleAttrs | undefined
    let set: Attr.ComplexAttrs | undefined
    let offset: Attr.ComplexAttrs | undefined
    let position: Attr.ComplexAttrs | undefined
    let delay: Attr.ComplexAttrs | undefined

    const specials: { name: string; definition: Attr.Definition }[] = []

    // divide the attributes between normal and special
    Object.keys(raw).forEach((name) => {
      const val = raw[name]
      const definition = this.getDefinition(name)
      const isValid = FunctionExt.call(
        Attr.isValidDefinition,
        this.view,
        definition,
        val,
        {
          elem,
          attrs: raw,
          cell: this.cell,
          view: this.view,
        },
      )

      if (definition && isValid) {
        if (typeof definition === 'string') {
          if (normal == null) {
            normal = {}
          }
          normal[definition] = val as Attr.SimpleAttrValue
        } else if (val !== null) {
          specials.push({ name, definition })
        }
      } else {
        if (normal == null) {
          normal = {}
        }
        const normalName = Dom.CASE_SENSITIVE_ATTR.includes(name)
          ? name
          : StringExt.kebabCase(name)
        normal[normalName] = val as Attr.SimpleAttrValue
      }
    })

    specials.forEach(({ name, definition }) => {
      const val = raw[name]

      const setDefine = definition as Attr.SetDefinition
      if (typeof setDefine.set === 'function') {
        if (
          !Dom.isHTMLElement(elem) &&
          AttrManager.DELAY_ATTRS.includes(name)
        ) {
          if (delay == null) {
            delay = {}
          }
          delay[name] = val
        } else {
          if (set == null) {
            set = {}
          }
          set[name] = val
        }
      }

      const offsetDefine = definition as Attr.OffsetDefinition
      if (typeof offsetDefine.offset === 'function') {
        if (offset == null) {
          offset = {}
        }
        offset[name] = val
      }

      const positionDefine = definition as Attr.PositionDefinition
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
      delay,
    }
  }

  protected mergeProcessedAttrs(
    allProcessedAttrs: AttrManager.ProcessedAttrs,
    roProcessedAttrs: AttrManager.ProcessedAttrs,
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

  protected findAttrs(
    cellAttrs: Attr.CellAttrs,
    rootNode: Element,
    selectorCache: { [selector: string]: Element[] },
    selectors: Markup.Selectors,
  ) {
    const merge: Element[] = []
    const result: Dictionary<
      Element,
      {
        elem: Element
        array: boolean
        priority: number | number[]
        attrs: Attr.ComplexAttrs | Attr.ComplexAttrs[]
      }
    > = new Dictionary()

    Object.keys(cellAttrs).forEach((selector) => {
      const attrs = cellAttrs[selector]
      if (!ObjectExt.isPlainObject(attrs)) {
        return
      }

      const { isCSSSelector, elems } = View.find(selector, rootNode, selectors)
      selectorCache[selector] = elems
      for (let i = 0, l = elems.length; i < l; i += 1) {
        const elem = elems[i]
        const unique = selectors && selectors[selector] === elem
        const prev = result.get(elem)
        if (prev) {
          if (!prev.array) {
            merge.push(elem)
            prev.array = true
            prev.attrs = [prev.attrs as Attr.ComplexAttrs]
            prev.priority = [prev.priority as number]
          }

          const attributes = prev.attrs as Attr.ComplexAttrs[]
          const selectedLength = prev.priority as number[]
          if (unique) {
            // node referenced by `selector`
            attributes.unshift(attrs)
            selectedLength.unshift(-1)
          } else {
            // node referenced by `groupSelector` or CSSSelector
            const sortIndex = ArrayExt.sortedIndex(
              selectedLength,
              isCSSSelector ? -1 : l,
            )

            attributes.splice(sortIndex, 0, attrs)
            selectedLength.splice(sortIndex, 0, l)
          }
        } else {
          result.set(elem, {
            elem,
            attrs,
            priority: unique ? -1 : l,
            array: false,
          })
        }
      }
    })

    merge.forEach((node) => {
      const item = result.get(node)!
      const arr = item.attrs as Attr.ComplexAttrs[]
      item.attrs = arr.reduceRight(
        (memo, attrs) => ObjectExt.merge(memo, attrs),
        {},
      )
    })

    return result as Dictionary<
      Element,
      {
        elem: Element
        array: boolean
        priority: number | number[]
        attrs: Attr.ComplexAttrs
      }
    >
  }

  protected updateRelativeAttrs(
    elem: Element,
    processedAttrs: AttrManager.ProcessedAttrs,
    refBBox: Rectangle,
    options: AttrManager.UpdateOptions,
  ) {
    const rawAttrs = processedAttrs.raw || {}
    let nodeAttrs = processedAttrs.normal || {}
    const setAttrs = processedAttrs.set
    const positionAttrs = processedAttrs.position
    const offsetAttrs = processedAttrs.offset
    const delayAttrs = processedAttrs.delay

    const getOptions = () => ({
      elem,
      cell: this.cell,
      view: this.view,
      attrs: rawAttrs,
      refBBox: refBBox.clone(),
    })

    if (setAttrs != null) {
      Object.keys(setAttrs).forEach((name) => {
        const val = setAttrs[name]
        const def = this.getDefinition(name)
        if (def != null) {
          const ret = FunctionExt.call(
            (def as Attr.SetDefinition).set,
            this.view,
            val,
            getOptions(),
          )
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

    if (Dom.isHTMLElement(elem)) {
      // TODO: setting the `transform` attribute on HTMLElements
      // via `node.style.transform = 'matrix(...)';` would introduce
      // a breaking change (e.g. basic.TextBlock).
      this.view.setAttrs(nodeAttrs, elem)
      return
    }

    // The final translation of the subelement.
    const nodeTransform = nodeAttrs.transform
    const transform = nodeTransform ? `${nodeTransform}` : null
    const nodeMatrix = Dom.transformStringToMatrix(transform)
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
      const scale = this.view.getScaleOfElement(
        elem,
        options.scalableNode as SVGElement,
      )
      sx = scale.sx
      sy = scale.sy
    }

    let positioned = false
    if (positionAttrs != null) {
      Object.keys(positionAttrs).forEach((name) => {
        const val = positionAttrs[name]
        const def = this.getDefinition(name)
        if (def != null) {
          const ts = FunctionExt.call(
            (def as Attr.PositionDefinition).position,
            this.view,
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
    this.view.setAttrs(nodeAttrs, elem)

    let offseted = false
    if (offsetAttrs != null) {
      // Check if the node is visible
      const nodeBoundingRect = this.view.getBoundingRectOfElement(elem)
      if (nodeBoundingRect.width > 0 && nodeBoundingRect.height > 0) {
        const nodeBBox = Dom.transformRectangle(
          nodeBoundingRect,
          nodeMatrix,
        ).scale(1 / sx, 1 / sy)

        Object.keys(offsetAttrs).forEach((name) => {
          const val = offsetAttrs[name]
          const def = this.getDefinition(name)
          if (def != null) {
            const ts = FunctionExt.call(
              (def as Attr.OffsetDefinition).offset,
              this.view,
              val,
              {
                elem,
                cell: this.cell,
                view: this.view,
                attrs: rawAttrs,
                refBBox: nodeBBox,
              },
            )

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
      elem.setAttribute('transform', Dom.matrixToTransformString(nodeMatrix))
    }

    // delay render
    const updateDelayAttrs = () => {
      if (delayAttrs != null) {
        Object.keys(delayAttrs).forEach((name) => {
          const val = delayAttrs[name]
          const def = this.getDefinition(name)
          if (def != null) {
            const ret = FunctionExt.call(
              (def as Attr.SetDefinition).set,
              this.view,
              val,
              getOptions(),
            )
            if (typeof ret === 'object') {
              this.view.setAttrs(ret, elem)
            } else if (ret != null) {
              this.view.setAttrs(
                {
                  [name]: ret,
                },
                elem,
              )
            }
          }
        })
      }
    }
    if (options.forceSync) {
      updateDelayAttrs()
    } else {
      Scheduler.scheduleTask(updateDelayAttrs)
    }
  }

  update(
    rootNode: Element,
    attrs: Attr.CellAttrs,
    options: AttrManager.UpdateOptions,
  ) {
    const selectorCache: { [selector: string]: Element[] } = {}
    const nodesAttrs = this.findAttrs(
      options.attrs || attrs,
      rootNode,
      selectorCache,
      options.selectors,
    )

    // `nodesAttrs` are different from all attributes, when
    // rendering only attributes sent to this method.
    const nodesAllAttrs = options.attrs
      ? this.findAttrs(attrs, rootNode, selectorCache, options.selectors)
      : nodesAttrs

    const specialItems: {
      node: Element
      refNode: Element | null
      attributes: Attr.ComplexAttrs | null
      processedAttributes: AttrManager.ProcessedAttrs
    }[] = []

    nodesAttrs.each((data) => {
      const node = data.elem
      const nodeAttrs = data.attrs
      const processed = this.processAttrs(node, nodeAttrs)
      if (
        processed.set == null &&
        processed.position == null &&
        processed.offset == null &&
        processed.delay == null
      ) {
        this.view.setAttrs(processed.normal, node)
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
            this.view.find(
              refSelector as string,
              rootNode,
              options.selectors,
            ))[0]
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
        const index = specialItems.findIndex((item) => item.refNode === node)
        if (index > -1) {
          specialItems.splice(index, 0, item)
        } else {
          specialItems.push(item)
        }
      }
    })

    const bboxCache: Dictionary<Element, Rectangle> = new Dictionary()
    let rotatableMatrix: DOMMatrix
    specialItems.forEach((item) => {
      const node = item.node
      const refNode = item.refNode

      let unrotatedRefBBox: Rectangle | undefined
      const isRefNodeRotatable =
        refNode != null &&
        options.rotatableNode != null &&
        Dom.contains(options.rotatableNode, refNode)

      // Find the reference element bounding box. If no reference was
      // provided, we use the optional bounding box.
      if (refNode) {
        unrotatedRefBBox = bboxCache.get(refNode)
      }

      if (!unrotatedRefBBox) {
        const target = (
          isRefNodeRotatable ? options.rotatableNode! : rootNode
        ) as SVGElement

        unrotatedRefBBox = refNode
          ? Dom.getBBox(refNode as SVGElement, { target })
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
        processedAttrs = this.processAttrs(node, item.attributes)
        this.mergeProcessedAttrs(processedAttrs, item.processedAttributes)
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
          rotatableMatrix = Dom.transformStringToMatrix(
            Dom.attr(options.rotatableNode, 'transform'),
          )
        }
        refBBox = Dom.transformRectangle(unrotatedRefBBox!, rotatableMatrix)
      }

      const caller = specialItems.find((item) => item.refNode === node)
      if (caller) {
        options.forceSync = true
      }

      this.updateRelativeAttrs(node, processedAttrs, refBBox, options)
    })
  }
}

export namespace AttrManager {
  export interface UpdateOptions {
    rootBBox: Rectangle
    selectors: Markup.Selectors
    scalableNode?: Element | null
    rotatableNode?: Element | null
    /**
     * Rendering only the specified attributes.
     */
    attrs?: Attr.CellAttrs | null
    /**
     * Whether to force synchronous rendering
     */
    forceSync?: boolean
  }

  export interface ProcessedAttrs {
    raw: Attr.ComplexAttrs
    normal?: Attr.SimpleAttrs | undefined
    set?: Attr.ComplexAttrs | undefined
    offset?: Attr.ComplexAttrs | undefined
    position?: Attr.ComplexAttrs | undefined
    delay?: Attr.ComplexAttrs | undefined
  }

  export const DELAY_ATTRS = [
    'text',
    'textWrap',
    'sourceMarker',
    'targetMarker',
  ]
}
