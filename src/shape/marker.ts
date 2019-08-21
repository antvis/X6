import { constants } from '../common'
import { SvgCanvas2D } from '../canvas'
import { Shape } from './shape'
import { Point } from '../struct'

export namespace Marker {
  type DrawFn = (
    c: SvgCanvas2D,
    shape: Shape,
    type: string,
    pe: Point,
    unitX: number,
    unitY: number,
    size: number,
    isSource: boolean,
    sw: number,
    filled: boolean,
  ) => void

  export const markers: { [name: string]: DrawFn } = {}

  export function addMarker(type: string, fn: DrawFn) {
    markers[type] = fn
  }

  export function createMarker(
    c: SvgCanvas2D,
    shape: Shape,
    type: string,
    pe: Point, // end point
    unitX: number,
    unitY: number,
    size: number,
    isSource: boolean,
    sw: number,
    filled: boolean,
  ) {
    const fn = markers[type]
    return (fn != null)
      ? fn(c, shape, type, pe, unitX, unitY, size, isSource, sw, filled)
      : null
  }
}

function createArrow(widthFactor: number = 2) {
  return function (
    c: SvgCanvas2D,
    shape: Shape,
    type: string,
    pe: Point,
    unitX: number,
    unitY: number,
    size: number,
    isSource: boolean,
    sw: number,
    filled: boolean,
  ) {
    // The angle of the forward facing arrow sides against the x axis is
    // 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
    // only half the strokewidth is processed ).
    const endOffsetX = unitX * sw * 1.118
    const endOffsetY = unitY * sw * 1.118

    unitX = unitX * (size + sw) // tslint:disable-line
    unitY = unitY * (size + sw) // tslint:disable-line

    const pt = pe.clone()
    pt.x -= endOffsetX
    pt.y -= endOffsetY

    const f = (
      type !== constants.ARROW_CLASSIC &&
      type !== constants.ARROW_CLASSIC_THIN
    ) ? 1 : 3 / 4

    pe.x += -unitX * f - endOffsetX
    pe.y += -unitY * f - endOffsetY

    return function () {
      c.begin()
      c.moveTo(pt.x, pt.y)
      c.lineTo(pt.x - unitX - unitY / widthFactor, pt.y - unitY + unitX / widthFactor)

      if (
        type === constants.ARROW_CLASSIC ||
        type === constants.ARROW_CLASSIC_THIN
      ) {
        c.lineTo(pt.x - unitX * 3 / 4, pt.y - unitY * 3 / 4)
      }

      c.lineTo(pt.x + unitY / widthFactor - unitX, pt.y - unitY - unitX / widthFactor)
      c.close()

      if (filled) {
        c.fillAndStroke()
      } else {
        c.stroke()
      }
    }
  }
}

Marker.addMarker('classic', createArrow(2))
Marker.addMarker('classicThin', createArrow(3))
Marker.addMarker('block', createArrow(2))
Marker.addMarker('blockThin', createArrow(3))

function createOpenArrow(widthFactor: number = 2) {
  return (
    c: SvgCanvas2D,
    shape: Shape,
    type: string,
    pe: Point,
    unitX: number,
    unitY: number,
    size: number,
    isSource: boolean,
    sw: number,
    filled: boolean,
  ) => {
    // The angle of the forward facing arrow sides against the x axis is
    // 26.565 degrees, 1/sin(26.565) = 2.236 / 2 = 1.118 ( / 2 allows for
    // only half the strokewidth is processed ).
    const endOffsetX = unitX * sw * 1.118
    const endOffsetY = unitY * sw * 1.118

    unitX = unitX * (size + sw) // tslint:disable-line
    unitY = unitY * (size + sw) // tslint:disable-line

    const pt = pe.clone()
    pt.x -= endOffsetX
    pt.y -= endOffsetY

    pe.x += -endOffsetX * 2
    pe.y += -endOffsetY * 2

    return function () {
      c.begin()
      c.moveTo(pt.x - unitX - unitY / widthFactor, pt.y - unitY + unitX / widthFactor)
      c.lineTo(pt.x, pt.y)
      c.lineTo(pt.x + unitY / widthFactor - unitX, pt.y - unitY - unitX / widthFactor)
      c.stroke()
    }
  }
}

Marker.addMarker('open', createOpenArrow(2))
Marker.addMarker('openThin', createOpenArrow(3))
Marker.addMarker('oval', (
  c: SvgCanvas2D,
  shape: Shape,
  type: string,
  pe: Point,
  unitX: number,
  unitY: number,
  size: number,
  isSource: boolean,
  sw: number,
  filled: boolean,
) => {
  const a = size / 2

  const pt = pe.clone()
  pe.x -= unitX * a
  pe.y -= unitY * a

  return function () {
    c.ellipse(pt.x - a, pt.y - a, size, size)

    if (filled) {
      c.fillAndStroke()
    }
    else {
      c.stroke()
    }
  }
})

function diamond(
  c: SvgCanvas2D,
  shape: Shape,
  type: string,
  pe: Point,
  unitX: number,
  unitY: number,
  size: number,
  isSource: boolean,
  sw: number,
  filled: boolean,
) {
  // The angle of the forward facing arrow sides against the x axis is
  // 45 degrees, 1/sin(45) = 1.4142 / 2 = 0.7071 ( / 2 allows for
  // only half the strokewidth is processed ). Or 0.9862 for thin diamond.
  // Note these values and the tk variable below are dependent, update
  // both together (saves trig hard coding it).
  const swFactor = (type === constants.ARROW_DIAMOND) ? 0.7071 : 0.9862
  const endOffsetX = unitX * sw * swFactor
  const endOffsetY = unitY * sw * swFactor

  unitX = unitX * (size + sw) // tslint:disable-line
  unitY = unitY * (size + sw) // tslint:disable-line

  const pt = pe.clone()
  pt.x -= endOffsetX
  pt.y -= endOffsetY

  pe.x += -unitX - endOffsetX
  pe.y += -unitY - endOffsetY

  // thickness factor for diamond
  const tk = ((type === constants.ARROW_DIAMOND) ? 2 : 3.4)

  return function () {
    c.begin()
    c.moveTo(pt.x, pt.y)
    c.lineTo(pt.x - unitX / 2 - unitY / tk, pt.y + unitX / tk - unitY / 2)
    c.lineTo(pt.x - unitX, pt.y - unitY)
    c.lineTo(pt.x - unitX / 2 + unitY / tk, pt.y - unitY / 2 - unitX / tk)
    c.close()

    if (filled) {
      c.fillAndStroke()
    } else {
      c.stroke()
    }
  }
}

Marker.addMarker('diamond', diamond)
Marker.addMarker('diamondThin', diamond)
