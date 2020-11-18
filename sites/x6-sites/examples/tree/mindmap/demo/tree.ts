import { Graph, Node, Edge, Shape } from '@antv/x6'

const data = {
  nodes: [
    {
      id: 69,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'fathers',
          },
        },
      },
      x: 35,
      y: 97,
    },
    {
      id: 70,
      shape: 'tree-node',
      width: 28,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: '0',
          },
        },
      },
      x: 184,
      y: 97,
    },
    {
      id: 71,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'id',
          },
        },
      },
      x: 333,
      y: 13,
    },
    {
      id: 72,
      shape: 'tree-node',
      width: 28,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: 0,
          },
        },
      },
      x: 503,
      y: 13,
    },
    {
      id: 73,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'married',
          },
        },
      },
      x: 333,
      y: 69,
    },
    {
      id: 74,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: false,
          },
        },
      },
      x: 503,
      y: 69,
    },
    {
      id: 75,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'name',
          },
        },
      },
      x: 333,
      y: 125,
    },
    {
      id: 76,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: 'Eric Taylor',
          },
        },
      },
      x: 503,
      y: 125,
    },
    {
      id: 77,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'daughters',
          },
        },
      },
      x: 333,
      y: 405,
    },
    {
      id: 78,
      shape: 'tree-node',
      width: 28,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: '0',
          },
        },
      },
      x: 503,
      y: 181,
    },
    {
      id: 79,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'age',
          },
        },
      },
      x: 673,
      y: 153,
    },
    {
      id: 80,
      shape: 'tree-node',
      width: 28,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: 30,
          },
        },
      },
      x: 843,
      y: 153,
    },
    {
      id: 81,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'name',
          },
        },
      },
      x: 673,
      y: 209,
    },
    {
      id: 82,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: 'Sarah',
          },
        },
      },
      x: 843,
      y: 209,
    },
    {
      id: 83,
      shape: 'tree-node',
      width: 28,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: '1',
          },
        },
      },
      x: 503,
      y: 293,
    },
    {
      id: 84,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'age',
          },
        },
      },
      x: 673,
      y: 265,
    },
    {
      id: 85,
      shape: 'tree-node',
      width: 28,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: 6,
          },
        },
      },
      x: 843,
      y: 265,
    },
    {
      id: 86,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'name',
          },
        },
      },
      x: 673,
      y: 321,
    },
    {
      id: 87,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: 'Cynthia',
          },
        },
      },
      x: 843,
      y: 321,
    },
    {
      id: 88,
      shape: 'tree-node',
      width: 28,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: '2',
          },
        },
      },
      x: 503,
      y: 405,
    },
    {
      id: 89,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'age',
          },
        },
      },
      x: 673,
      y: 377,
    },
    {
      id: 90,
      shape: 'tree-node',
      width: 28,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: 15,
          },
        },
      },
      x: 843,
      y: 377,
    },
    {
      id: 91,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'name',
          },
        },
      },
      x: 673,
      y: 433,
    },
    {
      id: 92,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: 'Linda',
          },
        },
      },
      x: 843,
      y: 433,
    },
    {
      id: 93,
      shape: 'tree-node',
      width: 28,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: '3',
          },
        },
      },
      x: 503,
      y: 517,
    },
    {
      id: 94,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'age',
          },
        },
      },
      x: 673,
      y: 489,
    },
    {
      id: 95,
      shape: 'tree-node',
      width: 28,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: 7,
          },
        },
      },
      x: 843,
      y: 489,
    },
    {
      id: 96,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'name',
          },
        },
      },
      x: 673,
      y: 545,
    },
    {
      id: 97,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: 'Barbara',
          },
        },
      },
      x: 843,
      y: 545,
    },
    {
      id: 98,
      shape: 'tree-node',
      width: 28,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: '4',
          },
        },
      },
      x: 503,
      y: 629,
    },
    {
      id: 99,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'age',
          },
        },
      },
      x: 673,
      y: 601,
    },
    {
      id: 100,
      shape: 'tree-node',
      width: 28,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: 18,
          },
        },
      },
      x: 843,
      y: 601,
    },
    {
      id: 101,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: false,
      attrs: {
        label: {
          textWrap: {
            text: 'name',
          },
        },
      },
      x: 673,
      y: 657,
    },
    {
      id: 102,
      shape: 'tree-node',
      width: 70,
      height: 26,
      leaf: true,
      attrs: {
        label: {
          textWrap: {
            text: 'Margaret',
          },
        },
      },
      x: 843,
      y: 657,
    },
  ],
  edges: [
    {
      source: 69,
      target: 70,
      shape: 'tree-edge',
    },
    {
      source: 70,
      target: 71,
      shape: 'tree-edge',
    },
    {
      source: 71,
      target: 72,
      shape: 'tree-edge',
    },
    {
      source: 70,
      target: 73,
      shape: 'tree-edge',
    },
    {
      source: 73,
      target: 74,
      shape: 'tree-edge',
    },
    {
      source: 70,
      target: 75,
      shape: 'tree-edge',
    },
    {
      source: 75,
      target: 76,
      shape: 'tree-edge',
    },
    {
      source: 70,
      target: 77,
      shape: 'tree-edge',
    },
    {
      source: 77,
      target: 78,
      shape: 'tree-edge',
    },
    {
      source: 78,
      target: 79,
      shape: 'tree-edge',
    },
    {
      source: 79,
      target: 80,
      shape: 'tree-edge',
    },
    {
      source: 78,
      target: 81,
      shape: 'tree-edge',
    },
    {
      source: 81,
      target: 82,
      shape: 'tree-edge',
    },
    {
      source: 77,
      target: 83,
      shape: 'tree-edge',
    },
    {
      source: 83,
      target: 84,
      shape: 'tree-edge',
    },
    {
      source: 84,
      target: 85,
      shape: 'tree-edge',
    },
    {
      source: 83,
      target: 86,
      shape: 'tree-edge',
    },
    {
      source: 86,
      target: 87,
      shape: 'tree-edge',
    },
    {
      source: 77,
      target: 88,
      shape: 'tree-edge',
    },
    {
      source: 88,
      target: 89,
      shape: 'tree-edge',
    },
    {
      source: 89,
      target: 90,
      shape: 'tree-edge',
    },
    {
      source: 88,
      target: 91,
      shape: 'tree-edge',
    },
    {
      source: 91,
      target: 92,
      shape: 'tree-edge',
    },
    {
      source: 77,
      target: 93,
      shape: 'tree-edge',
    },
    {
      source: 93,
      target: 94,
      shape: 'tree-edge',
    },
    {
      source: 94,
      target: 95,
      shape: 'tree-edge',
    },
    {
      source: 93,
      target: 96,
      shape: 'tree-edge',
    },
    {
      source: 96,
      target: 97,
      shape: 'tree-edge',
    },
    {
      source: 77,
      target: 98,
      shape: 'tree-edge',
    },
    {
      source: 98,
      target: 99,
      shape: 'tree-edge',
    },
    {
      source: 99,
      target: 100,
      shape: 'tree-edge',
    },
    {
      source: 98,
      target: 101,
      shape: 'tree-edge',
    },
    {
      source: 101,
      target: 102,
      shape: 'tree-edge',
    },
  ],
}

export class TreeNode extends Node {
  private collapsed: boolean = false

  protected postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed === true
  }

  toggleButtonVisibility(visible: boolean) {
    this.attr('buttonGroup', { display: visible ? 'block' : 'none' })
  }

  toggleCollapse(collapsed: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (!target) {
      this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9', strokeWidth: 1.6 })
    } else {
      this.attr('buttonSign', { d: 'M 2 5 8 5', strokeWidth: 1.8 })
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

export class TreeEdge extends Shape.Edge {
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

const container = document.getElementById('container')!
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
