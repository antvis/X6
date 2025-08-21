import { Path } from '../../geometry'
import { Attr } from '../attr'
import { normalize } from './util'
import { Marker } from './index'

export interface CrossMarkerOptions extends Attr.SimpleAttrs {
  size?: number
  width?: number
  height?: number
  offset?: number
}

export const cross: Marker.Factory<CrossMarkerOptions> = ({
  size,
  width,
  height,
  offset,
  ...attrs
}) => {
  const s = size || 10
  const w = width || s
  const h = height || s

  const path = new Path()
  path.moveTo(0, 0).lineTo(w, h).moveTo(0, h).lineTo(w, 0)

  return {
    ...attrs,
    tagName: 'path',
    fill: 'none',
    d: normalize(path.serialize(), offset || -w / 2),
  }
}
