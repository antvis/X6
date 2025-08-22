import { Point } from '../../geometry'
import { PortLabelLayout } from './index'
import { toResult } from './util'

export interface RadialArgs extends PortLabelLayout.CommonOptions {
  offset?: number
}

export const radial: PortLabelLayout.Definition<RadialArgs> = (
  portPosition,
  elemBBox,
  args,
) => radialLayout(portPosition.diff(elemBBox.getCenter()), false, args)

export const radialOriented: PortLabelLayout.Definition<RadialArgs> = (
  portPosition,
  elemBBox,
  args,
) => radialLayout(portPosition.diff(elemBBox.getCenter()), true, args)

function radialLayout(
  portCenterOffset: Point,
  autoOrient: boolean,
  args: RadialArgs,
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

  return toResult(
    {
      position: pos.round().toJSON(),
      angle: autoOrient ? orientAngle : 0,
      attrs: {
        '.': {
          y,
          'text-anchor': textAnchor,
        },
      },
    },
    args,
  )
}
