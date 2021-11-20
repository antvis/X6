import { Graph, Node, Point } from '@antv/x6'

Graph.registerNode(
  'org-node',
  {
    width: 180,
    height: 60,
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'image',
        selector: 'avatar',
      },
      {
        tagName: 'text',
        selector: 'rank',
      },
      {
        tagName: 'text',
        selector: 'name',
      },
    ],
    attrs: {
      body: {
        refWidth: '100%',
        refHeight: '100%',
        fill: '#5F95FF',
        stroke: '#5F95FF',
        strokeWidth: 1,
        rx: 10,
        ry: 10,
        pointerEvents: 'visiblePainted',
      },
      avatar: {
        width: 48,
        height: 48,
        refX: 8,
        refY: 6,
      },
      rank: {
        refX: 0.9,
        refY: 0.2,
        fill: '#fff',
        fontFamily: 'Courier New',
        fontSize: 14,
        textAnchor: 'end',
        textDecoration: 'underline',
      },
      name: {
        refX: 0.9,
        refY: 0.6,
        fill: '#fff',
        fontFamily: 'Courier New',
        fontSize: 14,
        fontWeight: '800',
        textAnchor: 'end',
      },
    },
  },
  true,
)

Graph.registerEdge(
  'org-edge',
  {
    zIndex: -1,
    attrs: {
      line: {
        fill: 'none',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        stroke: '#A2B1C3',
        sourceMarker: null,
        targetMarker: null,
      },
    },
  },
  true,
)

const graph = new Graph({
  container: document.getElementById('container')!,
  connecting: {
    anchor: 'orth',
  },
})

function member(
  x: number,
  y: number,
  rank: string,
  name: string,
  image: string,
) {
  return graph.addNode({
    x,
    y,
    shape: 'org-node',
    attrs: {
      avatar: {
        opacity: 0.7,
        'xlink:href': image,
      },
      rank: {
        text: rank,
        wordSpacing: '-5px',
        letterSpacing: 0,
      },
      name: {
        text: name,
        fontSize: 13,
        fontFamily: 'Arial',
        letterSpacing: 0,
      },
    },
  })
}

function link(source: Node, target: Node, vertices: Point.PointLike[]) {
  return graph.addEdge({
    vertices,
    source: {
      cell: source,
    },
    target: {
      cell: target,
    },
    shape: 'org-edge',
  })
}

const male =
  'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*kUy8SrEDp6YAAAAAAAAAAAAAARQnAQ'
const female =
  'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*f6hhT75YjkIAAAAAAAAAAAAAARQnAQ'

const bart = member(300, 70, 'CEO', 'Bart Simpson', male)
const homer = member(90, 200, 'VP Marketing', 'Homer Simpson', male)
const marge = member(300, 200, 'VP Sales', 'Marge Simpson', female)
const lisa = member(500, 200, 'VP Production', 'Lisa Simpson', female)
const maggie = member(400, 350, 'Manager', 'Maggie Simpson', female)
const lenny = member(190, 350, 'Manager', 'Lenny Leonard', male)
const carl = member(190, 500, 'Manager', 'Carl Carlson', male)

link(bart, marge, [
  {
    x: 385,
    y: 180,
  },
])
link(bart, homer, [
  {
    x: 385,
    y: 180,
  },
  {
    x: 175,
    y: 180,
  },
])
link(bart, lisa, [
  {
    x: 385,
    y: 180,
  },
  {
    x: 585,
    y: 180,
  },
])
link(homer, lenny, [
  {
    x: 175,
    y: 380,
  },
])
link(homer, carl, [
  {
    x: 175,
    y: 530,
  },
])
link(marge, maggie, [
  {
    x: 385,
    y: 380,
  },
])

graph.zoomToFit({ padding: 20, maxScale: 1 })
