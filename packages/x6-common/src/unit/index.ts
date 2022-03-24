let millimeterSize: number

const supportedUnits = {
  px(val: number) {
    return val
  },
  mm(val: number) {
    return millimeterSize * val
  },
  cm(val: number) {
    return millimeterSize * val * 10
  },
  in(val: number) {
    return millimeterSize * val * 25.4
  },
  pt(val: number) {
    return millimeterSize * ((25.4 * val) / 72)
  },
  pc(val: number) {
    return millimeterSize * ((25.4 * val) / 6)
  },
}

export type Unit = keyof typeof supportedUnits

// eslint-disable-next-line
export namespace Unit {
  export function measure(cssWidth: string, cssHeight: string, unit?: Unit) {
    const div = document.createElement('div')
    const style = div.style
    style.display = 'inline-block'
    style.position = 'absolute'
    style.left = '-15000px'
    style.top = '-15000px'
    style.width = cssWidth + (unit || 'px')
    style.height = cssHeight + (unit || 'px')
    document.body.appendChild(div)

    const rect = div.getBoundingClientRect()
    const size = {
      width: rect.width || 0,
      height: rect.height || 0,
    }

    document.body.removeChild(div)

    return size
  }

  export function toPx(val: number, unit?: Unit) {
    if (millimeterSize == null) {
      millimeterSize = measure('1', '1', 'mm').width
    }

    const convert = unit ? supportedUnits[unit] : null
    if (convert) {
      return convert(val)
    }

    return val
  }
}
