import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph, EdgeView } from '@antv/x6'

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    graph.addEdge({
      source: { x: 40, y: 40 },
      target: { x: 380, y: 40 },
      vertices: [
        { x: 40, y: 80 },
        { x: 200, y: 80 },
        { x: 200, y: 40 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      tools: [
        {
          name: 'button',
          args: {
            markup: [
              {
                tagName: 'circle',
                selector: 'button',
                attrs: {
                  r: 18,
                  stroke: '#fe854f',
                  strokeWidth: 2,
                  fill: 'white',
                  cursor: 'pointer',
                },
              },
              {
                tagName: 'text',
                textContent: 'Btn B',
                selector: 'icon',
                attrs: {
                  fill: '#fe854f',
                  fontSize: 10,
                  textAnchor: 'middle',
                  pointerEvents: 'none',
                  y: '0.3em',
                },
              },
            ],
            distance: -40,
            onClick({ view }: { view: EdgeView }) {
              const edge = view.cell
              const source = edge.getSource()
              const target = edge.getTarget()
              edge.setSource(target)
              edge.setTarget(source)
            },
          },
        },
      ],
    })

    graph.addEdge({
      source: { x: 40, y: 160 },
      target: { x: 380, y: 160 },
      vertices: [
        { x: 40, y: 200 },
        { x: 200, y: 200 },
        { x: 200, y: 160 },
      ],
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          targetMarker: 'classic',
        },
      },
      connector: 'smooth',
      tools: {
        name: 'button',
        args: {
          markup: [
            {
              tagName: 'circle',
              selector: 'button',
              attrs: {
                r: 18,
                stroke: '#fe854f',
                strokeWidth: 2,
                fill: 'white',
                cursor: 'pointer',
              },
            },
            {
              tagName: 'text',
              textContent: 'Btn A',
              selector: 'icon',
              attrs: {
                fill: '#fe854f',
                fontSize: 10,
                textAnchor: 'middle',
                pointerEvents: 'none',
                y: '0.3em',
              },
            },
          ],
          distance: -100,
          offset: { x: 0, y: 0 },
          onClick({ view }: { view: EdgeView }) {
            const edge = view.cell
            const offset = parseInt(
              edge.attr('line/strokeDashoffset') || '0',
              10,
            )
            edge.attr({
              line: {
                strokeDasharray: '5, 10',
                strokeDashoffset: offset + 20,
              },
            })
          },
        },
      },
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="edge-tool-button-app ">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.edge-tool-button-app {
  display: flex;
  width: 100%;
  padding: 0;
  font-family: sans-serif;
}
.edge-tool-button-app .app-content {
  flex: 1;
  height: 320px;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`)
