import * as util from './util'
import { v } from '../../v'
import { CellView } from '../core/cell-view'
import { Rectangle, Point } from '../../geometry'
import { NumberExt, JSONObject, StringExt, ObjectExt } from '../../util'

export namespace Attr {
  export type SimpleAttrValue = string | number | null | undefined
  export type SimpleAttrs = { [name: string]: SimpleAttrValue }

  export type ComplexAttrValue =
    | string
    | number
    | boolean
    | JSONObject
    | null
    | undefined

  export type ComplexAttrs = { [name: string]: ComplexAttrValue }

  export type CellAttrs = { [selector: string]: ComplexAttrs }
}

export namespace Attr {
  export interface QualifyOptions {
    view: CellView
    node: Element
    attrs: ComplexAttrs
  }

  export type QualifyFucntion = (
    val: ComplexAttrValue,
    options: QualifyOptions,
  ) => boolean

  export interface Qualify {
    qualify?: QualifyFucntion
  }

  interface Options extends QualifyOptions {
    refBBox: Rectangle
  }

  export type SetFunction = (
    val: ComplexAttrValue,
    options: Options,
  ) => SimpleAttrValue | SimpleAttrs | void

  export interface SetDefinition extends Qualify {
    set: SetFunction
  }

  export type OffsetFunction = (
    val: ComplexAttrValue,
    options: Options,
  ) => Point | Point.PointLike

  export interface OffsetDefinition extends Qualify {
    offset: OffsetFunction
  }

  export type PositionFunction = (
    val: ComplexAttrValue,
    options: Options,
  ) => Point | Point.PointLike | undefined | null

  export interface PositionDefinition extends Qualify {
    /**
     * Returns a point from the reference bounding box.
     */
    position: PositionFunction
  }

  export type Definition =
    | string
    | Qualify
    | SetDefinition
    | OffsetDefinition
    | PositionDefinition

  export type Definitions = { [attrName: string]: Definition }

  export type GetDefinition = (name: string) => Definition | null | undefined
}

export namespace Attr {
  export function isValidDefinition(
    def: Definition | undefined | null,
    val: ComplexAttrValue,
    options: QualifyOptions,
  ): def is Definition {
    if (def != null) {
      if (typeof def === 'string') {
        return true
      }

      if (typeof def.qualify !== 'function' || def.qualify(val, options)) {
        return true
      }
    }

    return false
  }
}

