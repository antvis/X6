import { SVGNumber } from '../../struct/svg-number'
import { VectorElement } from '../element'

@Stop.register('Stop')
export class Stop extends VectorElement<SVGStopElement> {
  update(
    offset?: number | string | SVGNumber,
    color?: string,
    opacity?: number | string | SVGNumber,
  ): this
  update(options: Stop.Options): this
  update(
    offset?: Stop.Options | number | string | SVGNumber,
    color?: string,
    opacity?: number | string | SVGNumber,
  ): this
  update(
    offset?: Stop.Options | number | string | SVGNumber,
    color?: string,
    opacity?: number | string | SVGNumber,
  ) {
    const options: {
      offset?: number
      color?: string
      opacity?: number
    } = {}

    if (
      offset == null ||
      typeof offset === 'number' ||
      typeof offset === 'string' ||
      offset instanceof SVGNumber
    ) {
      if (offset != null) {
        options.offset = SVGNumber.create(offset).value
      }
      if (color != null) {
        options.color = color
      }
      if (opacity != null) {
        options.opacity = SVGNumber.create(opacity).value
      }
    } else {
      if (offset.offset != null) {
        options.offset = SVGNumber.create(offset.offset).value
      }
      if (offset.color != null) {
        options.color = offset.color
      }
      if (offset.opacity != null) {
        options.opacity = SVGNumber.create(offset.opacity).value
      }
    }

    if (options.opacity != null) {
      this.attr('stop-opacity', options.opacity)
    }
    if (options.color != null) {
      this.attr('stop-color', options.color)
    }
    if (options.offset != null) {
      this.attr('offset', options.offset)
    }

    return this
  }
}

export namespace Stop {
  export interface Options {
    offset?: number | string | SVGNumber
    color?: string
    opacity?: number | string | SVGNumber
  }
}
