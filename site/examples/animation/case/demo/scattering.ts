import { Graph } from '@antv/x6'

const circleRadius = 20
const rippleCounts = 5
const centerPoint = { x: 400, y: 400 }

function getPoint(
  start: { x: number; y: number },
  angleDeg: number,
  dist: number,
) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: start.x + dist * Math.cos(rad),
    y: start.y + dist * Math.sin(rad),
  }
}

const rippleMarkups = Array.from({ length: rippleCounts }).map((_, index) => ({
  tagName: 'circle',
  selector: `ripple${index}`,
  groupSelector: 'rippleGroup',
  attrs: {
    cx: circleRadius,
    cy: circleRadius,
  },
}))

const rippleAnimations = Array.from({ length: rippleCounts }).map(
  (_, index) => [
    {
      [`attrs/ripple${index}/r`]: [0, 350],
      [`attrs/ripple${index}/strokeOpacity`]: [0.5, 0],
    },
    {
      duration: 2000,
      fill: 'forwards',
      delay: index * 150,
      iterations: Infinity,
      easing: 'ease-out-sine',
    },
  ],
) as AnimateParams[]

Graph.registerNode(
  'custom-circle',
  {
    inherit: 'circle',
    width: circleRadius * 2,
    height: circleRadius * 2,
    markup: [
      ...rippleMarkups,
      {
        selector: 'center',
        tagName: 'circle',
      },
      {
        selector: 'body',
        tagName: 'circle',
      },
    ],
    attrs: {
      body: {
        fill: '#fff',
        stroke: 'none',
        magnet: true,
      },
      center: {
        fill: '#DEE9EB',
        stroke: 'none',
        r: circleRadius,
        cx: circleRadius,
        cy: circleRadius,
        filter: {
          name: 'dropShadow',
          args: {
            dx: 0,
            dy: 0,
            blur: 10,
            color: '#fff',
          },
        },
      },
      rippleGroup: {
        fill: 'transparent',
        strokeWidth: 4,
        stroke: '#0ff',
      },
    },
    animation: [
      ...rippleAnimations,
      [
        {
          'attrs/center/r': [circleRadius, circleRadius * 1.2],
        },
        {
          duration: 1000,
          fill: 'forwards',
          iterations: Infinity,
          direction: 'alternate',
        },
      ],
    ],
  },
  true,
)

Graph.registerEdge(
  'custom-edge',
  {
    inherit: 'edge',
    markup: [
      {
        tagName: 'path',
        selector: 'line',
      },
      {
        tagName: 'path',
        selector: 'fill',
      },
    ],
    attrs: {
      line: {
        connection: true,
        strokeWidth: 8,
        strokeLinecap: 'round',
        opacity: 0.7,
        targetMarker: null,
        strokeDasharray: '10,20',
        stroke: {
          type: 'linearGradient',
          stops: [
            { offset: '0%', color: '#0ff', opacity: 1 },
            { offset: '50%', color: '#f0f', opacity: 0.8 },
            { offset: '100%', color: '#ff0' },
          ],
        },
      },
    },
    animation: [
      [
        {
          'attrs/line/opacity': [0.7, 1],
        },
        {
          duration: 1000,
          fill: 'forwards',
          direction: 'alternate',
          iterations: Infinity,
        },
      ],
      [
        {
          'attrs/line/strokeDashoffset': [30, 0],
        },
        {
          duration: 500,
          iterations: Infinity,
        },
      ],
    ],
  },
  true,
)

const graph = new Graph({
  container: document.getElementById('container'),
  connecting: {
    connectionPoint: {
      name: 'anchor',
      args: {
        offset: 20,
      },
    },
  },
  background: {
    color: '#000',
  },
})
graph.addNode({
  id: 'main',
  shape: 'custom-circle',
  ...centerPoint,
})

const edgeDistances = [300, 250, 280, 240, 230, 260, 210, 240, 270, 220]

edgeDistances.forEach((d, index) => {
  const p = getPoint(centerPoint, (360 / 10) * index, d)

  graph.addNode({
    id: `node${index}`,
    shape: 'circle',
    x: p.x,
    y: p.y,
  })

  graph.addEdge({
    source: 'main',
    target: `node${index}`,
    shape: 'custom-edge',
    zIndex: -1,
  })
})

graph.centerContent()
