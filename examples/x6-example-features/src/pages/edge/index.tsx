import React from 'react'
import { Graph, Edge, CellView, EdgeView, Dom } from '@antv/x6'
import '../index.less'

class CustomEdgeView extends EdgeView {
  onDblClick(e: JQuery.DoubleClickEvent, x: number, y: number) {
    if (this.cell.getProp('customLinkInteractions')) {
      this.addVertex(x, y)
    }
  }

  onContextMenu(e: JQuery.ContextMenuEvent, x: number, y: number) {
    if (this.cell.getProp('customLinkInteractions')) {
      this.addLabel(x, y, {
        reverseDistance: true,
        absoluteDistance: true,
      })
    }
  }
}

CustomEdgeView.config<EdgeView.Options>({ doubleTools: true })
EdgeView.registry.register('customEdgeView', CustomEdgeView)

const CustomEdge = Edge.define({
  name: 'custom-edge',
  defaultLabel: {
    markup: [
      {
        tagName: 'circle',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],
    attrs: {
      label: {
        text: '%', // default label text
        fill: '#ff0000', // default text color
        fontSize: 14,
        textAnchor: 'middle',
        yAlign: 'middle',
        pointerEvents: 'none',
      },
      body: {
        ref: 'label',
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 1,
        refRCircumscribed: '60%',
        refCx: 0,
        refCy: 0,
      },
    },
    position: {
      distance: 0.5, // place label at midpoint by default
      offset: {
        y: -20, // offset label by 20px upwards by default
      },
      options: {
        absoluteOffset: true, // keep offset absolute when moving by default
      },
    },
  },
})

Edge.registry.register('customEdge', CustomEdge)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 1400,
      grid: 10,
      interacting: function (cellView: CellView) {
        if (cellView.cell.getProp('customLinkInteractions')) {
          return { vertexAdd: false }
        }

        // all interactions enabled
        return true
      },
    })

    const marker = 'M 10 0 L 0 5 L 10 10 z'

    // Default connection of two elements.
    // -----------------------------------

    const r1 = graph.addNode({
      shape: 'basic.rect',
      size: { width: 70, height: 30 },
      position: { x: 335, y: 50 },
      attrs: {
        rect: { fill: '#1890ff', stroke: '#1890ff' },
        text: { text: 'box', fill: '#fff', magnet: true },
      },
    })

    var r2 = r1.clone()
    graph.addNode(r2)
    r2.translate(300)

    graph.addEdge({
      source: r1,
      target: r2,
    })

    // Custom link interactions.
    // -------------------------

    var r3 = r1.clone()
    graph.addNode(r3)
    r3.translate(0, 80)

    var r4 = r3.clone()
    graph.addNode(r4)
    r4.translate(300)

    graph.addEdge({
      shape: 'customEdge',
      view: 'customEdgeView',
      customLinkInteractions: true,
      source: r3,
      target: r4,
      attrs: {
        '.source-marker': { d: marker },
        '.target-marker': { d: marker },
      },
    })

    // Custom .source-marker and .target-marker.
    // -----------------------------------------

    var r5 = r3.clone()
    graph.addNode(r5)
    r5.translate(0, 80)

    var r6 = r5.clone()
    graph.addNode(r6)
    r6.translate(300)

    graph.addEdge({
      source: r5,
      target: r6,
      attrs: {
        '.source-marker': { d: marker },
        '.target-marker': { d: marker },
      },
    })

    // Changing source and target selectors of the edge.
    // -------------------------------------------------
    var r7 = r5.clone()
    graph.addNode(r7)
    r7.translate(0, 80)

    var r8 = r7.clone()
    graph.addNode(r8)
    r8.translate(300)

    graph.addEdge({
      source: { cell: r7.id },
      target: { cell: r8.id, selector: 'text' },
      attrs: {
        '.source-marker': { d: marker },
        '.target-marker': { d: marker },
      },
    })

    // Vertices.
    // ---------
    var r9 = r7.clone()
    graph.addNode(r9)
    r9.translate(0, 80)

    var r10 = r9.clone()
    graph.addNode(r10)
    r10.translate(300)

    graph.addEdge({
      source: r9,
      target: r10,
      vertices: [
        { x: 370, y: 470 },
        { x: 670, y: 470 },
      ],
      attrs: {
        '.source-marker': { d: marker },
        '.target-marker': { d: marker },
      },
    })

    // Custom vertex/connection markups. (ADVANCED)
    // --------------------------------------------

    var r11 = r9.clone()
    graph.addNode(r11)
    r11.translate(0, 120)

    var r12 = r11.clone()
    graph.addNode(r12)
    r12.translate(300)

    graph.addEdge({
      source: r11,
      target: r12,
      vertices: [
        { x: 370, y: 600 },
        { x: 520, y: 640 },
        { x: 670, y: 600 },
      ],
      vertexMarkup: [
        '<g class="vertex-group" transform="translate(<%= x %>, <%= y %>)">',
        '<image class="vertex" data-index="<%= index %>" xlink:href="https://cdn1.iconfinder.com/data/icons/ecommerce-61/48/eccomerce_-_location-32.png" width="25" height="25" transform="translate(-12.5, -12.5)"/>',
        '<rect class="vertex-remove-area" data-index="<%= index %>" fill="red" width="19.5" height="19" transform="translate(11, -26)" rx="3" ry="3" />',
        '<path class="vertex-remove" data-index="<%= index %>" transform="scale(.8) translate(9.5, -37)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z">',
        '<title>Remove vertex.</title>',
        '</path>',
        '</g>',
      ].join(''),
      markup: [
        '<path class="connection"/>',
        '<image class="source-marker" xlink:href="http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png" width="25" height="25"/>',
        '<image class="target-marker" xlink:href="http://cdn3.iconfinder.com/data/icons/49handdrawing/24x24/left.png" width="25" height="25"/>',
        '<path class="connection-wrap"/>',
        '<g class="vertices"/>',
      ].join(''),
      attrs: {
        '.connection': {
          strokeWidth: 4,
          strokeDasharray: [5, 5, 5].join(','),
          stroke: 'gray',
        },
      },
    })

    // Labels.
    // -------
    var r13 = r11.clone()
    graph.addNode(r13)
    r13.translate(0, 230)

    var r14 = r13.clone()
    graph.addNode(r14)
    r14.translate(300)

    const edge7 = new CustomEdge({
      source: r13,
      target: r14,
      attrs: {
        '.source-marker': { d: marker },
        '.target-marker': { d: marker },
      },
      labels: [
        {
          attrs: {
            label: {
              text: '1..n',
            },
          },
          position: {
            distance: 29, // individual absolute positioning
            offset: null, // remove default offset
            options: {
              absoluteOffset: null, // disable absolute offset when moving
            },
          },
        },
        {
          markup: [
            // individual markup
            {
              tagName: 'rect',
              selector: 'body',
            },
            {
              tagName: 'text',
              selector: 'label',
            },
          ],
          attrs: {
            label: {
              text: 'X6',
              fill: 'white',
              fontFamily: 'sans-serif',
              textAnchor: 'left',
            },
            body: {
              stroke: 'red',
              strokeWidth: 2,
              fill: '#F39C12',
              rx: 5,
              ry: 5,
              refWidth: '140%',
              refHeight: '140%',
              refX: '-20%',
              refY: '-20%',
              refRCircumscribed: null,
              refCx: null,
              refCy: null,
            },
          },
          position: {
            distance: 0.5,
            offset: {
              // individual absolute offset
              x: 10,
              y: 25,
            },
            // keep default args
          },
        },
        {
          markup: [
            {
              tagName: 'circle',
              selector: 'body',
            },
            {
              tagName: 'path',
              selector: 'symbol',
            },
          ],
          attrs: {
            body: {
              ref: null,
              fill: 'lightgray',
              stroke: 'black',
              strokeWidth: 2,
              r: 15,
              refRCircumscribed: null,
              refCx: null,
              refCy: null,
            },
            symbol: {
              // add attrs for individually added `path`
              d: 'M 0 -15 0 -35 20 -35',
              stroke: 'black',
              strokeWidth: 2,
              fill: 'none',
            },
          },
          position: 0.5, // erase default position object, use relative distance
        },
        {
          position: {
            distance: 0.89, // individual relative distance
            // keep default offset
            // keep default args
          },
        },
      ],
    })

    graph.addEdge(edge7)

    // Custom tools.
    // -------------
    var r15 = r13.clone()
    graph.addNode(r15)
    r15.translate(0, 100)

    var r16 = r15.clone()
    graph.addNode(r16)
    r16.translate(300)

    graph.addEdge({
      source: r15,
      target: r16,
      attrs: {
        '.source-marker': { d: marker },
        '.target-marker': { d: marker },
      },
      toolMarkup: [
        '<g class="edge-tool">',
        '<g class="tool-remove" event="edge:remove">',
        '<circle r="11" />',
        '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"/>',
        '<title>Remove link.</title>',
        '</g>',
        '<g event="edge:options">',
        '<circle r="11" transform="translate(25)"/>',
        '<path fill="white" transform="scale(.55) translate(29, -16)" d="M31.229,17.736c0.064-0.571,0.104-1.148,0.104-1.736s-0.04-1.166-0.104-1.737l-4.377-1.557c-0.218-0.716-0.504-1.401-0.851-2.05l1.993-4.192c-0.725-0.91-1.549-1.734-2.458-2.459l-4.193,1.994c-0.647-0.347-1.334-0.632-2.049-0.849l-1.558-4.378C17.165,0.708,16.588,0.667,16,0.667s-1.166,0.041-1.737,0.105L12.707,5.15c-0.716,0.217-1.401,0.502-2.05,0.849L6.464,4.005C5.554,4.73,4.73,5.554,4.005,6.464l1.994,4.192c-0.347,0.648-0.632,1.334-0.849,2.05l-4.378,1.557C0.708,14.834,0.667,15.412,0.667,16s0.041,1.165,0.105,1.736l4.378,1.558c0.217,0.715,0.502,1.401,0.849,2.049l-1.994,4.193c0.725,0.909,1.549,1.733,2.459,2.458l4.192-1.993c0.648,0.347,1.334,0.633,2.05,0.851l1.557,4.377c0.571,0.064,1.148,0.104,1.737,0.104c0.588,0,1.165-0.04,1.736-0.104l1.558-4.377c0.715-0.218,1.399-0.504,2.049-0.851l4.193,1.993c0.909-0.725,1.733-1.549,2.458-2.458l-1.993-4.193c0.347-0.647,0.633-1.334,0.851-2.049L31.229,17.736zM16,20.871c-2.69,0-4.872-2.182-4.872-4.871c0-2.69,2.182-4.872,4.872-4.872c2.689,0,4.871,2.182,4.871,4.872C20.871,18.689,18.689,20.871,16,20.871z"/>',
        '<title>Link options.</title>',
        '</g>',
        '</g>',
      ].join(''),
    })

    // Manhattan routing.
    // ------------------
    var r17 = r15.clone()
    graph.addNode(r17)
    r17.translate(0, 100)

    var r18 = r17.clone()
    graph.addNode(r18)
    r18.translate(200, 80)

    graph.addEdge({
      source: r17,
      target: r18,
      vertices: [{ x: 700, y: 990 }],
      router: { name: 'metro' },
    })
    graph.addEdge({
      source: r17,
      target: r18,
      vertices: [{ x: 450, y: 1015 }],
      router: { name: 'manhattan' },
      connector: { name: 'rounded' },
    })

    // Markers.
    // ------------------
    var r19 = r17.clone()
    graph.addNode(r19)
    r19.translate(0, 200)

    var r20 = r19.clone()
    graph.addNode(r20)
    r20.translate(200, 0)

    var circleMarker = Dom.createVector(
      '<marker id="circle-marker" markerUnits="userSpaceOnUse" viewBox = "0 0 12 12" refX = "6" refY = "6" markerWidth = "15" markerHeight = "15" stroke = "none" stroke-width = "0" fill = "red" orient = "auto"> <circle r = "5" cx="6" cy="6" fill="blue"/> </marker>',
    )
    var diamondMarker = Dom.createVector(
      '<marker id="diamond-marker" viewBox = "0 0 5 20" refX = "0" refY = "6" markerWidth = "30" markerHeight = "30" stroke = "none" stroke-width = "0" fill = "red" > <rect x="0" y="0" width = "10" height="10" transform="rotate(45)"  /> </marker>',
    )

    const defs = graph.view.svg.querySelector('defs')!
    defs.appendChild(circleMarker.node)
    defs.appendChild(diamondMarker.node)

    graph.addEdge({
      source: r19,
      target: r20,
      vertices: [
        { x: 400, y: 1080 },
        { x: 600, y: 1080 },
      ],
      attrs: {
        '.connection': {
          'marker-mid': 'url(#circle-marker)',
        },
      },
    })

    graph.addEdge({
      source: r19,
      target: r20,
      vertices: [
        { x: 400, y: 1190 },
        { x: 600, y: 1190 },
      ],
      attrs: {
        '.connection': {
          'marker-mid': 'url(#diamond-marker)',
        },
      },
    })

    // OneSide routing.
    // ----------------
    var r21 = r19.clone()
    graph.addNode(r21)
    r21.translate(0, 150)

    var r22 = r21.clone()
    graph.addNode(r22)
    r22.translate(200, 0)
    graph.addEdge({
      source: r21,
      target: r22,
      router: { name: 'oneSide', args: { side: 'bottom' } },
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
