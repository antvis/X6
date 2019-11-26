import React, { MouseEvent } from 'react'
import classnames from 'classnames'
// import { Mousetrap, HotkeyUtil } from '@/components'
import { MenuItem } from './item'
import { MenuDivider } from './divider'
import { SubMenu as MenuSubMenu } from './submenu'
import { MenuContext } from './context'
import './menu.less'

export class Menu extends React.PureComponent<Menu.Props> {
  registerHotkey = (
    hotkey: string,
    handler: (e?: ExtendedKeyboardEvent, combo?: string) => any,
  ) => {
    // const key = HotkeyUtil.getHotkeyForBind(hotkey)
    // Mousetrap.bind(key, handler)
  }

  onClick = (name: string, e: MouseEvent | ExtendedKeyboardEvent) => {
    if (this.props.stopPropagation) {
      e.stopPropagation()
    }

    if (this.props.onClick) {
      this.props.onClick(name, e)
    }
  }

  render() {
    const { className, children, hasIcon } = this.props
    const ContextProvider = MenuContext.Provider
    const contextValue: MenuContext.Contexts = {
      onClick: this.onClick,
      registerHotkey: this.registerHotkey,
    }

    return (
      <div
        className={classnames(
          'x6-menu', {
          'x6-menu-has-icon': hasIcon,
        },
          className,
        )}
      >
        <ContextProvider value={contextValue}>
          {
            children
          }
        </ContextProvider>
      </div>
    )
  }
}

export namespace Menu {
  export const Item = MenuItem
  export const Divider = MenuDivider
  export const SubMenu = MenuSubMenu
  export const Context = MenuContext

  export interface Props {
    className?: string
    hasIcon?: boolean
    stopPropagation?: boolean
    onClick?: (name: string, e?: MouseEvent | ExtendedKeyboardEvent) => void
    onKeyUp?: (name: string, e?: MouseEvent | ExtendedKeyboardEvent) => void
  }

  export const defaultProps = {
    stopPropagation: true,
  }
}
