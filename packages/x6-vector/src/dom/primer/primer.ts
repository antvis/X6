import { isNode } from '../../util'
import { Base } from '../common/base'
import { Registry } from '../common/registry'
import { Affix } from './affix'
import { Data } from './data'
import { Memory } from './memory'
import { ClassName } from './classname'
import { Style, Hook as StyleHook } from '../style'
import {
  Attributes,
  AttributesMap,
  Hook as AttributesHook,
} from '../attributes'
import { EventEmitter, EventListener, Hook as EventHook } from '../events'
import { Adopter } from '../common/adopter'

@Primer.mixin(
  Affix,
  Data,
  Memory,
  Attributes,
  ClassName,
  Style,
  EventEmitter,
  EventListener,
)
export class Primer<TElement extends Element> extends Base<TElement> {
  public readonly node: TElement

  public get type() {
    return this.node.nodeName
  }

  constructor()
  constructor(attrs?: AttributesMap<TElement> | null)
  constructor(node: TElement | null, attrs?: AttributesMap<TElement> | null)
  constructor(tagName: string | null, attrs?: AttributesMap<TElement> | null)
  constructor(
    nodeOrAttrs?: TElement | string | AttributesMap<TElement> | null,
    attrs?: AttributesMap<TElement> | null,
  )
  constructor(
    nodeOrAttrs?: TElement | string | AttributesMap<TElement> | null,
    attrs?: AttributesMap<TElement> | null,
  ) {
    super()

    let attributes: AttributesMap<TElement> | null | undefined
    if (isNode(nodeOrAttrs)) {
      this.node = nodeOrAttrs
      attributes = attrs
    } else {
      const ctor = this.constructor as Registry.Definition
      let tagName =
        typeof nodeOrAttrs === 'string'
          ? nodeOrAttrs
          : Registry.getTagName(ctor)
      if (tagName) {
        if (tagName === 'dom') {
          // return new Dom('div') by dafault
          tagName = 'div'
        }
        this.node = Adopter.createNode<TElement>(tagName)
        attributes =
          nodeOrAttrs != null && typeof nodeOrAttrs !== 'string'
            ? nodeOrAttrs
            : attrs
      } else {
        throw new Error(
          `Can not initialize "${ctor.name}" with unknown tag name`,
        )
      }
    }

    if (attributes) {
      this.attr(attributes)
    }

    this.restoreAffix()
    Adopter.cache(this.node, this)
  }
}

export interface Primer<TElement extends Element>
  extends Affix<TElement>,
    Data<TElement>,
    Memory<TElement>,
    Style<TElement>,
    Attributes<TElement>,
    ClassName<TElement>,
    EventEmitter<TElement>,
    EventListener<TElement> {}

export namespace Primer {
  export const registerEventHook = EventHook.register
  export const registerStyleHook = StyleHook.register
  export const registerAttributeHook = AttributesHook.register
}
