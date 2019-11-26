import React, { MouseEvent } from 'react'

export const MenuContext = React.createContext<MenuContext.Contexts>({
  onClick: null,
  registerHotkey: null,
})

export namespace MenuContext {
  export interface Contexts {
    onClick: ((key: string, e: MouseEvent | ExtendedKeyboardEvent) => void) | null
    registerHotkey: ((
      key: string,
      handler: (e?: ExtendedKeyboardEvent, combo?: string) => any,
    ) => void) | null
  }
}
