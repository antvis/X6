import { type KeyValue, NumberExt } from '../../common'
import { Path } from '../../geometry'
import type { MarkerFactory } from './index'
import { normalize } from './util'

interface Common {
  size?: number
  width?: number
  height?: number
  offset?: number
}

export interface BlockMarkerOptions extends Common, KeyValue {
  open?: boolean
}

export interface ClassicMarkerOptions extends Common, KeyValue {
  factor?: number
}

export const block: MarkerFactory<BlockMarkerOptions> = ({
  size,
  width,
  height,
  offset,
  open,
  ...attrs
}) => {
  return createClassicMarker(
    { size, width, height, offset },
    open === true,
    true,
    undefined,
    attrs,
  )
}

export const classic: MarkerFactory<ClassicMarkerOptions> = ({
  size,
  width,
  height,
  offset,
  factor,
  ...attrs
}) => {
  return createClassicMarker(
    { size, width, height, offset },
    false,
    false,
    factor,
    attrs,
  )
}

function createClassicMarker(
  options: Common,
  open: boolean,
  full: boolean,
  factor: number = 3 / 4,
  attrs: KeyValue = {},
) {
  const size = options.size || 10
  const width = options.width || size
  const height = options.height || size
  const path = new Path()
  const localAttrs: { fill?: string } = {}

  if (open) {
    path
      .moveTo(width, 0)
      .lineTo(0, height / 2)
      .lineTo(width, height)
    localAttrs.fill = 'none'
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
    ...localAttrs,
    ...attrs,
    tagName: 'path',
    d: normalize(path.serialize(), {
      x: options.offset != null ? options.offset : -width / 2,
    }),
  }
}
