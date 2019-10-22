import React from 'react'
import { MenuItem } from './item'

export const SubMenu: React.SFC<MenuItem.Props> = (props) => {
  const { hotkey, children, ...others } = props
  return (
    <div {...MenuItem.getProps(props, 'nb-menu-submenu')}>
      {
        MenuItem.getContent(
          others,
          null,
          (
            <span className="nb-menu-submenu-arrow" />
          ),
          (
            <div className="nb-menu-submenu-menu">
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
