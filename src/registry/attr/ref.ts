import { Dom, FunctionExt, NumberExt } from '../../common'
import { Path, Point, Polyline, type Rectangle } from '../../geometry'
import type {
  AttrDefinition,
  AttrOptions,
  AttrPositionFunction,
  AttrSetFunction,
  ComplexAttrValue,
  SimpleAttrs,
} from './index'

export const ref: AttrDefinition = {
  // We do not set `ref` attribute directly on an element.
  // The attribute itself does not qualify for relative positioning.
}

// if `refX` is in [0, 1] then `refX` is a fraction of bounding box width
// if `refX` is < 0 then `refX`'s absolute values is the right coordinate of the bounding box
// otherwise, `refX` is the left coordinate of the bounding box

export const refX: AttrDefinition = {
  position: positionWrapper('x', 'width', 'origin'),
}

export const refY: AttrDefinition = {
  position: positionWrapper('y', 'height', 'origin'),
}

// `ref-dx` and `ref-dy` define the offset of the subelement relative to the right and/or bottom
// coordinate of the reference element.

export const refDx: AttrDefinition = {
  position: positionWrapper('x', 'width', 'corner'),
}

export const refDy: AttrDefinition = {
  position: positionWrapper('y', 'height', 'corner'),
}

// 'ref-width'/'ref-height' defines the width/height of the subelement relatively to
// the reference element size
// val in 0..1         ref-width = 0.75 sets the width to 75% of the ref. el. width
// val < 0 || val > 1  ref-height = -20 sets the height to the ref. el. height shorter by 20
export const refWidth: AttrDefinition = {
  set: setWrapper('width', 'width'),
}

export const refHeight: AttrDefinition = {
  set: setWrapper('height', 'height'),
}

export const refRx: AttrDefinition = {
  set: setWrapper('rx', 'width'),
}

export const refRy: AttrDefinition = {
  set: setWrapper('ry', 'height'),
}

export const refRInscribed: AttrDefinition = {
  set: ((attrName): AttrSetFunction => {
    const widthFn = setWrapper(attrName, 'width')
    const heightFn = setWrapper(attrName, 'height')
    return function (value, options) {
      const refBBox = options.refBBox
      const fn = refBBox.height > refBBox.width ? widthFn : heightFn
      return FunctionExt.call(fn, this, value, options)
    }
  })('r'),
}

export const refRCircumscribed: AttrDefinition = {
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

    return { r: rValue } as SimpleAttrs
  },
}

export const refCx: AttrDefinition = {
  set: setWrapper('cx', 'width'),
}

export const refCy: AttrDefinition = {
  set: setWrapper('cy', 'height'),
}

export const refDResetOffset: AttrDefinition = {
  set: dWrapper({ resetOffset: true }),
}

export const refDKeepOffset: AttrDefinition = {
  set: dWrapper({ resetOffset: false }),
}

export const refPointsResetOffset: AttrDefinition = {
  set: pointsWrapper({ resetOffset: true }),
}

export const refPointsKeepOffset: AttrDefinition = {
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
): AttrPositionFunction {
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
): AttrSetFunction {
  return (val, { refBBox }) => {
    let value = parseFloat(val as string)
    const percentage = NumberExt.isPercentage(val)
    if (percentage) {
      value /= 100
    }

    const attrs: SimpleAttrs = {}

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
  shapeConstructor: (value: ComplexAttrValue) => any,
  options: { resetOffset: boolean },
): <T>(value: ComplexAttrValue, options: AttrOptions) => T {
  const cacheName = 'x6-shape'
  const resetOffset = options && options.resetOffset

  return (value, { elem, refBBox }) => {
    let cache = Dom.data(elem, cacheName)
    if (!cache || cache.value !== value) {
      // only recalculate if value has changed
      const cachedShape = shapeConstructor(value)
      cache = {
        value,
        shape: cachedShape,
        shapeBBox: cachedShape.bbox(),
      }
      Dom.data(elem, cacheName, cache)
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
function dWrapper(options: { resetOffset: boolean }): AttrSetFunction {
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
function pointsWrapper(options: { resetOffset: boolean }): AttrSetFunction {
  const shape = shapeWrapper((points) => new Polyline(points as any), options)
  return (value, args) => {
    const polyline = shape<Polyline>(value, args)
    return {
      points: polyline.serialize(),
    }
  }
}
