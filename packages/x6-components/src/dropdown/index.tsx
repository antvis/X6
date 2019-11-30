import React from "react"
import classNames from "classnames"
import RcDropdown from "rc-dropdown"
import { Menu } from "../menu"

export class Dropdown extends React.Component<Dropdown.Props, any> {
  getTransitionName() {
    const { placement = "", transitionName } = this.props
    if (transitionName !== undefined) {
      return transitionName
    }
    if (placement.indexOf("top") >= 0) {
      return "slide-down"
    }
    return "slide-up"
  }

  render() {
    const { children, trigger, disabled, onMenuClick } = this.props

    const prefixCls = `${this.props.prefixCls}-dropdown`
    const dropdownTrigger = React.cloneElement(this.props.children as any, {
      className: classNames(
        (children as any).props.className,
        `${prefixCls}-trigger`
      ),
      disabled
    })

    const triggers = disabled
      ? []
      : Array.isArray(trigger)
      ? trigger
      : [trigger]

    let alignPoint
    if (triggers && triggers.indexOf("contextMenu") !== -1) {
      alignPoint = true
    }

    const overlay = React.Children.only(this.props.overlay) as any
    let fixedOverlay = overlay
    if (overlay != null && overlay.type === Menu && onMenuClick) {
      const onClick = (name: string) => {
        onMenuClick(name)
        if (overlay.props.onClick) {
          overlay.props.onClick(name)
        }
      }

      fixedOverlay = React.cloneElement(overlay, { onClick })
    }

    return (
      <RcDropdown
        {...this.props}
        prefixCls={prefixCls}
        overlay={fixedOverlay}
        alignPoint={alignPoint}
        trigger={triggers as string[]}
        transitionName={this.getTransitionName()}
      >
        {dropdownTrigger}
      </RcDropdown>
    )
  }
}

export namespace Dropdown {
  export type Trigger = "click" | "hover" | "contextMenu"
  export type Placement =
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight"

  export interface Props {
    prefixCls?: string
    className?: string
    overlayClassName?: string
    openClassName?: string
    visible?: boolean
    disabled?: boolean
    align?: Object
    trigger?: Trigger | Trigger[]
    overlay?: React.ReactNode
    transitionName?: string
    placement?: Placement
    forceRender?: boolean
    onMenuClick?: (name: string) => void
    onVisibleChange?: (visible?: boolean) => void
    getPopupContainer?: (triggerNode: Element) => HTMLElement
  }

  export const defaultProps = {
    trigger: "hover",
    prefixCls: "x6",
    mouseEnterDelay: 0.15,
    mouseLeaveDelay: 0.1,
    placement: "bottomLeft"
  }
}
