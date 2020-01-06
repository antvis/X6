import { Point } from '../geometry'
import { Shape } from '../shape'
import { SvgCanvas2D } from '../canvas'
import { ovalMarker } from './oval'
import { diamondMarker } from './diamond'
import { createOpenMarker as createOpenMarkerInner } from './open'
import { createClassicMarker as createClassicMarkerinner } from './classic'
import { circleMarker, circlePlusMarker, halfCircleMarker } from './circle'
import { crossMarker } from './cross'
import { dashMarker } from './dash'
import {
  asyncMarker,
  createOpenAsyncMarker as createOpenAsyncMarkerInner,
} from './async'
import { registerEntity } from '../registry/util'

export namespace Marker {
  export const oval = ovalMarker
  export const diamond = diamondMarker
  export const createOpenMarker = createOpenMarkerInner
  export const createClassicMarker = createClassicMarkerinner
  export const circle = circleMarker
  export const circlePlus = circlePlusMarker
  export const halfCircle = halfCircleMarker
  export const cross = crossMarker
  export const dash = dashMarker
  export const async = asyncMarker
  export const createOpenAsyncMarker = createOpenAsyncMarkerInner
}

export namespace Marker {
  export interface CreateMarkerOptions {
    /**
     * The `SvgCanvas2D` instance used to draw the edge and marker.
     */
    c: SvgCanvas2D

    /**
     * The edge shape instance.
     */
    shape: Shape

    /**
     * The marker name.
     */
    name: string

    /**
     * The marker size.
     */
    size: number

    /**
     * The stroke width.
     */
    sw: number

    /**
     * The connection point of the edge and node. We could update it
     * when take take into account the marker size.
     */
    pe: Point

    /**
     * The cos(deg) of from p0 to pe.
     */
    unitX: number

    /**
     * The sin(deg) of from p0 to pe.
     */
    unitY: number

    /**
     * Indicating if the new terminal is the source or target.
     */
    isSource: boolean

    /**
     * Indicating if the marker should be filled.
     */
    filled: boolean
  }

  export type MarkerFactory = (options: CreateMarkerOptions) => () => void

  const markers: { [name: string]: MarkerFactory } = {}

  export function register(
    name: string,
    draw: MarkerFactory,
    force: boolean = false,
  ) {
    registerEntity(markers, name, draw, force, () => {
      throw new Error(`Marker with name '${name}' already registered.`)
    })
  }

  export function createMarker(options: CreateMarkerOptions) {
    const fn = markers[options.name]
    return fn != null ? fn(options) : null
  }

  export function getMakerNames() {
    return Object.keys(markers)
  }
}
