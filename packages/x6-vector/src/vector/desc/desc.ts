import { Base } from '../common/base'
import { SVGDescAttributes } from './types'

@Desc.register('Desc')
export class Desc extends Base<SVGDescElement> {
  update(desc?: string | null | Desc.Update) {
    if (typeof desc === 'string' || desc == null) {
      this.node.textContent = desc || null
    } else {
      desc.call(this, this)
    }
    return this
  }
}

export namespace Desc {
  export type Update = (this: Desc, pattern: Desc) => void

  export function create<Attributes extends SVGDescAttributes>(
    attrs?: Attributes | null,
  ): Desc
  export function create<Attributes extends SVGDescAttributes>(
    desc: string,
    attrs?: Attributes | null,
  ): Desc
  export function create<Attributes extends SVGDescAttributes>(
    update: Update,
    attrs?: Attributes | null,
  ): Desc
  export function create<Attributes extends SVGDescAttributes>(
    desc?: string | Update | Attributes | null,
    attrs?: Attributes | null,
  ): Desc
  export function create<Attributes extends SVGDescAttributes>(
    desc?: string | Update | Attributes | null,
    attrs?: Attributes | null,
  ): Desc {
    const instance = new Desc()
    if (typeof desc === 'string' || typeof desc === 'function') {
      instance.update(desc)
      if (attrs) {
        instance.attr(attrs)
      }
    } else if (desc) {
      instance.attr(desc)
    }
    return instance
  }
}
