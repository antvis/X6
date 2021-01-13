import React from 'react'
import { Button } from 'antd'
import { Graph, Edge } from '@antv/x6'
import '../index.less'

export default class Example extends React.Component<
  Example.Props,
  Example.State
> {
  state: Example.State = {
    canRedo: false,
    canUndo: false,
  }

  private container: HTMLDivElement
  private graph: Graph

  componentDidMount() {
    const graph = (this.graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      panning: true,
      history: {
        enabled: true,
        beforeAddCommand(event, args: any) {
          if (args.options.ignoreHistory) {
            return false
          }
        },
      },
      connecting: {
        allowBlank: false,
        allowNode: false,
        connector: {
          name: 'smooth',
        },
        createEdge() {
          return Edge.create({
            attrs: {
              line: {
                strokeDasharray: '5 5',
              },
            },
          })
        },
      },
    }))

    graph.history.on('change', () => {
      this.setState({
        canRedo: graph.canRedo(),
        canUndo: graph.canUndo(),
      })
    })

    graph.on('edge:connected', ({ edge }) => {
      edge.attr('line/strokeDasharray', null, { ignoreHistory: true })
    })

    graph.addNode({
      x: 100,
      y: 80,
      width: 160,
      height: 80,
      label: 'hello',
      ports: {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
        },
        items: [
          {
            id: 'top',
            group: 'top',
          },
          {
            id: 'right',
            group: 'right',
          },
          {
            id: 'bottom',
            group: 'bottom',
          },
          {
            id: 'left',
            group: 'left',
          },
        ],
      },
    })

    graph.addNode({
      x: 400,
      y: 320,
      width: 160,
      height: 80,
      label: 'world',
      ports: {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: '#31d0c6',
                strokeWidth: 2,
                fill: '#fff',
              },
            },
          },
        },
        items: [
          {
            id: 'top',
            group: 'top',
          },
          {
            id: 'right',
            group: 'right',
          },
          {
            id: 'bottom',
            group: 'bottom',
          },
          {
            id: 'left',
            group: 'left',
          },
        ],
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
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
        <div className="x6-graph-tools">
          <Button onClick={this.onUndo} disabled={!this.state.canUndo}>
            Undo
          </Button>
          <Button onClick={this.onRedo} disabled={!this.state.canRedo}>
            Redo
          </Button>
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
