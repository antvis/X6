import { Button } from 'antd'
import React from 'react'

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
      grid: {
        size: 10,
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#e6e6e6',
            thickness: 1
          },
          {
            color: '#ddd',
            thickness: 1,
            factor: 4
          }
        ]
      },
      history: {
        enabled: true,
        beforeAddCommand(event, args) {
          if (args && 'options' in args && args.options) {
            return args.options.ignore !== true
          }
        }
      },
      selecting: {
        enabled: true
      },
      embedding: {
        enabled: true,
        findParent({ node }) {
          const bbox = node.getBBox()
          return this.getNodes().filter((node) => {
            const data = node.getData<any>()
            if (data && data.parent) {
              const targetBBox = node.getBBox()
              return bbox.isIntersectWithRect(targetBBox)
            }
            return false
          })
        }
      },
    })

    this.history = graph.history
    this.history.on('change', (info) => {
      this.setState({
        canRedo: this.history.canRedo(),
        canUndo: this.history.canUndo(),
      })
    })

    const source = graph.addNode({
      x: 120,
      y: 120,
      width: 100,
      height: 40,
      zIndex: 10,
      attrs: {
        label: {
          text: 'Hello',
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
          text: 'World',
        },
        body: {
          strokeWidth: 1,
        },
      },
    }, { ignore: true })

    graph.addNode({
      x: 400,
      y: 100,
      width: 150,
      height: 150,
      zIndex: 1,
      attrs: {
        label: {
          text: '🌎',
        },
        body: {
          strokeWidth: 1,
        },
      },
      data: {
        parent: true
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
              removeable: false,
              removeRedundancies: false,
              snapRadius: 10,
              attrs: {
                r: 4
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

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <h1>Edge Vertices & History & Embedding</h1>
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
