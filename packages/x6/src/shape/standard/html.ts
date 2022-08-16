import { Registry } from '../../registry'
import { Markup } from '../../view'
import { Node } from '../../model/node'
import { NodeView } from '../../view/node'
import { Graph } from '../../graph/graph'
import { Base } from '../base'
import { FunctionExt, ObjectExt, Dom } from '../../util'

export class HTML<
  Properties extends HTML.Properties = HTML.Properties,
> extends Base<Properties> {
  get html() {
    return this.getHTML()
  }

  set html(
    val:
      | HTML.Component
      | HTML.UpdatableComponent
      | HTML.SingleSPAComponent
      | null
      | undefined,
  ) {
    this.setHTML(val)
  }

  getHTML() {
    return this.store.get<
      | HTML.Component
      | HTML.UpdatableComponent
      | HTML.SingleSPAComponent
      | null
      | undefined
    >('html')
  }

  setHTML(
    html:
      | HTML.Component
      | HTML.UpdatableComponent
      | HTML.SingleSPAComponent
      | null
      | undefined,
    options: Node.SetOptions = {},
  ) {
    if (html == null) {
      this.removeHTML(options)
    } else {
      this.store.set('html', html, options)
    }

    return this
  }

  removeHTML(options: Node.SetOptions = {}) {
    return this.store.remove('html', options)
  }
}

export namespace HTML {
  export type Elem = string | HTMLElement | null | undefined
  export type UnionElem = Elem | ((this: Graph, node: Node) => Elem)
  export interface Properties extends Node.Properties {
    html?:
      | UnionElem
      | {
          render: UnionElem
          shouldComponentUpdate?:
            | boolean
            | ((this: Graph, node: Node) => boolean)
        }
  }
}

export namespace HTML {
  export class View extends NodeView<HTML> {
    protected init() {
      super.init()
      this.cell.on('change:*', () => {
        const shouldUpdate = this.graph.hook.shouldUpdateHTMLComponent(
          this.cell,
        )
        if (shouldUpdate) {
          this.renderHTMLComponent()
        }
      })
      // init的时候markup还未创建成功
      Dom.requestAnimationFrame(() => this.mount())
    }

    confirmUpdate(flag: number) {
      const ret = super.confirmUpdate(flag)
      return this.handleAction(ret, View.action, () =>
        this.renderHTMLComponent(),
      )
    }

    protected renderHTMLComponent() {
      const container = this.selectors.foContent
      if (container) {
        const $wrap = this.$(container).empty()
        const component = this.graph.hook.getHTMLComponent(this.cell)
        if (component) {
          if (typeof component === 'string') {
            $wrap.html(component)
          } else {
            $wrap.append(component)
          }
        }
      }
    }

    mount() {
      const container = this.selectors.foContent
      if (container) {
        this.getSingleSPAComponentHook('mount').then((mount) => {
          FunctionExt.call(mount, this, {
            graph: this.graph,
            node: this.cell,
            container: container as Element,
          }).then((component: any) => {
            if (component) {
              const $wrap = this.$(container).empty()
              if (typeof component === 'string') {
                $wrap.html(component)
              } else {
                $wrap.append(component)
              }
            }
          })
        })
      }
    }

    unmount(elem: Element) {
      this.getSingleSPAComponentHook('unmount').then((unmount) => {
        const container = this.selectors.foContent
        FunctionExt.call(unmount, this, {
          graph: this.graph,
          node: this.cell,
          container: container as Element,
        })
      })
      super.unmount(elem)
      return this
    }

    protected getSingleSPAComponentHook(name: 'mount' | 'unmount') {
      return Promise.resolve().then(() => {
        const html = this.cell.getHTML()
        if (ObjectExt.isPlainObject(html)) {
          const hook = (html as HTML.SingleSPAComponent)[name]
          if (typeof hook === 'function') {
            return hook
          }
        }
        // eslint-disable-next-line
        return Promise.reject('can not get hook')
      })
    }
  }

  export namespace View {
    export const action = 'html' as any

    View.config({
      bootstrap: [action],
      actions: {
        html: action,
      },
    })

    NodeView.registry.register('html-view', View)
  }
}

export namespace HTML {
  HTML.config({
    view: 'html-view',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        ...Markup.getForeignObjectMarkup(),
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],
    attrs: {
      body: {
        fill: 'none',
        stroke: 'none',
        refWidth: '100%',
        refHeight: '100%',
      },
      fo: {
        refWidth: '100%',
        refHeight: '100%',
      },
    },
  })

  Node.registry.register('html', HTML)
}

export namespace HTML {
  export type Component =
    | HTMLElement
    | string
    | ((this: Graph, node: HTML) => HTMLElement | string)

  export type UpdatableComponent = {
    render: Component
    shouldComponentUpdate: boolean | ((this: Graph, node: HTML) => boolean)
  }

  export type SingleSPAComponentProps = {
    graph: Graph
    node: HTML
    container: Element
  }

  export type SingleSPAComponent = {
    mount: (props: SingleSPAComponentProps) => Promise<any>
    unmount: (props: SingleSPAComponentProps) => Promise<any>
  }

  export const componentRegistry = Registry.create<
    Component | UpdatableComponent | SingleSPAComponent
  >({
    type: 'html componnet',
  })
}
