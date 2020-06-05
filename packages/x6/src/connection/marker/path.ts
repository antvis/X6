import { normalizeMarker } from './util'
import { Marker } from './index'

export interface PathMarkerOptions {
  d: string
  offsetX?: number
  offsetY?: number
}

export const path: Marker.Definition<PathMarkerOptions> = (options) => {
  return {
    type: 'path',
    d: normalizeMarker(options.d, options.offsetX, options.offsetY),
  }
}
