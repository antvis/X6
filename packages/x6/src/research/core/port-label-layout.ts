import defaultsDeep from 'lodash/defaultsDeep'
import { Point, Rectangle } from '../../geometry'
import { Attr } from '../attr'

export namespace PortLabelLayout {
  export interface Result {
    x?: number
    y?: number
    angle?: number
    attrs?: Attr.CellAttrs
  }

  export interface ManualArgs extends Result {}

  export interface OffsetArgs {
    offset?: number
  }

  export interface LayoutArgs {
    manual: ManualArgs
    left: ManualArgs
    right: ManualArgs
    top: ManualArgs
    bottom: ManualArgs
    outside: OffsetArgs
    outsideOriented: OffsetArgs
    inside: OffsetArgs
    insideOriented: OffsetArgs
    radial: OffsetArgs
    radialOriented: OffsetArgs
  }

  export type LayoutNames = Extract<keyof LayoutArgs, string>
}

export namespace PortLabelLayout {
  export function manual(
    portPosition: Point,
    elemBBox: Rectangle,
    args: Result,
  ) {
    return labelAttributes(elemBBox, args)
  }

  export function left(portPosition: Point, elemBBox: Rectangle, args: Result) {
    return labelAttributes(
      {
        x: -15,
        attrs: { '.': { y: '.3em', 'text-anchor': 'end' } },
      },
      args,
    )
  }

  export function right(
    portPosition: Point,
    elemBBox: Rectangle,
    args: Result,
  ) {
    return labelAttributes(
      {
        x: 15,
        attrs: { '.': { y: '.3em', 'text-anchor': 'start' } },
      },
      args,
    )
  }

  export function top(portPosition: Point, elemBBox: Rectangle, args: Result) {
    return labelAttributes(
      {
        y: -15,
        attrs: { '.': { 'text-anchor': 'middle' } },
      },
      args,
    )
  }

  export function bottom(
    portPosition: Point,
    elemBBox: Rectangle,
    args: Result,
  ) {
    return labelAttributes(
      {
        y: 15,
        attrs: { '.': { y: '.6em', 'text-anchor': 'middle' } },
      },
      args,
    )
  }

  export function outside(
    portPosition: Point,
    elemBBox: Rectangle,
    args: OffsetArgs,
  ) {
    return outsideLayout(portPosition, elemBBox, false, args)
  }

  export function outsideOriented(
    portPosition: Point,
    elemBBox: Rectangle,
    args: OffsetArgs,
  ) {
    return outsideLayout(portPosition, elemBBox, true, args)
  }

  export function inside(
    portPosition: Point,
    elemBBox: Rectangle,
    args: OffsetArgs,
  ) {
    return insideLayout(portPosition, elemBBox, false, args)
  }

  export function insideOriented(
    portPosition: Point,
    elemBBox: Rectangle,
    args: OffsetArgs,
  ) {
    return insideLayout(portPosition, elemBBox, true, args)
  }

  export interface RadialArgs {}

  export function radial(
    portPosition: Point,
    elemBBox: Rectangle,
    args: OffsetArgs,
  ) {
    return radialLayout(portPosition.diff(elemBBox.getCenter()), false, args)
  }

  export function radialOriented(
    portPosition: Point,
    elemBBox: Rectangle,
    args: OffsetArgs,
  ) {
    return radialLayout(portPosition.diff(elemBBox.getCenter()), true, args)
  }

  function labelAttributes(preset: Result, args?: Result): Result {
    return defaultsDeep({}, args, preset, {
      x: 0,
      y: 0,
      angle: 0,
      attrs: {
        '.': {
          y: '0',
          'text-anchor': 'start',
        },
      },
    })
  }

