import { Graph, Node, Edge, Shape } from '@antv/x6'

class TreeNode extends Node {
  private collapsed: boolean = false

  protected postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed === true
  }

  toggleButtonVisibility(visible: boolean) {
    this.attr('buttonGroup', {
      display: visible ? 'block' : 'none',
    })
  }

  toggleCollapse(collapsed: boolean) {
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
      fill: '#ffffff',
      stroke: '#a0a0a0',
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
      fill: '#4C65DD',
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

class TreeEdge extends Shape.Edge {
  isHidden() {
    var node = this.getTargetNode() as TreeNode
    return !node || !node.isVisible()
  }
}

TreeEdge.config({
  zIndex: 1,
  attrs: {
    line: {
      stroke: '#a0a0a0',
      strokeWidth: 1,
      targetMarker: null,
    },
  },
})

if (Node.registry.exist('tree-node')) {
  Node.registry.register('tree-node', TreeNode as typeof Node)
}
if (Edge.registry.exist('tree-edge')) {
  Edge.registry.register('tree-edge', TreeEdge as typeof Edge)
}

const container = document.getElementById('container')
const graph = new Graph({
  container: container,
  frozen: true,
  async: true,
  interacting: false,
  grid: 1,
  sorting: 'approx',
  background: {
    color: '#F3F7F6',
  },
  scroller: {
    enabled: true,
  },
  connecting: {
    anchor: 'orth',
    connectionPoint: 'boundary',
    router: {
      name: 'er',
      args: {
        direction: 'H',
      },
    },
  },
})
graph.zoomTo(0.8)

fetch('../data/mindmap.json')
  .then((response) => response.json())
  .then((data) => {
    var start = new Date().getTime()
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

    graph.unfreeze({
      progress({ done }) {
        if (done) {
          const time = new Date().getTime() - start
          console.log(time)
          graph.unfreeze({
            batchSize: 50,
          })
        }
      },
    })
    graph.on('node:collapse', ({ node }) => {
      const treeNode = node as TreeNode
      treeNode.toggleCollapse()
      const collapsed = treeNode.isCollapsed()
      const nodes = graph.getSuccessors(node) as TreeNode[]
      nodes.forEach((node) => {
        node.toggleVisible(collapsed)
      })
    })
  })
