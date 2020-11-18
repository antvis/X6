import { IDisablable } from '../common'
import { Clipboard } from '../addon/clipboard'
import { Cell } from '../model/cell'
import { Graph } from './graph'
import { Base } from './base'

export class ClipboardManager extends Base implements IDisablable {
  public widget: Clipboard

  protected get commonOptions() {
    const { enabled, ...others } = this.instanceOptions
    return others
  }

  protected get instanceOptions() {
    return this.options.clipboard
  }

  get cells() {
    return this.widget.cells
  }

  get disabled() {
    return this.instanceOptions.enabled !== true
  }

  protected init() {
    this.widget = this.graph.hook.createClipboard()
    this.widget.deserialize(this.instanceOptions)
  }

  enable() {
    if (this.disabled) {
      this.instanceOptions.enabled = true
    }
  }

  disable() {
    if (!this.disabled) {
      this.instanceOptions.enabled = false
    }
  }

  copy(cells: Cell[], options: Clipboard.CopyOptions = {}) {
    if (!this.disabled) {
      this.widget.copy(cells, this.graph, {
        ...this.commonOptions,
        ...options,
      })
    }
  }

  cut(cells: Cell[], options: Clipboard.CopyOptions = {}) {
    if (!this.disabled) {
      this.widget.cut(cells, this.graph, {
        ...this.commonOptions,
        ...options,
      })
    }
  }

  paste(options: Clipboard.PasteOptions = {}, graph: Graph = this.graph) {
    if (!this.disabled) {
      return this.widget.paste(graph, {
        ...this.commonOptions,
        ...options,
      })
    }
    return []
  }

  clean(force?: boolean) {
    if (!this.disabled || force) {
      this.widget.clean()
    }
  }

  isEmpty() {
    return this.widget.isEmpty()
  }

  @Base.dispose()
  dispose() {
    this.clean(true)
  }
}

export namespace ClipboardManager {
  export interface Options extends Clipboard.Options {
    enabled?: boolean
  }

  export interface CopyOptions extends Clipboard.CopyOptions {}
  export interface PasteOptions extends Clipboard.PasteOptions {}
}
