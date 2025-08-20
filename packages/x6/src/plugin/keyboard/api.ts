import { Graph } from '../../graph'
import { Keyboard } from './index'
import type { KeyboardImpl } from './keyboard'

declare module '../../graph/graph' {
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
    clearKeys: () => Graph
    triggerKey: (key: string, action: KeyboardImpl.Action) => Graph
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

Graph.prototype.clearKeys = function () {
  const keyboard = this.getPlugin('keyboard') as Keyboard
  if (keyboard) {
    keyboard.clear()
  }
  return this
}

Graph.prototype.triggerKey = function (
  key: string,
  action: KeyboardImpl.Action,
) {
  const keyboard = this.getPlugin('keyboard') as Keyboard
  if (keyboard) {
    keyboard.trigger(key, action)
  }
  return this
}
