import { Graph, Timing } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

graph.on('edge:customevent', ({ name, e, edge }) => {
  if (name === 'click:circle' || name === 'click:rect') {
    e.stopPropagation()
    const t = edge.attr<number>('c1/atConnectionRatio') > 0.3 ? 0.3 : 0.9
    const options = {
      delay: 100,
      duration: 1000,
      timing: Timing.easeInOutBack,
    }
    edge.transition('attrs/c1/atConnectionRatio', t, options)
    edge.transition('attrs/c2/atConnectionRatio', t, options)
  }
})

graph.addEdge({
  source: { x: 320, y: 60 },
  target: { x: 380, y: 300 },
  vertices: [{ x: 320, y: 200 }],
  connector: { name: 'rounded' },
  markup: [
    {
      tagName: 'path',
      selector: 'p1',
    },
    {
      tagName: 'path',
      selector: 'p2',
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
      tagName: 'circle',
      selector: 'c2',
    },
    {
      tagName: 'text',
      selector: 'signText',
    },
  ],
  attrs: {
    p1: {
      connection: true,
      fill: 'none',
      stroke: '#237804',
      strokeWidth: 6,
      strokeLinejoin: 'round',
    },
    p2: {
      connection: true,
      fill: 'none',
      stroke: '#73d13d',
      strokeWidth: 4,
      pointerEvents: 'none',
      strokeLinejoin: 'round',
      targetMarker: {
        tagName: 'path',
        fill: '#73d13d',
        stroke: '#237804',
        strokeWidth: 1,
        d: 'M 10 -3 10 -10 -2 0 10 10 10 3',
      },
    },
    sign: {
      x: -20,
      y: -10,
      width: 50,
      height: 20,
      stroke: '#237804',
      fill: '#73d13d',
      atConnectionLength: 30,
      strokeWidth: 1,
      event: 'click:rect',
      cursor: 'pointer',
    },
    signText: {
      atConnectionLength: 34,
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      text: 'Token',
      event: 'click:rect',
      cursor: 'pointer',
    },
    c1: {
      r: 10,
      stroke: '#f5222d',
      fill: '#fe854f',
      atConnectionRatio: 0.68,
      strokeWidth: 1,
      event: 'click:circle',
      cursor: 'pointer',
    },
    c2: {
      r: 5,
      stroke: '#f5222d',
      fill: 'white',
      atConnectionRatio: 0.68,
      strokeWidth: 1,
      pointerEvents: 'none',
    },
  },
})
