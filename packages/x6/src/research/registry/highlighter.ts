import { KeyValue } from '../../types'
import { Highlighter } from '../highlighter'
import { Registry } from './registry'

export const HighlighterRegistry = new Registry<
  Highlighter.Definition<KeyValue>
>({
  onError(name) {
    throw new Error(`Highlighter with name '${name}' already registered.`)
  },
})

Object.keys(Highlighter).forEach(key => {
  const name = key as Highlighter.NativeNames
  const entity = Highlighter[name]
  HighlighterRegistry.register(name, entity, true)
})
