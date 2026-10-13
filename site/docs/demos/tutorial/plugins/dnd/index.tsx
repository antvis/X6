import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { Graph, Dnd, Snapline } from '@antv/x6'

export default class Example extends React.Component {
  private graph: Graph
  private container: HTMLDivElement
  private dndContainer: HTMLDivElement
  private dnd: Dnd

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
    })

    graph.use(
      new Snapline({
        enabled: true,
        sharp: true,
      }),
    )

    const source = graph.addNode({
      x: 130,
      y: 30,
      width: 100,
      height: 40,
      label: 'Hello',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    const target = graph.addNode({
      x: 180,
      y: 160,
      width: 100,
      height: 40,
      label: 'World',
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 6,
          ry: 6,
        },
      },
    })

    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
        },
      },
    })
    graph.centerContent()

    this.dnd = new Dnd({
      target: graph,
      scaled: false,
      dndContainer: this.dndContainer,
    })
    this.graph = graph
  }

  startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget
    const type = target.getAttribute('data-type')
    const node =
      type === 'rect'
        ? this.graph.createNode({
            width: 100,
            height: 40,
            label: 'Rect',
            attrs: {
              body: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
                rx: 6,
                ry: 6,
              },
            },
          })
        : this.graph.createNode({
            width: 60,
            height: 60,
            shape: 'circle',
            label: 'Circle',
            attrs: {
              body: {
                stroke: '#8f8f8f',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          })

    this.dnd.start(node, e.nativeEvent as any)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  dndContainerRef = (container: HTMLDivElement) => {
    this.dndContainer = container
  }

  render() {
    return (
      <div className="dnd-app">
        <div className="dnd-wrap" ref={this.dndContainerRef}>
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

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.dnd-app {
  display: flex;
  padding: 0;
  font-family: sans-serif;
}
.dnd-app .app-content {
  flex: 1;
  height: 240px;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
.dnd-app .dnd-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  user-select: none;
}
.dnd-app .dnd-wrap .dnd-rect {
  width: 100px;
  height: 40px;
  margin: 16px;
  line-height: 40px;
  text-align: center;
  border: 1px solid #8f8f8f;
  border-radius: 6px;
  cursor: move;
}
.dnd-app .dnd-wrap .dnd-circle {
  width: 60px;
  height: 60px;
  margin: 16px;
  line-height: 60px;
  text-align: center;
  border: 1px solid #8f8f8f;
  border-radius: 100%;
  cursor: move;
}
`)
