import { Attribute } from './define'
import { NumberExt } from '../../util'
import { Point, Path, Rectangle, Polyline } from '../../geometry'
import { v } from '../../v'
import { CellView } from '../core/cell-view'

export function setWrapper(
  attrName: string,
  dimension: 'width' | 'height',
): Attribute.SetFunction {
  return function(val, { refBBox }) {
    let value = parseFloat(val as string)
    const percentage = NumberExt.isPercentage(val)
    if (percentage) {
      value /= 100
    }

    const attrs: Attribute.SimpleAttributes = {}

    if (isFinite(value)) {
      const attrValue =
        percentage || (value >= 0 && value <= 1)
          ? value * refBBox[dimension]
          : Math.max(value + refBBox[dimension], 0)
      attrs[attrName] = attrValue
    }

    return attrs
  }
}

export function positionWrapper(
  axis: 'x' | 'y',
  dimension: 'width' | 'height',
  origin: 'origin' | 'corner',
): Attribute.PositionFunction {
  return (val, { refBBox }) => {
    let value = parseFloat(val as string)
    const percentage = NumberExt.isPercentage(val)
    if (percentage) {
      value /= 100
    }

    let delta
    if (isFinite(value)) {
      const refOrigin = refBBox[origin]
      if (percentage || (value > 0 && value < 1)) {
        delta = refOrigin[axis] + refBBox[dimension] * value
      } else {
        delta = refOrigin[axis] + value
      }
    }

    const point = new Point()
    point[axis] = delta || 0
    return point
  }
}

export function offsetWrapper(
  axis: 'x' | 'y',
  dimension: 'width' | 'height',
  corner: 'right' | 'bottom',
): Attribute.OffsetFunction {
  return (value, { refBBox }) => {
    const point = new Point()
    let delta
    if (value === 'middle') {
      delta = refBBox[dimension] / 2
    } else if (value === corner) {
      delta = refBBox[dimension]
    } else if (typeof value === 'number' && isFinite(value)) {
      delta = value > -1 && value < 1 ? -refBBox[dimension] * value : -value
    } else if (NumberExt.isPercentage(value)) {
      delta = (refBBox[dimension] * parseFloat(value)) / 100
    } else {
      delta = 0
    }
    point[axis] = -(refBBox[axis] + delta)
    return point
  }
}

function shapeWrapper(
  shapeConstructor: (value: Attribute.ComplexAttributeValue) => any,
  options: { resetOffset: boolean },
) {
  const cacheName = 'x6-shape'
  const resetOffset = options && options.resetOffset

  return function(
    value: Attribute.ComplexAttributeValue,
    view: CellView,
    refBBox: Rectangle,
    node: Element,
  ) {
    const $node = view.$(node)
    let cache = $node.data(cacheName)
    if (!cache || cache.value !== value) {
      // only recalculate if value has changed
      const cachedShape = shapeConstructor(value)
      cache = {
        value,
        shape: cachedShape,
        shapeBBox: cachedShape.bbox(),
      }
      $node.data(cacheName, cache)
    }

    const shape = cache.shape.clone()
    const shapeBBox = cache.shapeBBox.clone()
    const shapeOrigin = shapeBBox.origin()
    const refOrigin = refBBox.getOrigin()

    shapeBBox.x = refOrigin.x
    shapeBBox.y = refOrigin.y

    const fitScale = refBBox.maxRectScaleToFit(shapeBBox, refOrigin)
    // `maxRectScaleToFit` can give Infinity if width or height is 0
    const sx = shapeBBox.width === 0 || refBBox.width === 0 ? 1 : fitScale.sx
    const sy = shapeBBox.height === 0 || refBBox.height === 0 ? 1 : fitScale.sy

    shape.scale(sx, sy, shapeOrigin)
    if (resetOffset) {
      shape.translate(-shapeOrigin.x, -shapeOrigin.y)
    }

    return shape
  }
}

// `d` attribute for SVGPaths
export function dWrapper(options: {
  resetOffset: boolean
}): Attribute.SetFunction {
  function pathConstructor(value: string) {
    return Path.parse(v.normalizePathData(value))
  }

  const shape = shapeWrapper(pathConstructor, options)

  return (value, { view, refBBox, node }) => {
    const path = shape(value, view, refBBox, node)
    return {
      d: path.serialize(),
    } as Attribute.SimpleAttributes
  }
}

// `points` attribute for SVGPolylines and SVGPolygons
export function pointsWrapper(options: {
  resetOffset: boolean
}): Attribute.SetFunction {
  const shape = shapeWrapper(points => new Polyline(points as any), options)
  return (value, { view, refBBox, node }) => {
    const polyline = shape(value, view, refBBox, node)
    return {
      points: polyline.serialize(),
    }
  }
}

export function atConnectionWrapper(
  method: 'getTangentAtLength' | 'getTangentAtRatio',
  options: { rotate: boolean },
): Attribute.SetFunction {
  const zeroVector = new Point(1, 0)
  return (value, { view }) => {
    let p
    let angle
    const tangent = (view as any)[method](value)
    if (tangent) {
      angle = options.rotate ? tangent.vector().vectorAngle(zeroVector) : 0
      p = tangent.start
    } else {
      p = (view as any).path.start
      angle = 0
    }

    if (angle === 0) {
      return { transform: `translate(${p.x},${p.y}')` }
    }

    return {
      transform: `translate(${p.x},${p.y}') rotate(${angle})`,
    }
  }
}

export const isTextInUse: Attribute.QualifyFucntion = (val, { attrs }) => {
  return attrs.text !== undefined
}

export const isLinkView: Attribute.QualifyFucntion = (val, { view }) => {
  return view.cell.isEdge()
}

export function contextMarker(context: Attribute.ComplexAttributes) {
  const marker: Attribute.SimpleAttributes = {}

  // The context 'fill' is disregared here. The usual case is to use the
  // marker with a connection(for which 'fill' attribute is set to 'none').
  const stroke = context.stroke
  if (typeof stroke === 'string') {
    marker['stroke'] = stroke
    marker['fill'] = stroke
  }

  // Again the context 'fill-opacity' is ignored.
  let strokeOpacity = context.strokeOpacity
  if (strokeOpacity == null) {
    strokeOpacity = context['stroke-opacity']
  }

  if (strokeOpacity == null) {
    strokeOpacity = context.opacity
  }

  if (strokeOpacity != null) {
    marker['stroke-opacity'] = strokeOpacity as number
    marker['fill-opacity'] = strokeOpacity as number
  }

  return marker
}
