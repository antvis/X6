import { GeometryContainer } from '../../vector/container/geometry'
import { SVGContainerAnimator } from './container'

export class SVGContainerGeometryAnimator<
  TSVGElement extends SVGAElement | SVGGElement,
  TOwner extends GeometryContainer<TSVGElement> = GeometryContainer<TSVGElement>
> extends SVGContainerAnimator<TSVGElement, TOwner> {}
