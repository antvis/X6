const data: any = {
  nodes: [],
  edges: [],
}

for (let i = 1; i < 12; i++) {
  data.nodes.push({
    id: i + '',
    shape: 'rect',
    width: 60,
    height: 30,
    label: i,
    attrs: {
      body: {
        fill: '#855af2',
        stroke: 'transparent',
      },
      label: {
        fill: '#ffffff',
      },
    },
  })
}

data.edges.push(
  ...[
    {
      source: '1',
      target: '2',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '2',
      target: '3',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '3',
      target: '4',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '5',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '5',
      target: '6',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '1',
      target: '7',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '7',
      target: '3',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '3',
      target: '8',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '4',
      target: '9',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '1',
      target: '10',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '10',
      target: '11',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '5',
      target: '11',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
    {
      source: '7',
      target: '11',
      attrs: {
        line: {
          stroke: '#fd6d6f',
          strokeWidth: 1,
        },
      },
    },
  ],
)

export default data
