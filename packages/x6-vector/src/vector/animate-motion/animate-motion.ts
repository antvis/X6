import { Animation } from '../animate/animation'
import { SVGAnimateMotionAttributes } from './types'

@AnimateMotion.register('AnimateMotion')
export class AnimateMotion extends Animation<SVGAnimateMotionElement> {}

export namespace AnimateMotion {
  export function create<Attributes extends SVGAnimateMotionAttributes>(
    attrs?: Attributes | null,
  ) {
    return new AnimateMotion(attrs)
  }
}
