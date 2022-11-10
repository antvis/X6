import { Graph } from '@antv/x6'
import { Keyboard } from './index'
import { KeyboardImpl } from './keyboard'

declare module '@antv/x6/lib/graph/graph' {
  interface Graph {
    isKeyboardEnabled: () => boolean
    enableKeyboard: () => Graph
    disableKeyboard: () => Graph
    toggleKeyboard: (enabled?: boolean) => Graph
    bindKey: (
      keys: string | string[],
      callback: KeyboardImpl.Handler,
      action?: KeyboardImpl.Action,
    ) => Graph
    unbindKey: (keys: string | string[], action?: KeyboardImpl.Action) => Graph
  }
}

Graph.prototype.isKeyboardEnabled = function () {
  const keyboard = this.getPlugin('keyboard') as Keyboard
  if (keyboard) {
    return keyboard.isEnabled()
  }
  return false
}

Graph.prototype.enableKeyboard = function () {
  const keyboard = this.getPlugin('keyboard') as Keyboard
  if (keyboard) {
    keyboard.enable()
  }
  return this
}

Graph.prototype.disableKeyboard = function () {
  const keyboard = this.getPlugin('keyboard') as Keyboard
  if (keyboard) {
    keyboard.disable()
  }
  return this
}

Graph.prototype.toggleKeyboard = function (enabled?: boolean) {
  const keyboard = this.getPlugin('keyboard') as Keyboard
  if (keyboard) {
    keyboard.toggleEnabled(enabled)
  }
  return this
}

Graph.prototype.bindKey = function (
  keys: string | string[],
  callback: KeyboardImpl.Handler,
  action?: KeyboardImpl.Action,
) {
  const keyboard = this.getPlugin('keyboard') as Keyboard
  if (keyboard) {
    keyboard.bindKey(keys, callback, action)
  }
  return this
}

Graph.prototype.unbindKey = function (
  keys: string | string[],
  action?: KeyboardImpl.Action,
) {
  const keyboard = this.getPlugin('keyboard') as Keyboard
  if (keyboard) {
    keyboard.unbindKey(keys, action)
  }
  return this
}
