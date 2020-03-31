import { RequiredKeys } from 'utility-types'
import { KeyValue } from '../../types'
import { CellView } from '../core'
import * as highlighters from './index-rollup'

export namespace Highlighter {
  export const className = highlighters.className
  export const opacity = highlighters.opacity
  export const stroke = highlighters.stroke
}

export namespace Highlighter {
  export interface Definition<T> {
    highlight: (cellView: CellView, magnet: Element, options: T) => void
    unhighlight: (cellView: CellView, magnet: Element, options: T) => void
  }
}

export namespace Highlighter {
  type ModuleType = typeof Highlighter

  export type OptionsMap = {
    [K in RequiredKeys<ModuleType>]: Parameters<ModuleType[K]['highlight']>[2]
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
