import { Base } from '../common/base'
import { SVGTitleAttributes } from './types'

@Title.register('title')
export class Title extends Base<SVGTitleElement> {
  update(desc?: string | null | Title.Update) {
    if (typeof desc === 'string' || desc == null) {
      this.node.textContent = desc || null
    } else {
      desc.call(this, this)
    }
    return this
  }
}

export namespace Title {
  export type Update = (this: Title, pattern: Title) => void

  export function create<Attributes extends SVGTitleAttributes>(
    attrs?: Attributes | null,
  ): Title
  export function create<Attributes extends SVGTitleAttributes>(
    title: string,
    attrs?: Attributes | null,
  ): Title
  export function create<Attributes extends SVGTitleAttributes>(
    update: Update,
    attrs?: Attributes | null,
  ): Title
  export function create<Attributes extends SVGTitleAttributes>(
    title?: string | Update | Attributes | null,
    attrs?: Attributes | null,
  ): Title
  export function create<Attributes extends SVGTitleAttributes>(
    title?: string | Update | Attributes | null,
    attrs?: Attributes | null,
  ): Title {
    const instance = new Title()
    if (typeof title === 'string' || typeof title === 'function') {
      instance.update(title)
      if (attrs) {
        instance.attr(attrs)
      }
    } else if (title) {
      instance.attr(title)
    }
    return instance
  }
}
