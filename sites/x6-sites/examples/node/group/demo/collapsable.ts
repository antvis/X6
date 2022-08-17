import { Graph, Node } from '@antv/x6'

class Group extends Node {
  private collapsed: boolean = false
  private expandSize: { width: number; height: number }

  protected postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed
  }

  toggleCollapse(collapsed?: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (target) {
      this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9' })
      this.expandSize = this.getSize()
      this.resize(100, 32)
    } else {
      this.attr('buttonSign', { d: 'M 2 5 8 5' })
      if (this.expandSize) {
        this.resize(this.expandSize.width, this.expandSize.height)
      }
    }
    this.collapsed = target
  }
}

Group.config({
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
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
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: '#ffffff',
      stroke: 'none',
    },
    buttonGroup: {
      refX: 8,
      refY: 8,
    },
    button: {
      height: 14,
      width: 16,
      rx: 2,
      ry: 2,
      fill: '#f5f5f5',
      stroke: '#ccc',
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign: {
      refX: 3,
      refY: 2,
      stroke: '#808080',
    },
    label: {
      fontSize: 12,
      fill: '#fff',
      refX: 32,
      refY: 10,
    },
  },
})

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

function createGroup(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  stroke: string,
) {
  const group = new Group({
    id,
    x,
    y,
    width,
    height,
    attrs: {
      body: { fill, stroke },
      label: { text: id },
    },
  })
  graph.addNode(group)
  return group
}

function createNode(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
) {
  return graph.addNode({
    id,
    x,
    y,
    width,
    height,
    attrs: {
      body: {
        fill: fill || 'blue',
        stroke: 'none',
      },
      label: {
        text: id,
        fill: '#fff',
        fontSize: 12,
      },
    },
  })
}

function createEdge(
  id: string,
  source: string,
  target: string,
  vertices?: { x: number; y: number }[],
) {
  return graph.addEdge({
    id,
    source,
    target,
    vertices,
    label: id,
    attrs: {
      label: {
        fontSize: 12,
      },
    },
  })
}

const a = createGroup('a', 100, 40, 420, 240, '#fffbe6', '#ffe7ba')
const aa = createGroup('aa', 150, 100, 160, 120, '#47C769', 'none')
const aaa = createGroup('aaa', 180, 150, 100, 50, '#3199FF', 'none')
const c = createNode('c', 400, 180, 60, 40, 'orange')

a.addChild(aa)
aa.addChild(aaa)
a.addChild(c)

createNode('d', 580, 140, 60, 40, '#000')

createEdge('edge1', 'aa', 'c')
createEdge('edge3', 'c', 'd')
aa.addChild(
  createEdge('edge2', 'aa', 'aaa', [
    { x: 60, y: 140 },
    { x: 60, y: 220 },
  ]),
)

graph.on('node:collapse', ({ node }: { node: Group }) => {
  node.toggleCollapse()
  const collapsed = node.isCollapsed()
  const collapse = (parent: Group) => {
    const cells = parent.getChildren()
    if (cells) {
      cells.forEach((cell) => {
        if (collapsed) {
          cell.hide()
        } else {
          cell.show()
        }

        if (cell instanceof Group) {
          if (!cell.isCollapsed()) {
            collapse(cell)
          }
        }
      })
    }
  }

  collapse(node)
})
