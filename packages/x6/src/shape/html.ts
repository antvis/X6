import { Dom } from '@antv/x6-common'
import { Markup } from '../view'
import { Cell } from '../model/cell'
import { Node } from '../model/node'
import { NodeView } from '../view/node'
import { Graph } from '../graph/graph'

export class HTML<
  Properties extends HTML.Properties = HTML.Properties,
> extends Node<Properties> {}

export namespace HTML {
  export interface Properties extends Node.Properties {}
}

export namespace HTML {
  export class View extends NodeView<HTML> {
    protected init() {
      super.init()
      this.cell.on('change:*', this.onCellChangeAny, this)
    }

    protected onCellChangeAny({ key }: Cell.EventArgs['change:*']) {
      const content = shapeMaps[this.cell.shape]
      if (content) {
        const { effect } = content
        if (!effect || effect.includes(key)) {
          this.renderHTMLComponent()
        }
      }
    }

    confirmUpdate(flag: number) {
      const ret = super.confirmUpdate(flag)
      return this.handleAction(ret, View.action, () =>
        this.renderHTMLComponent(),
      )
    }

    protected renderHTMLComponent() {
      const container =
        this.selectors && (this.selectors.foContent as HTMLDivElement)
      if (container) {
        Dom.empty(container)
        const content = shapeMaps[this.cell.shape]
        if (!content) {
          return
        }

        let { html } = content
        if (typeof html === 'function') {
          html = html(this.cell)
        }
        if (html) {
          if (typeof html === 'string') {
            container.innerHTML = html
          } else {
            Dom.append(container, html)
          }
        }
      }
    }

    @View.dispose()
    dispose() {
      this.cell.off('change:*', this.onCellChangeAny, this)
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

    NodeView.registry.register('html-view', View, true)
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

  Node.registry.register('html', HTML, true)
}

export namespace HTML {
  type HTMLComponent =
    | string
    | HTMLElement
    | ((cell: Cell) => HTMLElement | string)

  export type HTMLShapeConfig = Node.Properties & {
    shape: string
    html: HTMLComponent
    effect?: (keyof Node.Properties)[]
    inherit?: string
  }

  export const shapeMaps: Record<
    string,
    {
      html: string | HTMLElement | ((cell: Cell) => HTMLElement | string)
      effect?: (keyof Node.Properties)[]
    }
  > = {}

  export function register(config: HTMLShapeConfig) {
    const { shape, html, effect, inherit, ...others } = config
    if (!shape) {
      throw new Error('should specify shape in config')
    }
    shapeMaps[shape] = {
      html,
      effect,
    }

    Graph.registerNode(
      shape,
      {
        inherit: inherit || 'html',
        ...others,
      },
      true,
    )
  }
}
