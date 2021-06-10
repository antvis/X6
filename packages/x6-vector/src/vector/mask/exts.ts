import { Adopter } from '../../dom/common/adopter'
import { Decorator } from '../common/decorator'
import { Base } from '../common/base'
import { Vector } from '../vector/vector'
import { Container } from '../container/container'
import { Mask } from './mask'
import { SVGMaskAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  @Decorator.checkDefs
  mask<Attributes extends SVGMaskAttributes>(attrs?: Attributes | null) {
    return this.defs()!.mask(attrs)
  }
}

export class DefsExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  mask<Attributes extends SVGMaskAttributes>(attrs?: Attributes | null) {
    return Mask.create(attrs).appendTo(this)
  }
}

export class ElementExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  masker() {
    return this.reference<Mask>('mask')
  }

  maskWith(element: Mask | Adopter.Target<Vector>) {
    let masker: Mask | undefined | null
    if (element instanceof Mask) {
      masker = element
    } else {
      const parent = this.parent<Container>()
      masker = parent && parent.mask()
      if (masker) {
        masker.add(element)
      }
    }

    if (masker) {
      this.attr('mask', `url("#${masker.id()}")`)
    }

    return this
  }

  unmask() {
    return this.attr('mask', null)
  }
}
