import { Disposable, Graph } from '@antv/x6'
import { KeyboardImpl } from './keyboard'

export class Keyboard extends Disposable {
  private keyboardImpl: KeyboardImpl
  public name = 'keyboard'

  constructor(public readonly options: KeyboardImpl.Options) {
    super()
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
    return this
  }

  disable() {
    this.keyboardImpl.disable()
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

  bindKey(
    keys: string | string[],
    callback: KeyboardImpl.Handler,
    action?: KeyboardImpl.Action,
  ) {
    this.keyboardImpl.on(keys, callback, action)
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
