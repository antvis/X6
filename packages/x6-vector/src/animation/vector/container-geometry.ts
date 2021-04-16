import { ContainerGeometry } from '../../vector/container/geometry'
import { SVGContainerAnimator } from './container'

export class SVGContainerGeometryAnimator<
  TSVGElement extends SVGAElement | SVGGElement,
  TOwner extends ContainerGeometry<TSVGElement> = ContainerGeometry<TSVGElement>
> extends SVGContainerAnimator<TSVGElement, TOwner> {}
