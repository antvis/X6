import React from 'react'
import { Button } from 'antd'
import { Graph } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component<
  Example.Props,
  Example.State
> {
  state: Example.State = {
    canRedo: false,
    canUndo: false,
  }

  private graph: Graph
  private graphContainer: HTMLDivElement
  private minimapContainer: HTMLDivElement

  componentDidMount() {
    const graph = (this.graph = new Graph({
      container: this.graphContainer,
      width: 800,
      height: 600,
      grid: true,
      history: {
        enabled: true,
        beforeAddCommand(event, options) {
          // 鼠标移入和移除时触发 添加 和 删除 工具，不应该添加到历时记录中
          if (
            event === 'cell:change:*' &&
            options != null &&
            options.key === 'tools'
          ) {
            return false
          }

          if (event === 'cell:removed') {
            const cell = options && options.cell
            if (cell) {
              cell.removeTools()
            }
          }
        },
      },
      scroller: {
        enabled: true,
        pannable: true,
      },
      minimap: {
        enabled: true,
        container: this.minimapContainer,
        width: 300,
        height: 200,
        padding: 10,
        graphOptions: {
          async: true,
          createCellView(cell) {
            if (cell.isEdge()) {
              return null
            }
          },
        },
      },
    }))

    graph.on('cell:mouseenter', function ({ cell }) {
      if (cell.isNode()) {
        cell.addTools([
          {
            name: 'boundary',
            args: {
              attrs: {
                fill: '#7c68fc',
                stroke: '#333',
                'stroke-width': 1,
                'fill-opacity': 0.2,
              },
            },
          },
          {
            name: 'button-remove',
            args: {
              x: 0,
              y: 0,
              offset: { x: 10, y: 10 },
            },
          },
        ])
      } else {
        cell.addTools(['vertices', 'segments'])
      }
    })

    graph.on('cell:mouseleave', ({ cell }) => {
      cell.removeTools()
    })

    graph.history.on('change', () => {
      this.setState({
        canRedo: graph.canRedo(),
        canUndo: graph.canUndo(),
      })
    })

    graph.on('node:click', function ({ node }) {
      node.attr('body/stroke', 'orange')
    })

    const rect1 = graph.addNode({
      x: 100,
      y: 80,
      width: 100,
      height: 40,
      label: 'hello',
    })

    const rect2 = graph.addNode({
      x: 400,
      y: 320,
      width: 100,
      height: 40,
      label: 'world',
    })

    graph.addEdge({
      source: rect1,
      target: rect2,
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.graphContainer = container
  }

  refMinimap = (container: HTMLDivElement) => {
    this.minimapContainer = container
  }

  onUndo = () => {
    this.graph.undo()
  }

  onRedo = () => {
    this.graph.redo()
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Scroller</h1>
        <div className="x6-graph-tools">
          <Button onClick={this.onUndo} disabled={!this.state.canUndo}>
            Undo
          </Button>
          <Button onClick={this.onRedo} disabled={!this.state.canRedo}>
            Redo
          </Button>
        </div>
        <div
          ref={this.refMinimap}
          style={{
            position: 'absolute',
            right: '50%',
            top: 40,
            marginRight: -720,
            width: 300,
            height: 200,
            boxShadow: '0 0 10px 1px #e9e9e9',
          }}
        />
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
