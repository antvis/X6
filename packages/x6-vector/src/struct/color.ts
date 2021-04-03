import { Num } from '../util/num'
import { Util } from './color-util'

export class Color implements Color.RGBALike {
  public r: number
  public g: number
  public b: number
  public a: number

  constructor()
  constructor(color: string)
  constructor(color: Color.RGBALike | Color.RGBA)
  constructor(r: number, g: number, b: number, a?: number)
  constructor(
    color?:
      | number
      | string
      | Color.RGBALike
      | Color.RGBA
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
    if (color == null) {
      return this.set(255, 255, 255, 1)
    }

    if (typeof color === 'number') {
      return this.set(color, g as number, b as number, a)
    }

    if (typeof color === 'string') {
      return Color.fromString(color) || this
    }

    if (Array.isArray(color)) {
      return this.set(color)
    }

    this.set(color.r, color.g, color.b, color.a == null ? 1 : color.a)
  }

  blend(start: Color, end: Color, weight: number) {
    return this.set(
      start.r + (end.r - start.r) * weight,
      start.g + (end.g - start.g) * weight,
      start.b + (end.b - start.b) * weight,
      start.a + (end.a - start.a) * weight,
    )
  }

  lighten(amount: number) {
    const rgba = Color.lighten(this.toArray(), amount)
    this.r = rgba[0]
    this.g = rgba[1]
    this.b = rgba[2]
    this.a = rgba[3]
    return this
  }

  darken(amount: number) {
    return this.lighten(-amount)
  }

  set(rgba: Color.RGBA): this
  set(r: number, g: number, b: number, a?: number): this
  set(arg0: number | Color.RGBA, arg1?: number, arg2?: number, arg3?: number) {
    const r = Array.isArray(arg0) ? arg0[0] : (arg0 as number)
    const g = Array.isArray(arg0) ? arg0[1] : (arg1 as number)
    const b = Array.isArray(arg0) ? arg0[2] : (arg2 as number)
    const a = Array.isArray(arg0) ? arg0[3] : (arg3 as number)
    this.r = Math.round(Num.clamp(r, 0, 255))
    this.g = Math.round(Num.clamp(g, 0, 255))
    this.b = Math.round(Num.clamp(b, 0, 255))
    this.a = a == null ? 1 : Num.clamp(a, 0, 1)
    return this
  }

  toHex() {
    const hex = ['r', 'g', 'b'].map((key: 'r' | 'g' | 'b') => {
      const str = this[key].toString(16)
      return str.length < 2 ? `0${str}` : str
    })
    return `#${hex.join('')}`
  }

  toRGBA(): Color.RGBA {
    return this.toArray()
  }

  toHSLA(): Color.HSLA {
    return Util.rgba2hsla(this.r, this.g, this.b, this.a)
  }

  toCSS(ignoreAlpha?: boolean) {
    const rgb = `${this.r},${this.g},${this.b}`
    return ignoreAlpha ? `rgb(${rgb})` : `rgba(${rgb},${this.a})`
  }

  toGrey() {
    return Color.makeGrey(Math.round((this.r + this.g + this.b) / 3), this.a)
  }

  toArray(): Color.RGBA {
    return [this.r, this.g, this.b, this.a]
  }

  toString() {
    return this.toCSS()
  }

  valueOf() {
    return this.toArray()
  }
}

export namespace Color {
  export type RGBA = Util.RGBA
  export type HSLA = Util.HSLA
  export interface RGBALike {
    r: number
    g: number
    b: number
    a?: number
  }

  export type Presets = keyof typeof Util.presets
  export const presets = Util.presets
}

export namespace Color {
  const rHex = /^#[a-f0-9]{3}$|^#[a-f0-9]{6}$/i
  const rRgb = /^rgba?\(([\s.,0-9]+)\)/
  const rHsl = /^hsla?\(([\s.,0-9]+)\)/

  export function isColor(val: any) {
    return isColorString(val) || isRgbLike(val) || val instanceof Color
  }

