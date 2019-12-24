import React from 'react'
import { Cell } from '@antv/x6'
import { FormatCell } from './format-cell'
import { FormatDiagram } from './fromat-diagram'
import { fetchEditor } from '../'
import './format.less'

export class Format extends React.PureComponent<Format.Props, Format.State> {
  state = {
    selectedCell: null,
  }

  componentDidMount() {
    fetchEditor().then(editor => {
      editor.graph.on('selection:changed', () => {
        this.setState({
          selectedCell: editor.graph.getSelectedCell(),
        })
      })
    })
  }

  render() {
    return this.state.selectedCell != null ? (
      <FormatCell cell={this.state.selectedCell!} />
    ) : (
      <FormatDiagram />
    )
  }
}

export namespace Format {
  export interface Props {}
  export interface State {
    selectedCell: Cell | null
  }
}
