import { Cell, Graph, Style } from '@antv/x6'
import { DataItem, isCircle, isGroup, data } from './data'

export function createGraph(container: HTMLDivElement) {
  return new Graph(container, {
    rotate: false,
    resize: true,
    folding: false,
    infinite: true, // 无限大画布
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
    backgroundColor: '#f8f9fa',
    grid: {
      type: 'dot',
      color: '#bcbcbc',
    },
    guide: {
      enabled: true,
      dashed: true,
      stroke: '#ff5500',
    },
    connection: {
      enabled: true,
      hotspotable: false,
      livePreview: true,
      createEdge(this, options) {
        const style = options.style
        fixEdgeStyle(style, style)
        return this.createEdge(options)
      },
    },
    connectionHighlight: {},
    keyboard: {
      enabled: true,
      global: false,
      escape: true,
    },
    selectionPreview: {
      dashed: false,
      strokeWidth: 2,
    },
    nodeStyle: {
      fill: 'rgba(0, 0, 0, 0)',
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
    dropEnabled: true,
    dropTargetHighlight: {
      stroke: '#87d068',
      opacity: 1,
    },
    isValidDropTarget(target) {
      if (target && target.data) {
        return isGroup(target.data.type)
      }
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
          return [[0.5, 1]]
        }

        if (isGroup(type)) {
          return [
            [0.25, 0],
            [0.5, 0],
            [0.75, 0],

            [0, 0.25],
            [0, 0.5],
            [0, 0.75],

            [1, 0.25],
            [1, 0.5],
            [1, 0.75],

            [0.25, 1],
            [0.5, 1],
            [0.75, 1],
          ]
        }

        return [
          [0.5, 0],
          [0, 0.5],

          [1, 0.5],
          [0.5, 1],
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

function fixEdgeStyle(raw: Style, result: Style) {
  if (raw.entryX === 1 || raw.entryX === 0) {
    result.elbow = 'horizontal'
  }
}

export function addEdge(graph: Graph, options: any) {
  const style: Style = {}
  fixEdgeStyle(options, style)
  graph.addEdge({ ...options, style })
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

    addEdge(graph, {
      source: start,
      target: process1,
      exitX: 0.5,
      exitY: 1,
      entryX: 0.5,
      entryY: 0,
    })

    addEdge(graph, {
      data: '同意',
      source: process1,
      target: process2,
      exitX: 0.5,
      exitY: 1,
      entryX: 0.5,
      entryY: 0,
    })

    addEdge(graph, {
      source: process2,
      target: process3,
      exitX: 0.5,
      exitY: 1,
      entryX: 0.5,
      entryY: 0,
    })

    addEdge(graph, {
      source: process3,
      target: end,
      exitX: 0.5,
      exitY: 1,
      entryX: 0.5,
      entryY: 0,
    })

    addEdge(graph, {
      data: '驳回',
      source: process1,
      target: end,
      points: [
        { x: 700, y: 144 },
        { x: 700, y: 508 },
      ],
      exitX: 1,
      exitY: 0.5,
      entryX: 1,
      entryY: 0.5,
    })
  })
}
