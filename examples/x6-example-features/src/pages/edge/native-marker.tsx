import React from 'react'
import { Select } from 'antd'
import { Graph, Edge } from '@antv/x6'
import '../index.less'

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
  private edge1: Edge
  private edge2: Edge

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
    })

    graph.addNode({
      id: 'a',
      label: 'a',
      shape: 'rect',
      width: 40,
      height: 40,
      x: 100,
      y: 100,
    })

    graph.addNode({
      id: 'b',
      label: 'b',
      shape: 'rect',
      width: 40,
      height: 40,
      x: 300,
      y: 100,
    })

    graph.addNode({
      id: 'c',
      label: 'c',
      shape: 'rect',
      width: 40,
      height: 40,
      x: 500,
      y: 100,
    })

    this.edge1 = graph.addEdge({
      source: 'a',
      target: 'b',
    })

    this.edge2 = graph.addEdge({
      source: 'b',
      target: 'c',
    })

    markers.forEach((marker, i) => {
      graph.addEdge({
        sourcePoint: [40, 240 + i * 40],
        targetPoint: [320, 240 + i * 40],
        label: marker,
        attrs: {
          line: {
            sourceMarker: {
              name: marker,
              args: marker === 'ellipse' ? { rx: 6, ry: 4 } : { size: 6 },
            },
            targetMarker: {
              name: marker,
              args: marker === 'ellipse' ? { rx: 6, ry: 4 } : { size: 6 },
            },
            strokeWidth: 1,
          },
        },
      })
    })

    graph.addEdge({
      source: { x: 50, y: 565 },
      target: { x: 300, y: 565 },
      label: 'custom marker',
      attrs: {
        line: {
          strokeWidth: 1,
          stroke: '#31d0c6',
          sourceMarker: {
            name: 'path',
            d: 'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z',
          },
          targetMarker: {
            name: 'path',
            offsetX: 10,
            d: 'M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z',
          },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  onMarkerChanged = (marker: string) => {
    console.log(marker)
    this.edge1.attr('line/targetMarker', marker)
    this.edge2.attr('line/targetMarker', marker)
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div className="x6-graph-tools">
          <Select style={{ width: 120 }} onChange={this.onMarkerChanged}>
            {markers.map((marker) => (
              <Select.Option key={marker} value={marker}>
                {marker}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
