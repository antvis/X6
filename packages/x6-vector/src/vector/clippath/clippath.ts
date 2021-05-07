import { Vector } from '../vector/vector'
import { Vessel } from '../container/vessel'
import { SVGClipPathAttributes } from './types'

@ClipPath.register('ClipPath')
export class ClipPath extends Vessel<SVGClipPathElement> {
  remove() {
    this.targets().forEach((target) => target.unclip())
    return super.remove()
  }

  targets<TVector extends Vector>() {
    return this.findTargets<TVector>('clip-path')
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
