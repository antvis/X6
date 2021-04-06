import { ForeignObject } from '../../../element/shape/foreignobject'
import { SVGAnimator } from '../svg'

@SVGForeignObjectAnimator.register('ForeignObject')
export class SVGForeignObjectAnimator extends SVGAnimator<
  SVGForeignObjectElement,
  ForeignObject
> {}
