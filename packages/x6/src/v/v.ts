import * as Static from './rollup'
import { Attributes } from './attr'
import { Vectorizer } from './vectorizer'

export function v( // tslint:disable-line
  elem: Vectorizer | SVGElement | string,
  attrs?: Attributes,
  children?:
    | SVGElement
    | HTMLElement
    | Vectorizer
    | (SVGElement | Vectorizer | HTMLElement)[],
) {
  return new Vectorizer(elem, attrs, children)
}

// attr
// ----
export namespace v {
  export const qualifyAttr = Static.qualifyAttr
  export const styleToObject = Static.styleToObject
  export const mergeAttrs = Static.mergeAttrs
  export const getAttribute = Static.getAttribute
  export const setAttribute = Static.setAttribute
  export const setAttributes = Static.setAttributes
  export const attr = Static.attr
}

// class
// ----
export namespace v {
  export const getClass = Static.getClass
  export const hasClass = Static.hasClass
  export const addClass = Static.addClass
  export const removeClass = Static.removeClass
  export const toggleClass = Static.toggleClass
}

// ctor
// ----
export namespace v {
  export const create = Static.create
  export const batch = Static.batch
  export const isVectorizer = Static.isVectorizer
  /**
   * Returns `true` if object is an instance of `SVGGraphicsElement`.
   */
  export const isSVGGraphicsElement = Static.isSVGGraphicsElement
  export const toNode = Static.toNode
  export const ensureId = Static.ensureId
}

// elem
// ----
export namespace v {
  export const createElement = Static.createElement
  export const createSvgElement = Static.createSvgElement
  export const createSvgDocument = Static.createSvgDocument
  export const index = Static.index
  export const tagName = Static.tagName
  export const parseXML = Static.parseXML
  export const find = Static.find
  export const findOne = Static.findOne
  export const findParentByClass = Static.findParentByClass
  export const remove = Static.remove
  export const empty = Static.empty
  export const append = Static.append
  export const prepend = Static.prepend
  export const before = Static.before
  export const appendTo = Static.appendTo
  export const contains = Static.contains
}

// matrix
// ----
export namespace v {
  /**
   * Returns a SVG point object initialized with the `x` and `y` coordinates.
   * @see https://developer.mozilla.org/en/docs/Web/API/SVGPoint
   */
  export const createSVGPoint = Static.createSVGPoint

  /**
   * Returns the SVG transformation matrix initialized with the given matrix.
   *
   * The given matrix is an object of the form:
   * {
   *   a: number
   *   b: number
   *   c: number
   *   d: number
   *   e: number
   *   f: number
   * }
   *
   * @see https://developer.mozilla.org/en/docs/Web/API/SVGMatrix
   */
  export const createSVGMatrix = Static.createSVGMatrix

  /**
   * Returns a SVG transform object.
   * @see https://developer.mozilla.org/en/docs/Web/API/SVGTransform
   */
  export const createSVGTransform = Static.createSVGTransform

  export const parseTransformString = Static.parseTransformString

  /**
   * Returns the SVG transformation matrix built from the `transformString`.
   *
   * E.g. 'translate(10,10) scale(2,2)' will result in matrix:
   * `{ a: 2, b: 0, c: 0, d: 2, e: 10, f: 10}`
   */
  export const transformStringToMatrix = Static.transformStringToMatrix
  export const matrixToTransformString = Static.matrixToTransformString
  export const deltaTransformPoint = Static.deltaTransformPoint
  /**
   * Decomposes the SVG transformation matrix into separate transformations.
   *
   * Returns an object of the form:
   * {
   *   translateX: number
   *   translateY: number
   *   scaleX: number
   *   scaleY: number
   *   skewX: number
   *   skewY: number
   *   rotation: number
   * }
   *
   * @see https://developer.mozilla.org/en/docs/Web/API/SVGMatrix
   */
  export const decomposeMatrix = Static.decomposeMatrix
  export const matrixToScale = Static.matrixToScale
  export const matrixToRotate = Static.matrixToRotate
  export const matrixToTranslate = Static.matrixToTranslate

  /**
   * Transforms point `p` by an SVG transformation represented by `matrix`.
   */
  export const transformPoint = Static.transformPoint
  export const transformLine = Static.transformLine
  /**
   * Transform as polyline (or an array of points) by an SVG transformation
   * represented by `matrix`.
   */
  export const transformPolyline = Static.transformPolyline
  export const transformRect = Static.transformRect
}

// transform
// ----
export namespace v {
  export const transform = Static.transform
  export const translate = Static.translate
  export const rotate = Static.rotate
  export const scale = Static.scale
}

// path
// ----
export namespace v {
  export const sample = Static.sample
  export const getPointsFromSvgElement = Static.getPointsFromSvgElement
  export const convertLineToPathData = Static.convertLineToPathData
  export const convertPolygonToPathData = Static.convertPolygonToPathData
  export const convertPolylineToPathData = Static.convertPolylineToPathData
  export const convertCircleToPathData = Static.convertCircleToPathData
  export const convertEllipseToPathData = Static.convertEllipseToPathData
  export const convertRectToPathData = Static.convertRectToPathData
  export const rectToPathData = Static.rectToPath
  export const convertToPath = Static.convertToPath
  export const convertToPathData = Static.convertToPathData
  export const normalizePathData = Static.normalizePathData
}

// text
// ----
export namespace v {
  export const text = Static.text
  export const sanitizeText = Static.sanitizeText
  export const annotateString = Static.annotateString
}

// geometry
// ----
export namespace v {
  /**
   * Returns the bounding box of the element after transformations are
   * applied. If `withoutTransformations` is `true`, transformations of
   * the element will not be considered when computing the bounding box.
   * If `target` is specified, bounding box will be computed relatively
   * to the `target` element.
   */
  export const bbox = Static.bbox

  /**
   * Returns the bounding box of the element after transformations are
   * applied. Unlike `bbox()`, this function fixes a browser implementation
   * bug to return the correct bounding box if this elemenent is a group of
   * svg elements (if `options.recursive` is specified).
   */
  export const getBBox = Static.getBBox

  /**
   * Returns an DOMMatrix that specifies the transformation necessary
   * to convert `elem` coordinate system into `target` coordinate system.
   */
  export const getTransformToElement = Static.getTransformToElement

  /**
   * Convert a global point with coordinates `x` and `y` into the
   * coordinate space of the element.
   */
  export const toLocalPoint = Static.toLocalPoint

  /**
   * Convert the SVGElement to an equivalent geometric shape. The element's
   * transformations are not taken into account.
   *
   * SVGRectElement      => Rectangle
   *
   * SVGLineElement      => Line
   *
   * SVGCircleElement    => Ellipse
   *
   * SVGEllipseElement   => Ellipse
   *
   * SVGPolygonElement   => Polyline
   *
   * SVGPolylineElement  => Polyline
   *
   * SVGPathElement      => Path
   *
   * others              => Rectangle
   */
  export const toGeometryShape = Static.toGeometryShape

  export const findIntersection = Static.findIntersection

  export const translateAndAutoOrient = Static.translateAndAutoOrient

  /**
   * Animate the element along the path SVG element (or Vectorizer object).
   * `attrs` contain Animation Timing attributes describing the animation.
   */
  export const animateAlongPath = Static.animateAlongPath
}

v.prototype = Vectorizer.prototype
