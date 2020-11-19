import { Graph, Node } from '@antv/x6'

class Group extends Node {
  private collapsed: boolean = false
  private expandSize: { width: number; height: number }

  protected postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed === true
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
      stroke: '#a0a0a0',
    },
    buttonGroup: {
      refX: 8,
      refY: 8,
    },
    button: {
      height: 16,
      width: 20,
      rx: 2,
      ry: 2,
      fill: '#f5f5f5',
      stroke: '#ccc',
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign: {
      refX: 5,
      refY: 4,
      stroke: '#808080',
    },
  },
})

const container = document.getElementById('container')!
const graph = new Graph({
  container: container,
  grid: true,
})

const createGroup = (
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
) => {
  const group = new Group({
    id,
    x,
    y,
    width,
    height,
    attrs: {
      body: { fill },
    },
  })
  graph.addNode(group)
  return group
}

const createNode = (
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
) => {
  return graph.addNode({
    id,
    x,
    y,
    width,
    height,
    attrs: {
      body: {
        fill: fill || 'blue',
      },
      label: {
        text: id,
        fill: 'white',
        refX: 10,
        refY: 10,
        textAnchor: 'start',
      },
    },
  })
}

const createEdge = (
  id: string,
  source: string,
  target: string,
  vertices?: { x: number; y: number }[],
) => {
  return graph.addEdge({
    id,
    source,
    target,
    vertices: vertices,
    label: id,
  })
}

const a = createGroup('a', 100, 30, 480, 320, 'lightblue')
const aa = createGroup('aa', 180, 80, 160, 140, 'green')
const aaa = createGroup('aaa', 200, 120, 120, 40, 'gray')
const c = createNode('c', 450, 200, 50, 50, 'orange')

a.addChild(aa)
aa.addChild(aaa)
a.addChild(c)

createNode('d', 680, 80, 50, 50, 'black')

createEdge('l1', 'aa', 'c')
createEdge('l3', 'c', 'd')
aa.addChild(
  createEdge('l2', 'aa', 'aaa', [
    { x: 50, y: 110 },
    { x: 50, y: 180 },
  ]),
)

graph.on('node:collapse', ({ node }: { node: Group }) => {
  node.toggleCollapse()
  const collapsed = node.isCollapsed()
  const cells = node.getDescendants()
  cells.forEach((node) => {
    if (collapsed) {
      node.hide()
    } else {
      node.show()
    }
  })
})

graph.on('react:collapse', ({ node }: { node: Node }) => {
  const data = node.getData<any>() || {}
  const collapsed = !(data.collapsed === true)
  node.updateData({ collapsed })
  node.resize(collapsed ? 80 : 160, collapsed ? 30 : 60)
  const cells = node.getDescendants()
  cells.forEach((node) => {
    if (collapsed) {
      node.hide()
    } else {
      node.show()
    }
  })
})
