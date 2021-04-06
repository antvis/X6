import { Queue } from './queue'
import { Timing } from './timing'
import { When, Now } from '../types'
import type { Animator } from '../animator'

export class Timeline {
  public readonly step: () => this
  public readonly stepImmediately: () => this
  public readonly now: Now

  protected paused = true

  /**
   * The speed of the timeline.
   */
  protected v = 1
  /**
   * The current time of the timeline.
   */
  protected t = 0
  /**
   * The previous step time of the timeline.
   */
  protected o = 0

  protected persisted: number | boolean = 0

  protected timestamp = 0

  protected animators: {
    animator: Timeline.AnyAnimator
    start: number
    persist: number | boolean
  }[] = []
  protected animatorIds: number[] = []
  protected previousAnimatorId = -1

  protected nextFrame: Queue.Item<Timing.Frame> | null = null

  constructor()
  constructor(now?: Now)
  constructor(now: Now = Timing.timer().now) {
    this.now = now
    this.step = () => this.stepImpl(false)
    this.stepImmediately = () => this.stepImpl(true)
  }

  isActive() {
    return this.nextFrame != null
  }

  /**
   * Get the speed of the timeline.
   */
  speed(): number
  /**
   * Set the speed of the timeline. Negative speeds will reverse the timeline.
   */
  speed(v: number): this
  speed(v?: number) {
    if (v == null) {
      return this.v
    }

    this.v = v
    return this
  }

  /**
   * Play the timeline in reverse basically going back in time.
   */
  reverse(): this
  reverse(yes: boolean): this
  reverse(yes?: boolean) {
    const speed = this.speed()
    if (yes == null) {
      return this.speed(-speed)
    }

    const positive = Math.abs(speed)
    return this.speed(yes ? -positive : positive)
  }

  persist(): number | boolean
  persist(dt: number): this
  persist(forever: boolean): this
  persist(dtOrForever?: number | boolean) {
    if (dtOrForever == null) {
      return this.persisted
    }

    this.persisted = dtOrForever
    return this
  }

  /**
   * Get the current time of the timeline.
   */
  time(): number
  /**
   * Set the current time of the timeline.
   */
  time(t: number): this
  time(t?: number) {
    if (t == null) {
      return this.t
    }
    this.t = t
    return this.peek(true)
  }

  /**
   * Offset the time by a delta.
   */
  offset(delta: number) {
    return this.time(this.t + delta)
  }

  /**
   * Finishes the whole timeline. All values are set to their corresponding
   * end values and every animation gets fullfilled.
   */
  finish() {
    const ends = this.animators.map(
      ({ start, animator }) => start + animator.quantity(),
    )
    const terminal = Math.max(0, ...ends)
    this.time(terminal + 1)
    return this.pause()
  }

  /**
   * Stops the timeline and sets the time back to zero.
   */
  stop() {
    this.time(0)
    return this.pause()
  }

  /**
   * Pauses the timeline.
   */
  pause() {
    this.paused = true
    return this.peek()
  }

  /**
   * Unpauses the timeline and continue the animation.
   */
  play() {
    this.paused = false
    return this.update().peek()
  }

  protected update() {
    if (!this.isActive()) {
      // Makes sure, that after pausing the time doesn't jump
      this.updateTimestamp()
    }
    return this
  }

  protected updateTimestamp() {
    const now = this.now()
    const delta = now - this.timestamp
    this.timestamp = now
    return delta
  }

  /**
   * Checks if we are running and continues the animation.
   */
  peek(immediately = false) {
    Timing.cancelFrame(this.nextFrame)
    this.nextFrame = null

    if (immediately) {
      return this.stepImmediately()
    }

    if (this.paused) {
      return this
    }

    this.nextFrame = Timing.frame(this.step)
    return this
  }

