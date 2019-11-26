import React from 'react'

export const MenubarContext = React.createContext<MenubarContext.Contexts>({
  activeMenubar: null,
  menubarActived: false,
})

export namespace MenubarContext {
  export interface Contexts {
    activeMenubar: (() => void) | null
    menubarActived: boolean
  }
}
