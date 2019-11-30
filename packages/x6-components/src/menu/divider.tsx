import React from "react"
import { MenuContext } from "./context"

export const MenuDivider: React.SFC = () => (
  <MenuContext.Consumer>
    {({ prefixCls }) => (
      <div className={`${prefixCls}-item ${prefixCls}-item-divider`} />
    )}
  </MenuContext.Consumer>
)
