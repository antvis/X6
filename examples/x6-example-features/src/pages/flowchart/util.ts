import { Cell, Graph, Anchor, Point } from '@antv/x6'
import { DataItem, isCircle, isGroup, data } from './data'

export function createGraph(container: HTMLDivElement) {
  return new Graph(container, {
    guide: true,
    rotate: false,
    resize: true,
    folding: false,
    infinite: true,
    minScale: 0.1,
    // pageVisible: true,
    // pageBreak: {
    //   enabled: true,
    //   dsahed: true,
    //   stroke: '#c0c0c0',
    // },
    // pageFormat: {
    //   width: 800,
    //   height: 960,
    // },
    // mouseWheel: true,
    rubberband: true,
    connection: {
      enabled: true,
      ignoreMouseDown: true,
    },
    connectionHighlight: {
      hotspotable: true,
      hotspot: 0,
      minHotspotSize: 0,
    },
    backgroundColor: '#f8f9fa',
    grid: {
      type: 'dot',
      color: '#ccc',
    },
    keyboard: {
      enabled: true,
      global: false,
      escape: false,
    },
    selectionPreview: {
      dashed: false,
      strokeWidth: 2,
    },
    nodeStyle: {
      fill: 'rgba(0,0,0,0)',
      stroke: 'none',
      noLabel: true,
      editable: false,
    },
    edgeStyle: {
      edge: 'elbow',
      elbow: 'vertical',
      labelBackgroundColor: '#f8f9fa',
      movable: false,
    },
    isLabelMovable() {
      return false
    },
    shouldRedrawOnDataChange() {
      return true
    },
    getAnchors(cell) {
      if (cell != null && this.model.isNode(cell)) {
        const type = cell.data.type
        if (type === 'start') {
          return [new Anchor({ point: new Point(0.5, 1) })]
        }

        return [
          new Anchor({ point: new Point(0.5, 0) }),
          new Anchor({ point: new Point(0, 0.5) }),
          new Anchor({ point: new Point(1, 0.5) }),
          new Anchor({ point: new Point(0.5, 1) }),
        ]
      }
      return null
    },
    getHtml(cell) {
      const data = cell.data
      const group = isGroup(data.type)
      return `
          <div class="flowchart-node${group ? ' is-gruop' : ''} ${data.type}">
            ${data.icon ? `<i class="icon">${data.icon}</i>` : ''}
            ${group ? '' : `<span class="text">${data.title}</span>`}
          </div>
        `
    },
  })
}

export function addNode(
  graph: Graph,
  item: DataItem,
  x: number,
  y: number,
  width?: number | null,
  height?: number | null,
  title?: string | null,
  parent?: Cell,
) {
  const data = { ...item.data }
  if (title) {
    data.title = title
  }

  return graph.addNode({
    x,
    y,
    data,
    parent,
    width: width || item.width,
    height: height || item.height,
    shape: 'html',
    resizable: !isCircle(item),
    perimeter: isCircle(item) ? 'ellipse' : 'rectangle',
  })
}

export function demo(graph: Graph) {
  graph.batchUpdate(() => {
    const start = addNode(graph, data.map['start'], 372, 32)
    const end = addNode(graph, data.map['end'], 372, 480)

    const container = addNode(graph, data.map['combine'], 200, 200, 400, 240)

    const batch = addNode(
      graph,
      data.map['group'],
      80,
      104,
      240,
      106,
      null,
      container,
    )

    const process1 = addNode(
      graph,
      data.map['approvement'],
      326,
      120,
      null,
      null,
      '一级主管审批',
    )

    const process2 = addNode(
      graph,
      data.map['execute'],
      126,
      32,
      null,
      null,
      '判断应用状态',
      container,
    )

    const process3 = addNode(
      graph,
      data.map['execute'],
      46,
      32,
      null,
      null,
      'DRM 推送',
      batch,
    )

    graph.addEdge({
      source: start,
      target: process1,
      style: {
        exitX: 0.5,
        exitY: 1,
        entryX: 0.5,
        entryY: 0,
      },
    })

    graph.addEdge({
      data: '同意',
      source: process1,
      target: process2,
      style: {
        exitX: 0.5,
        exitY: 1,
        entryX: 0.5,
        entryY: 0,
      },
    })

    graph.addEdge({
      source: process2,
      target: process3,
      style: {
        exitX: 0.5,
        exitY: 1,
        entryX: 0.5,
        entryY: 0,
      },
    })

    graph.addEdge({
      source: process3,
      target: end,
      style: {
        exitX: 0.5,
        exitY: 1,
        entryX: 0.5,
        entryY: 0,
      },
    })

    graph.addEdge({
      data: '驳回',
      source: process1,
      target: end,
      points: [
        { x: 700, y: 144 },
        { x: 700, y: 508 },
      ],
      style: {
        edge: 'orthogonal',
        exitX: 1,
        exitY: 0.5,
        entryX: 1,
        entryY: 0.5,
      },
    })
  })
}
