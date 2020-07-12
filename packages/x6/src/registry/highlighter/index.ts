import { KeyValue } from '../../types'
import { CellView } from '../../view'
import { Registry } from '../registry'
import * as highlighters from './main'

export namespace Highlighter {
  export interface Definition<T> {
    highlight: (cellView: CellView, magnet: Element, options: T) => void
    unhighlight: (cellView: CellView, magnet: Element, options: T) => void
  }

  export type CommonDefinition = Highlighter.Definition<KeyValue>
}

export namespace Highlighter {
  export function check(
    name: string,
    highlighter: Highlighter.CommonDefinition,
  ) {
    if (typeof highlighter.highlight !== 'function') {
      throw new Error(
        `Highlighter '${name}' is missing required \`highlight()\` method`,
      )
    }

    if (typeof highlighter.unhighlight !== 'function') {
      throw new Error(
        `Highlighter '${name}' is missing required \`unhighlight()\` method`,
      )
    }
  }
}

export namespace Highlighter {
  export type Presets = typeof Highlighter['presets']

  export type OptionsMap = {
    readonly [K in keyof Presets]-?: Parameters<Presets[K]['highlight']>[2]
  }

  export type NativeNames = keyof Presets

  export interface NativeItem<T extends NativeNames = NativeNames> {
    name: T
    args?: OptionsMap[T]
  }

  export interface ManaualItem {
    name: Exclude<string, NativeNames>
    args?: KeyValue
  }
}

export namespace Highlighter {
  export const presets = highlighters
  export const registry = Registry.create<CommonDefinition, Presets>({
    type: 'highlighter',
  })

  registry.register(presets, true)
}
