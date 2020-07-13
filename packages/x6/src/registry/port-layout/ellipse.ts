import { Rectangle, Ellipse } from '../../geometry'
import { PortLayout } from './index'
import { toResult } from './util'

export interface EllipseArgs extends PortLayout.CommonArgs {
  start?: number
  step?: number
  compensateRotate?: boolean
  /**
   * delta radius
   */
  dr?: number
}

export const ellipse: PortLayout.Definition<EllipseArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
  const startAngle = groupPositionArgs.start || 0
  const stepAngle = groupPositionArgs.step || 20

  return ellipseLayout(
    portsPositionArgs,
    elemBBox,
    startAngle,
    (index, count) => (index + 0.5 - count / 2) * stepAngle,
  )
}

export const ellipseSpread: PortLayout.Definition<EllipseArgs> = (
  portsPositionArgs,
  elemBBox,
  groupPositionArgs,
) => {
  const startAngle = groupPositionArgs.start || 0
  const stepAngle = groupPositionArgs.step || 360 / portsPositionArgs.length

  return ellipseLayout(portsPositionArgs, elemBBox, startAngle, (index) => {
    return index * stepAngle
  })
}

function ellipseLayout(
  portsPositionArgs: EllipseArgs[],
  elemBBox: Rectangle,
  startAngle: number,
  stepFn: (index: number, count: number) => number,
) {
  const center = elemBBox.getCenter()
  const start = elemBBox.getTopCenter()
  const ratio = elemBBox.width / elemBBox.height
  const ellipse = Ellipse.fromRect(elemBBox)
  const count = portsPositionArgs.length

  return portsPositionArgs.map((item, index) => {
    const angle = startAngle + stepFn(index, count)
    const p = start.clone().rotate(-angle, center).scale(ratio, 1, center)

    const theta = item.compensateRotate ? -ellipse.tangentTheta(p) : 0

    if (item.dx || item.dy) {
      p.translate(item.dx || 0, item.dy || 0)
    }

    if (item.dr) {
      p.move(center, item.dr)
    }

    return toResult(p.round(), theta, item)
  })
}
