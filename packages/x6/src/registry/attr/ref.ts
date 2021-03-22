import { Point, Path, Polyline, Rectangle } from '../../geometry'
import { NumberExt, FunctionExt } from '../../util'
import { Attr } from './index'

export const ref: Attr.Definition = {
  // We do not set `ref` attribute directly on an element.
  // The attribute itself does not qualify for relative positioning.
}

// if `refX` is in [0, 1] then `refX` is a fraction of bounding box width
// if `refX` is < 0 then `refX`'s absolute values is the right coordinate of the bounding box
// otherwise, `refX` is the left coordinate of the bounding box

export const refX: Attr.Definition = {
  position: positionWrapper('x', 'width', 'origin'),
}

export const refY: Attr.Definition = {
  position: positionWrapper('y', 'height', 'origin'),
}

// `ref-dx` and `ref-dy` define the offset of the subelement relative to the right and/or bottom
// coordinate of the reference element.

export const refDx: Attr.Definition = {
  position: positionWrapper('x', 'width', 'corner'),
}

export const refDy: Attr.Definition = {
  position: positionWrapper('y', 'height', 'corner'),
}

// 'ref-width'/'ref-height' defines the width/height of the subelement relatively to
// the reference element size
// val in 0..1         ref-width = 0.75 sets the width to 75% of the ref. el. width
// val < 0 || val > 1  ref-height = -20 sets the height to the ref. el. height shorter by 20
export const refWidth: Attr.Definition = {
  set: setWrapper('width', 'width'),
}

export const refHeight: Attr.Definition = {
  set: setWrapper('height', 'height'),
}

export const refRx: Attr.Definition = {
  set: setWrapper('rx', 'width'),
}

export const refRy: Attr.Definition = {
  set: setWrapper('ry', 'height'),
}

export const refRInscribed: Attr.Definition = {
  set: ((attrName): Attr.SetFunction => {
    const widthFn = setWrapper(attrName, 'width')
    const heightFn = setWrapper(attrName, 'height')
    return function (value, options) {
      const refBBox = options.refBBox
      const fn = refBBox.height > refBBox.width ? widthFn : heightFn
      return FunctionExt.call(fn, this, value, options)
    }
  })('r'),
}

export const refRCircumscribed: Attr.Definition = {
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
    if (Number.isFinite(value)) {
      if (percentage || (value >= 0 && value <= 1)) {
        rValue = value * diagonalLength
      } else {
        rValue = Math.max(value + diagonalLength, 0)
      }
    }

    return { r: rValue } as Attr.SimpleAttrs
  },
}

export const refCx: Attr.Definition = {
  set: setWrapper('cx', 'width'),
}

export const refCy: Attr.Definition = {
  set: setWrapper('cy', 'height'),
}

export const refDResetOffset: Attr.Definition = {
  set: dWrapper({ resetOffset: true }),
}

export const refDKeepOffset: Attr.Definition = {
  set: dWrapper({ resetOffset: false }),
}

export const refPointsResetOffset: Attr.Definition = {
  set: pointsWrapper({ resetOffset: true }),
}

export const refPointsKeepOffset: Attr.Definition = {
  set: pointsWrapper({ resetOffset: false }),
}

// aliases
// -------
export const refR = refRInscribed
export const refD = refDResetOffset
export const refPoints = refPointsResetOffset
// Allows to combine both absolute and relative positioning
// refX: 50%, refX2: 20
export const refX2 = refX
export const refY2 = refY
export const refWidth2 = refWidth
export const refHeight2 = refHeight

// utils
// -----

function positionWrapper(
  axis: 'x' | 'y',
  dimension: 'width' | 'height',
  origin: 'origin' | 'corner',
): Attr.PositionFunction {
  return (val, { refBBox }) => {
    if (val == null) {
      return null
    }

    let value = parseFloat(val as string)
    const percentage = NumberExt.isPercentage(val)
    if (percentage) {
      value /= 100
    }

    let delta
    if (Number.isFinite(value)) {
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

function setWrapper(
  attrName: string,
  dimension: 'width' | 'height',
): Attr.SetFunction {
  return function (val, { refBBox }) {
    let value = parseFloat(val as string)
    const percentage = NumberExt.isPercentage(val)
    if (percentage) {
      value /= 100
    }

    const attrs: Attr.SimpleAttrs = {}

    if (Number.isFinite(value)) {
      const attrValue =
        percentage || (value >= 0 && value <= 1)
          ? value * refBBox[dimension]
          : Math.max(value + refBBox[dimension], 0)
      attrs[attrName] = attrValue
    }

    return attrs
  }
}

function shapeWrapper(
  shapeConstructor: (value: Attr.ComplexAttrValue) => any,
  options: { resetOffset: boolean },
): <T>(value: Attr.ComplexAttrValue, options: Attr.Options) => T {
  const cacheName = 'x6-shape'
  const resetOffset = options && options.resetOffset

  return function (value, { view, elem, refBBox }) {
    const $elem = view.$(elem)
    let cache = $elem.data(cacheName)
    if (!cache || cache.value !== value) {
      // only recalculate if value has changed
      const cachedShape = shapeConstructor(value)
      cache = {
        value,
        shape: cachedShape,
        shapeBBox: cachedShape.bbox(),
      }
      $elem.data(cacheName, cache)
    }

    const shape = cache.shape.clone()
    const shapeBBox = cache.shapeBBox.clone() as Rectangle
    const shapeOrigin = shapeBBox.getOrigin()
    const refOrigin = refBBox.getOrigin()

    shapeBBox.x = refOrigin.x
    shapeBBox.y = refOrigin.y

    const fitScale = refBBox.getMaxScaleToFit(shapeBBox, refOrigin)
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
function dWrapper(options: { resetOffset: boolean }): Attr.SetFunction {
  function pathConstructor(value: string) {
    return Path.parse(value)
  }

  const shape = shapeWrapper(pathConstructor, options)

  return (value, args) => {
    const path = shape<Path>(value, args)
    return {
      d: path.serialize(),
    }
  }
}

// `points` attribute for SVGPolylines and SVGPolygons
function pointsWrapper(options: { resetOffset: boolean }): Attr.SetFunction {
  const shape = shapeWrapper((points) => new Polyline(points as any), options)
  return (value, args) => {
    const polyline = shape<Polyline>(value, args)
    return {
      points: polyline.serialize(),
    }
  }
}
