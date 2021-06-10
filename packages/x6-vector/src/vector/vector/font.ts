import { Base } from '../common/base'
import { Text } from '../text/text'

export class FontStyle<
  TSVGElement extends SVGElement = SVGElement,
> extends Base<TSVGElement> {
  font(key: string): string | number
  font(attrs: FontStyle.Attributes): this
  font(key: string, value: string | number | null | undefined): this
  font(a: FontStyle.Attributes | string, v?: string | number) {
    if (typeof a === 'object') {
      Object.keys(a).forEach((key: keyof FontStyle.Attributes) =>
        this.font(key, a[key]),
      )
      return this
    }

    if (a === 'leading') {
      const text = this as any as Text // eslint-disable-line
      if (text.leading) {
        return text.leading(v)
      }
    }

    return a === 'anchor'
      ? this.attr('text-anchor', v)
      : a === 'size' ||
        a === 'family' ||
        a === 'weight' ||
        a === 'stretch' ||
        a === 'variant' ||
        a === 'style'
      ? this.attr(`font-${a}`, v)
      : this.attr(a, v)
  }
}

export namespace FontStyle {
  export interface Attributes {
    leading?: number
    anchor?: string | number | null
    size?: string | number | null
    family?: string | null
    weight?: string | number | null
    stretch?: string | null
    variant?: string | null
    style?: string | null
  }
}
