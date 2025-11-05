import { type Cell, type CellView, Graph, type Node } from '@antv/x6'

function registerGateway(name: string, symbol: string) {
  Graph.registerNode(
    name,
    {
      inherit: 'polygon',
      attrs: {
        body: {
          refPoints: '0,10 10,0 20,10 10,20',
          strokeWidth: 2,
          stroke: '#5F95FF',
          fill: '#EFF4FF',
        },
        label: {
          text: symbol,
          fontSize: 32,
          fontWeight: 'bold',
          fill: '#5F95FF',
        },
      },
    },
    true,
  )
}

Graph.registerNode(
  'event',
  {
    inherit: 'circle',
    attrs: {
      body: {
        strokeWidth: 2,
        stroke: '#5F95FF',
        fill: '#FFF',
      },
    },
  },
  true,
)

Graph.registerNode(
  'start-event',
  {
    inherit: 'circle',
    attrs: {
      body: {
        strokeWidth: 2,
        stroke: '#52C41A',
        fill: '#FFF',
      },
    },
  },
  true,
)

Graph.registerNode(
  'end-event',
  {
    inherit: 'circle',
    attrs: {
      body: {
        strokeWidth: 4,
        stroke: '#FF4D4F',
        fill: '#FFF',
      },
    },
  },
  true,
)

Graph.registerNode(
  'activity',
  {
    inherit: 'rect',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'image',
        selector: 'img',
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],
    attrs: {
      body: {
        rx: 6,
        ry: 6,
        stroke: '#5F95FF',
        fill: '#EFF4FF',
        strokeWidth: 1,
      },
      img: {
        x: 6,
        y: 6,
        width: 16,
        height: 16,
        'xlink:href':
          'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*pwLpRr7QPGwAAAAAAAAAAAAAARQnAQ',
      },
      label: {
        fontSize: 12,
        fill: '#262626',
      },
    },
  },
  true,
)

Graph.registerNode(
  'subprocess',
  {
    inherit: 'rect',
    markup: [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'text', selector: 'label' },
      { tagName: 'image', selector: 'badge' },
      { tagName: 'text', selector: 'expand' },
      { tagName: 'text', selector: 'details' },
    ],
    attrs: {
      body: {
        rx: 6,
        ry: 6,
        stroke: '#5F95FF',
        fill: '#FAFBFF',
        strokeWidth: 1,
      },
      label: {
        ref: 'body',
        refX: '50%',
        refY: '50%',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fontSize: 12,
        fill: '#262626',
      },
      badge: {
        ref: 'body',
        refX: 0,
        refY: 0,
        x: 6,
        y: 6,
        width: 16,
        height: 16,
        'xlink:href':
          'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*pwLpRr7QPGwAAAAAAAAAAAAAARQnAQ',
      },
      expand: {
        ref: 'body',
        refX: '100%',
        refY: '100%',
        x: -8,
        y: -8,
        textVerticalAnchor: 'bottom',
        textAnchor: 'end',
        fontSize: 16,
        fontWeight: 'bold',
        fill: '#5F95FF',
        cursor: 'pointer',
        text: '+',
        event: 'subproc:toggle',
      },
      details: {
        ref: 'body',
        refX: '50%',
        refY: 44,
        y: 0,
        textAnchor: 'middle',
        textVerticalAnchor: 'top',
        fontSize: 12,
        fill: '#8C8C8C',
        display: 'none',
        textWrap: {
          width: -24,
        },
        text: '',
      },
    },
  },
  true,
)

registerGateway('gateway-parallel', '⨁')
registerGateway('gateway-exclusive', '×')

Graph.registerNode(
  'lane',
  {
    inherit: 'rect',
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'rect',
        selector: 'name-rect',
      },
      {
        tagName: 'text',
        selector: 'name-text',
      },
    ],
    attrs: {
      body: {
        fill: '#FFF',
        stroke: '#5F95FF',
        strokeWidth: 1,
      },
      'name-rect': {
        width: 240,
        height: 30,
        fill: '#5F95FF',
        stroke: '#fff',
        strokeWidth: 0,
      },
      'name-text': {
        ref: 'name-rect',
        refY: 0.5,
        refX: 0.5,
        textAnchor: 'middle',
        fontWeight: 'bold',
        fill: '#fff',
        fontSize: 12,
      },
    },
  },
  true,
)

