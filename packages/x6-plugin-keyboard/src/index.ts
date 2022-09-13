import { Disposable } from '@antv/x6-common'
import { Graph } from '@antv/x6-next'
import { KeyboardImpl } from './keyboard'

export class Keyboard extends Disposable {
  public name = 'keyboard'
  private keyboard: KeyboardImpl

  constructor(public readonly options: KeyboardImpl.Options) {
    super()
  }

  public init(graph: Graph) {
    this.keyboard = new KeyboardImpl(this.options, graph)
  }

  isKeyboardEnabled() {
    return !this.keyboard.disabled
  }

  enableKeyboard() {
    this.keyboard.enable()
    return this
  }

  disableKeyboard() {
    this.keyboard.disable()
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
    this.keyboard.on(keys, callback, action)
    return this
  }

  unbindKey(keys: string | string[], action?: KeyboardImpl.Action) {
    this.keyboard.off(keys, action)
    return this
  }

  @Disposable.dispose()
  dispose() {
    this.keyboard.dispose()
  }
}
