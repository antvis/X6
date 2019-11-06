import MousetrapNative from 'mousetrap'
import { KeyboardHandler } from './handler'

export class Mousetrap extends MousetrapNative {
  keyboardHandler: KeyboardHandler

  constructor(elem: Element, keyboardHandler: KeyboardHandler) {
    super(elem)
    this.keyboardHandler = keyboardHandler
  }

  stopCallback(
    e: KeyboardEvent,
    elem: HTMLElement,
    combo: string,
  ) {
    if (
      this.keyboardHandler.isEnabledForEvent(e) &&
      !this.keyboardHandler.isEventIgnored(e)
    ) {

      if (e.keyCode === 27) {
        this.keyboardHandler.escape(e)
      }

      return super.stopCallback(e, elem, combo)
    }

    return false
  }
}
