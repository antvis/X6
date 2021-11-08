import { Animation } from '../animate/animation'
import { SVGAnimateTransformAttributes } from './types'

@AnimateTransform.register('AnimateTransform')
export class AnimateTransform extends Animation<SVGAnimateTransformElement> {}

export namespace AnimateTransform {
  export function create<Attributes extends SVGAnimateTransformAttributes>(
    attrs?: Attributes | null,
  ) {
    return new AnimateTransform(attrs)
  }
}
