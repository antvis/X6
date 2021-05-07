import { ClipPath } from '../../vector/clippath/clippath'
import { SVGWrapperAnimator } from './wrapper'

@SVGClipPathAnimator.register('ClipPath')
export class SVGClipPathAnimator extends SVGWrapperAnimator<
  SVGClipPathElement,
  ClipPath
> {}
