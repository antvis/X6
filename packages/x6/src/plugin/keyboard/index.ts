import { Disposable } from '@antv/x6-common'
import { Graph } from '../../graph'
import { KeyboardImpl } from './keyboard'
import './api'

export class Keyboard extends Disposable implements Graph.Plugin {
  public name = 'keyboard'
  private keyboardImpl: KeyboardImpl
  public options: KeyboardImpl.Options

  constructor(options: KeyboardImpl.Options = {}) {
    super()
    this.options = { enabled: true, ...options }
  }

  init(graph: Graph) {
    this.keyboardImpl = new KeyboardImpl({
      ...this.options,
      graph,
    })
  }

  // #region api

  isEnabled() {
    return !this.keyboardImpl.disabled
  }

  enable() {
    this.keyboardImpl.enable()
  }

  disable() {
    this.keyboardImpl.disable()
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

  bindKey(
    keys: string | string[],
    callback: KeyboardImpl.Handler,
    action?: KeyboardImpl.Action,
  ) {
    this.keyboardImpl.on(keys, callback, action)
    return this
  }

  trigger(key: string, action?: KeyboardImpl.Action) {
    this.keyboardImpl.trigger(key, action)
    return this
  }

  clear() {
    this.keyboardImpl.clear()
    return this
  }

  unbindKey(keys: string | string[], action?: KeyboardImpl.Action) {
    this.keyboardImpl.off(keys, action)
    return this
  }

  // #endregion

  @Disposable.dispose()
  dispose() {
    this.keyboardImpl.dispose()
  }
}
