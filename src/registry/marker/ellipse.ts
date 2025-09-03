import type { SimpleAttrs } from '../attr'
import type { MarkerFactory } from './index'

export interface EllipseMarkerOptions extends SimpleAttrs {
  rx?: number
  ry?: number
}

export const ellipse: MarkerFactory<EllipseMarkerOptions> = ({
  rx,
  ry,
  ...attrs
}) => {
  const radiusX = rx || 5
  const radiusy = ry || 5
  return {
    cx: radiusX,
    ...attrs,
    tagName: 'ellipse',
    rx: radiusX,
    ry: radiusy,
  }
}
