import * as util from '../util'
import { Shape } from '../shape'
import { SvgCanvas2D } from '../canvas'
import { Point, MarkerNames } from '../struct'
import { createClassicMarker } from './classic'
import { createOpenMarker } from './open'
import { diamond } from './diamond'
import { oval } from './oval'

export interface DrawMarkerOptions {
  /**
   * The `SvgCanvas2D` instance used to draw the edge and marker.
   */
  c: SvgCanvas2D,
  /**
   * The edge shape instance.
   */
  shape: Shape,
  /**
   * The marker name.
   */
  name: string,
  /**
   * The marker size.
   */
  size: number,
  /**
   * The stroke width.
   */
  sw: number,
  /**
   * The connection point of the edge and node. We could update it
   * when take take into account the marker size.
   */
  pe: Point,
  /**
   * The cos(deg) of from p0 to pe.
   */
  unitX: number,
  /**
   * The sin(deg) of from p0 to pe.
   */
  unitY: number,
  /**
   * Indicating if the new terminal is the source or target.
   */
  isSource: boolean,
  /**
   * Indicating if the marker should be filled.
   */
  filled: boolean,
}

export type DrawMarker = (options: DrawMarkerOptions) => (() => void)

const markers: { [name: string]: DrawMarker } = {}

export function registerMarker(
  name: string,
  fn: DrawMarker,
  force: boolean = false,
) {
  if (markers[name] && !force && !util.isApplyingHMR()) {
    throw new Error(`Marker with name '${name}' already registered.`)
  }
  markers[name] = fn
}

export function getMakerNames() {
  return Object.keys(markers)
}

export function createMarker(options: DrawMarkerOptions) {
  const fn = markers[options.name]
  return (fn != null) ? fn(options) : null
}

// register
// ----
registerMarker(MarkerNames.classic, createClassicMarker(2))
registerMarker(MarkerNames.classicThin, createClassicMarker(3))
registerMarker(MarkerNames.block, createClassicMarker(2))
registerMarker(MarkerNames.blockThin, createClassicMarker(3))
registerMarker(MarkerNames.open, createOpenMarker(2))
registerMarker(MarkerNames.openThin, createOpenMarker(3))
registerMarker(MarkerNames.diamond, diamond)
registerMarker(MarkerNames.diamondThin, diamond)
registerMarker(MarkerNames.oval, oval)
