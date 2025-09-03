import { Dom } from '../../common'
import {
  type EdgeToolManualItem,
  type EdgeToolNativeItem,
  type EdgeToolNativeNames,
  edgeToolRegistry,
  type NodeToolManualItem,
  type NodeToolNativeItem,
  type NodeToolNativeNames,
  nodeToolRegistry,
} from '../../registry/tool'
import { CellView } from '../cell'
import { View } from '../view'
import { createViewElement } from '../view/util'
import { ToolItem } from './tool-item'

export interface ToolsViewOptions extends ToolsViewConfigOptions {
  className?: string
}

export interface ToolsViewConfigOptions {
  view?: CellView
  name?: string
  local?: boolean
  items?:
    | (
        | ToolItem
        | string
        | NodeToolNativeNames
        | NodeToolNativeItem
        | NodeToolManualItem
        | EdgeToolNativeNames
        | EdgeToolNativeItem
        | EdgeToolManualItem
      )[]
    | null
}

export interface ToolsViewUpdateOptions {
  toolId?: string
}

export class ToolsView extends View {
  public static toStringTag = `X6.${ToolsView.name}`

  public static isToolsView(instance: any): instance is ToolsView {
    if (instance == null) {
      return false
    }

    if (instance instanceof ToolsView) {
      return true
    }

    const tag = instance[Symbol.toStringTag]
    const view = instance as ToolsView

    if (
      (tag == null || tag === ToolsViewToStringTag) &&
      view.graph != null &&
      view.cell != null &&
      typeof view.config === 'function' &&
      typeof view.update === 'function' &&
      typeof view.focus === 'function' &&
      typeof view.blur === 'function' &&
      typeof view.show === 'function' &&
      typeof view.hide === 'function'
    ) {
      return true
    }

    return false
  }

  public tools: ToolItem[] | null
  public options: ToolsViewOptions
  public cellView: CellView
  public svgContainer: SVGGElement
  public htmlContainer: HTMLDivElement

  public get name() {
    return this.options.name
  }

  public get graph() {
    return this.cellView.graph
  }

  public get cell() {
    return this.cellView.cell
  }

  protected get [Symbol.toStringTag]() {
    return ToolsViewToStringTag
  }

  constructor(options: ToolsViewOptions = {}) {
    super()
    this.svgContainer = this.createContainer(true, options) as SVGGElement
    this.htmlContainer = this.createContainer(false, options) as HTMLDivElement
    this.config(options)
  }

  protected createContainer(svg: boolean, options: ToolsViewOptions) {
    const container = svg
      ? createViewElement('g', true)
      : createViewElement('div', false)
    Dom.addClass(container, this.prefixClassName('cell-tools'))
    if (options.className) {
      Dom.addClass(container, options.className)
    }
    return container
  }

  config(options: ToolsViewConfigOptions) {
    this.options = {
      ...this.options,
      ...options,
    }

    if (!CellView.isCellView(options.view) || options.view === this.cellView) {
      return this
    }

    this.cellView = options.view

    if (this.cell.isEdge()) {
      Dom.addClass(this.svgContainer, this.prefixClassName('edge-tools'))
      Dom.addClass(this.htmlContainer, this.prefixClassName('edge-tools'))
    } else if (this.cell.isNode()) {
      Dom.addClass(this.svgContainer, this.prefixClassName('node-tools'))
      Dom.addClass(this.htmlContainer, this.prefixClassName('node-tools'))
    }

    this.svgContainer.setAttribute('data-cell-id', this.cell.id)
    this.htmlContainer.setAttribute('data-cell-id', this.cell.id)

    if (this.name) {
      this.svgContainer.setAttribute('data-tools-name', this.name)
      this.htmlContainer.setAttribute('data-tools-name', this.name)
    }

    const tools = this.options.items
    if (!Array.isArray(tools)) {
      return this
    }

    this.tools = []

    const normalizedTools: typeof tools = []

    tools.forEach((meta) => {
      if (ToolItem.isToolItem(meta)) {
        if (meta.name === 'vertices') {
          normalizedTools.unshift(meta)
        } else {
          normalizedTools.push(meta)
        }
      } else {
        const name = typeof meta === 'object' ? meta.name : meta
        if (name === 'vertices') {
          normalizedTools.unshift(meta)
        } else {
          normalizedTools.push(meta)
        }
      }
    })

    for (let i = 0; i < normalizedTools.length; i += 1) {
      const meta = normalizedTools[i]
      let tool: ToolItem | undefined

      if (ToolItem.isToolItem(meta)) {
        tool = meta
      } else {
        const name = typeof meta === 'object' ? meta.name : meta
        const args = typeof meta === 'object' ? meta.args || {} : {}
        if (name) {
          if (this.cell.isNode()) {
            const ctor = nodeToolRegistry.get(name)
            if (ctor) {
              tool = new ctor(args)
            } else {
              return nodeToolRegistry.onNotFound(name)
            }
          } else if (this.cell.isEdge()) {
            const ctor = edgeToolRegistry.get(name)
            if (ctor) {
              tool = new ctor(args)
            } else {
              return edgeToolRegistry.onNotFound(name)
            }
          }
        }
      }

      if (tool) {
        tool.config(this.cellView, this)
        tool.render()
        const container =
          tool.options.isSVGElement !== false
            ? this.svgContainer
            : this.htmlContainer
        container.appendChild(tool.container)
        this.tools.push(tool)
      }
    }

    return this
  }

  update(options: ToolsViewUpdateOptions = {}) {
    const tools = this.tools
    if (tools) {
      tools.forEach((tool) => {
        if (options.toolId !== tool.cid && tool.isVisible()) {
          tool.update()
        }
      })
    }
    return this
  }

  focus(focusedTool: ToolItem | null) {
    const tools = this.tools
    if (tools) {
      tools.forEach((tool) => {
        if (focusedTool === tool) {
          tool.show()
        } else {
          tool.hide()
        }
      })
    }

    return this
  }

  blur(blurredTool: ToolItem | null) {
    const tools = this.tools
    if (tools) {
      tools.forEach((tool) => {
        if (tool !== blurredTool && !tool.isVisible()) {
          tool.show()
          tool.update()
        }
      })
    }

    return this
  }

  hide() {
    return this.focus(null)
  }

  show() {
    return this.blur(null)
  }

  remove() {
    const tools = this.tools
    if (tools) {
      tools.forEach((tool) => tool.remove())
      this.tools = null
    }

    Dom.remove(this.svgContainer)
    Dom.remove(this.htmlContainer)
    return super.remove()
  }

  mount() {
    const tools = this.tools
    const cellView = this.cellView
    if (cellView && tools) {
      const hasSVG = tools.some((tool) => tool.options.isSVGElement !== false)
      const hasHTML = tools.some((tool) => tool.options.isSVGElement === false)
      if (hasSVG) {
        const parent = this.options.local
          ? cellView.container
          : cellView.graph.view.decorator
        parent.appendChild(this.svgContainer)
      }

      if (hasHTML) {
        this.graph.container.appendChild(this.htmlContainer)
      }
    }
    return this
  }
}

export const ToolsViewToStringTag = `X6.${ToolsView.name}`
