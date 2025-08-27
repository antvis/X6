import React from 'react'
import { Graph, Cell, Node as N, Edge as E } from '../../../../src'
import '../index.less'

// Overall goals
// -------------
// 1. reduce number of DOM elements
// 2. avoid asking the browser for element bounding boxes as much as possible

// Number of elements 0 - ?
var COUNT = 500
// Async rendering true/false
// true: does not block the UI
var ASYNC = true

const Node = N.registry.register(
  'performance_node',
  {
    size: {
      width: 100,
      height: 50,
    },
    zIndex: 2,
    attrs: {
      body: {
        // Using of special 'ref-like` attributes it's not generally the most
        // performer. In this particular case it's different though.
        // If the `ref` attribute is not defined all the metrics (width, height, x, y)
        // are taken from the model. There is no need to ask the browser for
        // an element bounding box.
        // All calculation are done just in Javascript === very fast.
        refWidth: '100%',
        refHeight: '100%',
        stroke: 'red',
        strokeWidth: 2,
        fill: 'lightgray',
        rx: 5,
        ry: 5,
      },
      label: {
        fill: 'black',
        // Please see the `ref-width` & `ref-height` comment.
        refX: '50%',
        refY: '50%',
        // Do not use special attribute `x-align` when not necessary.
        // It calls getBBox() on the SVGText element internally. Measuring text
        // in the browser is usually the slowest.
        // `text-anchor` attribute does the same job here (works for the text elements only).
        textAnchor: 'middle',
        // Do not use special attribute `y-align` for text vertical positioning. See above.
        textVerticalAnchor: 'middle',
      },
    },
    // if markup does not change during the application life time, define it on the prototype (i.e. not in the defaults above)
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],
  },
  true,
)

const Edge = E.registry.register(
  'performance_edge',
  {
    zIndex: 1,
    attrs: {
      line: {
        connection: true,
        stroke: 'green',
        strokeWidth: 2,
        // SVG Markers are pretty fast. Let's take advantage of this.
        targetMarker: 'classic',
      },
    },
    markup: [
      {
        tagName: 'path',
        selector: 'line',
        attrs: {
          // Here comes SVG attributes, for which values won't change during the application life time.
          // These are specs SVG attributes. Do not add special attributes (e.g. targetMarker, fill: { /* gradient */ })).
          // These attributes are set during render, and never touched again during updates.
        },
      },
    ],
  },
  true,
)

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: (COUNT / 2) * 110,
      height: 500,
      grid: 1,
      async: ASYNC,
    })

    var node = new Node()
    var edge = new Edge()

    var cells: Cell[] = []

    Array.from({ length: COUNT / 2 }).forEach((_, n) => {
      const a = node
        .clone()
        .position(n * 110, 100)
        .attr('label/text', n + 1)
      const b = node
        .clone()
        .position(n * 100, 300)
        .attr('label/text', n + 1 + COUNT / 2)
      const ab = edge.clone().setSource(a).setTarget(b)
      cells.push(a, b, ab)
    })

    const startTime = new Date().getTime()

    function showResult() {
      const duration = (new Date().getTime() - startTime) / 1000
      const elem = document.getElementById('result') as HTMLElement
      elem.textContent =
        COUNT +
        ' elements and ' +
        COUNT / 2 +
        ' links rendered in ' +
        duration +
        's'
    }

    // Prefer resetCells() over `addCells()` to add elements in bulk.
    // SVG as oppose to HTML does not know `z-index` attribute.
    // The "z" coordinate is determined by the order of the sibling elements. The
    // paper makes sure the DOM elements are sorted based on the "z" stored on each element model.
    graph.model.resetCells(cells)

    if (ASYNC) {
      graph.on('render:done', showResult)
    } else {
      showResult()
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div id="result" style={{ paddingLeft: 8, paddingBottom: 8 }}>
          #
        </div>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
