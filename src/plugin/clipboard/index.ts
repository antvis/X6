import { Basecoat } from '../../common'
import { Graph } from '../../graph'
import { Cell } from '../../model'
import { ClipboardImpl } from './clipboard'
import './api'

export class Clipboard
  extends Basecoat<Clipboard.EventArgs>
  implements Graph.Plugin
{
  public name = 'clipboard'
  private clipboardImpl: ClipboardImpl
  private graph: Graph
  public options: Clipboard.Options

  get disabled() {
    return this.options.enabled !== true
  }

  get cells() {
    return this.clipboardImpl.cells
  }

  constructor(options: Clipboard.Options = {}) {
    super()
    this.options = { enabled: true, ...options }
  }

  init(graph: Graph) {
    this.graph = graph
    this.clipboardImpl = new ClipboardImpl()
    this.clipboardImpl.deserialize(this.options)
  }

  // #region api

  isEnabled() {
    return !this.disabled
  }

  enable() {
    if (this.disabled) {
      this.options.enabled = true
    }
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
    }
  }

  toggleEnabled(enabled?: boolean) {
    // the enabled state is not specified.
    if (enabled === undefined) {
      enabled = !this.isEnabled()
    }
    enabled ? this.enable() : this.disable()
    return this
  }

  isEmpty(options: Clipboard.Options = {}) {
    return this.clipboardImpl.isEmpty(options)
  }

  getCellsInClipboard() {
    return this.cells
  }

  clean(force?: boolean) {
    if (!this.disabled || force) {
      this.clipboardImpl.clean()
      this.notify('clipboard:changed', { cells: [] })
    }
    return this
  }

  copy(cells: Cell[], options: Clipboard.CopyOptions = {}) {
    if (!this.disabled) {
      this.clipboardImpl.copy(cells, this.graph, {
        ...this.commonOptions,
        ...options,
      })
      this.notify('clipboard:changed', { cells })
    }
    return this
  }

  cut(cells: Cell[], options: Clipboard.CopyOptions = {}) {
    if (!this.disabled) {
      this.clipboardImpl.cut(cells, this.graph, {
        ...this.commonOptions,
        ...options,
      })
      this.notify('clipboard:changed', { cells })
    }
    return this
  }

  paste(options: Clipboard.PasteOptions = {}, graph: Graph = this.graph) {
    if (!this.disabled) {
      return this.clipboardImpl.paste(graph, {
        ...this.commonOptions,
        ...options,
      })
    }
    return []
  }

  // #endregion

  protected get commonOptions() {
    const { enabled, ...others } = this.options
    return others
  }

  protected notify<K extends keyof Clipboard.EventArgs>(
    name: K,
    args: Clipboard.EventArgs[K],
  ) {
    this.trigger(name, args)
    this.graph.trigger(name, args)
  }

  @Basecoat.dispose()
  dispose() {
    this.clean(true)
    this.off()
  }
}

export namespace Clipboard {
  export interface EventArgs {
    'clipboard:changed': {
      cells: Cell[]
    }
  }

  export interface Options extends ClipboardImpl.Options {
    enabled?: boolean
  }

  export interface CopyOptions extends ClipboardImpl.CopyOptions {}
  export interface PasteOptions extends ClipboardImpl.PasteOptions {}
}
