import { Dom, disposable } from '../common'
import { Graph } from '../graph/graph'
import type { Cell, CellBaseEventArgs } from '../model/cell'
import { Node, type NodeProperties } from '../model/node'
import { Markup } from '../view'
import { NodeView } from '../view/node'

type HTMLComponent =
  | string
  | HTMLElement
  | ((cell: Cell) => HTMLElement | string)

export type HTMLShapeConfig = NodeProperties & {
  shape: string
  html: HTMLComponent
  effect?: (keyof NodeProperties)[]
  inherit?: string
}

const ViewAction = 'html' as any

const HTMLShapeMaps: Record<
  string,
  {
    html: string | HTMLElement | ((cell: Cell) => HTMLElement | string)
    effect?: (keyof NodeProperties)[]
  }
> = {}

/**
 * HTML shape
 */
export class HTML extends Node {
  /**
   * HTML.register
   * @param config
   */
  public static register(config: HTMLShapeConfig) {
    const { shape, html, effect, inherit, ...others } = config
    if (!shape) {
      throw new Error('HTML.register should specify `shape` in config.')
    }
    HTMLShapeMaps[shape] = {
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

/**
 * HTML node view
 */
class View extends NodeView<HTML> {
  protected init() {
    super.init()
    this.cell.on('change:*', this.onCellChangeAny, this)
  }

  protected onCellChangeAny({ key }: CellBaseEventArgs['change:*']) {
    const content = HTMLShapeMaps[this.cell.shape]
    if (content) {
      const { effect } = content
      if (!effect || effect.includes(key)) {
        this.renderHTMLComponent()
      }
    }
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag)
    return this.handleAction(ret, ViewAction, () => this.renderHTMLComponent())
  }

  protected renderHTMLComponent() {
    const container =
      this.selectors && (this.selectors.foContent as HTMLDivElement)
    if (container) {
      Dom.empty(container)
      const content = HTMLShapeMaps[this.cell.shape]
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

  @disposable()
  dispose() {
    this.cell.off('change:*', this.onCellChangeAny, this)
  }
}

View.config({
  bootstrap: [ViewAction],
  actions: {
    html: ViewAction,
  },
})

NodeView.registry.register('html-view', View, true)
