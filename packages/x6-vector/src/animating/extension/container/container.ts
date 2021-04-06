import { Container } from '../../../element/container/container'
import { SVGAnimator } from '../svg'

export class SVGContainerAnimator<
  TSVGElement extends SVGElement,
  TTarget extends Container<TSVGElement> = Container<TSVGElement>
> extends SVGAnimator<TSVGElement, TTarget> {}
