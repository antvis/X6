import { Marker } from './index'

export interface EllipseMarkerOptions {
  rx?: number
  ry?: number
}

export const ellipse: Marker.Definition<EllipseMarkerOptions> = (options) => {
  return {
    type: 'ellipse',
    rx: options.rx || 5,
    ry: options.ry || 5,
  }
}
