import { Interp, type KeyValue, ObjectExt, Timing } from '../common'
import type { Cell } from './cell'

export class Animation {
  protected readonly ids: { [path: string]: number } = {}
  protected readonly cache: {
    [path: string]: {
      startValue: AnimationTargetValue
      targetValue: AnimationTargetValue
      options: AnimationStartOptions<AnimationTargetValue>
    }
  } = {}

  constructor(protected readonly cell: Cell) {}

  get() {
    return Object.keys(this.ids)
  }

  start<T extends AnimationTargetValue>(
    path: string | string[],
    targetValue: T,
    options: AnimationStartOptions<T> = {},
    delim = '/',
  ): () => void {
    const startValue = this.cell.getPropByPath<T>(path)
    const localOptions = ObjectExt.defaults(options, defaultOptions)
    const timing = this.getTiming(localOptions.timing)
    const interpolate = this.getInterp<T>(
      localOptions.interp,
      startValue,
      targetValue,
    )

    let startTime = 0
    const key = Array.isArray(path) ? path.join(delim) : path
    const paths = Array.isArray(path) ? path : path.split(delim)

    const calculateDirectionProgress = (
      timeFraction: number,
      iterationIndex: number,
    ) => {
      const isOdd = iterationIndex % 2 === 1
      const dir = localOptions.direction

      if (
        dir === 'normal' ||
        // alternate 时迭代次数为奇数时正向，偶数时反向
        (dir === 'alternate' && !isOdd) ||
        // alternate-reverse 时迭代次数为偶数时正向，奇数时反向
        (dir === 'alternate-reverse' && isOdd)
      ) {
        return timeFraction
      } else {
        return 1 - timeFraction
      }
    }

    const updateProgressState = (progress: number) => {
      const currentValue = interpolate(timing(progress)) as T
      this.cell.setPropByPath(paths, currentValue)

      if (options.progress) {
        options.progress({ progress, currentValue, ...this.getArgs<T>(key) })
      }
    }

    const iterate = () => {
      const now = Date.now()
      if (startTime === 0) {
        startTime = now
      }

      const { duration, iterations, fill } = localOptions
      const elapsed = now - startTime
      const iterationIndex = Math.floor(elapsed / duration)
      const localTime = elapsed % duration
      const timeFraction = localTime / duration

      let progress = calculateDirectionProgress(timeFraction, iterationIndex)

      if (iterationIndex < iterations) {
        this.ids[key] = requestAnimationFrame(iterate)

        updateProgressState(progress)
      } else {
        // 动画结束
        if (fill === 'forwards') {
          progress = calculateDirectionProgress(1, iterationIndex - 1)
        } else if (fill === 'none') {
          progress = 0
        }
        progress = Math.round(progress)

        updateProgressState(progress)

        this.cell.notify('transition:complete', this.getArgs<T>(key))
        options.complete?.(this.getArgs<T>(key))

        this.cell.notify('transition:finish', this.getArgs<T>(key))
        options.finish?.(this.getArgs<T>(key))
        this.clean(key)
      }
    }

    setTimeout(() => {
      this.stop(path, undefined, delim)
      this.cache[key] = { startValue, targetValue, options: localOptions }
      this.ids[key] = window.requestAnimationFrame(iterate)

      this.cell.notify('transition:start', this.getArgs<T>(key))
      options.start?.(this.getArgs<T>(key))
    }, options.delay)

    return this.stop.bind(this, path, options, delim)
  }

  stop<T extends AnimationTargetValue>(
    path: string | string[],
    options: AnimationStopOptions<T> = {},
    delim = '/',
  ) {
    const paths = Array.isArray(path) ? path : path.split(delim)
    Object.keys(this.ids)
      .filter((key) =>
        ObjectExt.isEqual(paths, key.split(delim).slice(0, paths.length)),
      )
      .forEach((key) => {
        cancelAnimationFrame(this.ids[key])
        const data = this.cache[key]
        const commonArgs = this.getArgs<T>(key)
        const localOptions = { ...data.options, ...options }
        const jumpedToEnd = localOptions.jumpedToEnd
        if (jumpedToEnd && data.targetValue != null) {
          this.cell.setPropByPath(key, data.targetValue)

          this.cell.notify('transition:end', { ...commonArgs })
          this.cell.notify('transition:complete', { ...commonArgs })
          localOptions.complete?.(commonArgs)
        }

        const stopArgs = { jumpedToEnd, ...commonArgs }
        this.cell.notify('transition:stop', { ...stopArgs })
        localOptions.stop?.(stopArgs)

        this.cell.notify('transition:finish', { ...commonArgs })
        localOptions.finish?.(commonArgs)

        this.clean(key)
      })

    return this
  }

  private clean(key: string) {
    delete this.ids[key]
    delete this.cache[key]
  }

  private getTiming(timing: Timing.Names | Timing.Definition) {
    return typeof timing === 'string' ? Timing[timing] : timing
  }

  private getInterp<T extends AnimationTargetValue>(
    interp: Interp.Definition<T> | undefined,
    startValue: T,
    targetValue: T,
  ) {
    if (interp) {
      return interp(startValue, targetValue)
    }

    if (typeof targetValue === 'number') {
      return Interp.number(startValue as number, targetValue)
    }

    if (typeof targetValue === 'string') {
      if (targetValue[0] === '#') {
        return Interp.color(startValue as string, targetValue)
      }

      return Interp.unit(startValue as string, targetValue)
    }

    return Interp.object(
      startValue as KeyValue<number>,
      targetValue as KeyValue<number>,
    )
  }

  private getArgs<T extends AnimationTargetValue>(
    key: string,
  ): AnimationCallbackArgs<T> {
    const data = this.cache[key]
    return {
      path: key,
      startValue: data.startValue,
      targetValue: data.targetValue,
      cell: this.cell,
    }
  }
}

export interface AnimationBaseOptions {
  delay: number
  duration: number
  timing: Timing.Names | Timing.Definition
  iterations?: number
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  fill?: 'none' | 'forwards'
}

export type AnimationTargetValue = string | number | KeyValue<number>

export interface AnimationCallbackArgs<T> {
  cell: Cell
  path: string
  startValue: T
  targetValue: T
}

export interface AnimationProgressArgs<T> extends AnimationCallbackArgs<T> {
  progress: number
  currentValue: T
}

export interface AnimationStopArgs<T> extends AnimationCallbackArgs<T> {
  jumpedToEnd?: boolean
}

export interface AnimationStartOptions<T>
  extends Partial<AnimationBaseOptions>,
    AnimationStopOptions<T> {
  interp?: Interp.Definition<T>
  /**
   * A function to call when the animation begins.
   */
  start?: (options: AnimationCallbackArgs<T>) => void
  /**
   * A function to be called after each step of the animation, only once per
   * animated element regardless of the number of animated properties.
   */
  progress?: (options: AnimationProgressArgs<T>) => void
}

export interface AnimationStopOptions<T> {
  /**
   * A Boolean indicating whether to complete the animation immediately.
   * Defaults to `false`.
   */
  jumpedToEnd?: boolean
  /**
   * A function that is called once the animation completes.
   */
  complete?: (options: AnimationCallbackArgs<T>) => void
  /**
   * A function to be called when the animation stops.
   */
  stop?: (options: AnimationStopArgs<T>) => void
  /**
   * A function to be called when the animation completes or stops.
   */
  finish?: (options: AnimationCallbackArgs<T>) => void
}

export const defaultOptions: AnimationBaseOptions = {
  delay: 10,
  duration: 100,
  timing: 'linear',
  iterations: 1,
  direction: 'normal',
  fill: 'none',
}
