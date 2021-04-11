import { ForeignObject } from '../../vector/foreignobject/foreignobject'
import { SVGAnimator } from '../svg'

@SVGForeignObjectAnimator.register('ForeignObject')
export class SVGForeignObjectAnimator extends SVGAnimator<
  SVGForeignObjectElement,
  ForeignObject
> {}
