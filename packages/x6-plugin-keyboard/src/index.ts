import { Disposable } from '@antv/x6-common'
import { Graph } from '@antv/x6'
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

  isKeyboardEnabled() {
    return !this.keyboardImpl.disabled
  }

  enableKeyboard() {
    this.keyboardImpl.enable()
    return this
  }

  disableKeyboard() {
    this.keyboardImpl.disable()
    return this
  }

  toggleKeyboard(enabled?: boolean) {
    if (enabled != null) {
      if (enabled !== this.isKeyboardEnabled()) {
        if (enabled) {
          this.enableKeyboard()
        } else {
          this.disableKeyboard()
        }
      }
    } else if (this.isKeyboardEnabled()) {
      this.disableKeyboard()
    } else {
      this.enableKeyboard()
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
