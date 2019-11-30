import React, { MouseEvent } from "react"
import classNames from "classnames"
import { Icon } from "../icon"
import { MenuContext } from "./context"

export class MenuItemInner extends React.PureComponent<MenuItemInner.Props> {
  componentDidMount() {
    const { hotkey } = this.props
    if (hotkey) {
      this.props.context.registerHotkey(hotkey, this.onHotkey)
    }
  }

  componentWillUnmount() {
    const { hotkey } = this.props
    if (hotkey) {
      this.props.context.unregisterHotkey(hotkey, this.onHotkey)
    }
  }

  private onHotkey = () => {
    this.triggerHandler()
  }

  private onClick = (e: MouseEvent) => {
    this.triggerHandler(e)
  }

  private triggerHandler(e?: MouseEvent) {
    if (!this.props.disabled && !this.props.hidden) {
      if (this.props.name) {
        this.props.context.onClick(this.props.name, e)
      }

      if (this.props.onClick) {
        this.props.onClick()
      }
    }
  }

  render() {
    return (
      <div {...MenuItemInner.getProps(this.props)}>
        {MenuItemInner.getContent(this.props, this.onClick)}
      </div>
    )
  }
}

export namespace MenuItemInner {
  export interface Props extends MenuItem.Props {
    context: MenuContext.Contexts
  }

  export function getProps(props: Props, extraCls?: string) {
    const { className, disabled, active, hidden } = props
    const { prefixCls } = props.context
    const baseCls = `${prefixCls}-item`
    return {
      className: classNames(
        baseCls,
        extraCls,
        {
          [`${baseCls}-active`]: active,
          [`${baseCls}-hidden`]: hidden,
          [`${baseCls}-disabled`]: disabled
        },
        className
      )
    }
  }

  export function getContent(
    props: Props,
    onClick: any,
    innerExtra?: any,
    outerExtra?: any
  ) {
    const { icon, text, hotkey, children } = props
    const { prefixCls } = props.context
    const baseCls = `${prefixCls}-item`
    return (
      <React.Fragment>
        <button className={`${baseCls}-button`} onClick={onClick}>
          {icon && (
            <span className={`${baseCls}-icon`}>
              {React.isValidElement(icon) ? (
                icon
              ) : (
                  <Icon type={icon as string | Icon.IconData} />
                )}
            </span>
          )}
          <span className={`${baseCls}-text`}>{text || children}</span>
          {hotkey && <span className={`${baseCls}-hotkey`}>{hotkey}</span>}
          {innerExtra}
        </button>
        {outerExtra}
      </React.Fragment>
    )
  }
}

export const MenuItem: React.SFC<MenuItem.Props> = (props) => (
  <MenuContext.Consumer>
    {(context) => <MenuItemInner context={context} {...props} />}
  </MenuContext.Consumer>
)

export namespace MenuItem {
  export interface Props {
    className?: string
    name?: string
    icon?: string | React.ReactNode | Icon.IconData
    text?: string | React.ReactNode
    hotkey?: string
    active?: boolean
    hidden?: boolean
    disabled?: boolean
    children?: React.ReactNode
    onClick?: () => void
  }
}
