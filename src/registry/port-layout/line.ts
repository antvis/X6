import { Point, Line } from '../../geometry'
import { normalizePoint, toResult } from './util'
import { PortLayout } from './index'

export interface SideArgs extends PortLayout.CommonArgs {
  strict?: boolean
}

export interface LineArgs extends SideArgs {
  start?: Point.PointLike
  end?: Point.PointLike
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

  return lineLayout(portsPositionArgs, start, end, groupPositionArgs)
}

export const left: PortLayout.Definition<SideArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
  return lineLayout(
    portsPositionArgs,
    elemBBox.getTopLeft(),
    elemBBox.getBottomLeft(),
    groupPositionArgs,
  )
}

export const right: PortLayout.Definition<SideArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
  return lineLayout(
    portsPositionArgs,
    elemBBox.getTopRight(),
    elemBBox.getBottomRight(),
    groupPositionArgs,
  )
}

export const top: PortLayout.Definition<SideArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
  return lineLayout(
    portsPositionArgs,
    elemBBox.getTopLeft(),
    elemBBox.getTopRight(),
    groupPositionArgs,
  )
}

export const bottom: PortLayout.Definition<SideArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
  return lineLayout(
    portsPositionArgs,
    elemBBox.getBottomLeft(),
    elemBBox.getBottomRight(),
    groupPositionArgs,
  )
}

function lineLayout(
  portsPositionArgs: SideArgs[],
  p1: Point,
  p2: Point,
  groupPositionArgs: SideArgs,
) {
  const line = new Line(p1, p2)
  const length = portsPositionArgs.length
  return portsPositionArgs.map(({ strict, ...offset }, index) => {
    const ratio =
      strict || groupPositionArgs.strict
        ? (index + 1) / (length + 1)
        : (index + 0.5) / length

    const p = line.pointAt(ratio)
    if (offset.dx || offset.dy) {
      p.translate(offset.dx || 0, offset.dy || 0)
    }

    return toResult(p.round(), 0, offset)
  })
}
