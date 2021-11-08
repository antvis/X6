import { Box } from '../../struct/box'
import { Vector } from '../vector/vector'
import { Vessel } from '../container/vessel'
import { Viewbox } from '../container/viewbox'
import { AttrOverride } from './override'
import { SVGPatternAttributes } from './types'

@Pattern.register('Pattern')
@Pattern.mixin(Viewbox, AttrOverride)
export class Pattern extends Vessel<SVGPatternElement> {
  bbox() {
    return new Box()
  }

  targets<TVector extends Vector>(): TVector[] {
    return this.findTargets<TVector>('fill')
  }

  update(handler?: Pattern.Update) {
    this.clear()

    if (typeof handler === 'function') {
      handler.call(this, this)
    }

    return this
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
