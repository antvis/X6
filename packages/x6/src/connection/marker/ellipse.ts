import { Attr } from '../../definition'
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
  return {
    ...attrs,
    tagName: 'ellipse',
    rx: rx || 5,
    ry: ry || 5,
  }
}
