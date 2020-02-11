export class Transition {}

export namespace Transition {
  export const timing = {
    linear(t: number) {
      return t
    },

    quad(t: number) {
      return t * t
    },

    cubic(t: number) {
      return t * t * t
    },

    inout(t: number) {
      if (t <= 0) return 0
      if (t >= 1) return 1
      const t2 = t * t
      const t3 = t2 * t
      return 4 * (t < 0.5 ? t3 : 3 * (t - t2) + t3 - 0.75)
    },

    exponential(t: number) {
      return Math.pow(2, 10 * (t - 1))
    },

    bounce(t: number) {
      for (let a = 0, b = 1; 1; a += b, b /= 2) {
        if (t >= (7 - 4 * a) / 11) {
          const q = (11 - 6 * a - 11 * t) / 4
          return -q * q + b * b
        }
      }
    },

    reverse(f: (v: number) => number) {
      return (t: number) => {
        return 1 - f(1 - t)
      }
    },

    reflect(f: (v: number) => number) {
      return (t: number) => {
        return 0.5 * (t < 0.5 ? f(2 * t) : 2 - f(2 - 2 * t))
      }
    },

    clamp(f: (v: number) => number, n: number = 0, x: number = 1) {
      return (t: number) => {
        const r = f(t)
        return r < n ? n : r > x ? x : r
      }
    },

    back(s: number = 1.70158) {
      return (t: number) => {
        return t * t * ((s + 1) * t - s)
      }
    },

    elastic(x: number = 1.5) {
      return (t: number) => {
        return (
          Math.pow(2, 10 * (t - 1)) * Math.cos(((20 * Math.PI * x) / 3) * t)
        )
      }
    },
  }

  export const interpolate = {
    number(a: number, b: number) {
      const d = b - a
      return (t: number) => {
        return a + d * t
      }
    },

    object(a: { [key: string]: number }, b: { [key: string]: number }) {
      const keys = Object.keys(a)
      return (t: number) => {
        const ret: { [key: string]: number } = {}
        for (let i = keys.length - 1; i !== -1; i -= 1) {
          const key = keys[i]
          ret[key] = a[key] + (b[key] - a[key]) * t
        }
        return ret
      }
    },

    hexColor(a: string, b: string) {
      const ca = parseInt(a.slice(1), 16)
      const cb = parseInt(b.slice(1), 16)
      const ra = ca & 0x0000ff
      const rd = (cb & 0x0000ff) - ra
      const ga = ca & 0x00ff00
      const gd = (cb & 0x00ff00) - ga
      const ba = ca & 0xff0000
      const bd = (cb & 0xff0000) - ba

      return (t: number) => {
        const r = (ra + rd * t) & 0x000000ff
        const g = (ga + gd * t) & 0x0000ff00
        const b = (ba + bd * t) & 0x00ff0000
        return `#${((1 << 24) | r | g | b).toString(16).slice(1)}`
      }
    },

    unit(a: string, b: string) {
      const reg = /(-?[0-9]*.[0-9]*)(px|em|cm|mm|in|pt|pc|%)/
      const ma = reg.exec(a)
      const mb = reg.exec(b)

      const pb = mb ? mb[1] : ''
      const aa = ma ? +ma[1] : 0
      const bb = mb ? +mb[1] : 0

      const index = pb.indexOf('.')
      const precision = index > 0 ? pb[1].length - index - 1 : 0

      const d = bb - aa
      const u = ma ? ma[2] : ''

      return (t: number) => {
        return (aa + d * t).toFixed(precision) + u
      }
    },
  }
}
