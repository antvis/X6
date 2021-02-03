import React from 'react'
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component<
  Example.Props,
  Example.State
> {
  private container: HTMLDivElement
  private history: Graph.HistoryManager

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
      history: true,
    })

    const parent = graph.addNode({
      x: 100,
      y: 60,
      width: 500,
      height: 140,
      label: 'Parent Node',
    })

    this.history = graph.history
    this.history.on('change', () => {
      this.setState({
        canRedo: this.history.canRedo(),
        canUndo: this.history.canUndo(),
      })
    })

    graph.batchUpdate(() => {
      const child = graph.addNode({
        x: 160,
        y: 100,
        width: 100,
        height: 40,
        label: 'Drag Me',
      })
      parent.addChild(child)
    })
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

export namespace Example {
  export interface Props {}

  export interface State {
    canUndo: boolean
    canRedo: boolean
  }
}
