import type { SimpleAttrs } from '../attr'
import type { Marker } from './index'
import { normalize } from './util'

export interface PathMarkerOptions extends SimpleAttrs {
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
