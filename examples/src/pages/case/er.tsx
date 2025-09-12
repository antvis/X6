import React from 'react'
import { Graph, Cell, Shape } from '@antv/x6'
import '../index.less'

Graph.registerPortLayout(
  'erPortPosition',
  (portsPositionArgs) => {
    return portsPositionArgs.map((_, index) => {
      return {
        position: {
          x: 0,
          y: (index + 1) * 24,
        },
        angle: 0,
      }
    })
  },
  true,
)

Graph.registerNode(
  'er-rect',
  {
    inherit: 'rect',
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
    attrs: {
      rect: {
        strokeWidth: 1,
        stroke: '#5F95FF',
        fill: '#5F95FF',
      },
      label: {
        fontWeight: 'bold',
        fill: '#ffffff',
        fontSize: 12,
      },
    },
    ports: {
      groups: {
        list: {
          markup: [
            {
              tagName: 'rect',
              selector: 'portBody',
            },
            {
              tagName: 'text',
              selector: 'portNameLabel',
            },
            {
              tagName: 'text',
              selector: 'portTypeLabel',
            },
          ],
          attrs: {
            portBody: {
              width: 150,
              height: 24,
              strokeWidth: 1,
              stroke: '#5F95FF',
              fill: '#EFF4FF',
              magnet: true,
            },
            portNameLabel: {
              ref: 'portBody',
              refX: 6,
              refY: 6,
              fontSize: 10,
            },
            portTypeLabel: {
              ref: 'portBody',
              refX: 95,
              refY: 6,
              fontSize: 10,
            },
          },
          position: 'erPortPosition',
        },
      },
    },
  },
  true,
)

const data = [
  {
    id: '1',
    shape: 'er-rect',
    label: '学生',
    width: 150,
    height: 24,
    position: { x: 80, y: 150 },
    ports: [
      {
        id: '1-1',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'ID',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '1-2',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Name',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '1-3',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Class',
          },
          portTypeLabel: {
            text: 'NUMBER',
          },
        },
      },
      {
        id: '1-4',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Gender',
          },
          portTypeLabel: {
            text: 'BOOLEAN',
          },
        },
      },
    ],
  },
  {
    id: '2',
    shape: 'er-rect',
    label: '课程',
    width: 150,
    height: 24,
    position: { x: 320, y: 210 },
    ports: [
      {
        id: '2-1',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'ID',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '2-2',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Name',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '2-3',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'StudentID',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '2-4',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'TeacherID',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '2-5',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Description',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
    ],
  },
  {
    id: '3',
    shape: 'er-rect',
    label: '老师',
    width: 150,
    height: 24,
    position: { x: 560, y: 350 },
    ports: [
      {
        id: '3-1',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'ID',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '3-2',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Name',
          },
          portTypeLabel: {
            text: 'STRING',
          },
        },
      },
      {
        id: '3-3',
        group: 'list',
        attrs: {
          portNameLabel: {
            text: 'Age',
          },
          portTypeLabel: {
            text: 'NUMBER',
          },
        },
      },
    ],
  },
  {
    id: '4',
    shape: 'edge',
    source: { cell: '1', port: '1-1' },
    target: { cell: '2', port: '2-3' },
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
      },
    },
    zIndex: 0,
  },
  {
    id: '5',
    shape: 'edge',
    source: { cell: '3', port: '3-1' },
    target: { cell: '2', port: '2-4' },
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
      },
    },
    zIndex: 0,
  },
]

export class CaseErExample extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 800,
      height: 600,
      grid: true,
      connecting: {
        router: {
          name: 'er',
          args: {
            offset: 25,
            direction: 'H',
          },
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#A2B1C3',
                strokeWidth: 2,
              },
            },
          })
        },
      },
    })

    const cells: Cell[] = []
    data.forEach((item) => {
      if (item.shape === 'edge') {
        cells.push(graph.createEdge(item))
      } else {
        cells.push(graph.createNode(item))
      }
    })
    graph.resetCells(cells)
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
