import React from 'react'
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import { UndoManager } from '@antv/x6/es/addon'
import '../index.less'

export default class Example extends React.Component<
  Example.Props,
  Example.State
> {
  private container: HTMLDivElement
  private undoManager: UndoManager

  state: Example.State = {
    canRedo: false,
    canUndo: false,
  }

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      gridSize: 1,
    })

    graph.addNode({
      type: 'rect',
      x: 130,
      y: 30,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'rect',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    })

    this.undoManager = new UndoManager({ model: graph })
    this.undoManager.on('change', () => {
      this.setState({
        canRedo: this.undoManager.canRedo(),
        canUndo: this.undoManager.canUndo(),
      })
    })
  }

  onUndo = () => {
    this.undoManager.undo()
  }

  onRedo = () => {
    this.undoManager.redo()
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

export namespace Example {
  export interface Props {}

  export interface State {
    canUndo: boolean
    canRedo: boolean
  }
}
