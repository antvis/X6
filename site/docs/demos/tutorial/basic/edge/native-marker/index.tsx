import insertDemoCss from 'insert-css'
import { createRoot } from 'react-dom/client'
import React from 'react'
import { Graph } from '@antv/x6'

const markers = [
  'block',
  'classic',
  'diamond',
  'circle',
  'circlePlus',
  'ellipse',
  'cross',
  'async',
]

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
    })

    markers.forEach((marker, i) => {
      graph.addEdge({
        sourcePoint: [120, 20 + i * 40],
        targetPoint: [400, 20 + i * 40],
        label: marker,
        attrs: {
          line: {
            sourceMarker: marker,
            targetMarker: marker,
            stroke: '#8f8f8f',
            strokeWidth: 1,
          },
        },
      })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="native-marker-app ">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}

const root = createRoot(document.getElementById('container')!)
root.render(<Example />)
window.addEventListener('pagehide', () => root.unmount(), { once: true })

insertDemoCss(`
.native-marker-app {
  display: flex;
  width: 100%;
  padding: 0;
  font-family: sans-serif;
}
.native-marker-app .app-content {
  flex: 1;
  height: 320px;
  margin-right: 8px;
  margin-left: 8px;
  box-shadow: 0 0 10px 1px #e9e9e9;
}
`)
