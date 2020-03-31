import { KeyValue } from '../../types'
import { Highlighter } from '../highlighter'
import { Registry } from './util'

// tslint:disable-next-line
export const HighlighterRegistry = new Registry<
  Highlighter.Definition<KeyValue>
>({
  onError(name) {
    throw new Error(`Highlighter with name '${name}' already registered.`)
  },
})

HighlighterRegistry.register('className', Highlighter.className, true)
HighlighterRegistry.register('opacity', Highlighter.opacity, true)
HighlighterRegistry.register('stroke', Highlighter.stroke, true)
