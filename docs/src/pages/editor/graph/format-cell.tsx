import React from 'react'
import classnames from 'classnames'
import { Checkbox, InputNumber, Select, Menu, Dropdown, Button, Icon } from 'antd'
import { ColorPicker } from '../../../components'

export class FormatCell
  extends React.PureComponent<FormatCell.Props, FormatCell.State> {

  state: FormatCell.State = {
    activeTab: 'style'
  }

  onTabChange(activeTab: FormatCell.TabName) {
    this.setState({ activeTab })
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
        <div className="x6-editor-format-content">
          <div className="x6-editor-format-section ">
            <div className="section-item">
              <Checkbox style={{ width: 120 }}>
                Fill
              </Checkbox>
              <ColorPicker value="#ffffff" style={{ flex: 1 }} />
            </div>
            <div className="section-item">
              <Checkbox style={{ width: 120 }}>
                Gradient
              </Checkbox>
              <ColorPicker value="#ffffff" style={{ flex: 1 }} />
            </div>
          </div>
          <div className="x6-editor-format-section ">
            <div className="section-item">
              <Checkbox style={{ width: 120 }}>
                Line
              </Checkbox>
              <ColorPicker value="#000" style={{ flex: 1 }} />
            </div>
            <div className="section-item">
              <Select
                defaultValue="solid"
                style={{ width: 104, marginRight: 16 }}
                className="x6-linestyle-select"
                dropdownClassName="x6-linestyle-select-dropdown"
              >
                <Select.Option value="solid">
                  <div className="linestyle-item solid" />
                </Select.Option>
                <Select.Option value="dashed">
                  <div className="linestyle-item dashed" />
                </Select.Option>
                <Select.Option value="dotted">
                  <div className="linestyle-item dotted" />
                </Select.Option>
              </Select>
              <InputNumber
                min={1}
                step={1}
                defaultValue={1}
                className="x6-editor-format-number right"
                formatter={value => `${value!}pt`}
                parser={value => value!.replace('pt', '')}
                style={{ flex: 1 }}
              />
            </div>
          </div>
          <div className="x6-editor-format-section ">
            <div className="section-item">
              <Checkbox style={{ width: 120 }}>
                Opacity
              </Checkbox>
              <InputNumber
                min={0}
                max={100}
                step={1}
                defaultValue={100}
                className="x6-editor-format-number right"
                formatter={value => `${value!}%`}
                parser={value => value!.replace('%', '')}
                style={{ flex: 1 }}
              />
            </div>
          </div>
          <div className="x6-editor-format-section ">
            <div className="section-item">
              <Checkbox>
                Shadow
              </Checkbox>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export namespace FormatCell {
  export type TabName = 'style' | 'text' | 'arrange'
  export interface Props { }
  export interface State {
    activeTab: TabName
  }
}
