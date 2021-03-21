import React from 'react'

export const MenubarContext = React.createContext<MenubarContext.Contexts>(
  {} as any,
)

// eslint-disable-next-line @typescript-eslint/no-redeclare
export namespace MenubarContext {
  export interface Contexts {
    prefixCls: string
    activeMenubar: () => void
    menubarActived: boolean
  }
}
