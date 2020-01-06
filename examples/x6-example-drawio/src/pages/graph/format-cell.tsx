import React from 'react'
import classnames from 'classnames'
import { Checkbox, InputNumber, Select, Button } from 'antd'
import { ColorPicker, ColorResult } from '@antv/x6-components'
import {
  Cell,
  Geometry,
  FontStyle,
  VAlign,
  Align,
  Color,
  NumberExt,
} from '@antv/x6'
import { getEditor } from '../index'

export class FormatCell extends React.PureComponent<
  FormatCell.Props,
  FormatCell.State
> {
  constructor(props: FormatCell.Props) {
    super(props)

    const style = this.graph.getStyle(props.cell)
    const geom = props.cell.geometry!

    let labelPosition = ''
    if (style.labelVerticalPosition) {
      labelPosition = style.labelVerticalPosition
    }

    if (style.labelPosition) {
      if (labelPosition) {
        labelPosition += style.labelPosition
      } else {
        labelPosition = style.labelPosition
      }
    }

    if (!labelPosition) {
      labelPosition = 'center'
    }

    this.state = {
      activeTab: 'style',
      fill: style.fill,
      gradient: style.gradientColor,
      strokeColor: style.stroke,
      strokeWidth: style.strokeWidth,
      strokeDashed: style.dashed,
      opacity: style.opacity,
      shadow: style.shadow,

      x: geom.bounds.x,
      y: geom.bounds.y,
      w: geom.bounds.width,
      h: geom.bounds.height,
      constrained: false,
      rotation: style.rotation,

      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      fontStyle: style.fontStyle,
      fontColor: style.fontColor,
      align: style.align,
      valign: style.verticalAlign,
      horizontal: style.horizontal,
      labelBorderColor: style.labelBorderColor,
      labelBackgroundColor: style.labelBackgroundColor,
      labelPosition: labelPosition,
    }
  }

  get editor() {
    return getEditor()
  }

  get graph() {
    return this.editor.graph
  }

  get commands() {
    return this.editor.commands
  }

  executeCommand(name: string, arg?: any) {
    const cmd = this.commands.get(name)
    if (cmd) {
      cmd.handler(this.graph, arg)
    }
  }

  onTabChange(activeTab: FormatCell.TabName) {
    this.setState({ activeTab })
  }

  updateFill(color: string) {
    this.executeCommand('fillColor', color)
    this.setState({ fill: color })
  }

  onFillCheckedChange = (e: any) => {
    const color = e.target.checked ? '#ffffff' : 'none'
    this.updateFill(color)
  }

  onFillChange = (value: ColorResult) => {
    this.updateFill(value.hex)
  }

  updateGradient(color: string) {
    this.executeCommand('gradientColor', color)
    this.setState({ gradient: color })
  }

  onGradientCheckedChange = (e: any) => {
    const color = e.target.checked ? '#000000' : 'none'
    this.updateGradient(color)
  }

  onGradientChange = (value: ColorResult) => {
    this.updateGradient(value.hex)
  }

  updateStrokeColor(strokeColor?: string) {
    this.executeCommand('strokeColor', strokeColor)
    this.setState({ strokeColor })
  }

  updateStrokeWidth(strokeWidth?: number) {
    this.executeCommand('strokeWidth', strokeWidth)
    this.setState({ strokeWidth })
  }

  updateStrokeDashed(strokeDashed?: boolean) {
    this.executeCommand('strokeDashed', strokeDashed)
    this.setState({ strokeDashed })
  }

  onStrokeCheckedChange = (e: any) => {
    if (e.target.checked) {
      this.updateStrokeColor('#000000')
      this.updateStrokeWidth(1)
      this.updateStrokeDashed(false)
    } else {
      this.updateStrokeColor()
      this.updateStrokeWidth()
      this.updateStrokeDashed()
    }
  }

  onStrokeColorChanged = (value: ColorResult) => {
    this.updateStrokeColor(value.hex)
  }

  onStrokeStyleChanged = (value: 'solid' | 'dashed') => {
    this.updateStrokeDashed(value === 'dashed')
  }

  onStrokeWidthChanged = (strokeWidth?: number) => {
    this.updateStrokeWidth(strokeWidth)
  }

  updateOpacity(opacity?: number) {
    const cmd = this.commands.get('opacity')
    if (cmd) {
      cmd.handler(this.graph, opacity)
    }
    this.setState({ opacity })
  }

  onOpacityCheckedChange = (e: any) => {
    if (e.target.checked) {
      this.updateOpacity(100)
    } else {
      this.updateOpacity()
    }
  }

  onOpacityChange = (value?: number) => {
    if (value != null) {
      this.updateOpacity(value / 100)
    } else {
      this.updateOpacity()
    }
  }

  onShadowChange = (e: any) => {
    const cmd = this.commands.get('shadow')
    if (cmd) {
      cmd.handler(this.graph, e.target.checked)
    }
    this.setState({ shadow: e.target.checked })
  }

  renderStyleTab() {
    const hasStroke =
      (this.state.strokeWidth != null && this.state.strokeWidth > 0) ||
      Color.isValid(this.state.strokeColor)

    return (
      <div className="x6-editor-format-content">
        <div className="x6-editor-format-section ">
          <div className="section-item">
            <Checkbox
              style={{ width: 136, fontWeight: 600 }}
              onChange={this.onFillCheckedChange}
              checked={Color.isValid(this.state.fill)}
            >
              Fill
            </Checkbox>
            {Color.isValid(this.state.fill) && (
              <ColorPicker
                color={this.state.fill!}
                onChange={this.onFillChange}
                style={{ flex: 1 }}
              />
            )}
          </div>
          <div className="section-item">
            <Checkbox
              style={{ width: 136, fontWeight: 600 }}
              onChange={this.onGradientCheckedChange}
              checked={Color.isValid(this.state.gradient)}
            >
              Gradient
            </Checkbox>
            {Color.isValid(this.state.gradient) && (
              <ColorPicker
                onChange={this.onGradientChange}
                color={this.state.gradient!}
                style={{ flex: 1 }}
              />
            )}
          </div>
        </div>
        <div className="x6-editor-format-section ">
          <div className="section-item">
            <Checkbox
              style={{ width: 136, fontWeight: 600 }}
              checked={hasStroke}
              onChange={this.onStrokeCheckedChange}
            >
              Stroke
            </Checkbox>
            {hasStroke && (
              <ColorPicker
                color={this.state.strokeColor || '#000'}
                onChange={this.onStrokeColorChanged}
                style={{ flex: 1 }}
              />
            )}
          </div>
          {hasStroke && (
            <div className="section-item">
              <Select
                value={this.state.strokeDashed ? 'dashed' : 'solid'}
                onChange={this.onStrokeStyleChanged}
                style={{ width: 120, marginRight: 16 }}
                className="x6-linestyle-select"
                dropdownClassName="x6-linestyle-select-dropdown"
              >
                <Select.Option value="solid">
                  <div className="linestyle-item solid" />
                </Select.Option>
                <Select.Option value="dashed">
                  <div className="linestyle-item dashed" />
                </Select.Option>
                {/* <Select.Option value="dotted">
                    <div className="linestyle-item dotted" />
                  </Select.Option> */}
              </Select>
              <InputNumber
                min={1}
                step={1}
                value={this.state.strokeWidth || 1}
                onChange={this.onStrokeWidthChanged}
                className="x6-editor-format-number right"
                formatter={value => `${value!} pt`}
                parser={value => value!.replace(' pt', '')}
                style={{ flex: 1 }}
              />
            </div>
          )}
        </div>
        <div className="x6-editor-format-section ">
          <div className="section-item">
            <Checkbox
              style={{ width: 136, fontWeight: 600 }}
              onChange={this.onOpacityCheckedChange}
              checked={this.state.opacity != null}
            >
              Opacity
            </Checkbox>
            {this.state.opacity != null && (
              <InputNumber
                min={0}
                max={100}
                step={1}
                onChange={this.onOpacityChange}
                value={NumberExt.clamp(
                  +(this.state.opacity! * 100).toFixed(0),
                  0,
                  100,
                )}
                className="x6-editor-format-number right"
                formatter={value => `${value!}%`}
                parser={value => value!.replace(/%$/g, '')}
                style={{ flex: 1 }}
              />
            )}
          </div>
        </div>
        <div className="x6-editor-format-section ">
          <div className="section-item">
            <Checkbox
              style={{ fontWeight: 600 }}
              checked={this.state.shadow}
              onChange={this.onShadowChange}
            >
              Shadow
            </Checkbox>
          </div>
        </div>
      </div>
    )
  }

  onConstrtainChanged = (e: any) => {
    this.setState({ constrained: e.target.checked })
  }

  updateSize(w: number, h: number) {
    const geom = new Geometry(this.state.x, this.state.y, w, h)
    this.executeCommand('updateGeometry', geom)
    this.setState({ w, h })
  }

  onWidthChanged = (w: number) => {
    const h = this.state.constrained
      ? (w * this.state.h) / this.state.w
      : this.state.h
    this.updateSize(w, h)
  }

  onHeightChanged = (h: number) => {
    const w = this.state.constrained
      ? (h * this.state.w) / this.state.h
      : this.state.w
    this.updateSize(w, h)
  }

  onLeftChanged = (x: number) => {
    if (x != null) {
      this.setState({ x })
      this.executeCommand(
        'updateGeometry',
        new Geometry(x, this.state.y, this.state.w, this.state.h),
      )
    }
  }

  onTopChanged = (y: number) => {
    if (y != null) {
      this.setState({ y })
      this.executeCommand(
        'updateGeometry',
        new Geometry(this.state.x, y, this.state.w, this.state.h),
      )
    }
  }

  onRotationChanged = (rotation?: number) => {
    if (rotation != null) {
      this.executeCommand('rotate', rotation)
      this.setState({ rotation })
    }
  }

  rotate90 = () => {
    const rotation = ((this.state.rotation || 0) + 90) % 360
    this.onRotationChanged(rotation)
  }

  renderArrangeTab() {
    return (
      <div className="x6-editor-format-content">
        <div className="x6-editor-format-section ">
          <div className="section-item">
            <Button
              size="small"
              style={{ flex: 1, marginRight: 8 }}
              onClick={() => {
                this.executeCommand('toFront')
              }}
            >
              To Front
            </Button>
            <Button
              size="small"
              style={{ flex: 1, marginLeft: 8 }}
              onClick={() => {
                this.executeCommand('toBack')
              }}
            >
              To Back
            </Button>
          </div>
        </div>
        <div className="x6-editor-format-section ">
          <div className="section-item">
            <div style={{ width: 64, fontWeight: 'bold' }}>Size</div>
            <InputNumber
              min={0}
              step={1}
              value={this.state.w}
              onChange={this.onWidthChanged}
              className="x6-editor-format-number right"
              formatter={value => `${value!} pt`}
              parser={value => value!.replace(' pt', '')}
              style={{ flex: 1, marginRight: 2 }}
            />
            <InputNumber
              min={0}
              step={1}
              value={this.state.h}
              onChange={this.onHeightChanged}
              className="x6-editor-format-number right"
              formatter={value => `${value!} pt`}
              parser={value => value!.replace(' pt', '')}
              style={{ flex: 1, marginLeft: 2 }}
            />
          </div>
          <div
            className="section-item"
            style={{ marginTop: -8, textAlign: 'center', color: '#808080' }}
          >
            <div style={{ width: 64 }} />
            <div style={{ flex: 1 }}>Width</div>
            <div style={{ flex: 1 }}>Height</div>
          </div>
          <div className="section-item">
            <div style={{ width: 64 }} />
            <Checkbox
              style={{ flex: 1 }}
              checked={this.state.constrained}
              onChange={this.onConstrtainChanged}
            >
              Constrain Size
            </Checkbox>
          </div>
        </div>
        <div className="x6-editor-format-section ">
          <div className="section-item">
            <div style={{ width: 64, fontWeight: 'bold' }}>Position</div>
            <InputNumber
              min={0}
              step={1}
              value={this.state.x}
              onChange={this.onLeftChanged}
              className="x6-editor-format-number right"
              formatter={value => `${value!} pt`}
              parser={value => value!.replace(' pt', '')}
              style={{ flex: 1, marginRight: 2 }}
            />
            <InputNumber
              min={0}
              step={1}
              value={this.state.y}
              onChange={this.onTopChanged}
              className="x6-editor-format-number right"
              formatter={value => `${value!} pt`}
              parser={value => value!.replace(' pt', '')}
              style={{ flex: 1, marginLeft: 2 }}
            />
          </div>
          <div
            className="section-item"
            style={{ marginTop: -8, textAlign: 'center', color: '#808080' }}
          >
            <div style={{ width: 64 }} />
            <div style={{ flex: 1 }}>Left</div>
            <div style={{ flex: 1 }}>Top</div>
          </div>
        </div>
        <div className="x6-editor-format-section ">
          <div className="section-item">
            <div style={{ width: 136, fontWeight: 600 }}>Angle</div>
            <InputNumber
              min={0}
              step={1}
              max={360}
              onChange={this.onRotationChanged}
              value={(this.state.rotation || 0) % 360}
              className="x6-editor-format-number right"
              formatter={value => `${value!}°`}
              parser={value => value!.replace('°', '')}
              style={{ flex: 1 }}
            />
          </div>
          <div className="section-item">
            <Button size="small" style={{ flex: 1 }} onClick={this.rotate90}>
              Rotate shape by 90°
            </Button>
          </div>
        </div>
        <div className="x6-editor-format-section ">
          <div className="section-title">Flip</div>
          <div className="section-item">
            <Button
              size="small"
              style={{ flex: 1, marginRight: 8 }}
              onClick={() => this.executeCommand('flipH')}
            >
              Horizontal
            </Button>
            <Button
              size="small"
              style={{ flex: 1, marginLeft: 8 }}
              onClick={() => this.executeCommand('flipV')}
            >
              Vertical
            </Button>
          </div>
        </div>
      </div>
    )
  }

  onFontFamilyChanged = (fontFamily?: string) => {
    this.executeCommand('fontFamily', fontFamily)
    this.setState({ fontFamily })
  }

  toggleBold = () => {
    this.executeCommand('bold')
    const current = (this.state.fontStyle as number) || 0
    const fontStyle = FontStyle.isBold(this.state.fontStyle)
      ? current - FontStyle.bold
      : current + FontStyle.bold
    this.setState({ fontStyle })
  }

  toggleItalic = () => {
    this.executeCommand('italic')
    const current = (this.state.fontStyle as number) || 0
    const fontStyle = FontStyle.isItalic(this.state.fontStyle)
      ? current - FontStyle.italic
      : current + FontStyle.italic
    this.setState({ fontStyle })
  }

  toggleUnderline = () => {
    this.executeCommand('underline')
    const current = (this.state.fontStyle as number) || 0
    const fontStyle = FontStyle.isUnderlined(this.state.fontStyle)
      ? current - FontStyle.underlined
      : current + FontStyle.underlined
    this.setState({ fontStyle })
  }

  onFontSizeChanged = (fontSize?: number) => {
    this.executeCommand('fontSize', fontSize)
    this.setState({ fontSize })
  }

  updateAlign = (align: Align) => {
    this.executeCommand('align', align)
    this.setState({ align })
  }

  updateVAlign = (valign: VAlign) => {
    this.executeCommand('valign', valign)
    this.setState({ valign })
  }

  toggleHorizontal = () => {
    const vertical = this.state.horizontal === false
    this.executeCommand('horizontal', vertical)
    this.setState({ horizontal: vertical })
  }

  updateFontColor(color: string) {
    this.executeCommand('fontColor', color)
    this.setState({ fontColor: color })
  }

  onFontColorCheckedChange = (e: any) => {
    const color = e.target.checked ? '#000000' : 'none'
    this.updateFontColor(color)
  }

  onFontColorChange = (value: ColorResult) => {
    this.updateFontColor(value.hex)
  }

  updateLabelBorderColor(color: string) {
    this.executeCommand('labelBorderColor', color)
    this.setState({ labelBorderColor: color })
  }

  onLabelBorderColorCheckedChange = (e: any) => {
    const color = e.target.checked ? '#000000' : 'none'
    this.updateLabelBorderColor(color)
  }

  onLabelBorderColorChange = (value: ColorResult) => {
    this.updateLabelBorderColor(value.hex)
  }

  updateLabelBgColor(color: string) {
    this.executeCommand('labelBackgroundColor', color)
    this.setState({ labelBackgroundColor: color })
  }

  onLabelBgColorCheckedChange = (e: any) => {
    const color = e.target.checked ? '#ffffff' : 'none'
    this.updateLabelBgColor(color)
  }

  onLabelBgColorChange = (value: ColorResult) => {
    this.updateLabelBgColor(value.hex)
  }

  onLabelPositionChanged = (position: string) => {
    this.executeCommand('labelPosition', position)
    this.setState({ labelPosition: position })
  }

  renderTextTab() {
    return (
      <div className="x6-editor-format-content">
        <div className="x6-editor-format-section">
          <div className="section-title">Font</div>
          <div className="section-item">
            <Select
              style={{ flex: 1 }}
              value={this.state.fontFamily || 'Helvetica'}
              onChange={this.onFontFamilyChanged}
            >
              {[
                'Helvetica',
                'Verdana',
                'Times New Roman',
                'Garamond',
                'Comic Sans MS',
                'Courier New',
                'Georgia',
                'Lucida Console',
                'Tahoma',
              ].map(name => (
                <Select.Option key={name} value={name}>
                  <div style={{ fontFamily: name }}>{name}</div>
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="section-item">
            <Button
              className={classnames('ant-btn-flag', {
                'ant-btn-checked': FontStyle.isBold(this.state.fontStyle),
              })}
              icon="bold"
              onClick={this.toggleBold}
            />
            <Button
              className={classnames('ant-btn-flag', {
                'ant-btn-checked': FontStyle.isItalic(this.state.fontStyle),
              })}
              icon="italic"
              onClick={this.toggleItalic}
            />
            <Button
              className={classnames('ant-btn-flag', {
                'ant-btn-checked': FontStyle.isUnderlined(this.state.fontStyle),
              })}
              icon="underline"
              onClick={this.toggleUnderline}
              style={{ marginRight: 23 }}
            />
            <Button
              className={classnames('ant-btn-flag', 'ant-btn-icon-only', {
                'ant-btn-checked': this.state.horizontal === false,
              })}
              onClick={this.toggleHorizontal}
            >
              <i className="anticon">
                <svg
                  width="14px"
                  height="14px"
                  fill="currentColor"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M384 128l169.984 169.984h-128v299.99h-84.01v-299.99h-128zm297.984 598.016h128L640 896 470.016 726.016h128v-299.99h84.01v299.99z" />
                </svg>
              </i>
            </Button>
            <InputNumber
              min={0}
              step={1}
              value={this.state.fontSize || 12}
              onChange={this.onFontSizeChanged}
              className="x6-editor-format-number right"
              formatter={value => `${value!}pt`}
              parser={value => value!.replace('pt', '')}
              style={{ flex: 1 }}
            />
          </div>
          <div className="section-item">
            <Button
              className={classnames('ant-btn-flag', {
                'ant-btn-checked': this.state.align === 'left',
              })}
              icon="align-left"
              onClick={() => {
                this.updateAlign('left')
              }}
            />
            <Button
              className={classnames('ant-btn-flag', {
                'ant-btn-checked': this.state.align === 'center',
              })}
              icon="align-center"
              onClick={() => {
                this.updateAlign('center')
              }}
            />
            <Button
              className={classnames('ant-btn-flag', {
                'ant-btn-checked': this.state.align === 'right',
              })}
              icon="align-right"
              style={{ marginRight: 23 }}
              onClick={() => {
                this.updateAlign('right')
              }}
            />
            <Button
              className={classnames('ant-btn-flag', 'ant-btn-icon-only', {
                'ant-btn-checked': this.state.valign === 'top',
              })}
              onClick={() => {
                this.updateVAlign('top')
              }}
            >
              <i className="anticon">
                <svg
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M169.984 128h683.99v86.016h-683.99V128zm172.032 342.016L512 298.026l169.984 171.99h-128V896h-84.01V470.016h-128z" />
                </svg>
              </i>
            </Button>
            <Button
              className={classnames('ant-btn-flag', 'ant-btn-icon-only', {
                'ant-btn-checked': this.state.valign === 'middle',
              })}
              onClick={() => {
                this.updateVAlign('middle')
              }}
            >
              <i className="anticon">
                <svg
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M169.984 470.016h683.99v84.01h-683.99v-84.01zm512-256L512 384 342.016 214.016h128V42.026h84.01v171.99h128zM342.016 809.984L512 640l169.984 169.984h-128v171.99h-84.01v-171.99h-128z" />
                </svg>
              </i>
            </Button>
            <Button
              className={classnames('ant-btn-flag', 'ant-btn-icon-only', {
                'ant-btn-checked': this.state.valign === 'bottom',
              })}
              style={{ marginRight: 0 }}
              onClick={() => {
                this.updateVAlign('bottom')
              }}
            >
              <i className="anticon">
                <svg
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M169.984 809.984h683.99V896h-683.99v-86.016zm512-256L512 725.974l-169.984-171.99h128V128h84.01v425.984h128z" />
                </svg>
              </i>
            </Button>
          </div>
        </div>
        <div className="x6-editor-format-section">
          <div className="section-item">
            <Checkbox
              style={{ width: 144, fontWeight: 600 }}
              onChange={this.onFontColorCheckedChange}
              checked={Color.isValid(this.state.fontColor)}
            >
              Font Color
            </Checkbox>
            {Color.isValid(this.state.fontColor) && (
              <ColorPicker
                color={this.state.fontColor!}
                onChange={this.onFontColorChange}
                style={{ flex: 1 }}
              />
            )}
          </div>
          <div className="section-item">
            <Checkbox
              style={{ width: 144, fontWeight: 600 }}
              onChange={this.onLabelBorderColorCheckedChange}
              checked={Color.isValid(this.state.labelBorderColor)}
            >
              Border Color
            </Checkbox>
            {Color.isValid(this.state.labelBorderColor) && (
              <ColorPicker
                color={this.state.labelBorderColor!}
                onChange={this.onLabelBorderColorChange}
                style={{ flex: 1 }}
              />
            )}
          </div>
          <div className="section-item">
            <Checkbox
              style={{ width: 144, fontWeight: 600 }}
              onChange={this.onLabelBgColorCheckedChange}
              checked={Color.isValid(this.state.labelBackgroundColor)}
            >
              Background Color
            </Checkbox>
            {Color.isValid(this.state.labelBackgroundColor) && (
              <ColorPicker
                color={this.state.labelBackgroundColor!}
                onChange={this.onLabelBgColorChange}
                style={{ flex: 1 }}
              />
            )}
          </div>
        </div>
        <div className="x6-editor-format-section">
          <div className="section-item">
            <div style={{ width: 96, fontWeight: 600 }}>Label Position</div>
            <Select
              style={{ flex: 1 }}
              value={this.state.labelPosition}
              onChange={this.onLabelPositionChanged}
            >
              {[
                'Top Left',
                'Top',
                'Top Right',
                'Left',
                'Center',
                'Right',
                'Bottom Left',
                'Bottom',
                'Bottom Right',
              ].map(p => (
                <Select.Option key={p} value={p.toLowerCase()}>
                  {p}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const activeTab = this.state.activeTab

    return (
      <div className="x6-editor-format-wrap">
        <div className="x6-editor-format-title">
          <ul className="x6-editor-format-tab">
            <li
              className={classnames({ active: activeTab === 'style' })}
              onClick={this.onTabChange.bind(this, 'style')}
            >
              Style
            </li>
            <li
              className={classnames({ active: activeTab === 'text' })}
              onClick={this.onTabChange.bind(this, 'text')}
            >
              Text
            </li>
            <li
              className={classnames({ active: activeTab === 'arrange' })}
              onClick={this.onTabChange.bind(this, 'arrange')}
            >
              Arrange
            </li>
          </ul>
        </div>
        {activeTab === 'style' && this.renderStyleTab()}
        {activeTab === 'arrange' && this.renderArrangeTab()}
        {activeTab === 'text' && this.renderTextTab()}
      </div>
    )
  }
}

export namespace FormatCell {
  export type TabName = 'style' | 'text' | 'arrange'

  export interface Props {
    cell: Cell
  }

  export interface State {
    activeTab: TabName
    fill?: string
    gradient?: string
    strokeColor?: string
    strokeWidth?: number
    strokeDashed?: boolean
    opacity?: number
    shadow?: boolean

    x: number
    y: number
    w: number
    h: number
    constrained: boolean
    rotation?: number

    fontSize?: number
    fontFamily?: string
    fontStyle?: FontStyle
    align?: Align
    valign?: VAlign
    horizontal?: boolean
    fontColor?: string
    labelBorderColor?: string
    labelBackgroundColor?: string
    labelPosition?: string
  }
}
