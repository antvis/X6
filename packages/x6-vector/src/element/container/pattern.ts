import { Attrs } from '../../types'
import { Box } from '../../struct/box'
import { Container } from './container'
import { Viewbox } from './container-viewbox'
import { VectorElement } from '../element'

@Pattern.mixin(Viewbox)
@Pattern.register('Pattern')
export class Pattern extends Container<SVGPatternElement> {
  attr(): Attrs
  attr(names: string[]): Attrs
  attr<T extends string | number = string>(name: string): T
  attr(name: string, value: null): this
  attr(name: string, value: string | number, ns?: string): this
  attr(attrs: Attrs): this
  attr<T extends string | number>(
    name: string,
    value?: string | number | null,
    ns?: string,
  ): T | this
  attr(
    attr?: string | string[] | Attrs,
    value?: string | number | null,
    ns?: string,
  ) {
    return super.attr(
      attr === 'transform' ? 'patternTransform' : attr,
      value,
      ns,
    )
  }

  bbox() {
    return new Box()
  }

  targets<TVector extends VectorElement>() {
    return Pattern.find<TVector>(`svg [fill*="${this.id()}"]`)
  }

  update(handler?: Pattern.Update) {
    this.clear()

    if (typeof handler === 'function') {
      handler.call(this, this)
    }

    return this
  }

  url() {
    return `url("#${this.id()}")`
  }

  toString() {
    return this.url()
  }
}

export interface Pattern extends Viewbox<SVGPatternElement> {}

export namespace Pattern {
  export type Update = (this: Pattern, pattern: Pattern) => void
  export function create(attrs?: Attrs | null): Pattern
  export function create(size: number | string, attrs?: Attrs | null): Pattern
  export function create(
    size: number | string,
    update: Update,
    attrs?: Attrs | null,
  ): Pattern
  export function create(
    width: number | string,
    height: number | string,
    attrs?: Attrs | null,
  ): Pattern
  export function create(
    width: number | string,
    height: number | string,
    update: Update,
    attrs?: Attrs | null,
  ): Pattern
  export function create(
    width?: number | string | Attrs | null,
    height?: number | string | Update | Attrs | null,
    update?: Update | Attrs | null,
    attrs?: Attrs | null,
  ): Pattern
  export function create(
    width?: number | string | Attrs | null,
    height?: number | string | Update | Attrs | null,
    update?: Update | Attrs | null,
    attrs?: Attrs | null,
  ): Pattern {
    const pattern = new Pattern()
    const base = {
      x: 0,
      y: 0,
      patternUnits: 'userSpaceOnUse',
    }

    if (width != null) {
      if (typeof width === 'object') {
        pattern.attr(width)
      } else if (height != null) {
        if (typeof height === 'function') {
          pattern.update(height).attr({
            ...base,
            width,
            height: width,
            ...update,
          })
        } else if (typeof height === 'object') {
          pattern.attr({
            ...base,
            width,
            height: width,
            ...height,
          })
        } else if (update != null) {
          if (typeof update === 'function') {
            pattern.update(update).attr({
              ...base,
              width,
              height,
              ...attrs,
            })
          } else {
            pattern.attr({
              ...base,
              width,
              height,
              ...update,
            })
          }
        }
      } else {
        pattern.attr({
          ...base,
          width,
          height: width,
        })
      }
    }

    return pattern
  }
}
