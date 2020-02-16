import { KeyValue } from '../../types'
import { Point, Line, Rectangle, Ellipse } from '../../geometry'

export namespace PortLayout {
  export interface Result extends KeyValue {
    x: number
    y: number
    angle: number
  }

  export type CustomLayoutFunction = (
    portsPositionArgs: CustomLayoutArgs[],
    elemBBox: Rectangle,
    groupPositionargs: CustomLayoutArgs,
  ) => Result[]

  export interface CustomLayoutArgs extends KeyValue {
    fn: CustomLayoutFunction
  }

  export interface AbsoluteArgs {
    x?: string | number
    y?: string | number
  }

  interface OffsetArgs {
    dx?: number
    dy?: number
  }

  export interface SideArgs extends OffsetArgs {}

  export interface LineArgs extends SideArgs {
    start?: Point | Point.PointLike
    end?: Point | Point.PointLike
  }

  export interface EllipseArgs extends OffsetArgs {
    start?: number
    step?: number
    compensateRotation?: boolean
    /**
     * delta radius
     */
    dr?: number
  }

  export interface LayoutArgs {
    fn: PortLayout.CustomLayoutArgs
    line: PortLayout.SideArgs
    left: PortLayout.SideArgs
    top: PortLayout.SideArgs
    right: PortLayout.SideArgs
    bottom: PortLayout.SideArgs
    absolute: PortLayout.AbsoluteArgs
    ellipse: PortLayout.EllipseArgs
    ellipseSpread: PortLayout.EllipseArgs
  }

  export type LayoutNames = Extract<keyof LayoutArgs, string>
}

export namespace PortLayout {
  export function absolute(
    portsPositionArgs: AbsoluteArgs[],
    elemBBox: Rectangle,
  ) {
    return portsPositionArgs.map(item => getPointFromArgs(elemBBox, item))
  }

  export function fn(
    portsPositionArgs: CustomLayoutArgs[],
    elemBBox: Rectangle,
    groupPositionargs: CustomLayoutArgs,
  ) {
    return groupPositionargs.fn(portsPositionArgs, elemBBox, groupPositionargs)
  }

  export function line(
    portsPositionArgs: LineArgs[],
    elemBBox: Rectangle,
    groupPositionargs: LineArgs,
  ) {
    const start = getPointFromArgs(
      elemBBox,
      groupPositionargs.start || elemBBox.getOrigin(),
    )
    const end = getPointFromArgs(
      elemBBox,
      groupPositionargs.end || elemBBox.getCorner(),
    )

    return lineLayout(portsPositionArgs, start, end)
  }

  export function left(portsPositionArgs: SideArgs[], elemBBox: Rectangle) {
    return lineLayout(
      portsPositionArgs,
      elemBBox.getOrigin(),
      elemBBox.getBottomLeft(),
    )
  }

  export function right(portsPositionArgs: SideArgs[], elemBBox: Rectangle) {
    return lineLayout(
      portsPositionArgs,
      elemBBox.getTopRight(),
      elemBBox.getCorner(),
    )
  }

  export function top(portsPositionArgs: SideArgs[], elemBBox: Rectangle) {
    return lineLayout(
      portsPositionArgs,
      elemBBox.getOrigin(),
      elemBBox.getTopRight(),
    )
  }

  export function bottom(portsPositionArgs: SideArgs[], elemBBox: Rectangle) {
    return lineLayout(
      portsPositionArgs,
      elemBBox.getBottomLeft(),
      elemBBox.getCorner(),
    )
  }

  export function ellipse(
    portsPositionArgs: EllipseArgs[],
    elemBBox: Rectangle,
    groupPositionargs: EllipseArgs,
  ) {
    const startAngle = groupPositionargs.start || 0
    const stepAngle = groupPositionargs.step || 20

    return ellipseLayout(
      portsPositionArgs,
      elemBBox,
      startAngle,
      (index, count) => (index + 0.5 - count / 2) * stepAngle,
    )
  }

  export function ellipseSpread(
    portsPositionArgs: EllipseArgs[],
    elemBBox: Rectangle,
    groupPositionargs: EllipseArgs,
  ) {
    const startAngle = groupPositionargs.start || 0
    const stepAngle = groupPositionargs.step || 360 / portsPositionArgs.length

    return ellipseLayout(portsPositionArgs, elemBBox, startAngle, index => {
      return index * stepAngle
    })
  }

  function getTransformAttrs(point: Point, angle: number, rawArgs: any) {
    return {
      x: point.x,
      y: point.y,
      angle: angle || 0,
      ...rawArgs,
    } as Result
  }

  function lineLayout(portsPositionArgs: SideArgs[], p1: Point, p2: Point) {
    const line = new Line(p1, p2)
    const length = portsPositionArgs.length
    return portsPositionArgs.map((item, index) => {
      const p = line.pointAt((index + 0.5) / length)
      if (item.dx || item.dy) {
        p.translate(item.dx || 0, item.dy || 0)
      }

      return getTransformAttrs(p.round(), 0, item)
    })
  }

  function ellipseLayout(
    portsPositionArgs: EllipseArgs[],
    elemBBox: Rectangle,
    startAngle: number,
    stepFn: (index: number, count: number) => number,
  ) {
    const center = elemBBox.getCenter()
    const ratio = elemBBox.width / elemBBox.height
    const p1 = elemBBox.getTopCenter()
    const ellipse = Ellipse.fromRect(elemBBox)
    const length = portsPositionArgs.length
    return portsPositionArgs.map((item, index) => {
      const angle = startAngle + stepFn(index, length)
      const p2 = p1
        .clone()
        .rotate(-angle, center)
        .scale(ratio, 1, center)

      const theta = item.compensateRotation ? -ellipse.tangentTheta(p2) : 0
      if (item.dx || item.dy) {
        p2.translate(item.dx || 0, item.dy || 0)
      }

      if (item.dr) {
        p2.move(center, item.dr)
      }

      return getTransformAttrs(p2.round(), theta, item)
    })
  }

  function getPointFromArgs(
    bbox: Rectangle,
    args:
      | {
          x?: string | number
          y?: string | number
        }
      | Point
      | Point.PointLike = {},
  ) {
    let x = args.x
    if (typeof x === 'string') {
      x = (parseFloat(x) / 100) * bbox.width
    }

    let y = args.y
    if (typeof y === 'string') {
      y = (parseFloat(y) / 100) * bbox.height
    }

    return new Point(x || 0, y || 0)
  }
}
