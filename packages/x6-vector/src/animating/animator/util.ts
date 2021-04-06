import type { Animator } from './index'
import type { Primer } from '../../element/dom/primer'
import { Options, When } from '../types'
import { Stepper } from '../stepper/stepper'

export namespace Util {
  let id = 0
  export function generateId() {
    const ret = id
    id += 1
    return ret
  }

  export const defaults = {
    duration: 400,
    delay: 0,
  }

  export function sanitise(
    duration: number | Options = defaults.duration,
    delay: number = defaults.delay,
    when: When = 'after',
  ) {
    let times = 1
    let swing = false
    let wait = 0

    if (typeof duration === 'object' && !(duration instanceof Stepper)) {
      const options = duration
      // eslint-disable-next-line no-param-reassign
      duration = duration.duration || defaults.duration
      // eslint-disable-next-line no-param-reassign
      delay = options.delay || delay
      // eslint-disable-next-line no-param-reassign
      when = options.when || when
      swing = options.swing || swing
      times = options.times || times
      wait = options.wait || wait
    }

    return {
      delay,
      swing,
      times,
      wait,
      when,
      duration: duration as number,
    }
  }

  export function create<TType extends typeof Animator>(
    Type: TType,
    element: Primer,
    duration?: Partial<Options> | number,
    delay?: number,
    when?: When,
  ) {
    const o = sanitise(duration, delay, when)
    const timeline = element.timeline()
    return new Type(o.duration)
      .loop(o)
      .element(element)
      .timeline(timeline.play())
      .schedule(o.delay, o.when)
  }
}
