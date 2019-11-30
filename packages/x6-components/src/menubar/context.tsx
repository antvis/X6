import React from "react"

export const MenubarContext = React.createContext<MenubarContext.Contexts>(
  {} as any
)

export namespace MenubarContext {
  export interface Contexts {
    prefixCls: string
    activeMenubar: () => void
    menubarActived: boolean
  }
}
