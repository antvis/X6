import { NumberExt } from '../util/number'

export class Color {
  public r: number
  public g: number
  public b: number
  public a: number

  constructor()
  constructor(color: string)
  constructor(color: Color.RGBA)
  constructor(r: number, g: number, b: number, a?: number)
  constructor(
    color?:
      | number
      | string
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
    this.set(
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
  }

  darken(amount: number) {
    this.lighten(-amount)
  }

  set(rgba: Color.RGBA): this
  set(r: number, g: number, b: number, a?: number): this
  set(arg0: number | Color.RGBA, arg1?: number, arg2?: number, arg3?: number) {
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

  toRGBA(): Color.RGBA {
    return this.toArray()
  }

  toHSLA(): Color.HSLA {
    return Color.rgba2hsla(this.r, this.g, this.b, this.a)
  }

  toCSS(ignoreAlpha?: boolean) {
    const rgb = `${this.r},${this.g},${this.b},`
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
}

export namespace Color {
  export type RGBA = [number, number, number, number]
  export type HSLA = [number, number, number, number]

  export function fromArray(arr: RGBA) {
    return new Color(arr)
  }

  export function fromHex(color: string) {
    return new Color([...hex2rgb(color), 1])
  }

  export function fromRGBA(color: string) {
    const matches = color.toLowerCase().match(/^rgba?\(([\s.,0-9]+)\)/)
    if (matches) {
      const arr = matches[1].split(/\s*,\s*/).map((v) => parseInt(v, 10))
      return new Color(arr as Color.RGBA)
    }

    return null
  }

  function hue2rgb(m1: number, m2: number, h: number) {
    if (h < 0) {
      ++h // eslint-disable-line
    }
    if (h > 1) {
      --h // eslint-disable-line
    }

    const h6 = 6 * h
    if (h6 < 1) {
      return m1 + (m2 - m1) * h6
    }
    if (2 * h < 1) {
      return m2
    }
    if (3 * h < 2) {
      return m1 + (m2 - m1) * (2 / 3 - h) * 6
    }
    return m1
  }

  export function fromHSLA(color: string) {
    const matches = color.toLowerCase().match(/^hsla?\(([\s.,0-9]+)\)/)
    if (matches) {
      const arr = matches[2].split(/\s*,\s*/)
      const h = (((parseFloat(arr[0]) % 360) + 360) % 360) / 360
      const s = parseFloat(arr[1]) / 100
      const l = parseFloat(arr[2]) / 100
      const a = arr[3] == null ? 1 : parseInt(arr[3], 10)
      return new Color(hsla2rgba(h, s, l, a))
    }

    return null
  }

  export function fromString(color: string) {
    if (color.startsWith('#')) {
      return fromHex(color)
    }

    if (color.startsWith('rgb')) {
      return fromRGBA(color)
    }

    const preset = (Color.named as any)[color]
    if (preset) {
      return fromHex(preset)
    }

    return fromHSLA(color)
  }

  export function makeGrey(g: number, a: number) {
    return Color.fromArray([g, g, g, a])
  }

  export function rgba2hsla(rgba: RGBA): HSLA
  export function rgba2hsla(r: number, g: number, b: number, a?: number): HSLA
  export function rgba2hsla(
    arg0: number | RGBA,
    arg1?: number,
    arg2?: number,
    arg3?: number,
  ): HSLA {
    const r = Array.isArray(arg0) ? arg0[0] : (arg0 as number)
    const g = Array.isArray(arg0) ? arg0[1] : (arg1 as number)
    const b = Array.isArray(arg0) ? arg0[2] : (arg2 as number)
    const a = Array.isArray(arg0) ? arg0[3] : (arg3 as number)

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const l = (max + min) / 2

    let h = 0
    let s = 0

    if (min !== max) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
        default:
          break
      }
      h /= 6
    }

    return [h, s, l, a == null ? 1 : a]
  }

  export function hsla2rgba(hsla: HSLA): RGBA
  export function hsla2rgba(h: number, s: number, l: number, a?: number): RGBA
  export function hsla2rgba(
    arg0: number | HSLA,
    arg1?: number,
    arg2?: number,
    arg3?: number,
  ): RGBA {
    const h = Array.isArray(arg0) ? arg0[0] : (arg0 as number)
    const s = Array.isArray(arg0) ? arg0[1] : (arg1 as number)
    const l = Array.isArray(arg0) ? arg0[2] : (arg2 as number)
    const a = Array.isArray(arg0) ? arg0[3] : (arg3 as number)

    const m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s
    const m1 = 2 * l - m2
    return [
      hue2rgb(m1, m2, h + 1 / 3) * 256,
      hue2rgb(m1, m2, h) * 256,
      hue2rgb(m1, m2, h - 1 / 3) * 256,
      a == null ? 1 : a,
    ]
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

  export function randomRGBA(ignoreAlpha?: boolean) {
    return random(ignoreAlpha).toString()
  }

  export function invert(rgba: RGBA, bw: boolean): RGBA
  export function invert(hex: string, bw: boolean): string
  export function invert(color: string | RGBA, bw: boolean) {
    if (typeof color === 'string') {
      const pound = color[0] === '#'
      const [r, g, b] = hex2rgb(color)
      if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#ffffff'
      }

      return `${pound ? '#' : ''}${rgb2hex(255 - r, 255 - g, 255 - b)}`
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

  function hex2rgb(hex: string): [number, number, number] {
    const color = hex.indexOf('#') === 0 ? hex : `#${hex}`
    let val = Number(`0x${color.substr(1)}`)
    if (!(color.length === 4 || color.length === 7) || Number.isNaN(val)) {
      throw new Error('Invalid hex color.')
    }

    const bits = color.length === 4 ? 4 : 8
    const mask = (1 << bits) - 1
    const bgr = ['b', 'g', 'r'].map(() => {
      const c = val & mask
      val >>= bits
      return bits === 4 ? 17 * c : c
    })

    return [bgr[2], bgr[1], bgr[0]]
  }

  function rgb2hex(r: number, g: number, b: number) {
    const pad = (hex: string) => (hex.length < 2 ? `0${hex}` : hex)
    return `${pad(r.toString(16))}${pad(g.toString(16))}${pad(b.toString(16))}`
  }

  export function lighten(rgba: RGBA, amt: number): RGBA
  export function lighten(hex: string, amt: number): string
  export function lighten(color: RGBA | string, amt: number) {
    return lum(color, amt)
  }

  export function darken(rgba: RGBA, amt: number): RGBA
  export function darken(hex: string, amt: number): string
  export function darken(color: RGBA | string, amt: number) {
    return lum(color, -amt)
  }

  function lum(color: RGBA | string, amt: number): RGBA | string {
    if (typeof color === 'string') {
      const pound = color[0] === '#'
      const num = parseInt(pound ? color.substr(1) : color, 16)
      const r = NumberExt.clamp((num >> 16) + amt, 0, 255)
      const g = NumberExt.clamp(((num >> 8) & 0x00ff) + amt, 0, 255)
      const b = NumberExt.clamp((num & 0x0000ff) + amt, 0, 255)

      return `${pound ? '#' : ''}${(b | (g << 8) | (r << 16)).toString(16)}`
    }

    const hex = rgb2hex(color[0], color[1], color[2])
    const arr = hex2rgb(lum(hex, amt) as string)

    return [arr[0], arr[1], arr[2], color[3]]
  }
}

export namespace Color {
  export const named = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    burntsienna: '#ea7e5d',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
  }
}
