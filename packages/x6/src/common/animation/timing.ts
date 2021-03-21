import { FunctionKeys } from 'utility-types'

export namespace Timing {
  export type Definition = (t: number) => number
  export type Names = FunctionKeys<typeof Timing>
}

export namespace Timing {
  export const linear: Definition = (t) => t
  export const quad: Definition = (t) => t * t
  export const cubic: Definition = (t) => t * t * t
  export const inout: Definition = (t) => {
    if (t <= 0) {
      return 0
    }

    if (t >= 1) {
      return 1
    }

    const t2 = t * t
    const t3 = t2 * t
    return 4 * (t < 0.5 ? t3 : 3 * (t - t2) + t3 - 0.75)
  }

  export const exponential: Definition = (t) => {
    return Math.pow(2, 10 * (t - 1)) // eslint-disable-line
  }

  export const bounce = ((t: number) => {
    // eslint-disable-next-line
    for (let a = 0, b = 1; 1; a += b, b /= 2) {
      if (t >= (7 - 4 * a) / 11) {
        const q = (11 - 6 * a - 11 * t) / 4
        return -q * q + b * b
      }
    }
  }) as Definition
}

export namespace Timing {
  export const decorators = {
    reverse(f: Definition): Definition {
      return (t) => 1 - f(1 - t)
    },
    reflect(f: Definition): Definition {
      return (t) => 0.5 * (t < 0.5 ? f(2 * t) : 2 - f(2 - 2 * t))
    },
    clamp(f: Definition, n = 0, x = 1): Definition {
      return (t) => {
        const r = f(t)
        return r < n ? n : r > x ? x : r
      }
    },
    back(s = 1.70158): Definition {
      return (t) => t * t * ((s + 1) * t - s)
    },
    elastic(x = 1.5): Definition {
      return (t) =>
        Math.pow(2, 10 * (t - 1)) * Math.cos(((20 * Math.PI * x) / 3) * t) // eslint-disable-line
    },
  }
}

export namespace Timing {
  // Slight acceleration from zero to full speed
  export function easeInSine(t: number) {
    return -1 * Math.cos(t * (Math.PI / 2)) + 1
  }

  // Slight deceleration at the end
  export function easeOutSine(t: number) {
    return Math.sin(t * (Math.PI / 2))
  }

  // Slight acceleration at beginning and slight deceleration at end
  export function easeInOutSine(t: number) {
    return -0.5 * (Math.cos(Math.PI * t) - 1)
  }

  // Accelerating from zero velocity
  export function easeInQuad(t: number) {
    return t * t
  }

  // Decelerating to zero velocity
  export function easeOutQuad(t: number) {
    return t * (2 - t)
  }

  // Acceleration until halfway, then deceleration
  export function easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  // Accelerating from zero velocity
  export function easeInCubic(t: number) {
    return t * t * t
  }

  // Decelerating to zero velocity
  export function easeOutCubic(t: number) {
    const t1 = t - 1
    return t1 * t1 * t1 + 1
  }

  // Acceleration until halfway, then deceleration
  export function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  // Accelerating from zero velocity
  export function easeInQuart(t: number) {
    return t * t * t * t
  }

  // Decelerating to zero velocity
  export function easeOutQuart(t: number) {
    const t1 = t - 1
    return 1 - t1 * t1 * t1 * t1
  }

  // Acceleration until halfway, then deceleration
  export function easeInOutQuart(t: number) {
    const t1 = t - 1
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * t1 * t1 * t1 * t1
  }

  // Accelerating from zero velocity
  export function easeInQuint(t: number) {
    return t * t * t * t * t
  }

  // Decelerating to zero velocity
  export function easeOutQuint(t: number) {
    const t1 = t - 1
    return 1 + t1 * t1 * t1 * t1 * t1
  }

  // Acceleration until halfway, then deceleration
  export function easeInOutQuint(t: number) {
    const t1 = t - 1
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * t1 * t1 * t1 * t1 * t1
  }

  // Accelerate exponentially until finish
  export function easeInExpo(t: number) {
    if (t === 0) {
      return 0
    }

    return Math.pow(2, 10 * (t - 1)) // eslint-disable-line
  }

  // Initial exponential acceleration slowing to stop
  export function easeOutExpo(t: number) {
    if (t === 1) {
      return 1
    }

    return -Math.pow(2, -10 * t) + 1 // eslint-disable-line
  }

  // Exponential acceleration and deceleration
  export function easeInOutExpo(t: number) {
    if (t === 0 || t === 1) {
      return t
    }

    const scaledTime = t * 2
    const scaledTime1 = scaledTime - 1

    if (scaledTime < 1) {
      return 0.5 * Math.pow(2, 10 * scaledTime1) // eslint-disable-line
    }

    return 0.5 * (-Math.pow(2, -10 * scaledTime1) + 2) // eslint-disable-line
  }

