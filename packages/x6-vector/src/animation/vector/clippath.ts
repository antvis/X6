import { ClipPath } from '../../vector/clippath/clippath'
import { SVGContainerAnimator } from './container'

@SVGClipPathAnimator.register('ClipPath')
export class SVGClipPathAnimator extends SVGContainerAnimator<
  SVGClipPathElement,
  ClipPath
> {}
