/* eslint-disable jsx-a11y/click-events-have-key-events  */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react'
import classNames from 'classnames'
import { Popover } from 'antd'
import { PopoverProps } from 'antd/es/popover'
import addEventListener from 'rc-util/lib/Dom/addEventListener'
import {
  SketchPicker,
  SketchPickerProps,
  RGBColor,
  ColorResult,
} from 'react-color'

export { ColorResult } from 'react-color'

export class ColorPicker extends React.Component<
  ColorPicker.Props,
  ColorPicker.State
> {
  private removeDocClickEvent: (() => void) | null

  private container: HTMLDivElement

  constructor(props: ColorPicker.Props) {
    super(props)
    this.state = {
      active: false,
      color: props.color,
    }
  }

  componentWillUnmount() {
    this.unbindDocEvent()
  }

  onDocumentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLDivElement
    const picker = this.container.querySelector('.sketch-picker')!

    if (target === picker || picker.contains(target)) {
      return
    }

    this.setState({ active: false })
    this.unbindDocEvent()
  }

  unbindDocEvent() {
    if (this.removeDocClickEvent) {
      this.removeDocClickEvent()
      this.removeDocClickEvent = null
    }
  }

  handleChange = (
    value: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (this.props.onChange) {
      this.props.onChange(value, event)
    }
    this.setState({
      color: value.rgb,
    })
  }

  handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (this.state.active) {
      this.setState({ active: false })
      this.unbindDocEvent()
    } else {
      this.setState({ active: true })
      if (!this.removeDocClickEvent) {
        this.removeDocClickEvent = addEventListener(
          document.documentElement,
          'click',
          this.onDocumentClick,
        ).remove
      }
    }
  }

  refContainer = (popoverRef: { getContainer: () => HTMLDivElement }) => {
    if (popoverRef) {
      this.container = popoverRef.getContainer()
    }
  }

  renderPicker() {
    const { prefixCls, disabled, style, ...props } = this.props

    return (
      <SketchPicker width="240px" {...props} onChange={this.handleChange} />
    )
  }

  render() {
    const { color } = this.state
    const { disabled, overlayProps, style } = this.props
    const baseCls = `${this.props.prefixCls}-color-picker`
    const popoverProps: PopoverProps = {}
    if (disabled) {
      popoverProps.visible = false
      // Support for antd 5.0
      popoverProps.open = false
    } else {
      popoverProps.visible = this.state.active
      // Support for antd 5.0
      popoverProps.open = this.state.active
    }

    const colorStr =
      typeof color === 'string'
        ? color
        : `rgba(${color.r},${color.g},${color.b},${color.a})`

    return (
      <Popover
        placement="topLeft"
        {...overlayProps}
        {...popoverProps}
        content={this.renderPicker()}
        overlayClassName={`${baseCls}-overlay`}
        destroyTooltipOnHide
        ref={this.refContainer}
        trigger={[]}
      >
        <div
          style={style}
          onClick={this.handleClick}
          className={classNames(baseCls, {
            [`${baseCls}-disabled`]: disabled,
          })}
        >
          <div
            className={`${baseCls}-block`}
            style={{ backgroundColor: disabled ? '#c4c4c4' : colorStr }}
          />
        </div>
      </Popover>
    )
  }
}

export namespace ColorPicker {
  export interface Props extends SketchPickerProps {
    prefixCls?: string
    disabled?: boolean
    overlayProps?: PopoverProps
    style?: React.CSSProperties
    color: string | RGBColor
  }

  export interface State {
    active: boolean
    color: string | RGBColor
  }

  export const defaultProps: Props = {
    prefixCls: 'x6',
    color: '#1890FF',
  }
}
