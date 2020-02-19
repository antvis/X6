import { attr } from './attr'
import {
  Scale,
  Rotate,
  Translate,
  createSVGTransform,
  parseTransformString,
  transformStringToMatrix,
  matrixToTransformString,
} from './matrix'

export interface TransformOptions {
  absolute?: boolean
}

export function transform(elem: SVGElement): DOMMatrix
export function transform(
  elem: SVGElement,
  matrix: DOMMatrix,
  options?: TransformOptions,
): void
export function transform(
  elem: SVGElement,
  matrix?: DOMMatrix,
  opt: TransformOptions = {},
) {
  if (matrix == null) {
    return transformStringToMatrix(attr(elem, 'transform'))
  }

  if (opt.absolute) {
    elem.setAttribute('transform', matrixToTransformString(matrix))
    return
  }

  const transform = (elem as any).transform
  const svgTransform = createSVGTransform(matrix)
  transform.baseVal.appendItem(svgTransform)
}

export function translate(elem: SVGElement): Translate
export function translate(
  elem: SVGElement,
  tx: number,
  ty?: number,
  options?: TransformOptions,
): void
export function translate(
  elem: SVGElement,
  tx?: number,
  ty: number = 0,
  options: TransformOptions = {},
) {
  let transformAttr = attr(elem, 'transform')
  const transform = parseTransformString(transformAttr)
  if (tx == null) {
    return transform.translate
  }

  transformAttr = transform.raw
  transformAttr = transformAttr.replace(/translate\([^)]*\)/g, '').trim()

  const newTx = options.absolute ? tx : transform.translate.tx + tx
  const newTy = options.absolute ? ty : transform.translate.ty + ty
  const newTranslate = `translate(${newTx},${newTy})`

  // Note that `translate()` is always the first transformation. This is
  // usually the desired case.
  elem.setAttribute('transform', `${newTranslate} ${transformAttr}`.trim())
}

export function rotate(elem: SVGElement): Rotate
export function rotate(
  elem: SVGElement,
  angle: number,
  cx?: number,
  cy?: number,
  options?: TransformOptions,
): void
export function rotate(
  elem: SVGElement,
  angle?: number,
  cx?: number,
  cy?: number,
  options: TransformOptions = {},
) {
  let transformAttr = attr(elem, 'transform')
  const transform = parseTransformString(transformAttr)

  if (angle == null) {
    return transform.rotate
  }

  transformAttr = transform.raw
  transformAttr = transformAttr.replace(/rotate\([^)]*\)/g, '').trim()

  angle %= 360 // tslint:disable-line
  const newAngle = options.absolute ? angle : transform.rotate.angle + angle
  const newOrigin = cx != null && cy != null ? `,${cx},${cy}` : ''
  const newRotate = `rotate(${newAngle}${newOrigin})`
  elem.setAttribute('transform', `${transformAttr} ${newRotate}`.trim())
}

export function scale(elem: SVGElement): Scale
export function scale(elem: SVGElement, sx: number, sy?: number): void
export function scale(elem: SVGElement, sx?: number, sy?: number) {
  let transformAttr = attr(elem, 'transform')
  const transform = parseTransformString(transformAttr)

  if (sx == null) {
    return transform.scale
  }

  sy = sy == null ? sx : sy //tslint:disable-line

  transformAttr = transform.raw
  transformAttr = transformAttr.replace(/scale\([^)]*\)/g, '').trim()
  const newScale = `scale(${sx},${sy})`
  elem.setAttribute('transform', `${transformAttr} ${newScale}`.trim())
}