  export function isRgbLike(val: any): val is RGBALike {
    return (
      val != null &&
      typeof val === 'object' &&
      typeof val.r === 'number' &&
      typeof val.g === 'number' &&
      typeof val.b === 'number' &&
      (typeof val.a === 'undefined' || typeof val.a === 'number')
    )
  }

  export function isRgb(val: any) {
    return typeof val === 'string' && rRgb.test(val.toLowerCase())
  }

  export function isHsl(val: any) {
    return typeof val === 'string' && rHsl.test(val.toLowerCase())
  }

  export function isHex(val: any) {
    return typeof val === 'string' && rHex.test(val)
  }

  export function isColorString(val: any) {
    return isRgb(val) || isHex(val) || isHsl(val)
  }

  export function fromArray(arr: RGBA) {
    return new Color(arr)
  }

  export function fromHex(hex: string) {
    return isHex(hex) ? new Color([...Util.hex2rgb(hex), 1]) : null
  }

  export function fromRgb(rgba: string) {
    const matches = rgba.toLowerCase().match(rRgb)
    if (matches) {
      const arr = matches[1].split(/\s*,\s*/).map((v) => parseFloat(v))
      return fromArray(arr as Color.RGBA)
    }

    return null
  }

  export function fromHsl(color: string) {
    const matches = color.toLowerCase().match(rHsl)
    if (matches) {
      const arr = matches[1].split(/\s*,\s*/)
      const h = (((parseFloat(arr[0]) % 360) + 360) % 360) / 360
      const s = parseFloat(arr[1]) / 100
      const l = parseFloat(arr[2]) / 100
      const a = arr[3] == null ? 1 : parseFloat(arr[3])
      return new Color(Util.hsla2rgba(h, s, l, a))
    }

    return null
  }

  export function fromString(color: string) {
    if (color.startsWith('#')) {
      return fromHex(color)
    }

    if (color.startsWith('rgb')) {
      return fromRgb(color)
    }

    if (color.startsWith('hsl')) {
      return fromHsl(color)
    }

    const preset = Color.presets[color as Color.Presets]
    if (preset) {
      return fromHex(preset)
    }

    return null
  }

  export function makeGrey(g: number, a: number) {
    return Color.fromArray([g, g, g, a])
  }

  export function random(ignoreAlpha?: boolean) {
    return new Color(
      Math.round(Math.random() * 256),
      Math.round(Math.random() * 256),
      Math.round(Math.random() * 256),
      ignoreAlpha ? undefined : parseFloat(Math.random().toFixed(2)),
    )
  }

  export function randomHex() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  export function randomRgb(ignoreAlpha?: boolean) {
    return random(ignoreAlpha).toString()
  }

  export function invert(rgba: RGBA, bw?: boolean): RGBA
  export function invert(hex: string, bw?: boolean): string
  export function invert(color: string | RGBA, bw?: boolean) {
    if (typeof color === 'string') {
      const pound = color[0] === '#'
      const [r, g, b] = Util.hex2rgb(color)
      if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#ffffff'
      }

      return `${pound ? '#' : ''}${Util.rgb2hex(255 - r, 255 - g, 255 - b)}`
    }

    const r = color[0]
    const g = color[1]
    const b = color[2]
    const a = color[3]

    if (bw) {
      return r * 0.299 + g * 0.587 + b * 0.114 > 186
        ? [0, 0, 0, a]
        : [255, 255, 255, a]
    }

    return [255 - r, 255 - g, 255 - b, a]
  }

  export function lighten(rgba: RGBA, amt: number): RGBA
  export function lighten(hex: string, amt: number): string
  export function lighten(color: RGBA | string, amt: number) {
    return Util.lum(color, amt)
  }

  export function darken(rgba: RGBA, amt: number): RGBA
  export function darken(hex: string, amt: number): string
  export function darken(color: RGBA | string, amt: number) {
    return Util.lum(color, -amt)
  }
}