export namespace Attr {
  export const definitions: Definitions = {
    xlinkHref: 'xlink:href',
    xlinkShow: 'xlink:show',
    xlinkRole: 'xlink:role',
    xlinkType: 'xlink:type',
    xlinkArcrole: 'xlink:arcrole',
    xlinkTitle: 'xlink:title',
    xlinkActuate: 'xlink:actuate',
    xmlSpace: 'xml:space',
    xmlBase: 'xml:base',
    xmlLang: 'xml:lang',
    preserveAspectRatio: 'preserveAspectRatio',
    requiredExtension: 'requiredExtension',
    requiredFeatures: 'requiredFeatures',
    systemLanguage: 'systemLanguage',
    externalResourcesRequired: 'externalResourceRequired',

    filter: {
      qualify: ObjectExt.isPlainObject,
      set(filter, { view }) {
        return `url(#${view.graph.defineFilter(filter)})`
      },
    },

    fill: {
      qualify: ObjectExt.isPlainObject,
      set(fill, { view }) {
        return `url(#${view.graph.defineGradient(fill)})`
      },
    },

    stroke: {
      qualify: ObjectExt.isPlainObject,
      set(stroke, { view }) {
        return `url(#${view.graph.defineGradient(stroke)})`
      },
    },

    sourceMarker: {
      qualify: ObjectExt.isPlainObject,
      set(marker, { view, attrs }) {
        const options = {
          ...util.contextMarker(attrs),
          ...(marker as JSONObject),
        }
        return { 'marker-start': `url(#${view.graph.defineMarker(options)})` }
      },
    },

    targetMarker: {
      qualify: ObjectExt.isPlainObject,
      set(marker, { view, attrs }) {
        const options = {
          ...util.contextMarker(attrs),
          transform: 'rotate(180)',
          ...(marker as JSONObject),
        }

        return { 'marker-end': `url(#${view.graph.defineMarker(options)})` }
      },
    },

    vertexMarker: {
      qualify: ObjectExt.isPlainObject,
      set(marker, { view, attrs }) {
        const options = {
          ...util.contextMarker(attrs),
          ...(marker as JSONObject),
        }
        return { 'marker-mid': `url(#${view.graph.defineMarker(options)})` }
      },
    },

    text: {
      qualify(text, { attrs }) {
        return (
          attrs.textWrap == null || !ObjectExt.isPlainObject(attrs.textWrap)
        )
      },
      set(text, { view, node, attrs }) {
        const cacheName = 'x6-text'
        const $node = view.$(node)
        const cache = $node.data(cacheName)
        const textAttrs = ObjectExt.pick(
          attrs,
          'lineHeight',
          'annotations',
          'textPath',
          'x',
          'textVerticalAnchor',
          'eol',
          'displayEmpty',
          'fontSize',
        )

        textAttrs.fontSize = attrs['font-size'] || attrs['fontSize']

        const fontSize = textAttrs.fontSize as string
        const textHash = JSON.stringify([text, textAttrs])

        // Updates the text only if there was a change in the string
        // or any of its attributes.
        if (cache == null || cache !== textHash) {
          if (fontSize) {
            node.setAttribute('font-size', fontSize)
          }

          // Text Along Path Selector
          const textPath = textAttrs.textPath
          if (textPath != null && typeof textPath === 'object') {
            const selector = textPath.selector
            if (typeof selector === 'string') {
              const pathNode = view.find(selector)[0]
              if (pathNode instanceof SVGPathElement) {
                v.ensureId(pathNode)
                textAttrs.textPath = {
                  'xlink:href': `#${pathNode.id}`,
                  ...textPath,
                }
              }
            }
          }

          v.text(node as SVGElement, `${text}`, textAttrs as any)
          $node.data(cacheName, textHash)
        }
      },
    },

    textWrap: {
      qualify: ObjectExt.isPlainObject,
      set(val, { view, node, attrs, refBBox }) {
        const info = val as JSONObject

        // option `width`
        const width = info.width || 0
        if (NumberExt.isPercentage(width)) {
          refBBox.width *= parseFloat(width) / 100
        } else if (width <= 0) {
          refBBox.width += width as number
        } else {
          refBBox.width = width as number
        }

        // option `height`
        const height = info.height || 0
        if (NumberExt.isPercentage(height)) {
          refBBox.height *= parseFloat(height) / 100
        } else if (height <= 0) {
          refBBox.height += height as number
        } else {
          refBBox.height = height as number
        }

        // option `text`
        let wrappedText
        let text = info.text
        if (text == null) {
          text = attrs.text
        }

        if (text != null) {
          wrappedText = StringExt.breakText(
            `${text}`,
            refBBox,
            {
              'font-weight': attrs['font-weight'] || attrs.fontWeight,
              'font-size': attrs['font-size'] || attrs.fontSize,
              'font-family': attrs['font-family'] || attrs.fontFamily,
              lineHeight: attrs.lineHeight,
            },
            {
              svgDocument: view.graph.svg as SVGSVGElement,
              ellipsis: info.ellipsis as string,
              hyphen: info.hyphen as string,
            },
          )
        } else {
          wrappedText = ''
        }

        const textDef = definitions.text as any
        textDef.set(wrappedText, { view, node, attrs, refBBox })
      },
    },

    title: {
      qualify(title, { node }) {
        // HTMLElement title is specified via an attribute (i.e. not an element)
        return node instanceof SVGElement
      },
      set(val, { view, node }) {
        const cacheName = 'x6-title'
        const title = `${val}`
        const $node = view.$(node)
        const cache = $node.data(cacheName)
        if (cache == null || cache !== title) {
          $node.data(cacheName, title)
          // Generally SVGTitleElement should be the first child
          // element of its parent.
          const firstChild = node.firstChild as Element
          if (firstChild && firstChild.tagName.toUpperCase() === 'TITLE') {
            // Update an existing title
            const titleElem = firstChild as SVGTitleElement
            titleElem.textContent = title
          } else {
            // Create a new title
            const titleNode = document.createElementNS(
              node.namespaceURI,
              'title',
            ) as SVGTitleElement
            titleNode.textContent = title
            node.insertBefore(titleNode, firstChild)
          }
        }
      },
    },

    lineHeight: {
      qualify: util.isTextInUse,
    },

    textVerticalAnchor: {
      qualify: util.isTextInUse,
    },

    textPath: {
      qualify: util.isTextInUse,
    },

    annotations: {
      qualify: util.isTextInUse,
    },

    eol: {
      qualify: util.isTextInUse,
    },

    displayEmpty: {
      qualify: util.isTextInUse,
    },

    // `port` attribute contains the `id` of the port that the underlying magnet represents.
    port: {
      set(port) {
        if (port != null && typeof port === 'object' && port.id) {
          return port.id as string
        }
        return port as string
      },
    },

    style: {
      qualify: ObjectExt.isPlainObject,
      set(styles, { view, node }) {
        view.$(node).css(styles as JQuery.PlainObject<string | number>)
      },
    },

    html: {
      set(html, { view, node }) {
        view
          .$(view.container)
          .find(node)
          .html(`${html}`)
      },
    },

    ref: {
      // We do not set `ref` attribute directly on an element.
      // The attribute itself does not qualify for relative positioning.
    },

    // if `refX` is in [0, 1] then `refX` is a fraction of bounding box width
    // if `refX` is < 0 then `refX`'s absolute values is the right coordinate of the bounding box
    // otherwise, `refX` is the left coordinate of the bounding box

    refX: {
      position: util.positionWrapper('x', 'width', 'origin'),
    },

    refY: {
      position: util.positionWrapper('y', 'height', 'origin'),
    },

    // `ref-dx` and `ref-dy` define the offset of the subelement relative to the right and/or bottom
    // coordinate of the reference element.

    refDx: {
      position: util.positionWrapper('x', 'width', 'corner'),
    },

    refDy: {
      position: util.positionWrapper('y', 'height', 'corner'),
    },

    // 'ref-width'/'ref-height' defines the width/height of the subelement relatively to
    // the reference element size
    // val in 0..1         ref-width = 0.75 sets the width to 75% of the ref. el. width
    // val < 0 || val > 1  ref-height = -20 sets the height to the ref. el. height shorter by 20

    refWidth: {
      set: util.setWrapper('width', 'width'),
    },

    refHeight: {
      set: util.setWrapper('height', 'height'),
    },

    refRx: {
      set: util.setWrapper('rx', 'width'),
    },

    refRy: {
      set: util.setWrapper('ry', 'height'),
    },

    refRInscribed: {
      set: ((attrName): SetFunction => {
        const widthFn = util.setWrapper(attrName, 'width')
        const heightFn = util.setWrapper(attrName, 'height')
        return (value, options) => {
          const refBBox = options.refBBox
          const fn = refBBox.height > refBBox.width ? widthFn : heightFn
          return fn(value, options)
        }
      })('r'),
    },

    refRCircumscribed: {
      set(val, { refBBox }) {
        let value = parseFloat(val as string)
        const percentage = NumberExt.isPercentage(val)
        if (percentage) {
          value /= 100
        }

        const diagonalLength = Math.sqrt(
          refBBox.height * refBBox.height + refBBox.width * refBBox.width,
        )

        let rValue
        if (isFinite(value)) {
          if (percentage || (value >= 0 && value <= 1)) {
            rValue = value * diagonalLength
          } else {
            rValue = Math.max(value + diagonalLength, 0)
          }
        }

        return { r: rValue } as SimpleAttrs
      },
    },

    refCx: {
      set: util.setWrapper('cx', 'width'),
    },

    refCy: {
      set: util.setWrapper('cy', 'height'),
    },

    // `x-alignment` when set to `middle` causes centering of the subelement around its new x coordinate.
    // `x-alignment` when set to `right` uses the x coordinate as referenced to the right of the bbox.
    xAlignment: {
      offset: util.offsetWrapper('x', 'width', 'right'),
    },

    // `y-alignment` when set to `middle` causes centering of the subelement around its new y coordinate.
    // `y-alignment` when set to `bottom` uses the y coordinate as referenced to the bottom of the bbox.
    yAlignment: {
      offset: util.offsetWrapper('y', 'height', 'bottom'),
    },

    resetOffset: {
      offset(val, { refBBox }) {
        return val ? { x: -refBBox.x, y: -refBBox.y } : { x: 0, y: 0 }
      },
    },

    refDResetOffset: {
      set: util.dWrapper({ resetOffset: true }),
    },

    refDKeepOffset: {
      set: util.dWrapper({ resetOffset: false }),
    },

    refPointsResetOffset: {
      set: util.pointsWrapper({ resetOffset: true }),
    },

    refPointsKeepOffset: {
      set: util.pointsWrapper({ resetOffset: false }),
    },

    connection: {
      qualify: util.isLinkView,
      set(val, { view }) {
        const stubs = ((val as any).stubs || 0) as number
        let d
        if (isFinite(stubs) && stubs !== 0) {
          let offset
          if (stubs < 0) {
            offset = (this.getConnectionLength() + stubs) / 2
          } else {
            offset = stubs
          }
          const path = this.getConnection()
          const sourceParts = path.divideAtLength(offset)
          const targetParts = path.divideAtLength(-offset)
          if (sourceParts && targetParts) {
            d = `${sourceParts[0].serialize()} ${targetParts[1].serialize()}`
          }
        }

        return { d: d || (view as any).getSerializedConnection() }
      },
    },

    atConnectionLengthKeepGradient: {
      qualify: util.isLinkView,
      set: util.atConnectionWrapper('getTangentAtLength', { rotate: true }),
    },

    atConnectionLengthIgnoreGradient: {
      qualify: util.isLinkView,
      set: util.atConnectionWrapper('getTangentAtLength', { rotate: false }),
    },

    atConnectionRatioKeepGradient: {
      qualify: util.isLinkView,
      set: util.atConnectionWrapper('getTangentAtRatio', { rotate: true }),
    },

    atConnectionRatioIgnoreGradient: {
      qualify: util.isLinkView,
      set: util.atConnectionWrapper('getTangentAtRatio', { rotate: false }),
    },
  }

  // Aliases
  definitions.refR = definitions.refRInscribed
  definitions.refD = definitions.refDResetOffset
  definitions.refPoints = definitions.refPointsResetOffset
  definitions.atConnectionLength = definitions.atConnectionLengthKeepGradient
  definitions.atConnectionRatio = definitions.atConnectionRatioKeepGradient

  // This allows to combine both absolute and relative positioning
  // refX: 50%, refX2: 20
  definitions.refX2 = definitions.refX
  definitions.refY2 = definitions.refY
  definitions.refWidth2 = definitions.refWidth
  definitions.refHeight2 = definitions.refHeight
}
