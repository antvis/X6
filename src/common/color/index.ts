import { NumberExt } from '../number'
import { ObjectExt } from '../object'
import { hex2rgb, hsla2rgba, lighten, named, rgba2hsla } from './color'
import type { HSLA, RGBA } from './type'

/**
 * Color class for color parsing and manipulation
 */
export class Color {
  public r: number
  public g: number
  public b: number
  public a: number

  private static DEFAULT_COLOR = new Color(255, 255, 255, 1)

  public static random(ignoreAlpha?: boolean): Color {
    return new Color(
      Math.round(Math.random() * 256),
      Math.round(Math.random() * 256),
      Math.round(Math.random() * 256),
      ignoreAlpha ? undefined : parseFloat(Math.random().toFixed(2)),
    )
  }

  public static fromArray(arr: RGBA): Color {
    return new Color(arr)
  }

  public static fromHex(color: string): Color {
    return new Color([...hex2rgb(color), 1])
  }

  public static fromRGBA(color: string): Color {
    const matches = color.toLowerCase().match(/^rgba?\(([\s.,0-9]+)\)/)
    if (matches) {
      const arr = matches[1].split(/\s*,\s*/).map((v) => parseInt(v, 10))
      return new Color(arr as RGBA)
    }

    return Color.DEFAULT_COLOR
  }

  public static fromHSLA(color: string): Color {
    const matches = color.toLowerCase().match(/^hsla?\(([\s.,0-9]+)\)/)
    if (matches) {
      const arr = matches[2].split(/\s*,\s*/)
      const h = (((parseFloat(arr[0]) % 360) + 360) % 360) / 360
      const s = parseFloat(arr[1]) / 100
      const l = parseFloat(arr[2]) / 100
      const a = arr[3] == null ? 1 : parseInt(arr[3], 10)
      return new Color(hsla2rgba(h, s, l, a))
    }

    return Color.DEFAULT_COLOR
  }

  public static fromString(color: string): Color {
    if (color.startsWith('#')) {
      return Color.fromHex(color)
    }

    if (color.startsWith('rgb')) {
      return Color.fromRGBA(color)
    }

    const preset = (named as any)[color]
    if (preset) {
      return Color.fromHex(preset)
    }

    return Color.fromHSLA(color)
  }

  public static makeGrey(g: number, a: number) {
    return Color.fromArray([g, g, g, a])
  }

  public static randomRGBA(ignoreAlpha?: boolean) {
    return Color.random(ignoreAlpha).toString()
  }

  constructor()
  constructor(color: string)
  constructor(color: RGBA)
  constructor(color: { r: number; g: number; b: number; a?: number })
  constructor(r: number, g: number, b: number, a?: number)
  constructor(
    color?:
      | number
      | string
      | RGBA
      | {
          r: number
          g: number
          b: number
          a?: number
        },
    g?: number,
    b?: number,
    a?: number,
  ) {
    if (color === null || color === undefined) {
      this.set(255, 255, 255, 1)
    } else if (typeof color === 'number') {
      this.set(color, g as number, b as number, a)
    } else if (typeof color === 'string') {
      this.set(Color.fromString(color).toRGBA())
    } else if (Array.isArray(color)) {
      this.set(color)
    } else if (ObjectExt.isObject(color)) {
      this.set(color.r, color.g, color.b, NumberExt.clamp(color.a, 0, 1))
    } else {
      this.set(255, 255, 255, 1)
    }
  }

  blend(start: Color, end: Color, weight: number) {
    this.set(
      start.r + (end.r - start.r) * weight,
      start.g + (end.g - start.g) * weight,
      start.b + (end.b - start.b) * weight,
      start.a + (end.a - start.a) * weight,
    )
  }

  lighten(amount: number) {
    const rgba = lighten(this.toArray(), amount)
    this.r = rgba[0]
    this.g = rgba[1]
    this.b = rgba[2]
    this.a = rgba[3]
  }

  darken(amount: number) {
    this.lighten(-amount)
  }

  set(rgba: RGBA): this
  set(r: number, g: number, b: number, a?: number): this
  set(arg0: number | RGBA, arg1?: number, arg2?: number, arg3?: number) {
    const r = Array.isArray(arg0) ? arg0[0] : (arg0 as number)
    const g = Array.isArray(arg0) ? arg0[1] : (arg1 as number)
    const b = Array.isArray(arg0) ? arg0[2] : (arg2 as number)
    const a = Array.isArray(arg0) ? arg0[3] : (arg3 as number)
    this.r = Math.round(NumberExt.clamp(r, 0, 255))
    this.g = Math.round(NumberExt.clamp(g, 0, 255))
    this.b = Math.round(NumberExt.clamp(b, 0, 255))
    this.a = a == null ? 1 : NumberExt.clamp(a, 0, 1)
    return this
  }

  toHex() {
    const hex = ['r', 'g', 'b'].map((key: 'r' | 'g' | 'b') => {
      const str = this[key].toString(16)
      return str.length < 2 ? `0${str}` : str
    })
    return `#${hex.join('')}`
  }

  toRGBA(): RGBA {
    return this.toArray()
  }

  toHSLA(): HSLA {
    return rgba2hsla(this.r, this.g, this.b, this.a)
  }

  toCSS(ignoreAlpha?: boolean) {
    const rgb = `${this.r},${this.g},${this.b}`
    return ignoreAlpha ? `rgb(${rgb})` : `rgba(${rgb},${this.a})`
  }

  toGrey() {
    return Color.makeGrey(Math.round((this.r + this.g + this.b) / 3), this.a)
  }

  toArray(): RGBA {
    return [this.r, this.g, this.b, this.a]
  }

  toString() {
    return this.toCSS()
  }
}
