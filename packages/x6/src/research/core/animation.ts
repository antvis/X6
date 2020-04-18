import { v } from '../../v'
import { KeyValue } from '../../types'
import { ObjectExt } from '../../util'
import { Timing, Interpolation } from '../animation'
import { Cell } from './cell'

export class Animation {
  protected readonly ids: { [path: string]: number } = {}

  constructor(protected readonly cell: Cell) {}

  get() {
    return Object.keys(this.ids)
  }

  start<T extends string | number | KeyValue<number>>(
    path: string | string[],
    target: T,
    options: Animation.Options = {},
    delim: string = '/',
  ) {
    const localOptions: Animation.Options = {
      delay: 10,
      duration: 100,
      timing: 'linear',
      ...options,
    }

    let timing = Timing.linear
    if (localOptions.timing != null) {
      if (typeof localOptions.timing === 'string') {
        timing = Timing[localOptions.timing]
      } else {
        timing = localOptions.timing
      }
    }

    const current = this.cell.getPropByPath<T>(path)
    const interpolation = localOptions.interpolation

    let interpolate: any

    if (interpolation) {
      interpolate = interpolation(current, target)
    } else if (typeof target === 'object') {
      interpolate = Interpolation.object(
        current as KeyValue<number>,
        target as KeyValue<number>,
      )
    } else if (typeof target === 'number') {
      interpolate = Interpolation.number(current as number, target)
    } else if (typeof target === 'string') {
      if (target[0] === '#') {
        interpolate = Interpolation.color(current as string, target)
      } else {
        interpolate = Interpolation.unit(current as string, target)
      }
    }

    let startTime = 0

    const pathStr = Array.isArray(path) ? path.join(delim) : path
    const setter = () => {
      let id
      let val

      const now = new Date().getTime()
      if (startTime === 0) {
        startTime = now
      }

      const elaspe = now - startTime
      let progress = elaspe / localOptions.duration!
      if (progress < 1) {
        this.ids[pathStr] = id = v.requestAnimationFrame(setter)
      } else {
        progress = 1
        delete this.ids[pathStr]
      }

      val = interpolate(timing(progress))
      options.transitionId = id

      this.cell.setPropByPath(
        Array.isArray(path) ? path : path.split(delim),
        val,
      )

      if (id == null) {
        this.cell.notify('transition:end', { cell: this.cell, path: pathStr })
      }
    }

    const initiator = (transition: FrameRequestCallback) => {
      this.stop(path, delim)
      this.ids[pathStr] = v.requestAnimationFrame(transition)
      this.cell.notify('transition:begin', { cell: this.cell, path: pathStr })
    }

    return setTimeout(() => {
      initiator(setter)
    }, options.delay)
  }

  stop(path: string | string[], delim: string = '/') {
    const paths = Array.isArray(path) ? path : path.split(delim)

    Object.keys(this.ids)
      .filter(key =>
        ObjectExt.isEqual(paths, key.split(delim).slice(0, paths.length)),
      )
      .forEach(key => {
        v.cancelAnimationFrame(this.ids[key])
        delete this.ids[key]
        this.cell.notify('transition:end', { cell: this.cell, path: key })
      })

    return this
  }
}

export namespace Animation {
  export interface Options extends KeyValue {
    delay?: number
    duration?: number
    timing?: Timing.Names | Timing.Definition
    interpolation?: <T>(from: T, to: T) => (time: number) => T
  }
}
