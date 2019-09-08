import { Point, MarkerNames } from '../struct'
import { Shape } from '../shape'
import { SvgCanvas2D } from '../canvas'
import { createClassicMarker } from './classic'
import { createOpenMarker } from './open'
import { diamond } from './diamond'
import { oval } from './oval'

export interface DrawMarkerOptions {
  canvas: SvgCanvas2D,
  shape: Shape,
  type: string,
  pe: Point,
  unitX: number,
  unitY: number,
  size: number,
  isSource: boolean,
  strokeWidth: number,
  filled: boolean,
}

export type DrawMarker = (options: DrawMarkerOptions) => (() => void)

const markers: { [name: string]: DrawMarker } = {}

export function registerMarker(name: string, fn: DrawMarker) {
  if (markers[name]) {
    throw new Error(`Marker with name '${name}' already registered.`)
  }
  markers[name] = fn
}

export function createMarker(options: DrawMarkerOptions) {
  const fn = markers[options.type]
  return (fn != null) ? fn(options) : null
}

// register
// ----
registerMarker(MarkerNames.classic, createClassicMarker(2))
registerMarker(MarkerNames.classicThin, createClassicMarker(3))
registerMarker(MarkerNames.open, createOpenMarker(2))
registerMarker(MarkerNames.openThin, createOpenMarker(3))
registerMarker(MarkerNames.oval, oval)
registerMarker(MarkerNames.diamond, diamond)
