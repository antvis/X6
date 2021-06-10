import { Adopter } from '../../dom/common/adopter'
import { Decorator } from '../common/decorator'
import { Base } from '../common/base'
import { Vector } from '../vector/vector'
import { Container } from '../container/container'
import { ClipPath } from './clippath'
import { SVGClipPathAttributes } from './types'

export class ContainerExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  @Decorator.checkDefs
  clip<Attributes extends SVGClipPathAttributes>(
    attrs?: Attributes | null,
  ): ClipPath {
    return this.defs()!.clip(attrs)
  }
}

export class DefsExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  clip<Attributes extends SVGClipPathAttributes>(
    attrs?: Attributes | null,
  ): ClipPath {
    return ClipPath.create(attrs).appendTo(this)
  }
}

export class ElementExtension<
  TSVGElement extends SVGElement,
> extends Base<TSVGElement> {
  clipper() {
    return this.reference<ClipPath>('clip-path')
  }

  clipWith(element: ClipPath | Adopter.Target<Vector>) {
    // use given clip or create a new one
    let clipper: ClipPath | undefined | null
    if (element instanceof ClipPath) {
      clipper = element
    } else {
      const parent = this.parent<Container>()
      clipper = parent && parent.clip()
      if (clipper) {
        clipper.add(element)
      }
    }

    if (clipper) {
      this.attr('clip-path', `url("#${clipper.id()}")`)
    }

    return this
  }

  unclip() {
    return this.attr('clip-path', null)
  }
}
