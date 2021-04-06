import { Obj } from '../../util/obj'
import { Dom } from '../../element/dom/dom'
import { Timeline } from './timeline'

const cache: WeakMap<ElementExtension, Timeline> = new WeakMap()

export class ElementExtension {
  timeline(): Timeline
  timeline(timeline: Timeline): this
  timeline(timeline?: Timeline) {
    if (timeline == null) {
      if (!cache.has(this)) {
        cache.set(this, new Timeline())
      }
      return cache.get(this)!
    }

    cache.set(this, timeline)
    return this
  }
}

declare module '../../element/dom/primer' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Primer<TNode extends Node = Node> extends ElementExtension {}
}

Obj.applyMixins(Dom, ElementExtension)
