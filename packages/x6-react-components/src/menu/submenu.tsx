import React from 'react'
import { MenuContext } from './context'
import { MenuItem, MenuItemInner } from './item'

export const MenuSubMenu: React.FC<MenuItem.Props> = (props) => {
  const { hotkey, children, ...others } = props
  return (
    <MenuContext.Consumer>
      {(context) => {
        const { prefixCls } = context
        const wrapProps = MenuItemInner.getProps(
          { context, ...props },
          `${prefixCls}-submenu`,
        )
        return (
          <div {...wrapProps}>
            {MenuItemInner.getContent(
              { context, ...others },
              null,
              <span className={`${prefixCls}-submenu-arrow`} />,
              <div className={`${prefixCls}-submenu-menu`}>{children}</div>,
            )}
          </div>
        )
      }}
    </MenuContext.Consumer>
  )
}
