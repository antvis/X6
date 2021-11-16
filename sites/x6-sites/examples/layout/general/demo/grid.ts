import { Graph, Model } from '@antv/x6'
import { GridLayout } from '@antv/layout'

const data: Model.FromJSONData = {
  nodes: [],
  edges: [],
}
const keyPoints = [
  20, 12, 12, 4, 18, 12, 12, 6, 16, 17, 17, 10, 10, 3, 3, 2, 2, 9, 9, 10,
]

for (let i = 1; i <= 21; i++) {
  data.nodes!.push({
    id: `${i}`,
    shape: 'circle',
    width: 32,
    height: 32,
    attrs: {
      body: {
        fill: '#5F95FF',
        stroke: 'transparent',
      },
      label: {
        fill: '#ffffff',
      },
    },
    label: i,
  })
}

for (let i = 0; i < keyPoints.length; i += 2) {
  data.edges!.push({
    source: `${keyPoints[i]}`,
    target: `${keyPoints[i + 1]}`,
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
        targetMarker: null,
      },
    },
  })
}

const graph = new Graph({
  container: document.getElementById('container')!,
})

const gridLayout = new GridLayout({
  type: 'grid',
  width: 738,
  height: 360,
  sortBy: 'label',
  rows: 3,
  cols: 7,
})

const model = gridLayout.layout(data)
graph.fromJSON(model)
