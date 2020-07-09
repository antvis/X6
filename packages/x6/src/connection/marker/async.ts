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

export const async: Marker.Factory<AsyncMarkerOptions> = ({
  width,
  height,
  offset,
  open,
  flip,
  ...attrs
}) => {
  let h = height || 6
  const w = width || 10
  const opened = open === true
  const fliped = flip === true
  const result: Marker.Result = { ...attrs, tagName: 'path' }

  if (fliped) {
    h = -h
  }

  const path = new Path()

  path.moveTo(0, h).lineTo(w, 0)

  if (!opened) {
    path.lineTo(w, h)
    path.close()
  } else {
    result.fill = 'none'
  }

  result.d = normalize(path.serialize(), {
    x: offset || -w / 2,
    y: h / 2,
  })

  return result
}
