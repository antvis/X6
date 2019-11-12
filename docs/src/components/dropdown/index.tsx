import React from 'react'
import RcDropdown from 'rc-dropdown'
import { Menu } from '../menu'
import './index.less'

export class Dropdown extends React.Component<Dropdown.Props, any> {
  static defaultProps = {
    mouseEnterDelay: 0.15,
    mouseLeaveDelay: 0.1,
    placement: 'bottomLeft',
  }

  getTransitionName() {
    const { placement = '', transitionName } = this.props
    if (transitionName !== undefined) {
      return transitionName
    }
    if (placement.indexOf('top') >= 0) {
      return 'slide-down'
    }
    return 'slide-up'
  }

  render() {
    const {
      children,
      overlay: overlayElements,
      trigger,
      disabled,
      onMenuClick
    } = this.props

    const child = React.Children.only(children)
    const overlay = React.Children.only(overlayElements) as any

    const triggers = disabled
      ? []
      : Array.isArray(trigger) ? trigger : [trigger]

    let alignPoint
    if (triggers && triggers.indexOf('contextMenu') !== -1) {
      alignPoint = true
    }

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

    console.log(this.props)

    return (
      <RcDropdown
        {...this.props}
        alignPoint={alignPoint}
        prefixCls="x6-dropdown"
        trigger={triggers}
        overlay={fixedOverlay}
        transitionName={this.getTransitionName()}
      >
        {child}
      </RcDropdown>
    )
  }
}

export namespace Dropdown {
  export type Trigger = ('click' | 'hover' | 'contextMenu')

  export interface Props {
    overlayClassName?: string
    openClassName?: string
    disabled?: boolean
    visible?: boolean
    align?: Object
    trigger?: Trigger | Trigger[]
    overlay?: React.ReactNode
    transitionName?: string
    placement?: 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight'
    forceRender?: boolean
    onMenuClick?: (name: string) => void
    onVisibleChange?: (visible?: boolean) => void
    getPopupContainer?: (triggerNode: Element) => HTMLElement
  }
}
