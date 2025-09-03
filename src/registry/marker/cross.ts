import { Path } from '../../geometry'
import type { SimpleAttrs } from '../attr'
import type { MarkerFactory } from './index'
import { normalize } from './util'

export interface CrossMarkerOptions extends SimpleAttrs {
  size?: number
  width?: number
  height?: number
  offset?: number
}

export const cross: MarkerFactory<CrossMarkerOptions> = ({
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
