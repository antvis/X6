export namespace Interp {
  export type Definition<T> = (from: T, to: T) => (time: number) => T
}

export namespace Interp {
  export const number: Definition<number> = (a, b) => {
    const d = b - a
    return (t: number) => {
      return a + d * t
    }
  }

  export const object: Definition<{ [key: string]: number }> = (a, b) => {
    const keys = Object.keys(a)
    return (t) => {
      const ret: { [key: string]: number } = {}
      for (let i = keys.length - 1; i !== -1; i -= 1) {
        const key = keys[i]
        ret[key] = a[key] + (b[key] - a[key]) * t
      }
      return ret
    }
  }

  export const unit: Definition<string> = (a, b) => {
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

    return (t) => {
      return (aa + d * t).toFixed(precision) + u
    }
  }

  export const color: Definition<string> = (a, b) => {
    const ca = parseInt(a.slice(1), 16)
    const cb = parseInt(b.slice(1), 16)
    const ra = ca & 0x0000ff
    const rd = (cb & 0x0000ff) - ra
    const ga = ca & 0x00ff00
    const gd = (cb & 0x00ff00) - ga
    const ba = ca & 0xff0000
    const bd = (cb & 0xff0000) - ba

    return (t) => {
      const r = (ra + rd * t) & 0x000000ff
      const g = (ga + gd * t) & 0x0000ff00
      const b = (ba + bd * t) & 0x00ff0000
      return `#${((1 << 24) | r | g | b).toString(16).slice(1)}`
    }
  }
}
