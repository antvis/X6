import { Path } from '../../geometry'
import { NumberExt } from '../../util'
import { normalize } from './util'
import { Marker } from './index'

interface Common {
  size?: number
  width?: number
  height?: number
  offset?: number
}

export interface BlockMarkerOptions extends Common {
  open?: boolean
}

export interface ClassicMarkerOptions extends Common {
  factor?: number
}

export const block: Marker.Definition<BlockMarkerOptions> = (options) => {
  return createClassicMarker(options, options.open === true, true)
}

export const classic: Marker.Definition<ClassicMarkerOptions> = (options) => {
  return createClassicMarker(options, false, false, options.factor)
}

function createClassicMarker(
  options: BlockMarkerOptions,
  open: boolean,
  full: boolean,
  factor: number = 3 / 4,
) {
  const size = options.size || 10
  const width = options.width || size
  const height = options.height || size
  const path = new Path()
  const attrs: { fill?: string } = {}

  if (open) {
    path
      .moveTo(width, 0)
      .lineTo(0, height / 2)
      .lineTo(width, height)
    attrs.fill = 'none'
  } else {
    path.moveTo(0, height / 2)
    path.lineTo(width, 0)

    if (!full) {
      const f = NumberExt.clamp(factor, 0, 1)
      path.lineTo(width * f, height / 2)
    }

    path.lineTo(width, height)
    path.close()
  }

  return {
    ...attrs,
    type: 'path',
    d: normalize(path.serialize(), {
      x: options.offset || (open ? -width / 2 : 0),
    }),
  }
}
