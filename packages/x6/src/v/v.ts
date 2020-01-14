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

v.prototype = Vectorizer.prototype

export namespace v {
  // attr
  export const qualifyAttr = Static.qualifyAttr
  export const styleToObject = Static.styleToObject
  export const mergeAttrs = Static.mergeAttrs
  export const getAttribute = Static.getAttribute
  export const setAttribute = Static.setAttribute
  export const setAttributes = Static.setAttributes
  export const attr = Static.attr

  // class
  export const getClass = Static.getClass
  export const hasClass = Static.hasClass
  export const addClass = Static.addClass
  export const removeClass = Static.removeClass
  export const toggleClass = Static.toggleClass

  // ctor
  export const create = Static.create
  export const createBatch = Static.createBatch
  export const isVectorizer = Static.isVectorizer
  export const isSVGGraphicsElement = Static.isSVGGraphicsElement
  export const toNode = Static.toNode
  export const ensureId = Static.ensureId

  // elem
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

  // matrix
  export const createSVGPoint = Static.createSVGPoint
  export const createSVGMatrix = Static.createSVGMatrix
  export const createSVGTransform = Static.createSVGTransform
  export const parseTransformString = Static.parseTransformString
  export const transformStringToMatrix = Static.transformStringToMatrix
  export const matrixToTransformString = Static.matrixToTransformString
  export const deltaTransformPoint = Static.deltaTransformPoint
  export const decomposeMatrix = Static.decomposeMatrix
  export const matrixToScale = Static.matrixToScale
  export const matrixToRotate = Static.matrixToRotate
  export const matrixToTranslate = Static.matrixToTranslate
  export const transformPoint = Static.transformPoint
  export const transformLine = Static.transformLine
  export const transformPolyline = Static.transformPolyline
  export const transformRect = Static.transformRect

  // transform
  export const transform = Static.transform
  export const translate = Static.translate
  export const rotate = Static.rotate
  export const scale = Static.scale

  // path
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

  // text
  export const text = Static.text
  export const sanitizeText = Static.sanitizeText
  export const annotateString = Static.annotateString

  // geometry
  export const bbox = Static.bbox
  export const getBBox = Static.getBBox
  export const getTransformToElement = Static.getTransformToElement
  export const toLocalPoint = Static.toLocalPoint
  export const toGeometryShape = Static.toGeometryShape
  export const findIntersection = Static.findIntersection
  export const translateAndAutoOrient = Static.translateAndAutoOrient
  export const animateAlongPath = Static.animateAlongPath
}
