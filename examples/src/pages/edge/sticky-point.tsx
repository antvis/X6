import React from 'react'
import { Graph, Node } from '@antv/x6'
import '../index.less'

Node.registry.register(
  'rectText',
  {
    inherit: 'rect',
    attrs: { body: { stroke: 'none' } },
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1000,
      height: 800,
      connecting: {
        anchor: 'center',
        connectionPoint: {
          name: 'boundary',
          args: {
            sticky: true,
            extrapolate: true,
          },
        },
      },
    })

    function title(x: number, y: number, label: string) {
      graph.addNode({
        x,
        y,
        shape: 'rectText',
        attrs: {
          label: {
            text: label,
            fontSize: 12,
            textAnchor: 'start',
            fill: 'black',
          },
        },
      })
    }

    title(40, 40, 'Sticky points - default')
    const o1 = graph.addNode({
      x: 40,
      y: 80,
      width: 60,
      height: 30,
      angle: 45,
    })
    const o2 = graph.addNode({
      x: 240,
      y: 100,
      width: 60,
      height: 30,
      angle: 45,
    })
    graph.addEdge({
      source: { cell: o1.id, selector: 'body' },
      target: o2,
    })

    title(40, 190, 'Sticky points - orthogonal')
    const o3 = graph.addNode({
      shape: 'ellipse',
      x: 40,
      y: 220,
      width: 60,
      height: 30,
    })
    const o4 = graph.addNode({
      shape: 'rect',
      x: 240,
      y: 235,
      width: 60,
      height: 30,
    })
    graph.addEdge({
      source: { cell: o3.id, anchor: { name: 'orth' } },
      target: { cell: o4.id, anchor: { name: 'orth' } },
    })

    title(40, 320, 'Sticky points - intersecting')
    const o5 = graph.addNode({
      shape: 'circle',
      x: 40,
      y: 400,
      width: 60,
      height: 60,
      attrs: { label: { text: 'circle' } },
    })
    const o6 = graph.addNode({
      shape: 'rect',
      x: 240,
      y: 340,
      width: 60,
      height: 30,
    })
    graph.addEdge({
      source: { cell: o5.id, selector: 'body' },
      target: { cell: o6.id },
    })

    const o51 = graph.addNode({
      shape: 'ellipse',
      x: 380,
      y: 420,
      width: 60,
      height: 30,
      attrs: { label: { text: 'ellipse' } },
    })
    const o61 = graph.addNode({
      shape: 'rect',
      x: 500,
      y: 320,
      width: 60,
      height: 30,
    })
    graph.addEdge({
      source: { cell: o51.id, selector: 'body' },
      target: { cell: o61.id },
    })

    const o511 = graph.addNode({
      shape: 'polygon',
      x: 600,
      y: 340,
      width: 60,
      height: 60,
      attrs: {
        label: { text: 'polygon' },
        body: { refPoints: '60,20 100,40 100,80 60,100 20,80 20,40' },
      },
    })
    const o611 = graph.addNode({
      shape: 'rect',
      x: 700,
      y: 480,
      width: 60,
      height: 30,
    })
    graph.addEdge({
      source: { cell: o511.id, selector: 'body' },
      target: { cell: o611.id },
    })

    const o5111 = graph.addNode({
      shape: 'polyline',
      x: 680,
      y: 240,
      width: 50,
      height: 50,
      attrs: {
        label: {
          text: 'polyline',
          refY: '100%',
          refY2: 15,
        },
        body: {
          refPoints: '20,100 40,60 70,80 100,20',
        },
      },
    })
    const o6111 = graph.addNode({
      shape: 'rect',
      x: 800,
      y: 100,
      width: 60,
      height: 30,
    })
    graph.addEdge({
      source: { cell: o5111.id, selector: 'body' },
      target: { cell: o6111.id },
    })

    const o5112 = graph.addNode({
      shape: 'polyline',
      x: 840,
      y: 280,
      width: 50,
      height: 50,
      attrs: {
        label: {
          text: 'polyline',
          refY: '100%',
          refY2: 15,
        },
        body: {
          refPoints: '20,100 40,60 70,80 100,20',
        },
      },
    })
    const o6112 = graph.addNode({
      shape: 'polygon',
      x: 820,
      y: 480,
      width: 50,
      height: 50,
      attrs: {
        label: { text: 'polygon' },
        body: { refPoints: '60,20 100,40 100,80 60,100 20,80 20,40' },
      },
    })
    graph.addEdge({
      source: { cell: o5112.id, selector: 'body' },
      target: { cell: o6112.id },
    })

    const cross =
      'M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z'
    const star =
      'M28.631,12.359c-0.268-0.826-1.036-1.382-1.903-1.382h-0.015l-7.15,0.056l-2.155-6.816c-0.262-0.831-1.035-1.397-1.906-1.397s-1.645,0.566-1.906,1.397l-2.157,6.816l-7.15-0.056H4.273c-0.868,0-1.636,0.556-1.904,1.382c-0.27,0.831,0.029,1.737,0.74,2.246l5.815,4.158l-2.26,6.783c-0.276,0.828,0.017,1.739,0.723,2.25c0.351,0.256,0.763,0.384,1.175,0.384c0.418,0,0.834-0.132,1.189-0.392l5.751-4.247l5.751,4.247c0.354,0.26,0.771,0.392,1.189,0.392c0.412,0,0.826-0.128,1.177-0.384c0.704-0.513,0.997-1.424,0.721-2.25l-2.263-6.783l5.815-4.158C28.603,14.097,28.901,13.19,28.631,12.359zM19.712,17.996l2.729,8.184l-6.94-5.125L8.56,26.18l2.729-8.184l-7.019-5.018l8.627,0.066L15.5,4.82l2.603,8.225l8.627-0.066L19.712,17.996z'
    const umbrella =
      'M14.784,26.991c0,1.238-1.329,1.696-1.835,1.696c-0.504,0-1.536-0.413-1.65-1.812c0-0.354-0.288-0.642-0.644-0.642c-0.354,0-0.641,0.287-0.641,0.642c0.045,1.056,0.756,3.052,2.935,3.052c2.432,0,3.166-1.882,3.166-3.144v-8.176l-1.328-0.024C14.787,18.584,14.784,25.889,14.784,26.991zM15.584,9.804c-6.807,0-11.084,4.859-11.587,8.326c0.636-0.913,1.694-1.51,2.89-1.51c1.197,0,2.22,0.582,2.855,1.495c0.638-0.904,1.69-1.495,2.88-1.495c1.2,0,2.26,0.6,2.896,1.517c0.635-0.917,1.83-1.517,3.03-1.517c1.19,0,2.241,0.591,2.879,1.495c0.636-0.913,1.659-1.495,2.855-1.495c1.197,0,2.254,0.597,2.89,1.51C26.669,14.663,22.393,9.804,15.584,9.804zM14.733,7.125v2.081h1.323V7.125c0-0.365-0.296-0.661-0.661-0.661C15.029,6.464,14.733,6.76,14.733,7.125z'
    const music =
      'M12.751,8.042v6.041v9.862c-0.677-0.45-1.636-0.736-2.708-0.736c-2.048,0-3.708,1.025-3.708,2.292c0,1.265,1.66,2.291,3.708,2.291s3.708-1.026,3.708-2.291V13.786l10.915-3.24v9.565c-0.678-0.45-1.635-0.736-2.708-0.736c-2.048,0-3.708,1.025-3.708,2.292c0,1.265,1.66,2.291,3.708,2.291s3.708-1.026,3.708-2.291V10.249V4.208L12.751,8.042z'
    const thunder =
      'M25.371,7.306c-0.092-3.924-3.301-7.077-7.248-7.079c-2.638,0.001-4.942,1.412-6.208,3.517c-0.595-0.327-1.28-0.517-2.01-0.517C7.626,3.229,5.772,5.033,5.689,7.293c-2.393,0.786-4.125,3.025-4.127,5.686c0,3.312,2.687,6,6,6v-0.002h5.271l-2.166,3.398l1.977-0.411L10,30.875l9.138-10.102L17,21l2.167-2.023h4.269c3.312,0,6-2.688,6-6C29.434,10.34,27.732,8.11,25.371,7.306zM23.436,16.979H7.561c-2.209-0.006-3.997-1.792-4.001-4.001c-0.002-1.982,1.45-3.618,3.35-3.931c0.265-0.043,0.502-0.191,0.657-0.414C7.722,8.41,7.779,8.136,7.73,7.87C7.702,7.722,7.685,7.582,7.685,7.446C7.689,6.221,8.68,5.23,9.905,5.228c0.647,0,1.217,0.278,1.633,0.731c0.233,0.257,0.587,0.375,0.927,0.309c0.342-0.066,0.626-0.307,0.748-0.63c0.749-1.992,2.662-3.412,4.911-3.41c2.899,0.004,5.244,2.35,5.251,5.249c0,0.161-0.009,0.326-0.027,0.497c-0.049,0.517,0.305,0.984,0.815,1.079c1.86,0.344,3.274,1.966,3.271,3.923C27.43,15.186,25.645,16.973,23.436,16.979z'
    const palm =
      'M14.296,27.885v-2.013c0,0-0.402-1.408-1.073-2.013c-0.671-0.604-1.274-1.274-1.409-1.61c0,0-0.268,0.135-0.737-0.335s-1.812-2.616-1.812-2.616l-0.671-0.872c0,0-0.47-0.671-1.275-1.342c-0.805-0.672-0.938-0.067-1.476-0.738s0.604-1.275,1.006-1.409c0.403-0.134,1.946,0.134,2.684,0.872c0.738,0.738,0.738,0.738,0.738,0.738l1.073,1.141l0.537,0.201l0.671-1.073l-0.269-2.281c0,0-0.604-2.55-0.737-4.764c-0.135-2.214-0.47-5.703,1.006-5.837s1.007,2.55,1.073,3.489c0.067,0.938,0.806,5.232,1.208,5.568c0.402,0.335,0.671,0.066,0.671,0.066l0.402-7.514c0,0-0.479-2.438,1.073-2.549c0.939-0.067,0.872,1.543,0.872,2.147c0,0.604,0.269,7.514,0.269,7.514l0.537,0.135c0,0,0.402-2.214,0.604-3.153s0.604-2.416,0.537-3.087c-0.067-0.671-0.135-2.348,1.006-2.348s0.872,1.812,0.939,2.415s-0.134,3.153-0.134,3.757c0,0.604-0.738,3.623-0.537,3.824s2.08-2.817,2.349-3.958c0.268-1.141,0.201-3.02,1.408-2.885c1.208,0.134,0.47,2.817,0.402,3.086c-0.066,0.269-0.671,2.349-0.872,2.952s-0.805,1.476-1.006,2.013s0.402,2.349,0,4.629c-0.402,2.281-1.61,5.166-1.61,5.166l0.604,2.08c0,0-1.744,0.671-3.824,0.805C16.443,28.221,14.296,27.885,14.296,27.885z'
    const home =
      'M64 36.903l-32-24.839-32 24.839v-10.127l32-24.839 32 24.839zM56 36v24h-16v-16h-16v16h-16v-24l24-18z'
    const home2 =
      'M32 2l-32 32 6 6 6-6v26h16v-12h8v12h16v-26l6 6 6-6-32-32zM32 28c-2.209 0-4-1.791-4-4s1.791-4 4-4c2.209 0 4 1.791 4 4s-1.791 4-4 4z'
    const newspaper =
      'M56 16v-8h-56v44c0 2.209 1.791 4 4 4h54c3.314 0 6-2.686 6-6v-34h-8zM52 52h-48v-40h48v40zM8 20h40v4h-40zM32 28h16v4h-16zM32 36h16v4h-16zM32 44h12v4h-12zM8 28h20v20h-20z'

    const icons = [
      cross,
      star,
      umbrella,
      music,
      thunder,
      palm,
      home,
      home2,
      newspaper,
    ]

    const o7 = graph.addNode({
      shape: 'path',
      x: 140,
      y: 660,
      width: 50,
      height: 50,
      attrs: {
        label: {
          text: 'path',
          refY: '100%',
          refY2: 15,
        },
        body: {
          refD: cross,
          pointerEvents: 'bounding-box',
          cursor: 'pointer',
        },
      },
    })

    const o8 = graph.addNode({
      shape: 'rect',
      x: 240,
      y: 520,
      width: 60,
      height: 30,
    })
    graph.addEdge({
      source: { cell: o7.id, selector: 'body' },
      target: { cell: o8.id },
    })

    graph.on('node:mousedown', ({ cell }) => {
      if (cell === o7) {
        const index = icons.indexOf(o7.attr('body/refD')) + 1
        const icon = icons[index % icons.length]
        o7.attr('body/refD', icon)
      }
    })

    const o9 = graph.addNode({
      shape: 'rectText',
      x: 400,
      y: 80,
      width: 60,
      height: 30,
      attrs: {
        label: {
          text: 'my text',
          fontSize: 20,
        },
      },
    })
    const o10 = graph.addNode({
      shape: 'rect',
      x: 600,
      y: 160,
      width: 60,
      height: 30,
      angle: 45,
    })
    graph.addEdge({
      source: { cell: o9.id, selector: 'body' },
      target: { cell: o10.id },
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
