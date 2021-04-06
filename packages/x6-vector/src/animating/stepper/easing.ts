import { Stepper } from './stepper'

export class Easing extends Stepper {
  protected readonly ease: Easing.Definition

  constructor()
  constructor(ease: Easing.Names)
  constructor(ease: Easing.Definition)
  constructor(ease?: Easing.Names | Easing.Definition)
  constructor(ease: Easing.Names | Easing.Definition = 'linear') {
    super()
    if (typeof ease === 'string') {
      this.ease = Easing.presets[ease] || Easing.presets.linear
    } else {
      this.ease = ease
    }
  }

  step(from: number, to: number, pos: number): number
  step(from: string, to: string, pos: number): string
  step(from: string | number, to: string | number, pos: number) {
    if (typeof from !== 'number') {
      return pos < 1 ? from : to
    }
    return +from + (+to - +from) * this.ease(pos)
  }
}

export namespace Easing {
  export type Definition = (t: number) => number
  export type Names = keyof typeof presets

  export const presets = {
    linear: (pos: number) => pos,
    easeOut: (pos: number) => Math.sin((pos * Math.PI) / 2),
    easeIn: (pos: number) => -Math.cos((pos * Math.PI) / 2) + 1,
    easeInOut: (pos: number) => -Math.cos(pos * Math.PI) / 2 + 0.5,
  }

  export const factories = {
    // see https://www.w3.org/TR/css-easing-1/#cubic-bezier-algo
    bezier(x1: number, y1: number, x2: number, y2: number) {
      return (t: number) => {
        if (t < 0) {
          if (x1 > 0) {
            return (y1 / x1) * t
          }

          if (x2 > 0) {
            return (y2 / x2) * t
          }

          return 0
        }

        if (t > 1) {
          if (x2 < 1) {
            return ((1 - y2) / (1 - x2)) * t + (y2 - x2) / (1 - x2)
          }
          if (x1 < 1) {
            return ((1 - y1) / (1 - x1)) * t + (y1 - x1) / (1 - x1)
          }
          return 1
        }

        return 3 * t * (1 - t) ** 2 * y1 + 3 * t ** 2 * (1 - t) * y2 + t ** 3
      }
    },
    // see https://www.w3.org/TR/css-easing-1/#step-timing-function-algo
    steps(
      steps: number,
      stepPosition:
        | 'start'
        | 'end'
        | 'both'
        | 'none'
        | 'jump-start'
        | 'jump-end' = 'end',
    ) {
      // deal with "jump-" prefix
      const position = stepPosition.split('-').reverse()[0]

      let jumps = steps
      if (position === 'none') {
        jumps -= 1
      } else if (position === 'both') {
        jumps += 1
      }

      // The beforeFlag is essentially useless
      return (t: number, beforeFlag = false) => {
        // Step is called currentStep in referenced url
        let step = Math.floor(t * steps)
        const jumping = (t * step) % 1 === 0

        if (position === 'start' || position === 'both') {
          step += 1
        }

        if (beforeFlag && jumping) {
          step -= 1
        }

        if (t >= 0 && step < 0) {
          step = 0
        }

        if (t <= 1 && step > jumps) {
          step = jumps
        }

        return step / jumps
      }
    },
  }
}
