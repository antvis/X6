import { Path } from '../../geometry'
import { normalizeMarker } from './util'
import { Marker } from './index'

export interface CrossMarkerOptions {
  size?: number
  width?: number
  height?: number
  offset?: number
}

export const cross: Marker.Definition<CrossMarkerOptions> = (options) => {
  const size = options.size || 10
  const width = options.width || size
  const height = options.height || size

  const path = new Path()
  path.moveTo(0, 0).lineTo(width, height).moveTo(0, height).lineTo(width, 0)

  return {
    type: 'path',
    fill: 'none',
    d: normalizeMarker(path.serialize(), options.offset || -width / 2),
  }
}
