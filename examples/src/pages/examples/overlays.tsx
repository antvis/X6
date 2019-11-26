import React from 'react'
import { Graph, Overlay, Image } from '../../../../src'

export default class Overlays extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph(this.container)

    graph.on('click', ({ cell }) => {
      if (cell != null) {
        const overlays = graph.getOverlays(cell)
        if (overlays == null) {
          const overlay = new Overlay({
            image: new Image('https://gw.alipayobjects.com/mdn/rms_5cf9ec/afts/img/A*U7bEQLQ7lb4AAAAAAAAAAABkARQnAQ', 16, 16),
            tooltip: 'Overlay tooltip'
          })

          overlay.on('click', () => {
            alert('Overlay clicked')
          })

          graph.addOverlay(cell, overlay)
        } else {
          graph.removeOverlays(cell)
        }
      }
    })

    graph.on('dblclick', ({ cell }) => {
      alert('Doubleclick: ' + (cell != null ? 'Cell' : 'Graph'))
    })

    graph.batchUpdate(() => {
      const n1 = graph.addNode({ data: 'Hello', x: 60, y: 60, width: 120, height: 70 })
      const n2 = graph.addNode({ data: 'World', x: 240, y: 240, width: 80, height: 40 })
      graph.addEdge({ source: n1, target: n2 })
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div>
        <div
          ref={this.refContainer}
          tabIndex={-1}
          className="graph-container big"
        />
      </div>
    )
  }
}
