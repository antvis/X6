import { Vector } from '../vector/vector'
import { Wrapper } from './wrapper'

export class Referent<
  TSVGElement extends SVGElement = SVGElement
> extends Wrapper<TSVGElement> {
  url() {
    return `url(#${this.id()})`
  }

  toString() {
    return this.url()
  }

  protected findTargets<TVector extends Vector>(type: string): TVector[] {
    const root = this.root()
    return root ? root.find<TVector>(`[${type}*="${this.id()}"]`) : []
  }
}
