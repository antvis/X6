import { Color } from '../../struct/color'
import { Base } from '../common/base'
import { Image } from '../image/image'
import { Vector } from './vector'

export class FillStroke<
  TSVGElement extends SVGElement = SVGElement,
> extends Base<TSVGElement> {
  fill(): string
  fill(color: string | Color | Color.RGBALike | Vector | null): this
  fill(attrs: {
    color?: string
    opacity?: number
    rule?: 'nonzero' | 'evenodd'
  }): this
  fill(
    value?:
      | null
      | string
      | Color
      | Color.RGBALike
      | Vector
      | {
          color?: string
          opacity?: number
          rule?: 'nonzero' | 'evenodd'
        },
  ) {
    if (typeof value === 'undefined') {
      return this.attr('fill')
    }

    FillStroke.fillOrStroke(this, 'fill', value)
    return this
  }

  stroke(): string
  stroke(color: string | Color | Color.RGBALike | Vector | null): this
  stroke(attrs: {
    color?: string
    width?: number
    opacity?: number
    linecap?: 'butt' | 'round' | 'square'
    linejoin?: 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round'
    miterlimit?: number
    dasharray?: string | number[]
    dashoffset?: string | number
  }): this
  stroke(
    value?:
      | null
      | string
      | Color
      | Color.RGBALike
      | Vector
      | {
          color?: string
          width?: number
          opacity?: number
          linecap?: 'butt' | 'round' | 'square'
          linejoin?: 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round'
          miterlimit?: number
          dasharray?: string | number[]
          dashoffset?: string | number
        },
  ) {
    if (typeof value === 'undefined') {
      return this.attr('stroke')
    }

    FillStroke.fillOrStroke(this, 'stroke', value)
    return this
  }

  opacity(): number
  opacity(value: number | null): this
  opacity(value?: number | null) {
    return this.attr('opacity', value)
  }
}

export namespace FillStroke {
  const map = {
    fill: ['color', 'opacity', 'rule'],
    stroke: [
      'color',
      'width',
      'opacity',
      'linecap',
      'linejoin',
      'miterlimit',
      'dasharray',
      'dashoffset',
    ],
  }

  const prefix = (t: string, a: string) => (a === 'color' ? t : `${t}-${a}`)

  export function fillOrStroke<T extends SVGElement>(
    elem: Base<T>,
    type: 'fill' | 'stroke',
    value:
      | string
      | Color
      | Color.RGBALike
      | Vector
      | Record<string, string | number | number[]>
      | null,
  ) {
    if (value === null) {
      elem.attr(type, null)
    } else if (typeof value === 'string' || value instanceof Vector) {
      elem.attr(
        type,
        value instanceof Image ? (value as any) : value.toString(),
      )
    } else if (value instanceof Color || Color.isRgbLike(value)) {
      const color = new Color(value)
      elem.attr(type, color.toString())
    } else {
      const names = map[type]
      for (let i = names.length - 1; i >= 0; i -= 1) {
        const k = names[i]
        const v = value[k]
        if (v != null) {
          elem.attr(prefix(type, k), Array.isArray(v) ? v.join(' ') : v)
        }
      }
    }
  }
}
