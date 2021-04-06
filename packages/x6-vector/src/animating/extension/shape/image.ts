import { Image } from '../../../element/shape/image'
import { SVGAnimator } from '../svg'

@SVGImageAnimator.register('Image')
export class SVGImageAnimator extends SVGAnimator<SVGImageElement, Image> {}
