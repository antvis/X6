const data: any = {
  nodes: [],
  edges: [],
}
const keyPoints = [
  20,
  12,
  12,
  4,
  18,
  12,
  12,
  6,
  16,
  17,
  17,
  10,
  10,
  3,
  3,
  2,
  2,
  9,
  9,
  10,
]

for (let i = 1; i <= 21; i++) {
  data.nodes.push({
    id: i,
    shape: 'circle',
    width: 32,
    height: 32,
    attrs: {
      body: {
        fill: keyPoints.includes(i) ? '#fd6d6f' : '#855af2',
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
  data.edges.push({
    source: keyPoints[i],
    target: keyPoints[i + 1],
    attrs: {
      line: {
        stroke: '#fd6d6f',
        targetMarker: null,
      },
    },
  })
}

export default data
