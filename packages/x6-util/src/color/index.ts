export namespace Color {
  export function isValid(color?: string | null): color is string {
    return color != null && color !== 'none'
  }

  export function random() {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i += 1) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  export function invert(hex: string, bw: boolean) {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1) // tslint:disable-line
    }

    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      // tslint:disable-next-line
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }

    if (hex.length !== 6) {
      throw new Error('Invalid hex color.')
    }

    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)

    if (bw) {
      // http://stackoverflow.com/a/3943023/112731
      return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF'
    }

    // invert color components
    const rr = (255 - r).toString(16)
    const gg = (255 - g).toString(16)
    const bb = (255 - b).toString(16)

    // pad each with zeros and return
    return `#${pad(rr)}${pad(gg)}${pad(bb)}`
  }

  function pad(str: string, len: number = 2) {
    let zeros = ''

    if (str.length < len) {
      for (let i = 0; i < len; i += 1) {
        zeros += '0'
      }
    }

    return (zeros + str).slice(-len)
  }
}
