import { Path } from '../../geometry'
import { normalizeMarker } from './util'
import { Marker } from './index'

export interface DiamondMarkerOptions {
  size?: number
  width?: number
  height?: number
  offset?: number
}

export const diamond: Marker.Definition<DiamondMarkerOptions> = (options) => {
  const size = options.size || 10
  const width = options.width || size
  const height = options.height || size

  const path = new Path()
  path
    .moveTo(0, height / 2)
    .lineTo(width / 2, 0)
    .lineTo(width, height / 2)
    .lineTo(width / 2, height)
    .close()

  return {
    type: 'path',
    d: normalizeMarker(path.serialize(), options.offset),
  }
}
