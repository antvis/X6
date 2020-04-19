import { Point, Line } from '../../geometry'
import { PortLayout } from './index'
import { normalizePoint, toResult } from './util'

export interface SideArgs extends PortLayout.CommonArgs {}

export interface LineArgs extends SideArgs {
  start?: Point | Point.PointLike
  end?: Point | Point.PointLike
}

export const line: PortLayout.Definition<LineArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
  const start = normalizePoint(
    elemBBox,
    groupPositionArgs.start || elemBBox.getOrigin(),
  )
  const end = normalizePoint(
    elemBBox,
    groupPositionArgs.end || elemBBox.getCorner(),
  )

  return lineLayout(portsPositionArgs, start, end)
}

export const left: PortLayout.Definition<SideArgs> = (
  portsPositionArgs,
  elemBBox,
) => {
  return lineLayout(
    portsPositionArgs,
    elemBBox.getTopLeft(),
    elemBBox.getBottomLeft(),
  )
}

export const right: PortLayout.Definition<SideArgs> = (
  portsPositionArgs,
  elemBBox,
) => {
  return lineLayout(
    portsPositionArgs,
    elemBBox.getTopRight(),
    elemBBox.getBottomRight(),
  )
}

export const top: PortLayout.Definition<SideArgs> = (
  portsPositionArgs,
  elemBBox,
) => {
  return lineLayout(
    portsPositionArgs,
    elemBBox.getTopLeft(),
    elemBBox.getTopRight(),
  )
}

export const bottom: PortLayout.Definition<SideArgs> = (
  portsPositionArgs,
  elemBBox,
) => {
  return lineLayout(
    portsPositionArgs,
    elemBBox.getBottomLeft(),
    elemBBox.getBottomRight(),
  )
}

function lineLayout(portsPositionArgs: SideArgs[], p1: Point, p2: Point) {
  const line = new Line(p1, p2)
  const length = portsPositionArgs.length
  console.log(portsPositionArgs)
  return portsPositionArgs.map((offset, index) => {
    const p = line.pointAt((index + 0.5) / length)
    if (offset.dx || offset.dy) {
      p.translate(offset.dx || 0, offset.dy || 0)
    }

    return toResult(p.round(), 0, offset)
  })
}
