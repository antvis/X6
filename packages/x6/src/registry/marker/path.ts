import { Attr } from '../attr'
import { normalize } from './util'
import { Marker } from './index'

export interface PathMarkerOptions extends Attr.SimpleAttrs {
  d: string
  offsetX?: number
  offsetY?: number
}

export const path: Marker.Factory<PathMarkerOptions> = ({
  d,
  offsetX,
  offsetY,
  ...attrs
}) => {
  return {
    ...attrs,
    tagName: 'path',
    d: normalize(d, offsetX, offsetY),
  }
}
