import { applyMixins } from '../../util/mixin'
import {
  isDocument,
  isSVGSVGElement,
  isDocumentFragment,
  isInDocument,
} from '../../util/dom'
import { Registry } from './registry'

export abstract class Base<TElement extends Element = Element> {
  public node: TElement

  isDocument() {
    return isDocument(this.node)
  }

  isSVGSVGElement() {
    return isSVGSVGElement(this.node)
  }

  isDocumentFragment() {
    return isDocumentFragment(this.node)
  }

  isInDocument() {
    return isInDocument(this.node)
  }
}

export namespace Base {
  export function register(name: string, asRoot?: boolean) {
    return (ctor: Registry.Definition) => {
      Registry.register(ctor, name, asRoot)
    }
  }

  export function mixin(...source: any[]) {
    return (ctor: Registry.Definition) => {
      applyMixins(ctor, ...source)
    }
  }
}
