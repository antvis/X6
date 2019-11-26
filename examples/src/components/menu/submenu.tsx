import React from 'react'
import { MenuItem } from './item'

export const SubMenu: React.SFC<MenuItem.Props> = (props) => {
  const { hotkey, children, ...others } = props
  return (
    <div {...MenuItem.getProps(props, 'x6-menu-submenu')}>
      {
        MenuItem.getContent(
          others,
          null,
          (
            <span className="x6-menu-submenu-arrow" />
          ),
          (
            <div className="x6-menu-submenu-menu">
              {
                children
              }
            </div>
          ),
        )
      }
    </div>
  )
}
