---
title: "BPMN"
language: "zh"
canonical: "https://x6.antv.antgroup.com/zh/examples/showcase/practices/bpmn/"
version: "3.x"
---

# BPMN

[运行示例](https://x6.antv.antgroup.com/zh/examples/showcase/practices/bpmn/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import exampleData from '../../../data/bpmn.json'
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

Promise.resolve(exampleData)
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
```

## examples/data/bpmn.json

```json
[
  {
    "id": "lane-employee",
    "shape": "lane",
    "width": 240,
    "height": 600,
    "position": { "x": 60, "y": 60 },
    "attrs": { "name-text": { "text": "员工" } }
  },
  {
    "id": "lane-system",
    "shape": "lane",
    "width": 240,
    "height": 600,
    "position": { "x": 320, "y": 60 },
    "attrs": { "name-text": { "text": "系统" } }
  },
  {
    "id": "lane-leader",
    "shape": "lane",
    "width": 240,
    "height": 600,
    "position": { "x": 580, "y": 60 },
    "attrs": { "name-text": { "text": "直属领导" } }
  },
  {
    "id": "start",
    "shape": "start-event",
    "width": 40,
    "height": 40,
    "position": { "x": 160, "y": 100 },
    "parent": "lane-employee"
  },
  {
    "id": "apply",
    "shape": "activity",
    "width": 120,
    "height": 60,
    "position": { "x": 120, "y": 190 },
    "label": "提交请假申请",
    "parent": "lane-employee"
  },
  {
    "id": "check",
    "shape": "activity",
    "width": 120,
    "height": 60,
    "position": { "x": 380, "y": 110 },
    "label": "自动校验",
    "parent": "lane-system",
    "attrs": {
      "img": {
        "xlink:href": "https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*mUotQqntWJQAAAAAF_AAAAgAemJ7AQ/original"
      }
    }
  },
  {
    "id": "approve",
    "shape": "activity",
    "width": 120,
    "height": 60,
    "position": { "x": 640, "y": 110 },
    "label": "领导审批",
    "parent": "lane-leader"
  },
  {
    "id": "exgw",
    "shape": "gateway-exclusive",
    "width": 40,
    "height": 40,
    "position": { "x": 680, "y": 260 },
    "parent": "lane-leader"
  },
  {
    "id": "subproc",
    "shape": "subprocess",
    "width": 160,
    "height": 70,
    "position": { "x": 100, "y": 330 },
    "label": "补充资料",
    "parent": "lane-employee"
  },
  {
    "id": "archive",
    "shape": "activity",
    "width": 120,
    "height": 60,
    "position": { "x": 370, "y": 300 },
    "label": "备案与系统更新",
    "parent": "lane-system",
    "attrs": {
      "img": {
        "xlink:href": "https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*mUotQqntWJQAAAAAF_AAAAgAemJ7AQ/original"
      }
    }
  },
  {
    "id": "pgw",
    "shape": "gateway-parallel",
    "width": 40,
    "height": 40,
    "position": { "x": 410, "y": 450 },
    "parent": "lane-system"
  },
  {
    "id": "notify-hr",
    "shape": "activity",
    "width": 120,
    "height": 60,
    "position": { "x": 370, "y": 540 },
    "label": "通知 HR",
    "parent": "lane-system",
    "attrs": {
      "img": {
        "xlink:href": "https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*mUotQqntWJQAAAAAF_AAAAgAemJ7AQ/original"
      }
    }
  },
  {
    "id": "confirm",
    "shape": "activity",
    "width": 120,
    "height": 60,
    "position": { "x": 120, "y": 440 },
    "label": "确认请假安排",
    "parent": "lane-employee"
  },
  {
    "id": "pgw2",
    "shape": "gateway-parallel",
    "width": 40,
    "height": 40,
    "position": { "x": 160, "y": 550 },
    "parent": "lane-employee"
  },
  {
    "id": "end",
    "shape": "end-event",
    "width": 40,
    "height": 40,
    "position": { "x": 160, "y": 610 },
    "parent": "lane-employee"
  },

  {
    "id": "e1",
    "shape": "bpmn-edge",
    "source": "start",
    "target": "apply",
    "label": "开始"
  },
  { "id": "e2", "shape": "bpmn-edge", "source": "apply", "target": "check" },
  { "id": "e3", "shape": "bpmn-edge", "source": "check", "target": "approve" },
  { "id": "e4", "shape": "bpmn-edge", "source": "approve", "target": "exgw" },
  {
    "id": "e5",
    "shape": "bpmn-edge",
    "source": "exgw",
    "target": "subproc",
    "label": "资料不齐"
  },
  {
    "id": "e6",
    "shape": "bpmn-edge",
    "source": "exgw",
    "target": "archive",
    "label": "审批通过"
  },
  {
    "id": "e7",
    "shape": "bpmn-edge",
    "source": "subproc",
    "target": "archive",
    "label": "补充完成"
  },
  { "id": "e8", "shape": "bpmn-edge", "source": "archive", "target": "pgw" },
  { "id": "e9", "shape": "bpmn-edge", "source": "pgw", "target": "notify-hr" },
  { "id": "e10", "shape": "bpmn-edge", "source": "pgw", "target": "confirm" },
  {
    "id": "e11",
    "shape": "bpmn-edge",
    "source": "notify-hr",
    "target": "pgw2"
  },
  { "id": "e12", "shape": "bpmn-edge", "source": "confirm", "target": "pgw2" },
  {
    "id": "e13",
    "shape": "bpmn-edge",
    "source": "pgw2",
    "target": "end",
    "label": "结束"
  }
]
```
