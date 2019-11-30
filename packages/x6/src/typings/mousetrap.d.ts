interface ExtendedKeyboardEvent extends KeyboardEvent {
  returnValue: boolean // IE returnValue
}

type Action = 'keypress' | 'keydown' | 'keyup'
type Callback = (e: ExtendedKeyboardEvent, combo: string) => any

interface MousetrapStatic {
  (el: Element): MousetrapInstance
  new (el?: Element): MousetrapInstance
  reset(): MousetrapInstance
  addKeycodes(keycodes: { [key: number]: string }): void
  stopCallback: (
    e: ExtendedKeyboardEvent,
    element: Element,
    combo: string
  ) => boolean
  bind(
    keys: string | string[],
    callback: Callback,
    action?: Action
  ): MousetrapInstance
  unbind(keys: string | string[], action?: string): MousetrapInstance
  trigger(keys: string, action?: string): MousetrapInstance
  bindGlobal(
    keyArray: string | string[],
    callback: Callback,
    action?: Action
  ): void
}

interface MousetrapInstance {
  reset(): this
  stopCallback(
    e: ExtendedKeyboardEvent,
    element: Element,
    combo: string
  ): boolean
  bind(keys: string | string[], callback: Callback, action?: Action): this
  unbind(keys: string | string[], action?: Action): this
  trigger(keys: string, action?: Action): this
  handleKey(
    character: string,
    modifiers: string[],
    e: ExtendedKeyboardEvent
  ): void
}

declare var Mousetrap: MousetrapStatic

declare module 'mousetrap' {
  export = Mousetrap
}
