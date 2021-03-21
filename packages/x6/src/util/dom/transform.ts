import { Point } from '../../geometry'
import { attr } from './attr'
import { getBBox, getTransformToElement } from './geom'
import {
  Scale,
  Rotation,
  Translation,
  createSVGTransform,
  parseTransformString,
  transformStringToMatrix,
  matrixToTransformString,
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

export function translateAndAutoOrient(
  elem: SVGElement,
  position: Point.PointLike | Point.PointData,
  reference: Point.PointLike | Point.PointData,
  target?: SVGElement,
) {
  const pos = Point.create(position)
  const ref = Point.create(reference)

  if (!target) {
    const svg = elem instanceof SVGSVGElement ? elem : elem.ownerSVGElement!
    target = svg // eslint-disable-line
  }

  // Clean-up previously set transformations except the scale.
  // If we didn't clean up the previous transformations then they'd
  // add up with the old ones. Scale is an exception as it doesn't
  // add up, consider: `this.scale(2).scale(2).scale(2)`. The result
  // is that the element is scaled by the factor 2, not 8.
  const s = scale(elem)
  elem.setAttribute('transform', '')
  const bbox = getBBox(elem, { target }).scale(s.sx, s.sy)

  // 1. Translate to origin.
  const translateToOrigin = createSVGTransform()
  translateToOrigin.setTranslate(
    -bbox.x - bbox.width / 2,
    -bbox.y - bbox.height / 2,
  )

  // 2. Rotate around origin.
  const rotateAroundOrigin = createSVGTransform()
  const angle = pos.angleBetween(ref, pos.clone().translate(1, 0))
  if (angle) rotateAroundOrigin.setRotate(angle, 0, 0)

  // 3. Translate to the `position` + the offset (half my width)
  //    towards the `reference` point.
  const translateFromOrigin = createSVGTransform()
  const finalPosition = pos.clone().move(ref, bbox.width / 2)
  translateFromOrigin.setTranslate(
    2 * pos.x - finalPosition.x,
    2 * pos.y - finalPosition.y,
  )

  // 4. Get the current transformation matrix of this node
  const ctm = getTransformToElement(elem, target)

  // 5. Apply transformations and the scale
  const transform = createSVGTransform()
  transform.setMatrix(
    translateFromOrigin.matrix.multiply(
      rotateAroundOrigin.matrix.multiply(
        translateToOrigin.matrix.multiply(ctm.scale(s.sx, s.sy)),
      ),
    ),
  )

  elem.setAttribute('transform', matrixToTransformString(transform.matrix))
}
