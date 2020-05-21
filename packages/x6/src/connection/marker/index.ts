import { KeyValue } from '../../types'
import { Registry } from '../../common'
import { Path } from '../../geometry'
import { Attr } from '../../definition'
import * as markers from './main'

export namespace Marker {
  export type Definition<T extends KeyValue = KeyValue> = (options: T) => Result

  export type Result = Attr.SimpleAttrs & {
    id?: string
    type?: string
    markerUnits?: string
    children?: Attr.SimpleAttrs[]
  }
}

export namespace Marker {
  export type Presets = typeof Marker['presets']

  export type OptionsMap = {
    readonly [K in keyof Presets]-?: Parameters<Presets[K]>[0]
  }

  export type NativeNames = keyof OptionsMap

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: KeyValue
  }
}

export namespace Marker {
  export const presets = markers
  export const registry = Registry.create<Definition, Presets>({
    type: 'marker',
  })
  registry.register(presets, true)
}

export namespace Marker {
  /**
   * Normalizes marker's path data by translate the center
   * of an arbitrary path at <0 + offset,0>.
   */
  export function normalize(
    d: string,
    offset: { x?: number; y?: number },
  ): string
  export function normalize(
    d: string,
    offsetX?: number,
    offsetY?: number,
  ): string
  export function normalize(
    d: string,
    offset1?: number | { x?: number; y?: number },
    offset2?: number,
  ) {
    let offsetX: number | undefined
    let offsetY: number | undefined
    if (typeof offset1 === 'object') {
      offsetX = offset1.x
      offsetY = offset1.y
    } else {
      offsetX = offset1
      offsetY = offset2
    }

    const path = Path.parse(Path.normalize(d))
    const bbox = path.bbox()
    if (bbox) {
      let ty = -bbox.height / 2 - bbox.y
      let tx = -bbox.width / 2 - bbox.x
      if (typeof offsetX === 'number') {
        tx -= offsetX
      }
      if (typeof offsetY === 'number') {
        ty -= offsetY
      }

      path.translate(tx, ty)
    }

    return path.serialize()
  }
}
