import { Obj } from '../../util/obj'
import { Dom } from '../../element/dom/dom'
import { Primer } from '../../element/dom/primer'
import { When, Options } from '../types'
import { Util } from '../animator/util'
import { Registry } from '../registry'
import { AnimatorType } from './types'

export class ElementExtension<TNode extends Node> extends Primer<TNode> {
  animate(options: Options): AnimatorType<TNode>
  animate(duration?: number, delay?: number, when?: When): AnimatorType<TNode>
  animate(duration?: Options | number, delay?: number, when?: When) {
    const o = Util.sanitise(duration, delay, when)
    const timeline = this.timeline()
    const Type = Registry.get(this.node)
    return new Type(o.duration)
      .loop(o)
      .element(this)
      .timeline(timeline.play())
      .schedule(o.delay, o.when)
  }

  delay(by: number, when?: When) {
    return this.animate(0, by, when)
  }
}

declare module '../../element/dom/dom' {
  interface Dom<TNode extends Node = Node> extends ElementExtension<TNode> {}
}

Obj.applyMixins(Dom, ElementExtension)
