import type { KeyValue } from '../../common'
import type { CellView } from '../../view'
import { Registry } from '../registry'
import * as highlighters from './main'

export interface HighlighterDefinition<T> {
  highlight: (cellView: CellView, magnet: Element, options: T) => void
  unhighlight: (cellView: CellView, magnet: Element, options: T) => void
}

export type HighlighterCommonDefinition = HighlighterDefinition<KeyValue>

export function highlighterCheck(
  name: string,
  highlighter: HighlighterCommonDefinition,
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

type Presets = typeof presets

type OptionsMap = {
  readonly [K in keyof Presets]-?: Parameters<Presets[K]['highlight']>[2]
}

type NativeNames = keyof Presets

export interface HighlighterNativeItem<T extends NativeNames = NativeNames> {
  name: T
  args?: OptionsMap[T]
}

export interface HighlighterManualItem {
  name: Exclude<string, NativeNames>
  args?: KeyValue
}

const presets = highlighters

export const highlighterRegistry = Registry.create<
  HighlighterCommonDefinition,
  Presets
>({
  type: 'highlighter',
})

highlighterRegistry.register(presets, true)
