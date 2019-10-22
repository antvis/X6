import React from 'react'

export const ToolbarContext = React.createContext<ToolbarContext.Contexts>({
  onClick: null,
})

export namespace ToolbarContext {
  export interface Contexts {
    onClick: ((key: string, value?: any) => void) | null
  }
}
