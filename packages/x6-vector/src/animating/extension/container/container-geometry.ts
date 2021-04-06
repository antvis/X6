import { GeometryContainer } from '../../../element/container/container-geometry'
import { SVGContainerAnimator } from './container'

export class SVGContainerGeometryAnimator<
  TSVGElement extends SVGAElement | SVGGElement,
  TTarget extends GeometryContainer<TSVGElement> = GeometryContainer<TSVGElement>
> extends SVGContainerAnimator<TSVGElement, TTarget> {}