  function outsideLayout(
    portPosition: Point,
    elemBBox: Rectangle,
    autoOrient: boolean,
    args: OffsetArgs,
  ) {
    const offset = args.offset != null ? args.offset : 15
    const angle = elemBBox.getCenter().theta(portPosition)
    const bboxAngles = getBBoxAngles(elemBBox)

    let y
    let tx
    let ty
    let textAnchor
    let orientAngle = 0

    if (angle < bboxAngles[1] || angle > bboxAngles[2]) {
      y = '.3em'
      tx = offset
      ty = 0
      textAnchor = 'start'
    } else if (angle < bboxAngles[0]) {
      y = '0'
      tx = 0
      ty = -offset
      if (autoOrient) {
        orientAngle = -90
        textAnchor = 'start'
      } else {
        textAnchor = 'middle'
      }
    } else if (angle < bboxAngles[3]) {
      y = '.3em'
      tx = -offset
      ty = 0
      textAnchor = 'end'
    } else {
      y = '.6em'
      tx = 0
      ty = offset
      if (autoOrient) {
        orientAngle = 90
        textAnchor = 'start'
      } else {
        textAnchor = 'middle'
      }
    }

    return labelAttributes({
      x: Math.round(tx),
      y: Math.round(ty),
      angle: orientAngle,
      attrs: {
        '.': {
          y,
          'text-anchor': textAnchor,
        },
      },
    })
  }

  function insideLayout(
    portPosition: Point,
    elemBBox: Rectangle,
    autoOrient: boolean,
    args: OffsetArgs,
  ) {
    const offset = args.offset != null ? args.offset : 15
    const angle = elemBBox.getCenter().theta(portPosition)
    const bboxAngles = getBBoxAngles(elemBBox)

    let y
    let tx
    let ty
    let textAnchor
    let orientAngle = 0

    if (angle < bboxAngles[1] || angle > bboxAngles[2]) {
      y = '.3em'
      tx = -offset
      ty = 0
      textAnchor = 'end'
    } else if (angle < bboxAngles[0]) {
      y = '.6em'
      tx = 0
      ty = offset
      if (autoOrient) {
        orientAngle = 90
        textAnchor = 'start'
      } else {
        textAnchor = 'middle'
      }
    } else if (angle < bboxAngles[3]) {
      y = '.3em'
      tx = offset
      ty = 0
      textAnchor = 'start'
    } else {
      y = '0em'
      tx = 0
      ty = -offset
      if (autoOrient) {
        orientAngle = -90
        textAnchor = 'start'
      } else {
        textAnchor = 'middle'
      }
    }

    return labelAttributes({
      x: Math.round(tx),
      y: Math.round(ty),
      angle: orientAngle,
      attrs: {
        '.': {
          y,
          'text-anchor': textAnchor,
        },
      },
    })
  }

  function getBBoxAngles(elemBBox: Rectangle) {
    const center = elemBBox.getCenter()

    const tl = center.theta(elemBBox.getOrigin())
    const bl = center.theta(elemBBox.getBottomLeft())
    const br = center.theta(elemBBox.getCorner())
    const tr = center.theta(elemBBox.getTopRight())

    return [tl, tr, br, bl]
  }

  function radialLayout(
    portCenterOffset: Point,
    autoOrient: boolean,
    args: OffsetArgs,
  ) {
    const offset = args.offset != null ? args.offset : 20
    const origin = new Point(0, 0)
    const angle = -portCenterOffset.theta(origin)
    const pos = portCenterOffset
      .clone()
      .move(origin, offset)
      .diff(portCenterOffset)
      .round()

    let y = '.3em'
    let textAnchor
    let orientAngle = angle

    if ((angle + 90) % 180 === 0) {
      textAnchor = autoOrient ? 'end' : 'middle'
      if (!autoOrient && angle === -270) {
        y = '0em'
      }
    } else if (angle > -270 && angle < -90) {
      textAnchor = 'start'
      orientAngle = angle - 180
    } else {
      textAnchor = 'end'
    }

    return labelAttributes({
      x: Math.round(pos.x),
      y: Math.round(pos.y),
      angle: autoOrient ? orientAngle : 0,
      attrs: {
        '.': {
          y,
          'text-anchor': textAnchor,
        },
      },
    })
  }
}
