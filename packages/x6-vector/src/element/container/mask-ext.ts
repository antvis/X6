import { Attrs } from '../../types'
import { Vector } from '../vector'
import { VectorElement } from '../element'
import { Container } from './container'
import { Adopter } from '../adopter'
import { Decorator } from '../decorator'
import { Mask } from './mask'

export class ContainerExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  @Decorator.checkDefs
  mask(attrs?: Attrs | null) {
    return this.defs()!.mask(attrs)
  }
}

export class DefsExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  mask(attrs?: Attrs | null) {
    return Mask.create(attrs).appendTo(this)
  }
}

export class ElementExtension<
  TSVGElement extends SVGElement
> extends Vector<TSVGElement> {
  masker() {
    return this.reference<Mask>('mask')
  }

  maskWith(element: Mask | Adopter.Target<VectorElement>) {
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
