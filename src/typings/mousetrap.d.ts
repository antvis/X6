interface ExtendedKeyboardEvent extends KeyboardEvent {
  returnValue: boolean // IE returnValue
}

interface MousetrapStatic {
  (el: Element): MousetrapInstance
  new(el?: Element): MousetrapInstance
  reset(): MousetrapInstance
  addKeycodes(keycodes: { [key: number]: string }): void
  stopCallback: (e: ExtendedKeyboardEvent, element: Element, combo: string) => boolean
  bind(
    keys: string | string[],
    callback: (e: ExtendedKeyboardEvent, combo: string) => any,
    action?: string,
  ): MousetrapInstance
  unbind(keys: string | string[], action?: string): MousetrapInstance
  trigger(keys: string, action?: string): MousetrapInstance

  bindGlobal(
    keyArray: string | string[],
    callback: (e: ExtendedKeyboardEvent, combo: string) => any,
    action?: string,
  ): void
}

interface MousetrapInstance {
  reset(): this
  stopCallback(e: ExtendedKeyboardEvent, element: Element, combo: string): boolean
  bind(
    keys: string | string[],
    callback: (e: ExtendedKeyboardEvent, combo: string) => any,
    action?: string,
  ): this
  unbind(keys: string | string[], action?: string): this
  trigger(keys: string, action?: string): this
  handleKey(character: string, modifiers: string[], e: ExtendedKeyboardEvent): void
}

declare var Mousetrap: MousetrapStatic

declare module 'mousetrap' {
  export = Mousetrap
}
