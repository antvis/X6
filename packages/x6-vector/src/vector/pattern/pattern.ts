import { Box } from '../../struct/box'
import { Vector } from '../vector/vector'
import { Viewbox } from '../container/viewbox'
import { Container } from '../container/container'
import { SVGPatternAttributes } from './types'
import { AttrOverride } from './override'

@Pattern.mixin(Viewbox, AttrOverride)
@Pattern.register('Pattern')
export class Pattern extends Container<SVGPatternElement> {
  bbox() {
    return new Box()
  }

  targets<TVector extends Vector>() {
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
  export function create<Attributes extends SVGPatternAttributes>(
    attrs?: Attributes | null,
  ): Pattern
  export function create<Attributes extends SVGPatternAttributes>(
    size: number | string,
    attrs?: Attributes | null,
  ): Pattern
  export function create<Attributes extends SVGPatternAttributes>(
    size: number | string,
    update: Update,
    attrs?: Attributes | null,
  ): Pattern
  export function create<Attributes extends SVGPatternAttributes>(
    width: number | string,
    height: number | string,
    attrs?: Attributes | null,
  ): Pattern
  export function create<Attributes extends SVGPatternAttributes>(
    width: number | string,
    height: number | string,
    update: Update,
    attrs?: Attributes | null,
  ): Pattern
  export function create<Attributes extends SVGPatternAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Update | Attributes | null,
    update?: Update | Attributes | null,
    attrs?: Attributes | null,
  ): Pattern
  export function create<Attributes extends SVGPatternAttributes>(
    width?: number | string | Attributes | null,
    height?: number | string | Update | Attributes | null,
    update?: Update | Attributes | null,
    attrs?: Attributes | null,
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
        } else {
          pattern.attr({
            ...base,
            width,
            height,
          })
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
