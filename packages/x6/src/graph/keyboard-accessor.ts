import { BaseGraph } from './base-graph'
import { KeyboardHandler } from '../handler'

export class KeyboardAccessor extends BaseGraph {
  isKeyboardEnabled() {
    return this.keyboardHandler.isEnabled()
  }

  enableKeyboard() {
    this.keyboardHandler.enable()
    return this
  }

  disableKeyboard() {
    this.keyboardHandler.disable()
    return this
  }

  bindKey(
    keys: string | string[],
    handler: KeyboardHandler.Handler,
    action?: KeyboardHandler.Action,
  ) {
    this.keyboardHandler.bind(keys, handler, action)
    return this
  }

  unbindKey(keys: string | string[], action?: KeyboardHandler.Action) {
    this.keyboardHandler.unbind(keys, action)
    return this
  }

  onKeyPress(keys: string | string[], handler: KeyboardHandler.Handler) {
    this.bindKey(keys, handler, 'keypress')
    return this
  }

  onKeyDown(keys: string | string[], handler: KeyboardHandler.Handler) {
    this.bindKey(keys, handler, 'keydown')
    return this
  }

  onKeyUp(keys: string | string[], handler: KeyboardHandler.Handler) {
    this.bindKey(keys, handler, 'keyup')
    return this
  }
}
