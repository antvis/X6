import { Marker } from './index'

export interface PathMarkerOptions {
  d: string
  offsetX?: number
  offsetY?: number
}

export const path: Marker.Definition<PathMarkerOptions> = (options) => {
  return {
    type: 'path',
    d: Marker.normalize(options.d, options.offsetX, options.offsetY),
  }
}
