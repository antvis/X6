import { Image } from '../../vector/image/image'
import { SVGAnimator } from '../svg'

@SVGImageAnimator.register('Image')
export class SVGImageAnimator extends SVGAnimator<SVGImageElement, Image> {}
