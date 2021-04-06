import { ClipPath } from '../../../element/container/clippath'
import { SVGContainerAnimator } from './container'

@SVGClipPathAnimator.register('ClipPath')
export class SVGClipPathAnimator extends SVGContainerAnimator<
  SVGClipPathElement,
  ClipPath
> {}
