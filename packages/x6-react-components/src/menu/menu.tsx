import React, { MouseEvent, PropsWithChildren } from 'react'
import classNames from 'classnames'
import { MenuItem } from './item'
import { MenuDivider } from './divider'
import { MenuContext } from './context'
import { MenuSubMenu } from './submenu'

export class Menu extends React.PureComponent<PropsWithChildren<Menu.Props>> {
  private onClick = (name: string, e?: MouseEvent) => {
    if (this.props.stopPropagation && e != null) {
      e.stopPropagation()
    }

    if (this.props.onClick) {
      this.props.onClick(name)
    }
  }

  private registerHotkey = (hotkey: string, handler: () => any) => {
    if (this.props.registerHotkey) {
      this.props.registerHotkey(hotkey, handler)
    }
  }

  private unregisterHotkey = (hotkey: string, handler: () => any) => {
    if (this.props.unregisterHotkey) {
      this.props.unregisterHotkey(hotkey, handler)
    }
  }

  render() {
    const { prefixCls, className, children, hasIcon } = this.props
    const baseCls = `${prefixCls}-menu`
    const ContextProvider = MenuContext.Provider
    const contextValue: MenuContext.Contexts = {
      prefixCls: baseCls,
      onClick: this.onClick,
      registerHotkey: this.registerHotkey,
      unregisterHotkey: this.unregisterHotkey,
    }

    return (
      <div
        className={classNames(
          baseCls,
          {
            [`${baseCls}-has-icon`]: hasIcon,
          },
          className,
        )}
      >
        <ContextProvider value={contextValue}>{children}</ContextProvider>
      </div>
    )
  }
}

export namespace Menu {
  export const Item = MenuItem
  export const Divider = MenuDivider
  export const SubMenu = MenuSubMenu

  export interface Props {
    prefixCls?: string
    className?: string
    hasIcon?: boolean
    stopPropagation?: boolean
    onClick?: (name: string) => void
    registerHotkey?: (hotkey: string, handler: () => void) => void
    unregisterHotkey?: (hotkey: string, handler: () => void) => void
  }

  export const defaultProps: Props = {
    prefixCls: 'x6',
    stopPropagation: false,
  }
}