  // Increasing velocity until stop
  export function easeInCirc(t: number) {
    const scaledTime = t / 1
    return -1 * (Math.sqrt(1 - scaledTime * t) - 1)
  }

  // Start fast, decreasing velocity until stop
  export function easeOutCirc(t: number) {
    const t1 = t - 1
    return Math.sqrt(1 - t1 * t1)
  }

  // Fast increase in velocity, fast decrease in velocity
  export function easeInOutCirc(t: number) {
    const scaledTime = t * 2
    const scaledTime1 = scaledTime - 2

    if (scaledTime < 1) {
      return -0.5 * (Math.sqrt(1 - scaledTime * scaledTime) - 1)
    }

    return 0.5 * (Math.sqrt(1 - scaledTime1 * scaledTime1) + 1)
  }

  // Slow movement backwards then fast snap to finish
  export function easeInBack(t: number, magnitude = 1.70158) {
    return t * t * ((magnitude + 1) * t - magnitude)
  }

  // Fast snap to backwards point then slow resolve to finish
  export function easeOutBack(t: number, magnitude = 1.70158) {
    const scaledTime = t / 1 - 1

    return (
      scaledTime * scaledTime * ((magnitude + 1) * scaledTime + magnitude) + 1
    )
  }

  // Slow movement backwards, fast snap to past finish, slow resolve to finish
  export function easeInOutBack(t: number, magnitude = 1.70158) {
    const scaledTime = t * 2
    const scaledTime2 = scaledTime - 2

    const s = magnitude * 1.525

    if (scaledTime < 1) {
      return 0.5 * scaledTime * scaledTime * ((s + 1) * scaledTime - s)
    }

    return 0.5 * (scaledTime2 * scaledTime2 * ((s + 1) * scaledTime2 + s) + 2)
  }

  // Bounces slowly then quickly to finish
  export function easeInElastic(t: number, magnitude = 0.7) {
    if (t === 0 || t === 1) {
      return t
    }

    const scaledTime = t / 1
    const scaledTime1 = scaledTime - 1

    const p = 1 - magnitude
    const s = (p / (2 * Math.PI)) * Math.asin(1)

    return -(
      Math.pow(2, 10 * scaledTime1) * // eslint-disable-line
      Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p)
    )
  }

  // Fast acceleration, bounces to zero
  export function easeOutElastic(t: number, magnitude = 0.7) {
    const p = 1 - magnitude
    const scaledTime = t * 2

    if (t === 0 || t === 1) {
      return t
    }

    const s = (p / (2 * Math.PI)) * Math.asin(1)
    return (
      Math.pow(2, -10 * scaledTime) * // eslint-disable-line
        Math.sin(((scaledTime - s) * (2 * Math.PI)) / p) +
      1
    )
  }

  // Slow start and end, two bounces sandwich a fast motion
  export function easeInOutElastic(t: number, magnitude = 0.65) {
    const p = 1 - magnitude

    if (t === 0 || t === 1) {
      return t
    }

    const scaledTime = t * 2
    const scaledTime1 = scaledTime - 1

    const s = (p / (2 * Math.PI)) * Math.asin(1)

    if (scaledTime < 1) {
      return (
        -0.5 *
        (Math.pow(2, 10 * scaledTime1) * // eslint-disable-line
          Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p))
      )
    }

    return (
      Math.pow(2, -10 * scaledTime1) * // eslint-disable-line
        Math.sin(((scaledTime1 - s) * (2 * Math.PI)) / p) *
        0.5 +
      1
    )
  }

  // Bounce to completion
  export function easeOutBounce(t: number) {
    const scaledTime = t / 1

    if (scaledTime < 1 / 2.75) {
      return 7.5625 * scaledTime * scaledTime
    }
    if (scaledTime < 2 / 2.75) {
      const scaledTime2 = scaledTime - 1.5 / 2.75
      return 7.5625 * scaledTime2 * scaledTime2 + 0.75
    }
    if (scaledTime < 2.5 / 2.75) {
      const scaledTime2 = scaledTime - 2.25 / 2.75
      return 7.5625 * scaledTime2 * scaledTime2 + 0.9375
    }
    {
      const scaledTime2 = scaledTime - 2.625 / 2.75
      return 7.5625 * scaledTime2 * scaledTime2 + 0.984375
    }
  }

  // Bounce increasing in velocity until completion
  export function easeInBounce(t: number) {
    return 1 - easeOutBounce(1 - t)
  }

  // Bounce in and bounce out
  export function easeInOutBounce(t: number) {
    if (t < 0.5) {
      return easeInBounce(t * 2) * 0.5
    }

    return easeOutBounce(t * 2 - 1) * 0.5 + 0.5
  }
}
