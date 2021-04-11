import { Global } from '../global'
import { namespaces, createNode } from '../util'
import { Dom } from './dom'

@Fragment.register('Fragment')
export class Fragment extends Dom<HTMLDivElement> {
  constructor(node = Global.document.createDocumentFragment() as any) {
    super(node)
  }

  xml(): string
  xml(outerXML: boolean): string
  xml(process: (dom: Dom) => false | Dom, outerXML?: boolean): string
  xml(content: string, outerXML?: boolean, ns?: string): string
  xml(
    arg1?: boolean | string | ((dom: Dom) => false | Dom),
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
