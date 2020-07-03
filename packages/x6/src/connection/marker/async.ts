import { KeyValue } from '../../types'
import { Path } from '../../geometry'
import { normalize } from './util'
import { Marker } from './index'

export interface AsyncMarkerOptions extends KeyValue {
  width?: number
  height?: number
  offset?: number
  open?: boolean
  flip?: boolean
}

export const async: Marker.Definition<AsyncMarkerOptions> = ({
  width,
  height,
  offset,
  open,
  flip,
  ...attrs
}) => {
  const w = width || 10
  const h = height || 6
  const opened = open === true
  const fliped = flip === true
  const result: Marker.Result = { ...attrs, type: 'path' }

  const path = new Path()

  if (fliped) {
    path.moveTo(0, -h).lineTo(w, 0)
  } else {
    path.moveTo(0, h).lineTo(w, 0)
  }

  if (!opened) {
    path.lineTo(w, h)
    path.close()
  } else {
    result.fill = 'none'
  }

  result.d = normalize(path.serialize(), {
    x: offset || -w / 2,
    y: fliped ? -h / 2 : h / 2,
  })

  return result
}
