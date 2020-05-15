import { Path } from '../../geometry'
import { Marker } from './index'

export interface AsyncMarkerOptions {
  width?: number
  height?: number
  offset?: number
  open?: boolean
  flip?: boolean
}

export const async: Marker.Definition<AsyncMarkerOptions> = (options) => {
  const width = options.width || 10
  const height = options.height || 6
  const open = options.open === true
  const flip = options.flip === true
  const result: Marker.Result = { type: 'path' }

  const path = new Path()

  if (flip) {
    path.moveTo(0, -height).lineTo(width, 0)
  } else {
    path.moveTo(0, height).lineTo(width, 0)
  }

  if (!open) {
    path.lineTo(width, height)
    path.close()
  } else {
    result.fill = 'none'
  }

  result.d = Marker.normalize(path.serialize(), {
    x: options.offset || -width / 2,
    y: flip ? -height / 2 : height / 2,
  })

  return result
}
