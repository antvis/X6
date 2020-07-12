import { Attr } from '../attr'
import { Marker } from './index'

export interface EllipseMarkerOptions extends Attr.SimpleAttrs {
  rx?: number
  ry?: number
}

export const ellipse: Marker.Factory<EllipseMarkerOptions> = ({
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
