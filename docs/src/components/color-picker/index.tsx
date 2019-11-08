import React from 'react'
import classnames from 'classnames'
import { Popover } from 'antd'
import { PopoverProps } from 'antd/lib/popover'
import { SketchPicker, ColorResult } from 'react-color'
import './index.less'

export class ColorPicker extends
  React.Component<ColorPicker.Props, ColorPicker.State> {
  render() {
    const { value, onChange, disabled, ...props } = this.props
    const popoverProps: PopoverProps = {}
    if (disabled) {
      popoverProps.visible = false
    }

    return (
      <Popover
        {...popoverProps}
        content={
          <SketchPicker
            width="220px"
            onChange={onChange}
          />
        }
        placement="topRight"
        trigger="click"
        overlayClassName="x6-editor-color-picker-overlay"
      >
        <div

          className={
            classnames(
              'x6-editor-color-picker', {
              'x6-editor-color-picker-disabled': disabled
            })
          }
          {...props}
        >
          <div
            className="x6-editor-color-picker-block"
            style={{ backgroundColor: disabled ? '#c4c4c4' : value }}
          />
        </div>
      </Popover>
    )
  }
}

export namespace ColorPicker {
  export interface Props {
    value: string
    onChange?: (value: ColorResult) => void
    style?: React.CSSProperties
    disabled?: boolean
  }

  export interface State {
    active: boolean
  }
}
