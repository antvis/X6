import { KeyValue } from '../../types'
import { Registry } from '../../common'
import { Attr } from '../../definition'
import * as markers from './main'
import { normalize as normalizeMarker } from './util'

export namespace Marker {
  export type Definition<T extends KeyValue = KeyValue> = (options: T) => Result

  export type Result = Attr.SimpleAttrs & {
    id?: string
    tagName?: string
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
  export const normalize = normalizeMarker
}
