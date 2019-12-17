import { BaseGraph } from './base-graph'

export class ContextMenuAccessor extends BaseGraph {
  hideContextMenu() {
    this.contextMenuHandler.hide()
    return this
  }

  isContextMenuEnabled() {
    return this.contextMenuHandler.isEnabled()
  }

  enableContextMenu() {
    if (!this.isContextMenuEnabled()) {
      this.contextMenuHandler.enable()
    }
    return this
  }

  disableContextMenu() {
    if (this.isContextMenuEnabled()) {
      this.contextMenuHandler.disable()
    }
    return this
  }

  isContextMenuActive() {
    return this.contextMenuHandler.isShowing()
  }
}
