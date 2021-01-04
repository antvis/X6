import { Node } from '../model/node'
import { Knob } from '../addon/knob'
import { Base } from './base'
import { EventArgs } from './events'

export class KnobManager extends Base {
  protected widgets: Map<Node, Knob> = new Map()

  protected get isSelectionEnabled() {
    return this.options.selecting.enabled === true
  }

  protected init() {
    this.startListening()
  }

  protected startListening() {
    this.graph.on('node:mouseup', this.onNodeMouseUp, this)
    this.graph.on('node:selected', this.onNodeSelected, this)
    this.graph.on('node:unselected', this.onNodeUnSelected, this)
  }

  protected stopListening() {
    this.graph.off('node:mouseup', this.onNodeMouseUp, this)
    this.graph.off('node:selected', this.onNodeSelected, this)
    this.graph.off('node:unselected', this.onNodeUnSelected, this)
  }

  protected onNodeMouseUp({ node }: EventArgs['node:mouseup']) {
    if (!this.isSelectionEnabled) {
      const widget = this.graph.hook.createKnob(node, { clearAll: true })
      if (widget) {
        this.widgets.set(node, widget)
      }
    }
  }

  protected onNodeSelected({ node }: EventArgs['node:selected']) {
    if (this.isSelectionEnabled) {
      const widget = this.graph.hook.createKnob(node, { clearAll: false })
      if (widget) {
        this.widgets.set(node, widget)
      }
    }
  }

  protected onNodeUnSelected({ node }: EventArgs['node:unselected']) {
    if (this.isSelectionEnabled) {
      const widget = this.widgets.get(node)
      if (widget) {
        widget.dispose()
      }
      this.widgets.delete(node)
    }
  }
}
