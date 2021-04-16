import { Global } from '../../global'
import { Registry } from '../../dom/common/registry'
import { namespaces, createNode } from '../../util'
import { Dom } from '../../dom/dom'

export class Fragment extends Dom<DocumentFragment> {
  constructor(node = Global.document.createDocumentFragment()) {
    super(node)
  }

  xml(): string
  xml(process: (dom: Dom) => boolean | undefined | Dom): string
  xml(content: string, outerXML?: false, ns?: string): this
  xml(
    process: (dom: Dom) => boolean | undefined | Dom,
    outerXML?: false,
  ): string
  xml(outerXML: false): string
  xml(
    arg1?: boolean | string | ((dom: Dom) => boolean | undefined | Dom),
    arg2?: boolean,
    arg3?: string,
  ) {
    const content = typeof arg1 === 'boolean' ? null : arg1
    const ns = arg3

    // Put all elements into a wrapper before we can get the innerXML from it
    if (content == null || typeof content === 'function') {
      const wrapper = new Dom(
        createNode<SVGElement>('wrapper', ns || namespaces.html),
      )
      wrapper.add(this.node.cloneNode(true))

      return wrapper.xml(false)
    }

    return super.xml(content, false, ns)
  }
}

Registry.register(Fragment, 'Fragment')
