import React from 'react'
import { Checkbox, InputNumber, Select, Radio } from 'antd'
import { PageSize } from '@antv/x6'
import { GuideOptions } from '@antv/x6/lib/handler/guide/option'
import { RubberbandOptions } from '@antv/x6/lib/handler/rubberband/option'
import { ColorPicker, ColorResult } from '@antv/x6-components'
import { getEditor } from '../index'
import './format.less'

export class FormatDiagram extends React.PureComponent {
  state: FormatDiagram.State = {
    gridEnabled: true,
    gridSize: 10,
    gridMinSize: 4,
    gridColor: '#e0e0e0',
    gridType: 'line',
    pageView: true,
    pageSize: 'a4',
    guide: true,
    rubberband: true,
  }

  get editor() {
    return getEditor()
  }

  get graph() {
    return this.editor.graph
  }

  componentDidMount() {
    const graph = this.graph
    const guideOptions = graph.options.guide as GuideOptions

    this.setState({
      gridEnabled: graph.gridEnabled,
      gridSize: graph.gridSize,
      gridMinSize: graph.gridMinSize,
      gridColor: graph.gridColor,
      guide: guideOptions.enabled,
      pageView: graph.pageVisible,
      rubberband: graph.rubberbandHandler.isEnabled(),
    })
  }

  onGridEnableChange = (e: any) => {
    const graph = this.graph
    const checked = e.target.checked

    graph.gridEnabled = checked
    graph.view.validate()

    this.setState({
      gridEnabled: checked,
    })
  }

  onGridSizeChange = (value: number) => {
    this.graph.gridSize = value
    this.graph.view.validate()
    this.setState({ gridSize: value })
  }

  onGridColorChange = (value: ColorResult) => {
    this.graph.gridColor = value.hex
    this.graph.view.validateBackgroundStyle()
    this.setState({ gridColor: value.hex })
  }

  onGridTypeChange = (e: any) => {
    const gridType = e.target.value
    const graph = this.graph
    graph.gridType = gridType
    graph.view.validateBackgroundStyle()
    this.setState({ gridType })
  }

  onGuideEnableChanged = (e: any) => {
    const graph = this.graph
    const options = graph.options.guide as GuideOptions
    const checked = e.target.checked

    options.enabled = checked
    graph.guideHandler.setEnadled(checked)

    this.setState({ guide: checked })
  }

  onRubberbandEnableChanged = (e: any) => {
    const graph = this.graph
    const options = graph.options.rubberband as RubberbandOptions
    const checked = e.target.checked

    options.enabled = checked
    graph.rubberbandHandler.setEnadled(checked)

    this.setState({
      rubberband: checked,
    })
  }

  onPageSizeChange = (value: string) => {
    const sizes = {
      letter: PageSize.LETTER_PORTRAIT,
      legal: PageSize.LETTER_PORTRAIT,
      a0: PageSize.A0,
      a1: PageSize.A1,
      a2: PageSize.A2,
      a3: PageSize.A3,
      a4: PageSize.A4,
      a5: PageSize.A5,
      a6: PageSize.A6,
      a7: PageSize.A7,
    }

    const size = (sizes as any)[value]
    if (size) {
      this.setState({ pageSize: value })
      this.graph.pageFormat = { width: size.width, height: size.height }
      this.graph.view.validate()
    }
  }

  render() {
    console.log(this.state.gridColor)

    return (
      <div className="x6-editor-format-wrap">
        <div className="x6-editor-format-title">Diagram</div>
        <div className="x6-editor-format-content">
          <div className="x6-editor-format-section ">
            <div className="section-title">Grid</div>
            <div className="section-item">
              <Checkbox
                checked={this.state.gridEnabled}
                onChange={this.onGridEnableChange}
              >
                Enabled
              </Checkbox>
            </div>
            <div className="section-item">
              <span style={{ width: 80 }}>Grid Size</span>
              <InputNumber
                style={{ flex: 1 }}
                className="x6-editor-format-number"
                min={this.state.gridMinSize}
                value={this.state.gridSize}
                disabled={!this.state.gridEnabled}
                onChange={this.onGridSizeChange}
              />
            </div>
            <div className="section-item">
              <span style={{ width: 80 }}>Grid Color</span>
              <ColorPicker
                style={{ flex: 1 }}
                color={this.state.gridColor}
                onChange={this.onGridColorChange}
                disabled={!this.state.gridEnabled}
              />
            </div>
            <div className="section-item">
              <span style={{ width: 80 }}>Grid Style</span>
              <Radio.Group
                value={this.state.gridType}
                onChange={this.onGridTypeChange}
                disabled={!this.state.gridEnabled}
              >
                <Radio value="line">Line</Radio>
                <Radio value="dot">Dot</Radio>
              </Radio.Group>
            </div>
          </div>
          <div className="x6-editor-format-section ">
            <div className="section-title">Options</div>
            <div className="section-item">
              <Checkbox
                checked={this.state.guide}
                onChange={this.onGuideEnableChanged}
              >
                Snap Lines
              </Checkbox>
            </div>
            <div className="section-item">
              <Checkbox
                checked={this.state.rubberband}
                onChange={this.onRubberbandEnableChanged}
              >
                Rubberband
              </Checkbox>
            </div>
          </div>
          <div className="x6-editor-format-section ">
            <div className="section-title">Page Size</div>
            <div className="section-item">
              <Select
                style={{ width: '100%' }}
                value={this.state.pageSize}
                onChange={this.onPageSizeChange}
              >
                <Select.Option value="letter">
                  US-Letter (8,5" x 11")
                </Select.Option>
                <Select.Option value="legal">
                  US-Legal (8,5" x 14")
                </Select.Option>
                <Select.Option value="a0">A0 (841 mm x 1189 mm)</Select.Option>
                <Select.Option value="a1">A1 (594 mm x 841 mm)</Select.Option>
                <Select.Option value="a2">A2 (420 mm x 594 mm)</Select.Option>
                <Select.Option value="a3">A3 (297 mm x 420 mm)</Select.Option>
                <Select.Option value="a4">A4 (210 mm x 297 mm)</Select.Option>
                <Select.Option value="a5">A5 (148 mm x 210 mm)</Select.Option>
                <Select.Option value="a6">A6 (105 mm x 148 mm)</Select.Option>
                <Select.Option value="a7">A7 (74 mm x 105 mm)</Select.Option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export namespace FormatDiagram {
  export interface Props {}

  export interface State {
    gridEnabled: boolean
    gridSize: number
    gridMinSize: number
    gridColor: string
    gridType: string

    pageView: boolean
    pageSize: string

    guide: boolean
    rubberband: boolean
  }
}
