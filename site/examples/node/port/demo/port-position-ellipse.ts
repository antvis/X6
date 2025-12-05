import { Graph, Point } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

function getPathData(deg: number) {
  const center = new Point(180, 100)
  const start = new Point(180, 0)
  const ratio = center.x / center.y
  const p = start
    .clone()
    .rotate(90 - deg, center)
    .scale(ratio, 1, center)
  return `M ${center.x} ${center.y} ${p.x} ${p.y}`
}

const node = graph.addNode({
  x: 100,
  y: 60,
  width: 400,
  height: 200,
  markup: [
    { tagName: 'ellipse', selector: 'body' },
    { tagName: 'path', selector: 'line' },
  ],
  attrs: {
    body: {
      refCx: '50%',
      refCy: '50%',
      refRx: '50%',
      refRy: '50%',
      fill: '#f5f5f5',
      stroke: '#d9d9d9',
      strokeWidth: 1,
    },
    line: {
      d: getPathData(45),
      stroke: '#73d13d',
      strokeWidth: 1,
      strokeDasharray: '5 5',
    },
  },
  ports: {
    groups: {
      group1: {
        markup: [
          {
            tagName: 'rect',
            selector: 'rect',
          },
          {
            tagName: 'circle',
            selector: 'dot',
          },
        ],
        attrs: {
          rect: {
            magnet: true,
            stroke: '#31d0c6',
            fill: 'rgba(255,255,255,0.8)',
            strokeWidth: 2,
            width: 16,
            height: 16,
            x: -8,
            y: -8,
          },
          dot: {
            fill: '#fe854f',
            r: 2,
          },
          text: {
            fontSize: 12,
            fill: '#6a6c8a',
          },
        },
        // https://x6.antv.antgroup.com/api/registry/port-label-layout#radial
        label: {
          position: 'radial',
        },
        // https://x6.antv.antgroup.com/api/registry/port-layout#ellipse
        position: {
          name: 'ellipse',
          args: {
            start: 45,
          },
        },
      },
    },
  },
})

Array.from({ length: 10 }).forEach((_, index) => {
  node.addPort({
    id: `${index}`,
    group: 'group1',
    attrs: { text: { text: index } },
  })
})

node.portProp('0', {
  attrs: {
    rect: { stroke: 'red' },
    dot: { fill: '#31d0c6' },
  },
})
