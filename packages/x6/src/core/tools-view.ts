import { View } from './view'
import { CellView } from './cell-view'
import { ToolView } from './tool-view'

export class ToolsView extends View {
  protected options: ToolsView.Options
  protected tools: ToolView[] | null

  configure(options: ToolsView.Options) {
    this.options = { ...options }
    const tools = options.tools
    if (!Array.isArray(tools)) {
      return this
    }

    const cellView = options.cellView
    if (!(cellView instanceof CellView)) {
      return this
    }

    this.tools = []

    tools.forEach((tool) => {
      if (tool instanceof ToolView) {
        tool.configure(cellView, this)
        tool.render()
        this.container.appendChild(tool.container)
        this.tools!.push(tool)
      }
    })

    return this
  }

  getName() {
    return this.options.name
  }

  update(options: ToolsView.UpdateOptions = {}) {
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

  focusTool(focusedTool: ToolView | null) {
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

  blurTool(blurredTool: ToolView | null) {
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
    return this.focusTool(null)
  }

  show() {
    return this.blurTool(null)
  }

  remove() {
    const tools = this.tools
    if (tools) {
      tools.forEach((tool) => tool.remove())
      this.tools = null
    }

    return super.remove()
  }

  mount() {
    const options = this.options
    const cellView = options.cellView
    if (cellView) {
      const container = options.local
        ? cellView.container
        : cellView.graph.tools
      container.appendChild(this.container)
    }
    return this
  }
}

export namespace ToolsView {
  export interface Options {
    cellView: CellView
    name?: string
    tools?: ToolView[]
    local?: boolean
  }

  export interface UpdateOptions {
    toolId?: string
  }
}
