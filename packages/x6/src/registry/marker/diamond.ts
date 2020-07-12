import { Path } from '../../geometry'
import { Attr } from '../attr'
import { normalize } from './util'
import { Marker } from './index'

export interface DiamondMarkerOptions extends Attr.SimpleAttrs {
  size?: number
  width?: number
  height?: number
  offset?: number
}

export const diamond: Marker.Factory<DiamondMarkerOptions> = ({
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
  path
    .moveTo(0, h / 2)
    .lineTo(w / 2, 0)
    .lineTo(w, h / 2)
    .lineTo(w / 2, h)
    .close()

  return {
    ...attrs,
    tagName: 'path',
    d: normalize(path.serialize(), offset == null ? -w / 2 : offset),
  }
}
