import { Path } from '../../geometry'
import { Marker } from './index'

export interface CircleMarkerOptions {
  r?: number
}

export interface CirclePlusMarkerOptions extends CircleMarkerOptions {}

export const circle: Marker.Definition<CircleMarkerOptions> = (options) => {
  return {
    type: 'circle',
    r: options.r || 5,
  }
}

export const circlePlus: Marker.Definition<CircleMarkerOptions> = (options) => {
  const r = options.r || 5
  const path = new Path()

  path.moveTo(r, 0).lineTo(r, r * 2)
  path.moveTo(0, r).lineTo(r * 2, r)

  return {
    children: [
      {
        ...circle(options),
        fill: 'none',
      },
      {
        type: 'path',
        d: Marker.normalize(path.serialize()),
      },
    ] as any,
  }
}
