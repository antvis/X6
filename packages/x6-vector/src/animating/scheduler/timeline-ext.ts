import { Timeline } from './timeline'
import { Primer } from '../../dom/primer'

export class ElementExtension {
  protected timeline: Timeline

  scheduler(): Timeline
  scheduler(timeline: Timeline): this
  scheduler(timeline?: Timeline) {
    if (timeline == null) {
      if (this.timeline == null) {
        this.timeline = new Timeline()
      }
      return this.timeline
    }

    this.timeline = timeline
    return this
  }
}

declare module '../../dom/primer/primer' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Primer<TElement extends Element = Element>
    extends ElementExtension {}
}

Primer.mixin(ElementExtension)
