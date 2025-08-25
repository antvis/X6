import { attr } from './attr'
import { isSVGGraphicsElement } from './elem'
import {
  Scale,
  Rotation,
  Translation,
  createSVGTransform,
  parseTransformString,
  transformStringToMatrix,
  matrixToTransformString,
  createSVGMatrix,
} from './matrix'

export interface TransformOptions {
  absolute?: boolean
}

export function transform(elem: Element): DOMMatrix
export function transform(
  elem: SVGElement,
  matrix: DOMMatrix,
  options?: TransformOptions,
): void
export function transform(
  elem: SVGGraphicsElement,
  matrix?: DOMMatrix,
  options: TransformOptions = {},
) {
  if (matrix == null) {
    return transformStringToMatrix(attr(elem, 'transform'))
  }

  if (options.absolute) {
    elem.setAttribute('transform', matrixToTransformString(matrix))
    return
  }

  const transformList = elem.transform
  const svgTransform = createSVGTransform(matrix)
  transformList.baseVal.appendItem(svgTransform)
}

export function translate(elem: Element): Translation
export function translate(
  elem: Element,
  tx: number,
  ty?: number,
  options?: TransformOptions,
): void
export function translate(
  elem: Element,
  tx?: number,
  ty = 0,
  options: TransformOptions = {},
) {
  let transformAttr = attr(elem, 'transform')
  const transform = parseTransformString(transformAttr)
  if (tx == null) {
    return transform.translation
  }

  transformAttr = transform.raw
  transformAttr = transformAttr.replace(/translate\([^)]*\)/g, '').trim()

  const newTx = options.absolute ? tx : transform.translation.tx + tx
  const newTy = options.absolute ? ty : transform.translation.ty + ty
  const newTranslate = `translate(${newTx},${newTy})`

  // Note that `translate()` is always the first transformation. This is
  // usually the desired case.
  elem.setAttribute('transform', `${newTranslate} ${transformAttr}`.trim())
}

export function rotate(elem: Element): Rotation
export function rotate(
  elem: Element,
  angle: number,
  cx?: number,
  cy?: number,
  options?: TransformOptions,
): void
export function rotate(
  elem: Element,
  angle?: number,
  cx?: number,
  cy?: number,
  options: TransformOptions = {},
) {
  let transformAttr = attr(elem, 'transform')
  const transform = parseTransformString(transformAttr)

  if (angle == null) {
    return transform.rotation
  }

  transformAttr = transform.raw
  transformAttr = transformAttr.replace(/rotate\([^)]*\)/g, '').trim()

  angle %= 360 // eslint-disable-line
  const newAngle = options.absolute ? angle : transform.rotation.angle + angle
  const newOrigin = cx != null && cy != null ? `,${cx},${cy}` : ''
  const newRotate = `rotate(${newAngle}${newOrigin})`
  elem.setAttribute('transform', `${transformAttr} ${newRotate}`.trim())
}

export function scale(elem: Element): Scale
export function scale(elem: Element, sx: number, sy?: number): void
export function scale(elem: Element, sx?: number, sy?: number) {
  let transformAttr = attr(elem, 'transform')
  const transform = parseTransformString(transformAttr)

  if (sx == null) {
    return transform.scale
  }

  sy = sy == null ? sx : sy // eslint-disable-line

  transformAttr = transform.raw
  transformAttr = transformAttr.replace(/scale\([^)]*\)/g, '').trim()
  const newScale = `scale(${sx},${sy})`
  elem.setAttribute('transform', `${transformAttr} ${newScale}`.trim())
}

/**
 * Returns an DOMMatrix that specifies the transformation necessary
 * to convert `elem` coordinate system into `target` coordinate system.
 */
export function getTransformToElement(elem: SVGElement, target: SVGElement) {
  if (isSVGGraphicsElement(target) && isSVGGraphicsElement(elem)) {
    const targetCTM = target.getScreenCTM()
    const nodeCTM = elem.getScreenCTM()
    if (targetCTM && nodeCTM) {
      return targetCTM.inverse().multiply(nodeCTM)
    }
  }

  // Could not get actual transformation matrix
  return createSVGMatrix()
}

/**
 * Returns an DOMMatrix that specifies the transformation necessary
 * to convert `elem` coordinate system into `target` coordinate system.
 * Unlike getTransformToElement, elem is child of target,Because of the reduction in DOM API calls,
 * there is a significant performance improvement.
 */
export function getTransformToParentElement(
  elem: SVGElement,
  target: SVGElement,
) {
  let matrix = createSVGMatrix()

  if (isSVGGraphicsElement(target) && isSVGGraphicsElement(elem)) {
    let node = elem
    const matrixList = []
    while (node && node !== target) {
      const transform = node.getAttribute('transform') || null
      const nodeMatrix = transformStringToMatrix(transform)
      matrixList.push(nodeMatrix)
      node = node.parentNode as SVGGraphicsElement
    }
    matrixList.reverse().forEach((m) => {
      matrix = matrix.multiply(m)
    })
  }

  return matrix
}

/**
 * Converts a global point with coordinates `x` and `y` into the
 * coordinate space of the element.
 */
export function toLocalPoint(
  elem: SVGElement | SVGSVGElement,
  x: number,
  y: number,
) {
  const svg =
    elem instanceof SVGSVGElement
      ? elem
      : (elem.ownerSVGElement as SVGSVGElement)

  const p = svg.createSVGPoint()
  p.x = x
  p.y = y

  try {
    const ctm = svg.getScreenCTM()!
    const globalPoint = p.matrixTransform(ctm.inverse())
    const globalToLocalMatrix = getTransformToElement(elem, svg).inverse()
    return globalPoint.matrixTransform(globalToLocalMatrix)
  } catch (e) {
    return p
  }
}
