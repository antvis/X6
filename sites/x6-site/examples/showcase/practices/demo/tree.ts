import { Graph, Node, Edge, Shape } from '@antv/x6'

// 定义节点
class TreeNode extends Node {
  private collapsed: boolean = false

  protected postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed
  }

  toggleButtonVisibility(visible: boolean) {
    this.attr('buttonGroup', {
      display: visible ? 'block' : 'none',
    })
  }

  toggleCollapse(collapsed?: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (!target) {
      this.attr('buttonSign', {
        d: 'M 1 5 9 5 M 5 1 5 9',
        strokeWidth: 1.6,
      })
    } else {
      this.attr('buttonSign', {
        d: 'M 2 5 8 5',
        strokeWidth: 1.8,
      })
    }
    this.collapsed = target
  }
}

TreeNode.config({
  zIndex: 2,
  markup: [
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted',
          },
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'none',
            'pointer-events': 'none',
          },
        },
      ],
    },
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
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: '#EFF4FF',
      stroke: '#5F95FF',
    },
    label: {
      textWrap: {
        ellipsis: true,
        width: -10,
      },
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 12,
    },
    buttonGroup: {
      refX: '100%',
      refY: '50%',
    },
    button: {
      fill: '#5F95FF',
      stroke: 'none',
      x: -10,
      y: -10,
      height: 20,
      width: 30,
      rx: 10,
      ry: 10,
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign: {
      refX: 5,
      refY: -5,
      stroke: '#FFFFFF',
      strokeWidth: 1.6,
    },
  },
})

// 定义边
class TreeEdge extends Shape.Edge {
  isHidden() {
    const node = this.getTargetNode() as TreeNode
    return !node || !node.isVisible()
  }
}

TreeEdge.config({
  zIndex: 1,
  attrs: {
    line: {
      stroke: '#A2B1C3',
      strokeWidth: 1,
      targetMarker: null,
    },
  },
})

// 注册
Node.registry.register('tree-node', TreeNode, true)
Edge.registry.register('tree-edge', TreeEdge, true)

// 初始化画布
const graph = new Graph({
  container: document.getElementById('container')!,
  panning: true,
  interacting: false,
  connecting: {
    anchor: 'orth',
    connector: 'rounded',
    connectionPoint: 'boundary',
    router: {
      name: 'er',
      args: {
        offset: 24,
        direction: 'H',
      },
    },
  },
})

graph.on('node:collapse', ({ node }: { node: TreeNode }) => {
  node.toggleCollapse()
  const collapsed = node.isCollapsed()
  const run = (pre: TreeNode) => {
    const succ = graph.getSuccessors(pre, { distance: 1 })
    if (succ) {
      succ.forEach((node: TreeNode) => {
        node.toggleVisible(!collapsed)
        if (!node.isCollapsed()) {
          run(node)
        }
      })
    }
  }
  run(node)
})

fetch('/data/mindmap.json')
  .then((response) => response.json())
  .then((data) => {
    const nodes = data.nodes.map(({ leaf, ...metadata }: any) => {
      const node = new TreeNode(metadata)
      if (leaf) {
        node.toggleButtonVisibility(leaf === false)
      }
      return node
    })
    const edges = data.edges.map(
      (edge: any) =>
        new TreeEdge({
          source: edge.source,
          target: edge.target,
        }),
    )

    graph.resetCells([...nodes, ...edges])
    graph.zoomToFit({ padding: 24 })
  })