Graph.registerEdge(
  'bpmn-edge',
  {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
        targetMarker: 'classic',
      },
    },
  },
  true,
)

const graph = new Graph({
  container: document.getElementById('container') as HTMLElement,
  grid: true,
  connecting: {
    router: 'orth',
  },
  mousewheel: true,
  translating: {
    restrict(this: Graph, cellView: CellView | null) {
      if (cellView?.cell?.isNode()) {
        const cell = cellView.cell as Node
        if (cell.shape === 'lane') {
          return this.transform.getGraphArea()
        }
        const parentId = cell.prop('parent')
        if (parentId) {
          const parentNode = this.getCellById(parentId)
          if (parentNode?.isNode()) {
            return parentNode.getBBox().moveAndExpand({
              x: 0,
              y: 30,
              width: 0,
              height: -30,
            })
          }
        }
        return this.transform.getGraphArea()
      }
      return this.transform.getGraphArea()
    },
  },
})

graph.on('subproc:toggle', ({ node }: { node: Node }) => {
  if (!node || node.shape !== 'subprocess') return

  const data = node.getData() || {}
  const expanded = !!data.expanded
  const next = !expanded

  node.attr('expand/text', next ? '-' : '+')
  node.attr('details/display', next ? 'block' : 'none')

  const defaultDetails = '1、病例证明（如有）\n2、工作 backup'
  const rawDetails = data.details
  const detailsText = rawDetails
    ? Array.isArray(rawDetails)
      ? rawDetails.join('\n')
      : String(rawDetails)
    : defaultDetails
  if (next) {
    node.attr('details/text', detailsText)
  }

  const lines = String(detailsText).split(/\n/).length
  const size = node.getSize()
  const expandedHeight = Math.max(70, 40 + lines * 18 + 24)
  node.size(size.width, next ? expandedHeight : 70)

  if (next) {
    node.attr({
      label: { textVerticalAnchor: 'top', refY: 18, refX: '50%', ref: 'body' },
      details: {
        textVerticalAnchor: 'top',
        refY: 40,
        refX: '50%',
        ref: 'body',
      },
    })
  } else {
    node.attr('label', {
      textVerticalAnchor: 'middle',
      refY: '50%',
      refX: '50%',
      ref: 'body',
    })
  }

  node.setData({ ...data, expanded: next })
})

fetch('/data/bpmn.json')
  .then((response) => response.json())
  .then((data) => {
    const cells: Cell[] = []
    const nodeMap: Record<string, Node> = {}

    data.forEach((item: any) => {
      if (item.shape !== 'bpmn-edge') {
        const node = graph.createNode(item)
        nodeMap[item.id] = node as Node
        cells.push(node)
      }
    })

    data.forEach((item: any) => {
      if (item.shape === 'bpmn-edge') {
        const edge = graph.createEdge(item)
        if (item.label) {
          edge.setLabels([
            {
              attrs: {
                label: {
                  text: item.label,
                  fill: '#8C8C8C',
                  fontSize: 11,
                },
              },
            },
          ])
        }
        const sourceId = edge.getSourceCellId()
        const targetId = edge.getTargetCellId()
        const sParent = nodeMap[sourceId]?.prop('parent')
        const tParent = nodeMap[targetId]?.prop('parent')
        if (sParent && tParent && sParent !== tParent) {
          edge.attr('line/strokeDasharray', '5,5')
        }
        cells.push(edge)
      }
    })
    graph.resetCells(cells)

    Object.values(nodeMap).forEach((node) => {
      const parentId = node.prop('parent') as string | undefined
      if (parentId) {
        const parentNode = nodeMap[parentId]
        if (parentNode) {
          parentNode.addChild(node)
        }
      }
    })

    Object.values(nodeMap).forEach((node) => {
      if (node.shape === 'activity' && node.prop('parent') === 'lane-system') {
        node.attr(
          'img/xlink:href',
          'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*mUotQqntWJQAAAAAF_AAAAgAemJ7AQ/original',
        )
      }
    })

    graph.zoomToFit({ padding: 10, maxScale: 1 })
  })
