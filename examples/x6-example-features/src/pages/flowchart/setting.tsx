import React from 'react'
import { Graph, Cell } from '@antv/x6'
import { isFunc } from './data'
import { Input } from 'antd'

export class Setting extends React.Component<Setting.Props, Setting.State> {
  constructor(props: Setting.Props) {
    super(props)
    this.state = this.getNextState(props)

    props.graph.on('selectionChanged', () => {
      this.setState(this.getNextState())
    })
  }

  getNextState(props: Setting.Props = this.props) {
    return {
      selectedCells: props.graph.getSelectedCells(),
    }
  }

  onTitleChange = ({ target: { value } }) => {
    if (value && value.trim()) {
      const cell = this.state.selectedCells[0]
      const data = cell.data
      this.props.graph.setCellData(cell, {
        ...data,
        title: value.trim(),
      })
    }
  }

  render() {
    if (this.state.selectedCells.length === 1) {
      const cell = this.state.selectedCells[0]
      const data = cell.data
      if (data && isFunc(data.type)) {
        return (
          <div className="flowchart-format">
            <div className="flowchart-sidebar-title">流程设置</div>
            <div className="flowchart-sidebar-content">
              <label>
                <div>名称</div>
                <Input
                  type="text"
                  allowClear={true}
                  onBlur={this.onTitleChange}
                />
              </label>
            </div>
          </div>
        )
      }
    }
    return null
  }
}

export namespace Setting {
  export interface Props {
    graph: Graph
  }

  export interface State {
    selectedCells: Cell[]
  }
}
