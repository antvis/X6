import { Path } from '../../geometry'
import type { SimpleAttrs } from '../attr'
import type { Marker } from './index'
import { normalize } from './util'

export interface CircleMarkerOptions extends SimpleAttrs {
  r?: number
}

export interface CirclePlusMarkerOptions extends CircleMarkerOptions {}

export const circle: Marker.Factory<CircleMarkerOptions> = ({
  r,
  ...attrs
}) => {
  const radius = r || 5
  return {
    cx: radius,
    ...attrs,
    tagName: 'circle',
    r: radius,
  }
}

export const circlePlus: Marker.Factory<CircleMarkerOptions> = ({
  r,
  ...attrs
}) => {
  const radius = r || 5
  const path = new Path()

  path.moveTo(radius, 0).lineTo(radius, radius * 2)
  path.moveTo(0, radius).lineTo(radius * 2, radius)

  return {
    children: [
      {
        ...circle({ r: radius }),
        fill: 'none',
      },
      {
        ...attrs,
        tagName: 'path',
        d: normalize(path.serialize(), -radius),
      },
    ] as any,
  }
}
