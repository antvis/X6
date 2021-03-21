import { Attrs } from '../../types'
import { VectorElement } from '../element'
import { Container } from './container'

@ClipPath.register('ClipPath')
export class ClipPath extends Container<SVGClipPathElement> {
  remove() {
    this.targets().forEach((target) => target.unclip())
    return super.remove()
  }

  targets<TVector extends VectorElement>() {
    return ClipPath.find<TVector>(`svg [clip-path*="${this.id()}"]`)
  }
}

export namespace ClipPath {
  export function create(attrs?: Attrs | null) {
    const clip = new ClipPath()
    if (attrs) {
      clip.attr(attrs)
    }
    return clip
  }
}
