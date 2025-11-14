import React from 'react'
import { Button, Space } from 'antd'
import { Graph, History, Selection } from '@antv/x6'
import '../../index.less'

interface UndoExampleState {
  canUndo: boolean
  canRedo: boolean
}

export class VerticesExample extends React.Component {
  private container!: HTMLDivElement
  private history!: History

  state: UndoExampleState = {
    canRedo: false,
    canUndo: false,
  }

  componentDidMount() {
    // init window hook 适配Chrome开发者工具
    // window.__x6_instances__ = [];

    const graph = new Graph({
      container: this.container,
      width: 1000,
      height: 500,
      grid: true,
    })
    // window.__x6_instances__.push(graph)

    this.history = new History({
      beforeAddCommand(event, args) {
        if (args && 'options' in args && args.options) {
          return args.options.ignore !== true
        }
      }
    })
    this.history.on('change', () => {
      this.setState({
        canRedo: this.history.canRedo(),
        canUndo: this.history.canUndo(),
      })
    })
    graph.use(this.history).use(new Selection())

    const source = graph.addNode({
      x: 120,
      y: 120,
      width: 100,
      height: 40,
      zIndex: 10,
      attrs: {
        label: {
          text: 'Source',
        },
        body: {
          strokeWidth: 1,
        },
      },
    }, { ignore: true })

    const target = graph.addNode({
      x: 300,
      y: 320,
      width: 100,
      height: 40,
      zIndex: 10,
      attrs: {
        label: {
          text: 'Target',
        },
        body: {
          strokeWidth: 1,
        },
      },
    }, { ignore: true })

    graph.addEdge(
      {
        source,
        target,
        arrts: {
          line: {
            strokeWidth: 1
          }
        },
        vertices: [
          {
            x: 220,
            y: 220
          },
          {
            x: 120,
            y: 320
          },
          {
            x: 300,
            y: 400
          }
        ]
      },
      { ignore: true }
    )

    graph.on('edge:click', ({ cell }) => {
      if (!cell.hasTool('vertices')) {
        cell.addTools(
          {
            name: 'vertices',
            args: {
              stopPropagation: false,
              addable: true,
              removeable: true,
              removeRedundancies: false,
              snapRadius: 10,
              attrs: {
                r: 5
              }
            }
          }
        )
      }
    })

    graph.on('edge:unselected', ({ cell }) => {
      cell.removeTools()
    })

    graph.on('edge:mouseup', ({ cell }) => {
      console.log('edge:mouseup', cell)
    })
  }

  onUndo = () => {
    this.history.undo()
  }

  onRedo = () => {
    this.history.redo()
  }

  cleanHistory = () => {
    this.history.clean();
  };

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Edge Vertices & History</h1>
        <div className="x6-graph-tools">
          <Space.Compact>
            <Button onClick={this.onUndo} disabled={!this.state.canUndo}>
              Undo
            </Button>
            <Button onClick={this.onRedo} disabled={!this.state.canRedo}>
              Redo
            </Button>
            <Button type="primary" onClick={this.cleanHistory}>
              清空历史队列
            </Button>
          </Space.Compact>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
