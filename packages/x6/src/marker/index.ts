import { Shape } from '../shape'
import { Point } from '../struct'
import { SvgCanvas2D } from '../canvas'
import { registerEntity } from '../util/biz/registry'

export * from './classic'
export * from './diamond'
export * from './open'
export * from './oval'

export namespace Marker {
  export interface DrawMarkerOptions {
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

  export type DrawMarker = (options: DrawMarkerOptions) => () => void

  const markers: { [name: string]: DrawMarker } = {}

  export function register(
    name: string,
    draw: DrawMarker,
    force: boolean = false,
  ) {
    registerEntity(markers, name, draw, force, () => {
      throw new Error(`Marker with name '${name}' already registered.`)
    })
  }

  export function createMarker(options: DrawMarkerOptions) {
    const fn = markers[options.name]
    return fn != null ? fn(options) : null
  }

  export function getMakerNames() {
    return Object.keys(markers)
  }
}
