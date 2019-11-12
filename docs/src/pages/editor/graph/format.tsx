import React from 'react'
import { Graph } from '../../../../../src'
import { FormatCell } from './format-cell'
import { FormatDiagram } from './fromat-diagram'
import { fetchEditor } from '..'
import './format.less'

export class Format
  extends React.PureComponent<Format.Props, Format.State> {
  state = {
    hasSelectedCell: true
  }

  componentDidMount() {
    fetchEditor().then((editor) => {
      editor.graph.on(Graph.events.selectionChanged, () => {
        this.setState({ hasSelectedCell: editor.graph.hasSelectedCell() })
      })
    })
  }

  render() {
    return this.state.hasSelectedCell
      ? <FormatCell />
      : <FormatDiagram />
  }
}

export namespace Format {
  export interface Props { }
  export interface State {
    hasSelectedCell: boolean
  }
}
