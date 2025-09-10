import React from 'react'
import { Button } from 'antd'
import { Graph, History } from '../../../../src'
import '../index.less'

export class UndoExample extends React.Component<Example.Props, Example.State> {
  private container: HTMLDivElement
  private history: History

  state: Example.State = {
    canRedo: false,
    canUndo: false,
  }

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    this.history = new History()
    this.history.on('change', () => {
      this.setState({
        canRedo: this.history.canRedo(),
        canUndo: this.history.canUndo(),
      })
    })
    graph.use(this.history)

    const source = graph.addNode({
      x: 120,
      y: 120,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'Hello',
        },
        body: {
          strokeWidth: 1,
        },
      },
    })

    const target = graph.addNode({
      x: 300,
      y: 320,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'World',
        },
        body: {
          strokeWidth: 1,
        },
      },
    })

    graph.addEdge({ source, target, arrts: { line: { strokeWidth: 1 } } })
  }

  onUndo = () => {
    this.history.undo()
  }

  onRedo = () => {
    this.history.redo()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Default Settings</h1>
        <div className="x6-graph-tools">
          <Button.Group>
            <Button onClick={this.onUndo} disabled={!this.state.canUndo}>
              Undo
            </Button>
            <Button onClick={this.onRedo} disabled={!this.state.canRedo}>
              Redo
            </Button>
          </Button.Group>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}

// eslint-disable-next-line
export namespace Example {
  export interface Props {}

  export interface State {
    canUndo: boolean
    canRedo: boolean
  }
}
