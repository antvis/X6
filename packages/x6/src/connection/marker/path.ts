import { Attr } from '../../definition'
import { normalize } from './util'
import { Marker } from './index'

export interface PathMarkerOptions extends Attr.SimpleAttrs {
  d: string
  offsetX?: number
  offsetY?: number
}

export const path: Marker.Definition<PathMarkerOptions> = ({
  d,
  offsetX,
  offsetY,
  ...attrs
}) => {
  return {
    ...attrs,
    type: 'path',
    d: normalize(d, offsetX, offsetY),
  }
}