  schedule<TAnimator extends Timeline.AnyAnimator>(): {
    start: number
    end: number
    duration: number
    animator: TAnimator
  }[]
  /**
   * Schedules a runner on the timeline.
   */
  schedule<TAnimator extends Timeline.AnyAnimator>(
    animator: TAnimator,
    delay: number,
    when?: When,
  ): this
  schedule<TAnimator extends Timeline.AnyAnimator>(
    animator?: TAnimator,
    delay = 0,
    when?: When,
  ) {
    if (animator == null) {
      return this.animators.map(({ start, animator }) => {
        const duration = animator.quantity()
        const end = start + duration
        return {
          start,
          end,
          duration,
          animator,
        }
      })
    }

    // The start time for the next animation can either be given explicitly,
    // derived from the current timeline time or it can be relative to the
    // last start time to chain animations direclty

    let start = 0

    if (when == null || when === 'after') {
      // Plays the animation after the animation which comes last on the
      // timeline. If there is none, the animation is played right now.
      // Take the last time and increment
      start = this.getPreviousEndTime() + delay
    } else if (when === 'start') {
      // Schedules the animation to run to an absolute time on your timeline.
      start = delay
    } else if (when === 'now') {
      // Plays the animation right now.
      start = this.t + delay
    } else if (when === 'relative') {
      // Schedules the animation to play relative to its old start time.
      const info = this.getAnimator(animator.id)
      if (info) {
        start = info.start + delay
      }
    } else if (when === 'with') {
      const info = this.getPreviousAnimator()
      const lastStartTime = info ? info.start : this.t
      start = lastStartTime + delay
    } else {
      throw new Error('Invalid value for the "when" parameter')
    }

    animator.unschedule()
    animator.timeline(this)

    const persist = animator.persist()
    const meta = {
      start,
      animator,
      persist: persist == null ? this.persist() : persist,
    }

    this.previousAnimatorId = animator.id
    this.animators.push(meta)
    this.animators.sort((a, b) => a.start - b.start)
    this.animatorIds = this.animators.map((i) => i.animator.id)

    this.update().peek()
    return this
  }

  /**
   * Remove the animator from this timeline.
   */
  unschedule<TAnimator extends Timeline.AnyAnimator>(animator: TAnimator) {
    const index = this.animatorIds.indexOf(animator.id)
    if (index < 0) {
      return this
    }

    this.animators.splice(index, 1)
    this.animatorIds.splice(index, 1)

    animator.timeline(null)
    return this
  }

  protected stepImpl(immediately = false) {
    // Get the time delta from the last time and update the time
    let delta = this.updateTimestamp()

    if (immediately) {
      delta = 0
    }

    const dtTime = this.v * delta + (this.t - this.o)

    if (!immediately) {
      this.t += dtTime
      this.t = this.t < 0 ? 0 : this.t
    }
    this.o = this.t
    // this.fire('time', this.currentTime)

    // However, reseting in insertion order leads to bugs. Considering the case,
    // where 2 animators change the same attriute but in different times,
    // reseting both of them will lead to the case where the later defined
    // animator always wins the reset even if the other animator started earlier
    // and therefore should win the attribute battle
    // this can be solved by reseting them backwards
    for (let i = this.animators.length - 1; i >= 0; i -= 1) {
      const { start, animator } = this.animators[i]
      const delta = this.t - start
      // Dont run animator if not started yet and try to reset it
      if (delta <= 0) {
        animator.reset()
      }
    }

    let next = false
    for (let i = 0, l = this.animators.length; i < l; i += 1) {
      // Get and run the current animator and ignore it if its inactive
      const { animator, start, persist } = this.animators[i]
      if (!animator.active()) {
        continue
      }

      const delta = this.t - start
      if (delta <= 0) {
        // Dont run animator if not started yet
        next = true
        continue
      }

      // Adjust dt to make sure that animation is on point
      const dt = delta < dtTime ? delta : dtTime
      animator.step(dt)

      if (!animator.done) {
        next = true
      } else if (persist !== true) {
        const endTime = animator.quantity() - animator.time() + this.t
        const hold = persist === false ? 0 : persist

        if (endTime + hold < this.t) {
          // Delete animator and correct index
          animator.unschedule()
          i -= 1
          l -= 1
        }
      }
    }

    if (
      (next && !(this.v < 0 && this.t === 0)) ||
      (this.animatorIds.length > 0 && this.v < 0 && this.t > 0)
    ) {
      this.peek()
    } else {
      this.pause()
      // this.fire('finished')
    }

    return this
  }

  has(animatorId: number): boolean
  has<TAnimator extends Timeline.AnyAnimator>(animator: TAnimator): boolean
  has<TAnimator extends Timeline.AnyAnimator>(animatorId: number | TAnimator) {
    return this.animatorIds.includes(
      typeof animatorId === 'number' ? animatorId : animatorId.id,
    )
  }

  protected getAnimator(animatorId: number) {
    return this.animators[this.animatorIds.indexOf(animatorId)] || null
  }

  protected getPreviousAnimator() {
    return this.getAnimator(this.previousAnimatorId)
  }

  protected getPreviousEndTime() {
    const meta = this.getPreviousAnimator()
    const duration = meta ? meta.animator.quantity() : 0
    const start = meta ? meta.start : this.t
    return start + duration
  }
}

export namespace Timeline {
  export type AnyAnimator = Animator<any, any, any>
}
