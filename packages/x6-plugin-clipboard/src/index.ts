import { IDisablable, Disposable } from '@antv/x6-common'
import { Cell, Graph } from '@antv/x6'
import { ClipboardImpl } from './clipboard'

export class Clipboard extends Disposable implements IDisablable {
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

  isClipboardEnabled() {
    return !this.disabled
  }

  enableClipboard() {
    this.enable()
    return this
  }

  disableClipboard() {
    this.disable()
    return this
  }

  toggleClipboard(enabled?: boolean) {
    if (enabled != null) {
      if (enabled !== this.isClipboardEnabled()) {
        if (enabled) {
          this.enableClipboard()
        } else {
          this.disableClipboard()
        }
      }
    } else if (this.isClipboardEnabled()) {
      this.disableClipboard()
    } else {
      this.enableClipboard()
    }

    return this
  }

  isClipboardEmpty() {
    return this.isEmpty()
  }

  getCellsInClipboard() {
    return this.cells
  }

  cleanClipboard() {
    this.clean()
    return this
  }

  copy(cells: Cell[], options: Clipboard.CopyOptions = {}) {
    if (!this.disabled) {
      this.clipboardImpl.copy(cells, this.graph, {
        ...this.commonOptions,
        ...options,
      })
      this.graph.trigger('clipboard:changed', { cells })
    }
  }

  cut(cells: Cell[], options: Clipboard.CopyOptions = {}) {
    if (!this.disabled) {
      this.clipboardImpl.cut(cells, this.graph, {
        ...this.commonOptions,
        ...options,
      })
      this.graph.trigger('clipboard:changed', { cells })
    }
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

  private get commonOptions() {
    const { enabled, ...others } = this.options
    return others
  }

  private get cells() {
    return this.clipboardImpl.cells
  }

  get disabled() {
    return this.options.enabled !== true
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

  private clean(force?: boolean) {
    if (!this.disabled || force) {
      this.clipboardImpl.clean()
      this.graph.trigger('clipboard:changed', { cells: [] })
    }
  }

  private isEmpty() {
    return this.clipboardImpl.isEmpty()
  }

  @Disposable.dispose()
  dispose() {
    this.clean(true)
  }
}

export namespace Clipboard {
  export interface ClipboardEventArgs {
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
