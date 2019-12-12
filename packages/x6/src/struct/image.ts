export class Image {
  constructor(
    /**
     * String that specifies the URL of the image.
     */
    public src: string,

    /**
     * Integer that specifies the width of the image.
     */
    public width: number,

    /**
     * Integer that specifies the height of the image.
     */
    public height: number,
  ) {}

  toString() {
    return this.src
  }

  valueOf() {
    return {
      src: this.src,
      width: this.width,
      height: this.height,
    }
  }
}

export namespace Image {
  export interface ImageLike {
    src: string
    width: number
    height: number
  }
}

export namespace Image {
  function parseViewBox(svg: string) {
    const matches = svg.match(/<svg[^>]*viewBox\s*=\s*(["']?)(.+?)\1[^>]*>/i)
    if (matches && matches[2]) {
      return matches[2].replace(/\s+/, ' ').split(' ')
    }
    return null
  }

  function getNumber(str: string) {
    const ret = parseFloat(str)
    return isNaN(ret) ? null : ret
  }

  export function fromSvg(
    svg: string,
    width?: number | null,
    height?: number | null,
  ) {
    let viewBox: string[] | null = null

    const getNumberFromViewBox = (index: number) => {
      if (viewBox == null) {
        viewBox = parseViewBox(svg)
      }
      if (viewBox != null) {
        return getNumber(viewBox[index])
      }
      return null
    }

    const getNumberFromMatches = (reg: RegExp) => {
      const matches = svg.match(reg)
      if (matches && matches[2]) {
        return getNumber(matches[2])
      }
      return null
    }

    let w = width
    if (w == null) {
      w = getNumberFromMatches(/<svg[^>]*width\s*=\s*(["']?)(.+?)\1[^>]*>/i)
    }

    if (w == null) {
      w = getNumberFromViewBox(2)
    }

    if (w == null) {
      throw new Error('Can not parse width from svg string')
    }

    let h = height
    if (h == null) {
      h = getNumberFromMatches(/<svg[^>]*height\s*=\s*(["']?)(.+?)\1[^>]*>/i)
    }

    if (h == null) {
      h = getNumberFromViewBox(3)
    }

    if (h == null) {
      throw new Error('Can not parse height from svg string')
    }

    const decoded = encodeURIComponent(svg)
      .replace(/'/g, '%27')
      .replace(/"/g, '%22')

    const header = 'data:image/svg+xml'
    const dataUrl = `${header},${decoded}`

    // let dataUrl
    // if (window.btoa != null) {
    //   const base64 = btoa(decoded)
    //   dataUrl = `${header};base64,${base64}`
    // } else {
    //   dataUrl = `${header},${decoded}`
    // }

    return new Image(dataUrl, w, h)
  }
}
