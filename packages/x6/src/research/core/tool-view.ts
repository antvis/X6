import { View } from './view'
import { CellView } from './cell-view'
import { ToolsView } from './tools-view'

export class ToolView extends View {
  public container: HTMLElement
  protected name: string
  protected visible: boolean
  protected cellView: CellView
  protected parentView: ToolsView

  constructor() {
    super()
  }

  get graph() {
    return this.cellView.graph
  }

  render() {
    this.empty()
  }

  configure(view: CellView, toolsView: ToolsView) {
    this.cellView = view
    this.parentView = toolsView
    this.simulateRelatedView(this.container)
    // Delegate events in case the ToolView was removed from the DOM and reused.
    this.delegateEvents()
    return this
  }

  simulateRelatedView(el: Element) {
    if (el) {
      el.setAttribute('data-cell-id', this.cellView.cell.id)
    }
  }

  getName() {
    return this.name
  }

  show() {
    this.container.style.display = ''
    this.visible = true
  }

  hide() {
    this.container.style.display = 'none'
    this.visible = false
  }

  isVisible() {
    return this.visible
  }

  focus() {
    const opacity = this.options.focusOpacity
    if (isFinite(opacity)) {
      this.container.style.opacity = opacity
    }
    this.parentView.focusTool(this)
  }

  blur() {
    this.container.style.opacity = ''
    this.parentView.blurTool(this)
  }

  update() {}

  guard(evt) {
    if (this.graph == null || this.cellView == null) {
      return true
    }

    return this.graph.guard(evt, this.cellView)
  }
}

export namespace ToolView {
  export interface Options {
    isSvgElement: boolean
    focusOpacity?: number
  }
}
