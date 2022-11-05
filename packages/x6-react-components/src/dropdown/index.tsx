import React, { PropsWithChildren } from 'react'
import classNames from 'classnames'
import RcDropdown from 'rc-dropdown'

export class Dropdown extends React.Component<
  PropsWithChildren<Dropdown.Props>,
  any
> {
  // getTransitionName() {
  //   const { placement = '', transitionName } = this.props
  //   if (transitionName !== undefined) {
  //     return transitionName
  //   }
  //   if (placement.indexOf('top') >= 0) {
  //     return 'slide-down'
  //   }
  //   return 'slide-up'
  // }

  render() {
    const { children, trigger, disabled } = this.props

    const prefixCls = `${this.props.prefixCls}-dropdown`
    const child = React.Children.only(children) as React.ReactElement<any>
    const dropdownTrigger = React.cloneElement(child, {
      className: classNames(
        (children as any).props.className,
        `${prefixCls}-trigger`,
      ),
      disabled,
    })

    const triggers = disabled
      ? []
      : Array.isArray(trigger)
      ? trigger
      : [trigger]

    let alignPoint = false
    if (triggers && triggers.indexOf('contextMenu') !== -1) {
      alignPoint = true
    }

    const overlay = React.Children.only(this.props.overlay) as any
    const fixedOverlay = <div className={`${prefixCls}-overlay`}>{overlay}</div>

    return (
      <RcDropdown
        {...this.props}
        prefixCls={prefixCls}
        overlay={fixedOverlay}
        alignPoint={alignPoint}
        trigger={triggers as string[]}
      >
        {dropdownTrigger}
      </RcDropdown>
    )
  }
}

export namespace Dropdown {
  export type Trigger = 'click' | 'hover' | 'contextMenu'
  export type Placement =
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomCenter'
    | 'bottomRight'

  export interface Props {
    prefixCls?: string
    className?: string
    overlay?: React.ReactNode
    overlayStyle?: React.CSSProperties
    overlayClassName?: string
    visible?: boolean
    disabled?: boolean
    trigger?: Trigger | Trigger[]
    transitionName?: string
    placement?: Placement
    forceRender?: boolean
    mouseEnterDelay?: number
    mouseLeaveDelay?: number
    onVisibleChange?: (visible?: boolean) => void
    getPopupContainer?: (triggerNode: Element) => HTMLElement
  }

  export const defaultProps: Props = {
    trigger: 'hover',
    prefixCls: 'x6',
    mouseEnterDelay: 0.15,
    mouseLeaveDelay: 0.1,
    placement: 'bottomLeft',
  }
}
