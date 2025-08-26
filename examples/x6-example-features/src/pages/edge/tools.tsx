import React from 'react'
import { Graph, Timing, Registry } from '@antv/x6'
import '../index.less'

const { Marker } = Registry

function registerEdgeTool(name: string, inherit: string, options: any) {
  Graph.registerEdgeTool(
    name,
    {
      name,
      inherit,
      ...options,
    },
    true,
  )
}

registerEdgeTool('rectangle-source-arrowhead', 'source-arrowhead', {
  tagName: 'rect',
  attrs: {
    x: -15,
    y: -15,
    width: 30,
    height: 30,
    fill: 'black',
    'fill-opacity': 0.3,
    stroke: 'black',
    'stroke-width': 2,
    cursor: 'move',
  },
})

registerEdgeTool('circle-target-arrowhead', 'target-arrowhead', {
  tagName: 'circle',
  attrs: {
    r: 20,
    fill: 'black',
    'fill-opacity': 0.3,
    stroke: 'black',
    'stroke-width': 2,
    cursor: 'move',
  },
})

registerEdgeTool('custom-boundary', 'boundary', {
  attrs: {
    fill: '#7c68fc',
    'fill-opacity': 0.2,
    stroke: '#333',
    'stroke-width': 0.5,
    'stroke-dasharray': '5, 5',
    'pointer-events': 'none',
  },
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: 10,
      interacting: { edgeMovable: false },
      connecting: {
        connectionPoint: {
          name: 'boundary',
          args: {
            extrapolate: true,
            sticky: true,
          },
        },
        validateConnection() {
          return false
        },
      },
    })

    const edge1 = graph.addEdge({
      source: { x: 20, y: 20 },
      target: { x: 350, y: 20 },
      attrs: {
        line: {
          stroke: '#222138',
          sourceMarker: {
            fill: '#31d0c6',
            stroke: 'none',
            d: 'M 5 -10 L -15 0 L 5 10 Z',
          },
          targetMarker: {
            fill: '#fe854f',
            stroke: 'none',
            d: 'M 5 -10 L -15 0 L 5 10 Z',
          },
        },
      },
    })

    edge1.setTools({
      items: ['segments'],
    })

    const edge2 = graph.addEdge({
      source: { x: 20, y: 80 },
      target: { x: 350, y: 80 },
      attrs: {
        line: {
          stroke: '#fe854f',
          strokeWidth: 4,
          sourceMarker: {
            // if no fill or stroke specified, marker inherits the line color
            d: 'M 0 -5 L -10 0 L 0 5 Z',
          },
          targetMarker: {
            // the marker can be an arbitrary SVGElement
            tagName: 'circle',
            r: 5,
          },
        },
      },
    })

    const edge3 = graph.addEdge({
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
            d: Marker.normalize(
              'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z',
            ),
          },
          targetMarker: {
            stroke: '#31d0c6',
            fill: '#31d0c6',
            d: Marker.normalize(
              'M4.834,4.834L4.833,4.833c-5.889,5.892-5.89,15.443,0.001,21.334s15.44,5.888,21.33-0.002c5.891-5.891,5.893-15.44,0.002-21.33C20.275-1.056,10.725-1.056,4.834,4.834zM25.459,5.542c0.833,0.836,1.523,1.757,2.104,2.726l-4.08,4.08c-0.418-1.062-1.053-2.06-1.912-2.918c-0.859-0.859-1.857-1.494-2.92-1.913l4.08-4.08C23.7,4.018,24.622,4.709,25.459,5.542zM10.139,20.862c-2.958-2.968-2.959-7.758-0.001-10.725c2.966-2.957,7.756-2.957,10.725,0c2.954,2.965,2.955,7.757-0.001,10.724C17.896,23.819,13.104,23.817,10.139,20.862zM5.542,25.459c-0.833-0.837-1.524-1.759-2.105-2.728l4.081-4.081c0.418,1.063,1.055,2.06,1.914,2.919c0.858,0.859,1.855,1.494,2.917,1.913l-4.081,4.081C7.299,26.982,6.379,26.292,5.542,25.459zM8.268,3.435l4.082,4.082C11.288,7.935,10.29,8.571,9.43,9.43c-0.858,0.859-1.494,1.855-1.912,2.918L3.436,8.267c0.58-0.969,1.271-1.89,2.105-2.727C6.377,4.707,7.299,4.016,8.268,3.435zM22.732,27.563l-4.082-4.082c1.062-0.418,2.061-1.053,2.919-1.912c0.859-0.859,1.495-1.857,1.913-2.92l4.082,4.082c-0.58,0.969-1.271,1.891-2.105,2.728C24.623,26.292,23.701,26.983,22.732,27.563z',
              10,
            ),
          },
        },
      },
    })

    const edge4 = graph.addEdge({
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
            d: Marker.normalize(
              'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z',
            ),
          },
          targetMarker: {
            fill: '#4b4a67',
            stroke: '#4b4a67',
            d: Marker.normalize(
              'M5.5,15.499,15.8,21.447,15.8,15.846,25.5,21.447,25.5,9.552,15.8,15.152,15.8,9.552z',
            ),
          },
          vertexMarker: {
            type: 'circle',
            r: 5,
            'stroke-width': 2,
            fill: 'white',
          },
        },
      },
    })

    const edge5 = graph.addEdge({
      source: { x: 440, y: 100 },
      target: { x: 740, y: 100 },
      vertices: [
        { x: 400, y: 140 },
        { x: 550, y: 100 },
        { x: 600, y: 140 },
      ],
      connector: 'smooth',
      attrs: {
        line: {
          stroke: '#7c68fc',
          strokeWidth: 3,
          sourceMarker: {
            stroke: '#7c68fc',
            fill: '#7c68fc',
            d: Marker.normalize(
              'M24.316,5.318,9.833,13.682,9.833,5.5,5.5,5.5,5.5,25.5,9.833,25.5,9.833,17.318,24.316,25.682z',
            ),
          },
          targetMarker: {
            stroke: '#feb663',
            fill: '#feb663',
            d: Marker.normalize(
              'M14.615,4.928c0.487-0.986,1.284-0.986,1.771,0l2.249,4.554c0.486,0.986,1.775,1.923,2.864,2.081l5.024,0.73c1.089,0.158,1.335,0.916,0.547,1.684l-3.636,3.544c-0.788,0.769-1.28,2.283-1.095,3.368l0.859,5.004c0.186,1.085-0.459,1.553-1.433,1.041l-4.495-2.363c-0.974-0.512-2.567-0.512-3.541,0l-4.495,2.363c-0.974,0.512-1.618,0.044-1.432-1.041l0.858-5.004c0.186-1.085-0.307-2.6-1.094-3.368L3.93,13.977c-0.788-0.768-0.542-1.525,0.547-1.684l5.026-0.73c1.088-0.158,2.377-1.095,2.864-2.081L14.615,4.928z',
            ),
          },
        },
      },
    })

    const edge7 = graph.addEdge({
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
            args: {
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

    const edge9 = graph.addEdge({
      markup: [
        {
          tagName: 'path',
          selector: 'p1',
        },
        {
          tagName: 'rect',
          selector: 'sign',
        },
        {
          tagName: 'circle',
          selector: 'c1',
        },
        {
          tagName: 'path',
          selector: 'p2',
        },
        {
          tagName: 'circle',
          selector: 'c2',
        },
        {
          tagName: 'text',
          selector: 'signText',
        },
      ],
      source: { x: 380, y: 380 },
      target: { x: 740, y: 280 },
      vertices: [{ x: 600, y: 280 }],
      attrs: {
        p1: {
          connection: true,
          fill: 'none',
          stroke: 'black',
          strokeWidth: 6,
          strokeLinejoin: 'round',
        },
        p2: {
          connection: true,
          fill: 'none',
          stroke: '#fe854f',
          strokeWidth: 4,
          pointerEvents: 'none',
          strokeLinejoin: 'round',
          targetMarker: {
            tagName: 'path',
            fill: '#fe854f',
            stroke: 'black',
            'stroke-width': 1,
            d: 'M 10 -3 10 -10 -2 0 10 10 10 3',
          },
        },
        sign: {
          x: -20,
          y: -10,
          width: 40,
          height: 20,
          stroke: 'black',
          fill: '#fe854f',
          atConnectionLength: 30,
          strokeWidth: 1,
          event: 'myclick:rect',
        },
        signText: {
          atConnectionLength: 30,
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          text: 'Link',
        },
        c1: {
          r: 10,
          stroke: 'black',
          fill: '#fe854f',
          atConnectionRatio: 0.5,
          strokeWidth: 1,
          event: 'myclick:circle',
          cursor: 'pointer',
        },
        c2: {
          r: 5,
          stroke: 'black',
          fill: 'white',
          atConnectionRatio: 0.5,
          strokeWidth: 1,
          pointerEvents: 'none',
        },
      },
    })

    graph.on('myclick:circle', ({ cell, e }) => {
      e.stopPropagation()
      var edge = cell
      var t = edge.attr('c1/atConnectionRatio') > 0.2 ? 0.2 : 0.9
      var transitionOpt = {
        delay: 100,
        duration: 2000,
        timingFunction: Timing.inout,
      }
      edge.transition('attrs/c1/atConnectionRatio', t, transitionOpt)
      edge.transition('attrs/c2/atConnectionRatio', t, transitionOpt)
    })

    const path = graph.addNode({
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

    const edge10 = graph.addEdge({
      source: { x: 300, y: 400 },
      targetCell: path,
      attrs: {
        line: {
          sourceMarker: {
            d: 'M 0 0 15 0',
            stroke: 'white',
            'stroke-width': 3,
          },
        },
      },
    })

    graph.findViewByCell(edge10)!.addTools({
      name: 'permanent',
      items: ['target-anchor', 'rectangle-source-arrowhead'],
    })

    // stubs

    const edge11 = graph.addEdge({
      markup: [
        {
          tagName: 'path',
          selector: 'line',
        },
        {
          tagName: 'g',
          selector: 'sourceReference',
          children: [
            {
              tagName: 'rect',
              selector: 'sourceReferenceBody',
              groupSelector: 'endReferenceBody',
            },
            {
              tagName: 'text',
              selector: 'sourceReferenceLabel',
              groupSelector: 'endReferenceLabel',
            },
          ],
        },
        {
          tagName: 'g',
          selector: 'targetReference',
          children: [
            {
              tagName: 'rect',
              selector: 'targetReferenceBody',
              groupSelector: 'endReferenceBody',
            },
            {
              tagName: 'text',
              selector: 'targetReferenceLabel',
              groupSelector: 'endReferenceLabel',
            },
          ],
        },
      ],
      source: { x: 120, y: 550 },
      target: { x: 120, y: 400 },
      attrs: {
        line: {
          connection: { stubs: 40 },
          fill: 'none',
          stroke: 'black',
          strokeWidth: 2,
          strokeLinejoin: 'round',
          sourceMarker: {
            tagName: 'circle',
            r: 5,
            cx: 5,
            fill: 'white',
            stroke: 'black',
            'stroke-width': 2,
          },
          targetMarker: {
            tagName: 'circle',
            r: 5,
            cx: 5,
            fill: 'white',
            stroke: 'black',
            'stroke-width': 2,
          },
        },
        endReferenceBody: {
          x: -12,
          y: -45,
          width: 24,
          height: 90,
          fill: 'white',
          stroke: 'black',
          strokeWidth: 2,
        },
        sourceReference: {
          atConnectionLength: 50,
          event: 'edge:source:click',
        },
        targetReference: {
          atConnectionLength: -50,
          event: 'edge:target:click',
        },
        endReferenceLabel: {
          textAnchor: 'middle',
          textVerticalAnchor: 'middle',
          textDecoration: 'underline',
          writingMode: 'TB',
          fontFamily: 'sans-sarif',
          fontSize: 15,
          cursor: 'pointer',
          annotations: [
            {
              start: 6,
              end: 12,
              attrs: {
                'font-weight': 'bold',
              },
            },
          ],
        },
        sourceReferenceLabel: {
          text: 'Go to Target',
        },
        targetReferenceLabel: {
          text: 'Go to Source',
        },
      },
    })

    graph.on('edge:source:click', ({ cell }) => {
      cell.attr({
        sourceReferenceBody: { fill: 'white' },
        targetReferenceBody: { fill: '#fe854f' },
      })
    })

    graph.on('edge:target:click', ({ cell }) => {
      cell.attr({
        sourceReferenceBody: { fill: '#fe854f' },
        targetReferenceBody: { fill: 'white' },
      })
    })

    //
    const edge12 = graph.addEdge({
      markup: [
        {
          tagName: 'path',
          selector: 'line',
        },
        {
          tagName: 'path',
          selector: 'crossing',
        },
      ],
      source: { x: 220, y: 550 },
      target: { x: 220, y: 400 },
      attrs: {
        line: {
          connection: { stubs: -30 },
          fill: 'none',
          stroke: 'black',
          strokeWidth: 2,
          strokeLinejoin: 'round',
          sourceMarker: {
            tagName: 'circle',
            r: 5,
            cx: 5,
            fill: 'white',
            stroke: 'black',
            'stroke-width': 2,
          },
          targetMarker: {
            tagName: 'circle',
            r: 5,
            cx: 5,
            fill: 'white',
            stroke: 'black',
            'stroke-width': 2,
          },
        },
        crossing: {
          atConnectionRatio: 0.5,
          d: 'M -10 -20 0 20 M 0 -20 10 20',
          fill: 'none',
          stroke: 'black',
          strokeWidth: 2,
        },
      },
    })

    // tools
    graph.on('edge:mouseenter', ({ cell, view }) => {
      const items: any[] = []
      switch (cell) {
        // case edge1:
        case edge3:
        case edge4: {
          items.push(
            {
              name: 'vertices',
              args: { stopPropagation: false },
            },
            {
              name: 'segments',
              args: { stopPropagation: false },
            },
          )
          break
        }

        case edge2: {
          items.push(
            {
              name: 'button',
              args: {
                markup: [
                  {
                    tagName: 'circle',
                    selector: 'button',
                    attrs: {
                      r: 7,
                      stroke: '#fe854f',
                      'stroke-width': 3,
                      fill: 'white',
                      cursor: 'pointer',
                    },
                  },
                  {
                    tagName: 'text',
                    textContent: 'B',
                    selector: 'icon',
                    attrs: {
                      fill: '#fe854f',
                      'font-size': 10,
                      'text-anchor': 'middle',
                      'font-weight': 'bold',
                      'pointer-events': 'none',
                      y: '0.3em',
                    },
                  },
                ],
                distance: -30,
                onClick() {
                  var edge = this.cell
                  var source = edge.getSource()
                  var target = edge.getTarget()
                  edge.setSource(target)
                  edge.setTarget(source)
                },
              },
            },
            {
              name: 'button',
              args: {
                markup: [
                  {
                    tagName: 'circle',
                    selector: 'button',
                    attrs: {
                      r: 7,
                      stroke: '#fe854f',
                      'stroke-width': 3,
                      fill: 'white',
                      cursor: 'pointer',
                    },
                  },
                  {
                    tagName: 'text',
                    textContent: 'A',
                    selector: 'icon',
                    attrs: {
                      fill: '#fe854f',
                      'font-size': 10,
                      'text-anchor': 'middle',
                      'font-weight': 'bold',
                      'pointer-events': 'none',
                      y: '0.3em',
                    },
                  },
                ],
                distance: -50,
                onClick() {
                  var edge = this.cell
                  edge.attr({
                    line: {
                      strokeDasharray: '5,1',
                      strokeDashoffset:
                        (edge.attr('line/strokeDashoffset') | 0) + 20,
                    },
                  })
                },
              },
            },
          )
          break
        }

        case edge5: {
          items.push(
            {
              name: 'vertices',
              args: {
                snapRadius: 0,
                redundancyRemoval: false,
              },
            },
            'rectangle-source-arrowhead',
            'circle-target-arrowhead',
          )
          break
        }

        case edge7: {
          items.push('source-arrowhead', 'target-arrowhead', {
            name: 'button-remove',
            args: { distance: 20 },
          })
          break
        }

        case edge9: {
          items.push({
            name: 'vertices',
            args: {
              snapRadius: 0,
              redundancyRemoval: false,
              vertexAdding: false,
            },
          })
          break
        }

        case edge11:
        case edge12: {
          items.push('source-arrowhead', 'target-arrowhead')
          break
        }
      }

      if (items.length) {
        cell.setTools({
          items,
          name: 'onhover',
        })
      }
    })

    graph.on('edge:mouseleave', ({ cell }) => {
      if (cell.hasTools('onhover')) {
        cell.removeTools()
      }
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
