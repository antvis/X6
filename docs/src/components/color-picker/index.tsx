import React from 'react'
import { Popover } from 'antd'
import { SketchPicker, ColorResult } from 'react-color'
import './index.less'

export class ColorPicker extends
  React.Component<ColorPicker.Props, ColorPicker.State> {
  render() {
    const { value, onChange, ...props } = this.props
    return (
      <Popover
        content={<SketchPicker onChange={onChange} />}
        placement="topRight"
        trigger="click"
        overlayClassName="x6-editor-color-picker-overlay"
      >
        <div className="x6-editor-color-picker" {...props}>
          <div
            className="x6-editor-color-picker-block"
            style={{ backgroundColor: value }}
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
  }

  export interface State {
    active: boolean
  }
}
