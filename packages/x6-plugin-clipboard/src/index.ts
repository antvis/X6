import { Cell, Graph, IDisablable, Basecoat } from '@antv/x6'
import { ClipboardImpl } from './clipboard'

export class Clipboard
  extends Basecoat<Clipboard.EventArgs>
  implements IDisablable
{
  private clipboardImpl: ClipboardImpl
  private graph: Graph
  public name = 'clipboard'

  constructor(public readonly options: Clipboard.Options) {
    super()
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
    return this
  }

  disable() {
    if (!this.disabled) {
      this.options.enabled = false
    }
    return this
  }

  toggleEnabled(enabled?: boolean) {
    if (enabled != null) {
      if (enabled !== this.isEnabled()) {
        if (enabled) {
          this.enable()
        } else {
          this.disable()
        }
      }
    } else if (this.isEnabled()) {
      this.disable()
    } else {
      this.enable()
    }

    return this
  }

  isEmpty() {
    return this.clipboardImpl.isEmpty()
  }

  getCellsInClipboard() {
    return this.cells
  }

  private clean(force?: boolean) {
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

  get disabled() {
    return this.options.enabled !== true
  }

  private get commonOptions() {
    const { enabled, ...others } = this.options
    return others
  }

  private get cells() {
    return this.clipboardImpl.cells
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
