import React, { MouseEvent } from 'react'
import { Icon } from 'antd'
import classnames from 'classnames'
import { MenuContext } from './context'
// import { HotkeyUtil } from '@/components'

export class MenuItem extends React.PureComponent<MenuItem.Props> {
  componentDidMount() {
    const { hotkey } = this.props
    if (hotkey) {
      this.context.registerHotkey(hotkey, this.onHotkey)
    }
  }

  onHotkey = (e: ExtendedKeyboardEvent) => {
    e.returnValue = false
    this.triggerHandler(e)
  }

  onClick = (e: MouseEvent) => {
    this.triggerHandler(e)
  }

  triggerHandler(e: MouseEvent | ExtendedKeyboardEvent) {
    if (!this.props.disabled && !this.props.hidden) {
      this.context.onClick(this.props.name, e)
      if (this.props.onClick) {
        this.props.onClick(e)
      }
    }
  }

  render() {
    return (
      <div {...MenuItem.getProps(this.props)}>
        {MenuItem.getContent(this.props, this.onClick)}
      </div>
    )
  }
}

export namespace MenuItem {
  export const contextType = MenuContext

  export interface Props {
    className?: string
    name?: string
    icon?: string | React.ReactNode
    text?: string | React.ReactNode
    hotkey?: string
    active?: boolean
    hidden?: boolean
    disabled?: boolean
    children?: React.ReactNode
    onClick?: (e?: MouseEvent | ExtendedKeyboardEvent) => void
  }

  export function getProps(props: Props, extraCls?: string) {
    const { className, disabled, active, hidden } = props
    return {
      className: classnames(
        'nb-menu-item',
        extraCls,
        {
          'nb-menu-item-active': active,
          'nb-menu-item-hidden': hidden,
          'nb-menu-item-disabled': disabled,
        },
        className,
      ),
    }
  }

  export function getContent(
    props: Props,
    handleClick: any,
    innerExtra?: any,
    outerExtra?: any,
  ) {
    const { icon, text, hotkey, children } = props
    return (
      <React.Fragment>
        <button className="nb-menu-button" onClick={handleClick}>
          {
            icon && (
              <span className="nb-menu-item-icon">
                {
                  typeof icon === 'string'
                    ? (<Icon type={icon as string} />)
                    : (icon)
                }
              </span>
            )
          }
          <span className="nb-menu-item-text">{text || children}</span>
          {
            hotkey && (
              <span className="nb-menu-item-hotkey">
                {hotkey}
                {/* {HotkeyUtil.getHotkeyForDisplay(hotkey)} */}
              </span>
            )
          }
          {innerExtra}
        </button>
        {outerExtra}
      </React.Fragment>
    )
  }
}
