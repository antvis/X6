import React from 'react'
import { Graph } from '../../../../src'
import { markerNormalize } from '../../../../src/registry'
import '../index.less'

export class CustomMarkerExample extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      interacting: { edgeMovable: false },
      connecting: {
        connectionPoint: {
          name: 'boundary',
          args: {
            extrapolate: true,
            sticky: true,
          },
        },
        validateConnection: function () {
          return false
        },
      },
    })

    graph.addEdge({
      source: { x: 20, y: 20 },
      target: { x: 350, y: 20 },
      attrs: {
        line: {
          stroke: '#222138',
          sourceMarker: {
            name: 'classic',
            fill: '#31d0c6',
            stroke: 'none',
            size: 20,
          },
          targetMarker: {
            name: 'block',
            fill: '#fe854f',
            stroke: 'none',
            size: 20,
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 20, y: 80 },
      target: { x: 350, y: 80 },
      attrs: {
        line: {
          stroke: '#fe854f',
          strokeWidth: 1,
          sourceMarker: 'block',
          targetMarker: {
            tagName: 'circle',
            r: 5,
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 20, y: 400 },
      target: { x: 280, y: 400 },
      attrs: {
        line: {
          stroke: '#fe854f',
          strokeWidth: 1,
          sourceMarker: 'block',
          targetMarker: {
            name: 'block',
            width: 12,
            height: 6,
            open: true,
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 20, y: 430 },
      target: { x: 280, y: 430 },
      attrs: {
        line: {
          stroke: '#fe854f',
          strokeWidth: 1,
          sourceMarker: 'diamond',
          targetMarker: {
            name: 'diamond',
            width: 12,
            height: 6,
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 20, y: 460 },
      target: { x: 280, y: 460 },
      attrs: {
        line: {
          stroke: '#fe854f',
          strokeWidth: 1,
          sourceMarker: 'ellipse',
          targetMarker: {
            name: 'ellipse',
            rx: 6,
            ry: 4,
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 20, y: 490 },
      target: { x: 280, y: 490 },
      attrs: {
        line: {
          stroke: '#fe854f',
          strokeWidth: 1,
          sourceMarker: 'circle',
          targetMarker: {
            name: 'circlePlus',
            r: 10,
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 20, y: 520 },
      target: { x: 280, y: 520 },
      attrs: {
        line: {
          stroke: '#fe854f',
          strokeWidth: 1,
          sourceMarker: 'cross',
          targetMarker: {
            name: 'cross',
            width: 12,
            height: 8,
            offset: -10,
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 20, y: 550 },
      target: { x: 280, y: 550 },
      attrs: {
        line: {
          stroke: '#fe854f',
          strokeWidth: 1,
          sourceMarker: 'async',
          targetMarker: {
            name: 'async',
            width: 12,
            height: 8,
            offset: -10,
            open: true,
            flip: true,
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 10, y: 140 },
      target: { x: 350, y: 140 },
      attrs: {
        line: {
          stroke: '#31d0c6',
          strokeWidth: 3,
          strokeDasharray: '5 2',
          sourceMarker: {
            stroke: '#31d0c6',
            fill: '#31d0c6',
            d: markerNormalize(
              'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z',
            ),
          },
          targetMarker: {
            stroke: '#31d0c6',
            fill: '#31d0c6',
            name: 'path',
            d: 'M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z',
            offsetX: 10,
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 400, y: 20 },
      target: { x: 740, y: 20 },
      vertices: [
        { x: 400, y: 60 },
        { x: 550, y: 60 },
        { x: 550, y: 20 },
      ],
      attrs: {
        line: {
          stroke: '#3c4260',
          strokeWidth: 2,
          sourceMarker: {
            fill: '#4b4a67',
            stroke: '#4b4a67',
            d: markerNormalize(
              'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z',
            ),
          },
          targetMarker: {
            fill: '#4b4a67',
            stroke: '#4b4a67',
            d: markerNormalize(
              'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z',
            ),
          },
          vertexMarker: {
            tagName: 'circle',
            r: 4,
            strokeWidth: 2,
            fill: 'white',
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 440, y: 100 },
      target: { x: 740, y: 100 },
      vertices: [
        { x: 400, y: 140 },
        { x: 550, y: 100 },
        { x: 600, y: 140 },
      ],
      smooth: true,
      attrs: {
        line: {
          stroke: '#7c68fc',
          strokeWidth: 3,
          sourceMarker: {
            stroke: '#7c68fc',
            fill: '#7c68fc',
            d: markerNormalize(
              'M24.316,5.318,9.833,13.682,9.833,5.5,5.5,5.5,5.5,25.5,9.833,25.5,9.833,17.318,24.316,25.682z',
            ),
          },
          targetMarker: {
            stroke: '#feb663',
            fill: '#feb663',
            d: markerNormalize(
              'M14.615,4.928c0.487-0.986,1.284-0.986,1.771,0l2.249,4.554c0.486,0.986,1.775,1.923,2.864,2.081l5.024,0.73c1.089,0.158,1.335,0.916,0.547,1.684l-3.636,3.544c-0.788,0.769-1.28,2.283-1.095,3.368l0.859,5.004c0.186,1.085-0.459,1.553-1.433,1.041l-4.495-2.363c-0.974-0.512-2.567-0.512-3.541,0l-4.495,2.363c-0.974,0.512-1.618,0.044-1.432-1.041l0.858-5.004c0.186-1.085-0.307-2.6-1.094-3.368L3.93,13.977c-0.788-0.768-0.542-1.525,0.547-1.684l5.026-0.73c1.088-0.158,2.377-1.095,2.864-2.081L14.615,4.928z',
            ),
          },
        },
      },
    })

    graph.addEdge({
      source: { x: 400, y: 200 },
      target: { x: 740, y: 200 },
      connector: { name: 'smooth' },
      attrs: {
        line: {
          targetMarker: {
            d: 'M 0 -5 L -10 0 L 0 5 Z',
          },
        },
      },
      labels: [
        {
          markup: [
            {
              tagName: 'rect',
              selector: 'labelBody',
            },
            {
              tagName: 'text',
              selector: 'labelText',
            },
          ],
          attrs: {
            labelText: {
              text: 'First',
              fill: '#7c68fc',
              fontFamily: 'sans-serif',
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
            },
            labelBody: {
              ref: 'labelText',
              refX: -5,
              refY: -5,
              refWidth: '100%',
              refHeight: '100%',
              refWidth2: 10,
              refHeight2: 10,
              stroke: '#7c68fc',
              fill: 'white',
              strokeWidth: 2,
              rx: 5,
              ry: 5,
            },
          },
          position: {
            distance: 0.3,
            options: {
              keepGradient: true,
              ensureLegibility: true,
            },
          },
        },
        {
          markup: [
            {
              tagName: 'ellipse',
              selector: 'labelBody',
            },
            {
              tagName: 'text',
              selector: 'labelText',
            },
          ],
          attrs: {
            labelText: {
              text: 'Second',
              fill: '#31d0c6',
              fontFamily: 'sans-serif',
              textAnchor: 'middle',
              textVerticalAnchor: 'middle',
            },
            labelBody: {
              ref: 'labelText',
              refRx: '70%',
              refRy: '80%',
              stroke: '#31d0c6',
              fill: 'white',
              strokeWidth: 2,
            },
          },
          position: {
            distance: 0.7,
            angle: 45,
          },
        },
      ],
    })

    // Custom Edge
    // -----------

    const node1 = graph.addNode({
      shape: 'path',
      x: 500,
      y: 450,
      width: 100,
      height: 100,
      attrs: {
        body: {
          fill: '#31d0c6',
          refD: 'M 0 20 10 20 10 30 30 30 30 0 40 0 40 40 0 40 z',
        },
      },
    })

    graph.addEdge({
      source: { x: 300, y: 400 },
      target: node1,
      attrs: {
        line: {
          sourceMarker: {
            d: 'M 0 0 15 0',
            stroke: 'white',
            strokeWidth: 3,
          },
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
