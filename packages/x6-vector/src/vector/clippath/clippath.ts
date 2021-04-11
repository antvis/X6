import { Vector } from '../vector/vector'
import { Container } from '../container/container'
import { SVGClipPathAttributes } from './types'

@ClipPath.register('ClipPath')
export class ClipPath extends Container<SVGClipPathElement> {
  remove() {
    this.targets().forEach((target) => target.unclip())
    return super.remove()
  }

  targets<TVector extends Vector>() {
    return ClipPath.find<TVector>(`svg [clip-path*="${this.id()}"]`)
  }
}

export namespace ClipPath {
  export function create<Attributes extends SVGClipPathAttributes>(
    attrs?: Attributes | null,
  ) {
    const clip = new ClipPath()
    if (attrs) {
      clip.attr(attrs)
    }
    return clip
  }
}
