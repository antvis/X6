import { Disposable, disposable } from '../../common'
import type { Graph, GraphPlugin } from '../../graph'
import { KeyboardImpl } from './keyboard'
import './api'
import type {
  KeyboardImplAction,
  KeyboardImplHandler,
  KeyboardImplOptions,
} from './type'

export class Keyboard extends Disposable implements GraphPlugin {
  public name = 'keyboard'
  private keyboardImpl: KeyboardImpl
  public options: KeyboardImplOptions

  constructor(options: KeyboardImplOptions = {}) {
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
    // the enabled state is not specified.
    if (enabled === undefined) {
      enabled = !this.isEnabled()
    }
    enabled ? this.enable() : this.disable()
    return this
  }

  bindKey(
    keys: string | string[],
    callback: KeyboardImplHandler,
    action?: KeyboardImplAction,
  ) {
    this.keyboardImpl.on(keys, callback, action)
    return this
  }

  trigger(key: string, action?: KeyboardImplAction) {
    this.keyboardImpl.trigger(key, action)
    return this
  }

  clear() {
    this.keyboardImpl.clear()
    return this
  }

  unbindKey(keys: string | string[], action?: KeyboardImplAction) {
    this.keyboardImpl.off(keys, action)
    return this
  }

  // #endregion

  @disposable()
  dispose() {
    this.keyboardImpl.dispose()
  }
}
