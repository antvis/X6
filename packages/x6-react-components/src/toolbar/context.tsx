import React from 'react'

export const ToolbarContext = React.createContext<ToolbarContext.Contexts>(
  {} as any,
)

// eslint-disable-next-line @typescript-eslint/no-redeclare
export namespace ToolbarContext {
  export interface Contexts {
    prefixCls: string
    onClick: (key: string, value?: any) => void
  }
}
