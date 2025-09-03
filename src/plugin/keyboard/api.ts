import { Graph } from '../../graph'
import type { Keyboard } from './index'
import { KeyboardImpl } from './keyboard'
import type { KeyboardImplAction, KeyboardImplHandler } from './type'

declare module '../../graph/graph' {
  interface Graph {
    isKeyboardEnabled: () => boolean
    enableKeyboard: () => Graph
    disableKeyboard: () => Graph
    toggleKeyboard: (enabled?: boolean) => Graph
    bindKey: (
      keys: string | string[],
      callback: KeyboardImplHandler,
      action?: KeyboardImplAction,
    ) => Graph
    unbindKey: (keys: string | string[], action?: KeyboardImplAction) => Graph
    clearKeys: () => Graph
    triggerKey: (key: string, action: KeyboardImplAction) => Graph
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
  callback: KeyboardImplHandler,
  action?: KeyboardImplAction,
) {
  const keyboard = this.getPlugin('keyboard') as Keyboard
  if (keyboard) {
    keyboard.bindKey(keys, callback, action)
  }
  return this
}

Graph.prototype.unbindKey = function (
  keys: string | string[],
  action?: KeyboardImplAction,
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
  action: KeyboardImplAction,
) {
  const keyboard = this.getPlugin('keyboard') as Keyboard
  if (keyboard) {
    keyboard.trigger(key, action)
  }
  return this
}
