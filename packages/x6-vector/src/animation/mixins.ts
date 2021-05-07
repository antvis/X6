import { applyMixins } from '../util/mixin'
import { Dom } from '../dom/dom'
import { Primer } from '../dom/primer/primer'
import { Util } from '../animating/animator/util'
import { Timeline } from '../animating/scheduler/timeline'
import { When, Options } from '../animating/types'
import { Registry } from './registry'
import { AnimatorMap } from './types'

export class AnimateExtension<
  TElement extends Element
> extends Primer<TElement> {
  animate(options: Options): AnimatorMap<TElement>
  animate(duration?: number, delay?: number, when?: When): AnimatorMap<TElement>
  animate(duration?: Options | number, delay?: number, when?: When) {
    const o = Util.sanitise(duration, delay, when)
    const timeline = this.scheduler()
    const Type = Registry.get(this.node)
    return new Type(o.duration)
      .loop(o)
      .element(this as any)
      .scheduler(timeline.play())
      .schedule(o.delay, o.when)
  }

  delay(by: number, when?: When) {
    return this.animate(0, by, when)
  }
}

const cache: WeakMap<Primer, Timeline> = new WeakMap()

export class TimelineExtension<
  TElement extends Element = Element
> extends Primer<TElement> {
  scheduler(): Timeline
  scheduler(timeline: Timeline): this
  scheduler(timeline?: Timeline) {
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

declare module '../dom/dom' {
  interface Dom<TElement extends Element = Element>
    extends AnimateExtension<TElement>,
      TimelineExtension<TElement> {}
}

applyMixins(Dom, AnimateExtension, TimelineExtension)
