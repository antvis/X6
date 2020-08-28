import React from 'react'
import { Graph, Addon, Shape } from '@antv/x6'
import './app.css'

const { Dnd } = Addon
const { Rect, Circle } = Shape

export default class Example extends React.Component {
  private container: HTMLDivElement
  private dnd: any

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      grid: true,
      history: true,
      snapline: {
        enabled: true,
        sharp: true,
      },
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: true,
      },
    })

    const source = graph.addNode({
      x: 130,
      y: 30,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'Hello',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    })

    const target = graph.addNode({
      x: 180,
      y: 160,
      width: 100,
      height: 40,
      attrs: {
        label: {
          text: 'World',
          fill: '#6a6c8a',
        },
        body: {
          stroke: '#31d0c6',
          strokeWidth: 2,
        },
      },
    })

    graph.addEdge({ source, target })

    graph.centerContent()

    this.dnd = new Dnd({ target: graph, animation: true })
  }

  startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget
    const type = target.getAttribute('data-type')
    const node =
      type === 'rect'
        ? new Rect({
            width: 100,
            height: 40,
            attrs: {
              label: {
                text: 'Rect',
                fill: '#6a6c8a',
              },
              body: {
                stroke: '#31d0c6',
                strokeWidth: 2,
              },
            },
          })
        : new Circle({
            width: 60,
            height: 60,
            attrs: {
              label: {
                text: 'Circle',
                fill: '#6a6c8a',
              },
              body: {
                stroke: '#31d0c6',
                strokeWidth: 2,
              },
            },
          })

    this.dnd.start(node, e.nativeEvent as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="app">
        <div className="dnd-wrap">
          <div
            data-type="rect"
            className="dnd-rect"
            onMouseDown={this.startDrag}
          >
            Rect
          </div>
          <div
            data-type="circle"
            className="dnd-circle"
            onMouseDown={this.startDrag}
          >
            Circle
          </div>
        </div>

        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
