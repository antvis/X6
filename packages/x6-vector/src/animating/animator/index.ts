import { Entity } from '../../types'
import { Obj } from '../../util/obj'
import { When, Options } from '../types'
import { Easing } from '../stepper/easing'
import { Morpher } from '../morpher/morpher'
import { Stepper } from '../stepper/stepper'
import { Timeline } from '../scheduler/timeline'
import { Controller } from '../stepper/controller'
import {
  History,
  Executors,
  PrepareMethod,
  RunMethod,
  RetargetMethod,
} from './types'
import { Util } from './util'
import { Registry } from '../registry'
import { AnimatorType } from '../extension/types'

export class Animator<
  TElement extends Entity = Entity,
  TTarget extends Entity = Entity,
  TAnimator = AnimatorType<TElement>
> {
  public readonly id: number
  public readonly declarative: boolean
  public done = false
  protected enabled = true
  protected reseted = true
  protected persisted: number | boolean

  protected target: TTarget
  protected stepper: Stepper
  protected t: Timeline | null = null

  protected duration: number
  protected times = 1
  protected wait = 0
  protected swing = false
  protected reversal = false

  protected currentTime = 0
  protected previousStepTime = 0
  protected previousStepPosition: number

  protected readonly executors: Executors<TAnimator> = []
  protected readonly history: History<TAnimator> = {}
  protected readonly callbacks: {
    [Key in Animator.EventNames]: any[]
  } = {
    start: [],
    step: [],
    finished: [],
  }

  constructor()
  constructor(duration: number)
  constructor(stepper: Stepper)
  constructor(options: number | Stepper = Util.defaults.duration) {
    this.id = Util.generateId()
    const opts =
      typeof options === 'function' ? new Controller(options) : options
    this.stepper = opts instanceof Controller ? opts : new Easing()
    this.declarative = opts instanceof Controller
    this.persisted = this.declarative ? true : 0
    this.duration = typeof opts === 'number' ? opts : 0
  }

  active(): boolean
  active(enabled: boolean): this
  active(enabled?: boolean) {
    if (enabled == null) {
      return this.enabled
    }

    this.enabled = enabled
    return this
  }

  ease(): Stepper
  ease(stepper: Stepper): this
  ease(stepper?: Stepper) {
    if (stepper == null) {
      return this.stepper
    }

    this.stepper = stepper
    return this
  }

  persist(): number
  /**
   * Make this runner persist on the timeline forever (true) or for a specific
   * time. Usually a runner is deleted after execution to clean up memory.
   */
  persist(dt: number): this
  persist(forever: boolean): this
  persist(dtOrForever?: number | boolean) {
    if (dtOrForever == null) {
      return this.persisted
    }
    this.persisted = dtOrForever
    return this
  }

  element(): TTarget
  element(target: TTarget): this
  element(target?: TTarget) {
    if (target == null) {
      return this.target
    }

    this.target = target

    return this
  }

  timeline(): Timeline
  timeline(timeline: Timeline | null): this
  timeline(timeline?: Timeline | null) {
    if (typeof timeline === 'undefined') {
      return this.t
    }
    this.t = timeline
    return this
  }

  /**
   * Set the runner back to zero time and all animations with it
   */
  reset() {
    if (this.reseted) {
      return this
    }

    this.time(0)
    this.reseted = true
    return this
  }

  /**
   * Returns the duration the runner will run
   */
  quantity() {
    return this.times * (this.wait + this.duration) - this.wait
  }

  schedule(delay: number, when: When): this
  schedule(timeline: Timeline, delay: number, when: When): this
  schedule(timeline: Timeline | number, delay: When | number, when?: When) {
    if (typeof timeline === 'number') {
      when = delay as When // eslint-disable-line
      delay = timeline // eslint-disable-line
      timeline = this.timeline() // eslint-disable-line
    }

    if (timeline == null) {
      throw Error('Runner cannot be scheduled without timeline')
    }

    timeline.schedule(this, delay as number, when)
    return this
  }

  unschedule() {
    const timeline = this.timeline()
    if (timeline) {
      timeline.unschedule(this)
    }
    return this
  }

  loop(times?: number | true, swing?: boolean, wait?: number): this
  loop(options: { times?: number | true; swing?: boolean; wait?: number }): this
  loop(
    times?:
      | { times?: number | true; swing?: boolean; wait?: number }
      | number
      | true,
    swing?: boolean,
    wait?: number,
  ) {
    const o = typeof times === 'object' ? times : { times, swing, wait }
    this.times = o.times == null || o.times === true ? Infinity : o.times
    this.swing = o.swing || false
    this.wait = o.wait || 0
    return this
  }

  reverse(reverse?: boolean) {
    this.reversal = reverse == null ? !this.reversal : reverse
    return this
  }

  time(): number
  time(time: number): this
  time(time?: number) {
    if (time == null) {
      return this.currentTime
    }
    const delta = time - this.currentTime
    this.step(delta)
    return this
  }

  /**
   * Steps the runner to its finished state.
   */
  finish() {
    return this.step(Infinity)
  }

  /**
   * Returns the current position of the runner including the wait times
   * (between 0 and 1).
   */
  progress(): number
  /**
   * Sets the current position of the runner including the wait times
   * (between 0 and 1).
   */
  progress(p: number): this
  progress(p?: number) {
    if (p == null) {
      return Math.min(1, this.currentTime / this.quantity())
    }
    return this.time(p * this.quantity())
  }

  /**
   * Get the current iteration of the runner.
   */
  loops(): number
  /**
   * Jump to a specific iteration of the runner.
   * e.g. 3.5 for 4th loop half way through
   */
  loops(p: number): this
  loops(p?: number) {
    const duration = this.duration + this.wait

    if (p == null) {
      const finishedCount = Math.floor(this.currentTime / duration)
      const delta = this.currentTime - finishedCount * duration
      const position = delta / this.duration
      return Math.min(finishedCount + position, this.times)
    }

    const whole = Math.floor(p)
    const partial = p % 1
    const total = duration * whole + this.duration * partial
    return this.time(total)
  }

  /**
   * Returns the current position of the runner ignoring the wait times
   * (between 0 and 1).
   */
  position(): number
  /**
   * Sets the current position of the runner ignoring the wait times
   * (between 0 and 1).
   */
  position(p: number): this
  position(p?: number) {
    const current = this.currentTime
    const w = this.wait
    const t = this.times
    const s = this.swing
    const r = this.reversal
    const d = this.duration

    if (p == null) {
      /*
      This function converts a time to a position in the range [0, 1]
      The full explanation can be found in this desmos demonstration
        https://www.desmos.com/calculator/u4fbavgche
      The logic is slightly simplified here because we can use booleans
      */

      // Figure out the value without thinking about the start or end time
      const f = (x: number) => {
        const swinging = (s ? 1 : 0) * Math.floor((x % (2 * (w + d))) / (w + d))
        const backwards = +((swinging && !r) || (!swinging && r))
        const uncliped = ((backwards ? -1 : 1) * (x % (w + d))) / d + backwards
        const clipped = Math.max(Math.min(uncliped, 1), 0)
        return clipped
      }

      // Figure out the value by incorporating the start time
      const endTime = t * (w + d) - w
      const position =
        current <= 0
          ? Math.round(f(1e-5))
          : current < endTime
          ? f(current)
          : Math.round(f(endTime - 1e-5))
      return position
    }

    const finishedCount = Math.floor(this.loops())
    const swingForward = s && finishedCount % 2 === 0
    const forwards = (swingForward && !r) || (r && swingForward)
    const position = finishedCount + (forwards ? p : 1 - p)
    return this.loops(position)
  }

  animate(options: Options): Animator<TElement, TTarget>
  animate(
    duration?: number,
    delay?: number,
    when?: When,
  ): Animator<TElement, TTarget>
  animate(duration?: Options | number, delay?: number, when?: When) {
    const options = Util.sanitise(duration, delay, when)
    const animator = new Animator<TElement, TTarget>(options.duration)

    if (this.t) {
      animator.timeline(this.t)
    }

    if (this.target) {
      animator.element(this.target)
    }

    return animator.loop(options).schedule(options.delay, options.when)
  }

  delay(delay: number) {
    return this.animate(0, delay)
  }

  /**
   * Step the runner by a certain time.
   */
  step(delta = 16) {
    if (!this.active()) {
      return this
    }

    this.currentTime += delta

    // Figure out if we need to run the stepper in this frame
    const position = this.position()
    const running =
      this.previousStepPosition !== position && this.currentTime >= 0
    this.previousStepPosition = position

    const quantity = this.quantity()
    const justStarted = this.previousStepTime <= 0 && this.currentTime > 0
    const justFinished =
      this.previousStepTime < quantity && this.currentTime >= quantity

    this.previousStepTime = this.currentTime
    const callback = (cache: any[]) => {
      for (let i = 0, l = cache.length; i < l; i += 1) {
        const handler = cache[i] as Animator.Callback<TAnimator>
        const context = cache[i + 1]
        if (handler) {
          const result = handler.call(context, this)
          if (result === false) {
            return false
          }
        }
      }
    }

    if (justStarted) {
      if (callback(this.callbacks.start) === false) {
        return this
      }
    }

    this.reseted = false

    // Work out if the runner is finished set the done flag here so animations
    // know, that they are running in the last step (this is good for
    // transformations which can be merged)
    const declared = this.declarative

    this.done = !declared && !justFinished && this.currentTime >= quantity

    let converged = false
    if (running || declared) {
      this.prepare(running)
      converged = this.run(declared ? delta : position)
      if (callback(this.callbacks.step) === false) {
        return this
      }
    }

    // correct the done flag here
    // declaritive animations itself know when they converged
    this.done = this.done || (converged && declared)

    if (justFinished) {
      if (callback(this.callbacks.finished) === false) {
        return this
      }
    }

    return this
  }

  on(
    event: Animator.EventNames,
    callback: Animator.Callback<TAnimator>,
    context?: Entity,
  ) {
    const cache = this.callbacks[event]
    cache.push(callback, context)
    return this
  }

  off(
    event: Animator.EventNames,
    callback?: Animator.Callback<TAnimator>,
    context?: Entity,
  ) {
    const cache = this.callbacks[event]
    if (callback == null && context == null) {
      this.callbacks[event] = []
    } else {
      for (let i = cache.length - 1; i >= 0; i -= 2) {
        if (
          (callback == null || cache[i - 1] === callback) &&
          (context == null || cache[i] === context)
        ) {
          cache.splice(i - 1, 2)
        }
      }
    }
    return this
  }

  protected queue<TTarget, TExtra = any>(
    prepare?: PrepareMethod<TAnimator> | null,
    run?: RunMethod<TAnimator> | null,
    retarget?: RetargetMethod<TAnimator, TTarget, TExtra> | null,
    isTransform?: boolean,
  ) {
    this.executors.push({
      isTransform,
      retarget,
      prepare: prepare || (() => undefined),
      run: run || (() => undefined),
      ready: false,
      finished: false,
    })

    const timeline = this.timeline()
    if (timeline) {
      timeline.peek()
    }

    return this
  }

  protected prepare(running: boolean) {
    if (running || this.declarative) {
      for (let i = 0, l = this.executors.length; i < l; i += 1) {
        const exe = this.executors[i]
        const needInit = this.declarative || (!exe.ready && running)
        if (needInit && !exe.finished) {
          exe.prepare.call(this, this)
          exe.ready = true
        }
      }
    }
  }

  protected run(positionOrDelta: number) {
    let allfinished = true
    for (let i = 0, l = this.executors.length; i < l; i += 1) {
      const exe = this.executors[i]
      const converged = exe.run.call(this, this, positionOrDelta)
      exe.finished = exe.finished || converged === true
      allfinished = allfinished && exe.finished
    }

    return allfinished
  }

  protected remember(method: string, morpher: Morpher<any, any, any>) {
    // Save the morpher to the morpher list so that we can retarget it later
    this.history[method] = {
      morpher,
      executor: this.executors[this.executors.length - 1],
    }

    // We have to resume the timeline in case a controller
    // is already done without beeing ever run
    // This can happen when e.g. this is done:
    //    anim = el.animate(new SVG.Spring)
    // and later
    //    anim.move(...)
    if (this.declarative) {
      const timeline = this.timeline()
      if (timeline) {
        timeline.play()
      }
    }
  }

  protected retarget<TTarget, TExtra>(
    method: string,
    target: TTarget,
    extra?: TExtra,
  ) {
    if (this.history[method]) {
      const { morpher, executor } = this.history[method]

      // If the previous executor wasn't even prepared, drop it.
      if (!executor.ready) {
        const index = this.executors.indexOf(executor)
        this.executors.splice(index, 1)
        return false
      }

      if (executor.retarget) {
        // For the case of transformations, we use the special
        // retarget function which has access to the outer scope
        executor.retarget.call(this, this, target, extra)
      } else {
        morpher.to(target)
      }

      executor.finished = false

      const timeline = this.timeline()
      if (timeline) {
        timeline.play()
      }
      return true
    }

    return false
  }
}

export namespace Animator {
  export type EventNames = 'start' | 'step' | 'finished'

  export type Callback<T> = (animator: T) => any
}

export namespace Animator {
  export function register(name: string) {
    return <TDefinition extends Registry.Definition>(ctor: TDefinition) => {
      Registry.register(ctor, name)
    }
  }

  export function mixin(...source: any[]) {
    return (ctor: Registry.Definition) => {
      Obj.applyMixins(ctor, ...source)
    }
  }
}
