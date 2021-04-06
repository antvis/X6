import { Pattern } from '../../../element/container/pattern'
import { SVGViewboxAnimator } from './container-viewbox'

@SVGPatternAnimator.register('Pattern')
export class SVGPatternAnimator extends SVGViewboxAnimator<
  SVGPatternElement,
  Pattern
> {}
