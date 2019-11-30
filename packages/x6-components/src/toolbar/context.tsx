import React from "react"

export const ToolbarContext = React.createContext<ToolbarContext.Contexts>(
  {} as any
)

export namespace ToolbarContext {
  export interface Contexts {
    prefixCls: string
    onClick: (key: string, value?: any) => void
  }
}
