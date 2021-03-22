import jQuery from 'jquery'

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
    const div = jQuery('<div/>')
      .css({
        display: 'inline-block',
        position: 'absolute',
        left: -15000,
        top: -15000,
        width: cssWidth + (unit || ''),
        height: cssHeight + (unit || ''),
      })
      .appendTo(document.body)

    const size = {
      width: div.width() || 0,
      height: div.height() || 0,
    }

    div.remove()

    return size
  }

  export function toPx(val: number, unit?: Unit) {
    if (millimeterSize == null) {
      millimeterSize = measure(`1`, `1`, 'mm').width
    }

    const convert = unit ? supportedUnits[unit] : null
    if (convert) {
      return convert(val)
    }

    return val
  }
}
