import { describe, expect, it, vi } from 'vitest'
import { type CellView, type Edge, Graph, Node, Snapline } from '../../src'
import { createTestGraph } from '../utils'

const testGraphJSON = {
  nodes: [
    { id: 'json-node1', x: 10, y: 20, width: 50, height: 50, shape: 'rect' },
    { id: 'json-node2', x: 100, y: 200, width: 50, height: 50, shape: 'rect' },
  ],
  edges: [{ id: 'json-edge1', source: 'json-node1', target: 'json-node2' }],
}

describe('Graph: 基础节点/边操作', () => {
  it('addNode / getCell / removeNode', async () => {
    const { graph, cleanup } = createTestGraph()
    const node = graph.addNode({
      id: 'n1',
      x: 40,
      y: 50,
    })

    expect(graph.getCellById('n1')).toBe(node)
    expect(node.getPosition()).toEqual({ x: 40, y: 50 })
    node.setPosition(100, 120)
    expect(node.getPosition()).toEqual({ x: 100, y: 120 })
    node.remove()
    expect(graph.getCellById('n1')).toBeFalsy()
    cleanup()
  })

  it('toJSON / fromJSON', () => {
    const { graph, cleanup } = createTestGraph()
    graph.fromJSON(testGraphJSON)
    expect(graph.getCellById('json-node1')).not.toBeNull()
    expect(graph.getCellById('json-edge1')).not.toBeNull()
    expect(graph.getCellCount()).toBe(3)

    const parsedCells = graph.parseJSON(testGraphJSON)
    expect(parsedCells.length).toBe(3)
    expect(parsedCells.find((c) => c.id === 'json-node1')).not.toBeUndefined()

    cleanup()
  })

  it('按端口连接，遵守 allowBlank=false', () => {
    const { graph, cleanup } = createTestGraph({
      connecting: { allowBlank: false, allowMulti: false, snap: true },
    })
    graph.addNode({
      id: 'n1',
      x: 40,
      y: 40,
      width: 80,
      height: 40,
      ports: {
        groups: { r: { position: 'right' } },
        items: [{ id: 'p1', group: 'r' }],
      },
    })
    graph.addNode({
      id: 'n2',
      x: 240,
      y: 60,
      width: 80,
      height: 40,
      ports: {
        groups: { l: { position: 'left' } },
        items: [{ id: 'p2', group: 'l' }],
      },
    })

    const e = graph.addEdge({
      source: { cell: 'n1', port: 'p1' },
      target: { cell: 'n2', port: 'p2' },
    })
    expect(e).toBeTruthy()
    expect(e.getSource()).toMatchObject({ cell: 'n1', port: 'p1' })
    expect(e.getTarget()).toMatchObject({ cell: 'n2', port: 'p2' })

    cleanup()
  })

  it('addEdge / path 生成', async () => {
    const { graph, cleanup } = createTestGraph({
      connecting: { router: { name: 'manhattan' }, connector: 'rounded' },
    })
    graph.addNode({
      id: 'a',
      x: 60,
      y: 60,
      width: 80,
      height: 40,
      attrs: {
        body: {
          stroke: '#5F95FF',
          fill: '#EFF4FF',
          strokeWidth: 1,
        },
      },
    })
    graph.addNode({
      id: 'b',
      x: 260,
      y: 200,
      width: 80,
      height: 40,
      attrs: {
        body: {
          stroke: '#5F95FF',
          fill: '#EFF4FF',
          strokeWidth: 1,
        },
      },
    })

    graph.addEdge({
      source: { x: 540, y: 40 },
      target: { x: 580, y: 180 },
      vertices: [{ x: 540, y: 140 }],
      connector: { name: 'smooth' },
      attrs: {
        line: {
          stroke: '#1890ff',
          strokeDasharray: 5,
          targetMarker: 'classic',
          style: {
            animation: 'ant-line 30s infinite linear',
          },
        },
      },
    })

    expect(graph.getCellById('e1')).toBeTruthy()
    await expect(graph).toMatchDOMSnapshot(__dirname, 'graph')

    cleanup()
  })

  it('addNodes / addEdges / removeCells', () => {
    const { graph, cleanup } = createTestGraph()
    graph.addNodes([
      { id: 'n1', x: 10, y: 10, width: 40, height: 40 },
      { id: 'n2', x: 100, y: 10, width: 40, height: 40 },
    ])
    graph.addEdges([{ id: 'e1', source: 'n1', target: 'n2' }])

    expect(graph.getCellCount()).toBe(3)
    expect(graph.hasCell('n1')).toBe(true)

    graph.removeCells(['n1', 'e1'])
    expect(graph.hasCell('n1')).toBe(false)
    expect(graph.hasCell('e1')).toBe(false)

    cleanup()
  })

  it('getOutgoingEdges / getIncomingEdges / getConnectedEdges', () => {
    const { graph, cleanup } = createTestGraph()
    const n1 = graph.addNode({ id: 'n1', x: 0, y: 0, width: 40, height: 40 })
    const n2 = graph.addNode({ id: 'n2', x: 100, y: 0, width: 40, height: 40 })
    const e1 = graph.addEdge({ id: 'e1', source: 'n1', target: 'n2' })

    expect(graph.getOutgoingEdges(n1)).toEqual([e1])
    expect(graph.getIncomingEdges(n2)).toEqual([e1])
    expect(graph.getConnectedEdges(n1)).toEqual([e1])

    cleanup()
  })

  it('getRootNodes / getLeafNodes / isRootNode / isLeafNode', () => {
    const { graph, cleanup } = createTestGraph()
    const root = graph.addNode({ id: 'root' })
    graph.addNode({ id: 'node2' })
    const leaf = graph.addNode({ id: 'leaf' })
    graph.addEdge({ source: 'root', target: 'node2' })
    graph.addEdge({ source: 'node2', target: 'leaf' })

    expect(graph.getRootNodes()).toEqual([root])
    expect(graph.isRootNode('root')).toBe(true)
    expect(graph.isRootNode('node2')).toBe(false)

    expect(graph.getLeafNodes()).toEqual([leaf])
    expect(graph.isLeafNode('leaf')).toBe(true)
    expect(graph.isLeafNode('node2')).toBe(false)

    cleanup()
  })

  it('getNeighbors / isNeighbor', () => {
    const { graph, cleanup } = createTestGraph()
    const node1 = graph.addNode({ id: 'node1' })
    const node2 = graph.addNode({ id: 'node2' })
    const node3 = graph.addNode({ id: 'node3' })
    graph.addEdge({ source: 'node1', target: 'node2' })
    graph.addEdge({ source: 'node2', target: 'node1' })
    graph.addEdge({ source: 'node1', target: 'node3' })

    const neighbors = graph.getNeighbors(node1)
    expect(neighbors.map((c) => c.id).sort()).toEqual(['node2', 'node3'])

    expect(graph.isNeighbor(node1, node2)).toBe(true)
    expect(graph.isNeighbor(node1, node3)).toBe(true)
    expect(graph.isNeighbor(node2, node3)).toBe(false)

    cleanup()
  })

  it('neighbors / successors / predecessors', () => {
    const { graph, cleanup } = createTestGraph()
    const n1 = graph.addNode({ id: 'n1', x: 0, y: 0, width: 10, height: 10 })
    const n2 = graph.addNode({ id: 'n2', x: 100, y: 0, width: 10, height: 10 })
    const n3 = graph.addNode({ id: 'n3', x: 200, y: 0, width: 10, height: 10 })
    graph.addEdge({ id: 'e1', source: 'n1', target: 'n2' })
    graph.addEdge({ id: 'e2', source: 'n2', target: 'n3' })

    expect(graph.getOutgoingEdges(n1)?.length).toBe(1)
    expect(graph.getIncomingEdges(n2)?.length).toBe(1)
    expect(graph.getConnectedEdges(n2)?.length).toBe(2)

    expect(graph.getNeighbors(n2).map((n) => n.id)).toContain('n1')
    expect(graph.isNeighbor(n1, n2)).toBe(true)
    expect(graph.isSuccessor(n1, n3)).toBe(true)
    expect(graph.isPredecessor(n3, n1)).toBe(true)

    expect(graph.getShortestPath(n1, n3)).toEqual(['n1', 'n2', 'n3'])

    cleanup()
  })

  it('getNodesFromPoint / getNodesInArea', () => {
    const { graph, cleanup } = createTestGraph()
    const n1 = graph.addNode({ id: 'n1', x: 10, y: 10, width: 40, height: 40 })
    graph.addNode({ id: 'n2', x: 200, y: 200, width: 40, height: 40 })

    expect(graph.getNodesFromPoint(20, 20)).toContain(n1)
    expect(graph.getNodesInArea(0, 0, 60, 60)).toContain(n1)

    cleanup()
  })

  it('resetCells / clearCells', () => {
    const { graph, cleanup } = createTestGraph()
    graph.addNode({ id: 'n1', x: 0, y: 0, width: 10, height: 10 })
    graph.resetCells([])
    expect(graph.getCellCount()).toBe(0)

    const newNodes = [
      new Node({ id: 'new-node1' }),
      new Node({ id: 'new-node2' }),
    ]
    graph.resetCells(newNodes)

    expect(graph.getCellById('old-node')).toBeNull()
    expect(graph.getCellById('new-node1')).not.toBeNull()
    expect(graph.getCellCount()).toBe(2)
    cleanup()
  })

  it('updateCellId', () => {
    const { graph, cleanup } = createTestGraph()
    const n1 = graph.addNode({
      id: 'n1',
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      label: 'n1',
    })
    graph.updateCellId(n1, 'n1-new')
    expect((graph.getCellById('n1-new') as any).label).toBe('n1')
    cleanup()
  })
})

describe('Graph: Model / 数据模型', () => {
  it('addNode / addEdge / getCellById: 添加节点/边并通过ID获取', () => {
    const { graph, cleanup } = createTestGraph()

    const node1 = graph.addNode({
      id: 'node1',
      x: 10,
      y: 20,
      width: 50,
      height: 50,
    })
    expect(graph.isNode(node1)).toBe(true)
    expect(graph.getCellById('node1')).toEqual(node1)

    const node2 = new Node({ id: 'node2', x: 100, y: 200 })
    graph.addNode(node2)
    expect(graph.getCellById('node2')).toEqual(node2)

    const edge1 = graph.addEdge({
      id: 'edge1',
      source: 'node1',
      target: 'node2',
    })
    expect(graph.isEdge(edge1)).toBe(true)
    expect(graph.getCellById('edge1')).toEqual(edge1)

    cleanup()
  })

  it('removeCell / removeCells / clearCells: 删除节点/边', () => {
    const { graph, cleanup } = createTestGraph()
    const node1 = graph.addNode({ id: 'node1' })
    const node2 = graph.addNode({ id: 'node2' })
    graph.addNode({ id: 'node3' })
    const edge = graph.addEdge({
      id: 'edge1',
      source: 'node2',
      target: 'node3',
    })

    const removedNode = graph.removeCell('node1')
    expect(removedNode).toEqual(node1)
    expect(graph.getCellById('node1')).toBeNull()

    const removedEdge = graph.removeCell(edge)
    expect(removedEdge).toEqual(edge)
    expect(graph.getCellById('edge1')).toBeNull()

    graph.removeCells([node2, 'node3'])
    expect(graph.getCellCount()).toBe(0)

    expect(graph.removeCell('non-exist')).toBeNull()

    cleanup()
  })

  it('getNodes / getEdges / getConnectedEdges: 获取节点/边及关联边', () => {
    const { graph, cleanup } = createTestGraph()
    const node1 = graph.addNode({ id: 'node1' })
    const node2 = graph.addNode({ id: 'node2' })
    const edge1 = graph.addEdge({
      id: 'edge1',
      source: 'node1',
      target: 'node2',
    })
    const edge2 = graph.addEdge({
      id: 'edge2',
      source: 'node2',
      target: 'node1',
    })

    expect(graph.getNodes()).toEqual([node1, node2])
    expect(graph.getEdges()).toEqual([edge1, edge2])

    const node1Connected = graph.getConnectedEdges('node1')
    expect(node1Connected).toEqual([edge1, edge2])
    const node1Outgoing = graph.getOutgoingEdges('node1')
    expect(node1Outgoing).toEqual([edge1])
    const node1Incoming = graph.getIncomingEdges('node1')
    expect(node1Incoming).toEqual([edge2])

    cleanup()
  })

  it('getShortestPath / getSubGraph: 路径查找与子图', () => {
    const { graph, cleanup } = createTestGraph()
    const node1 = graph.addNode({ id: 'node1' })
    const node2 = graph.addNode({ id: 'node2' })
    const node3 = graph.addNode({ id: 'node3' })
    graph.addEdge({ id: 'e1', source: 'node1', target: 'node2' })
    graph.addEdge({ id: 'e2', source: 'node2', target: 'node3' })
    graph.addEdge({ id: 'e3', source: 'node1', target: 'node3' })

    const shortestPath = graph.getShortestPath('node1', 'node3')
    expect(shortestPath).toEqual(['node1', 'node3'])

    const subGraph = graph.getSubGraph([node1, node3])
    const subGraphIds = subGraph.map((cell) => cell.id).sort()
    expect(subGraphIds).toEqual(['e3', 'node1', 'node3'])

    cleanup()
  })

  it('batchUpdate: 批量更新', () => {
    const { graph, cleanup } = createTestGraph()
    const result = graph.batchUpdate(() => {
      graph.addNode({ id: 'node1' })
      graph.addNode({ id: 'node2' })
      return graph.getCellCount()
    })

    expect(result).toBe(2)
    expect(graph.getCellCount()).toBe(2)

    cleanup()
  })
  it('removeConnectedEdges / disconnectConnectedEdges: 移除/断开关联边', () => {
    const { graph, cleanup } = createTestGraph()
    graph.addNode({ id: 'node1' })
    graph.addNode({ id: 'node2' })
    graph.addEdge({
      id: 'edge1',
      source: 'node1',
      target: 'node2',
    })
    graph.addEdge({
      id: 'edge2',
      source: 'node2',
      target: 'node1',
    })

    graph.removeConnectedEdges('node1')
    expect(graph.getCellById('edge1')).toBeNull()
    expect(graph.getCellById('edge2')).toBeNull()

    const edge3 = graph.addEdge({
      id: 'edge3',
      source: 'node1',
      target: 'node2',
    })
    graph.disconnectConnectedEdges('node1')
    expect(graph.getCellById('edge3')).not.toBeNull()
    expect((edge3.getSource() as any).id).toBeUndefined()

    cleanup()
  })
  it('getNeighbors / isNeighbor: 邻居节点查询', () => {
    const { graph, cleanup } = createTestGraph()
    const node1 = graph.addNode({ id: 'node1' })
    const node2 = graph.addNode({ id: 'node2' })
    const node3 = graph.addNode({ id: 'node3' })
    graph.addEdge({ source: 'node1', target: 'node2' })
    graph.addEdge({ source: 'node2', target: 'node1' })
    graph.addEdge({ source: 'node1', target: 'node3' })

    const neighbors = graph.getNeighbors(node1)
    expect(neighbors.map((c) => c.id).sort()).toEqual(['node2', 'node3'])

    expect(graph.isNeighbor(node1, node2)).toBe(true)
    expect(graph.isNeighbor(node1, node3)).toBe(true)
    expect(graph.isNeighbor(node2, node3)).toBe(false)

    cleanup()
  })

  it('getSuccessors / isSuccessor / getPredecessors / isPredecessor: 前驱/后继查询', () => {
    const { graph, cleanup } = createTestGraph()
    const a = graph.addNode({ id: 'a' })
    const b = graph.addNode({ id: 'b' })
    const c = graph.addNode({ id: 'c' })
    graph.addEdge({ source: 'a', target: 'b' }) // a -> b
    graph.addEdge({ source: 'b', target: 'c' }) // b -> c

    // 前驱（入边来源）：b的前驱是a，c的前驱是b
    expect(graph.getPredecessors(b).map((c) => c.id)).toEqual(['a'])
    expect(graph.isPredecessor(b, a)).toBe(true)

    // 后继（出边目标）：a的后继是b，b的后继是c
    expect(graph.getSuccessors(a).map((c) => c.id)).toEqual(['b', 'c'])
    expect(graph.isSuccessor(a, b)).toBe(true)

    cleanup()
  })

  it('cloneSubGraph / cloneCells: 子图克隆', () => {
    const { graph, cleanup } = createTestGraph()
    const node1 = graph.addNode({ id: 'node1', x: 10, y: 20 })
    const node2 = graph.addNode({ id: 'node2', x: 100, y: 200 })
    graph.addEdge({
      id: 'edge1',
      source: 'node1',
      target: 'node2',
    })

    const subGraphMap = graph.cloneSubGraph([node1, node2])

    const clonedNode1 = subGraphMap['node1'] as Node
    const clonedEdge1 = subGraphMap['edge1'] as Edge
    expect(clonedNode1).not.toBeNull()

    expect(clonedNode1.getBBox().x).toBe(10)
    expect((clonedEdge1.getSource() as any).cell).toBe(clonedNode1?.id)

    const clonedCells = graph.cloneCells([node1])
    expect(Object.keys(clonedCells).length).toBe(1)
    expect(clonedCells['node1'].id).not.toBe('node1')

    cleanup()
  })

  it('getNodesFromPoint / getNodesInArea: 按点/区域获取节点', () => {
    const { graph, cleanup } = createTestGraph()
    // 添加两个重叠节点（node1在(0,0)，node2在(10,10)，宽高50）
    const node1 = graph.addNode({
      id: 'node1',
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    })
    const node2 = graph.addNode({
      id: 'node2',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
    })

    const nodesFromPoint = graph.getNodesFromPoint(15, 15)
    expect(nodesFromPoint.map((c) => c.id).sort()).toEqual(['node1', 'node2'])

    const nodesInArea = graph.getNodesInArea(0, 0, 20, 20)
    expect(nodesInArea.map((c) => c.id).sort()).toEqual(['node1', 'node2'])

    const nodesInAreaRect = graph.getNodesInArea({
      x: 0,
      y: 0,
      width: 20,
      height: 20,
    })
    expect(nodesInAreaRect.length).toBe(2)

    cleanup()
  })

  it('getNodesUnderNode: 获取指定节点下方的节点', () => {
    const { graph, cleanup } = createTestGraph()
    // node1在下层，node2在node1上方（同位置）
    const node1 = graph.addNode({
      id: 'node1',
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    })
    const node2 = graph.addNode({
      id: 'node2',
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    })

    const nodesUnder = graph.getNodesUnderNode(node2)
    expect(nodesUnder.map((c) => c.id)).toEqual(['node1'])

    cleanup()
  })

  it('searchCell: 搜索迭代', () => {
    const { graph, cleanup } = createTestGraph()
    graph.addNode({ id: 'node1' })
    graph.addNode({ id: 'node2' })
    const edge1 = graph.addEdge({
      id: 'edge1',
      source: 'node1',
      target: 'node2',
    })

    const cellIds: string[] = []
    graph.searchCell(edge1, (cell) => {
      cellIds.push(cell.id)
      return true
    })
    // 搜索应包含node1、edge1、node2（关联关系）
    expect(cellIds.sort()).toEqual(['edge1', 'node1', 'node2'])

    cleanup()
  })

  it('getAllCellsBBox / getCellsBBox: 获取包围盒', () => {
    const { graph, cleanup } = createTestGraph()
    const node1 = graph.addNode({
      id: 'node1',
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    })
    const node2 = graph.addNode({
      id: 'node2',
      x: 100,
      y: 200,
      width: 50,
      height: 50,
    })

    const allBBox = graph.getAllCellsBBox() as {
      x: number
      y: number
      width: number
      height: number
    }
    expect(allBBox.x).toBe(0)
    expect(allBBox.y).toBe(0)
    expect(allBBox.width).toBe(150) // 100+50
    expect(allBBox.height).toBe(250) // 200+50

    const cellsBBox = graph.getCellsBBox([node1])
    expect(cellsBBox).toEqual({ x: 0, y: 0, width: 50, height: 50 })

    cleanup()
  })
})

describe('Graph: View / 视图查找', () => {
  it('findViewByCell / findViewsFromPoint: 按坐标查找视图', () => {
    const { graph, cleanup } = createTestGraph()
    const node = graph.addNode({
      id: 'node1',
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    })

    const view = graph.findViewByCell('node1')
    expect(view).not.toBeNull()
    expect(view?.cell).toEqual(node)

    const viewsFromPoint = graph.findViewsFromPoint(0, 0)
    expect(viewsFromPoint.length).toBe(1)
    expect(viewsFromPoint[0].cell.id).toBe('node1')

    const viewsInArea = graph.findViewsInArea(
      {
        x: -1,
        y: -1,
        width: 100,
        height: 100,
      },
      { strict: false },
    )

    expect(viewsInArea.length).toBe(1)

    cleanup()
  })

  it('findViewByElem: 按DOM元素查找视图', () => {
    const { graph, cleanup } = createTestGraph()
    const node = graph.addNode({ id: 'node1' })
    const view = graph.findViewByCell(node) as CellView
    const elem = view?.el

    if (elem) {
      const foundView = graph.findViewByElem(elem)
      expect(foundView).toEqual(view)
    }

    expect(graph.findViewByElem(document.createElement('div'))).toBeNull()

    cleanup()
  })
})

describe('Graph: Coord / 坐标转换补充', () => {
  it('localToGraph / graphToLocal: 本地与图坐标转换', () => {
    const { graph, cleanup } = createTestGraph()
    const localPoint = { x: 10, y: 20 }
    const graphPoint = graph.localToGraph(localPoint)
    expect(graphPoint).toEqual(localPoint)

    const localPoint2 = graph.graphToLocal(graphPoint)
    expect(localPoint2).toEqual(localPoint)

    const localRect = { x: 0, y: 0, width: 100, height: 100 }
    const graphRect = graph.localToGraph(localRect)
    expect(graphRect).toEqual(localRect)

    cleanup()
  })

  it('clientToGraph: 客户端坐标转图坐标', () => {
    const { graph, cleanup } = createTestGraph()
    const clientPoint = { x: 50, y: 50 }
    const graphPoint = graph.clientToGraph(clientPoint)
    expect(graphPoint).toEqual(clientPoint)

    const clientRect = { x: 10, y: 10, width: 50, height: 50 }
    const graphRect = graph.clientToGraph(clientRect)
    expect(graphRect).toEqual(clientRect)

    cleanup()
  })
})

describe('Graph: Defs / 资源定义', () => {
  it('defineFilter / defineGradient / defineMarker: 定义资源', () => {
    const { graph, cleanup } = createTestGraph()

    expect(() => {
      graph.defineFilter({
        name: 'dropShadow',
        args: {
          dx: 2,
          dy: 2,
          blur: 3,
        },
      })
    }).not.toThrow()

    expect(() => {
      graph.defineGradient({
        id: 'linear',
        type: 'linear',
        stops: [
          { offset: 0, color: 'red' },
          { offset: 1, color: 'blue' },
        ],
      })
    }).not.toThrow()

    expect(() => {
      graph.defineMarker({
        id: 'arrow',
        tagName: 'path',
        d: 'M 0 0 L 10 5 L 0 10 Z',
      })
    }).not.toThrow()

    cleanup()
  })
})

describe('Graph: Grid / 网格', () => {
  it('setGridSize / getGridSize: 网格大小设置', () => {
    const { graph, cleanup } = createTestGraph()
    expect(graph.getGridSize()).toBe(10)

    graph.setGridSize(40)
    expect(graph.getGridSize()).toBe(40)

    cleanup()
  })

  it('showGrid / hideGrid / drawGrid: 网格显示控制', () => {
    const { graph, cleanup } = createTestGraph()

    expect(() => {
      graph.showGrid()
      graph.hideGrid()
      graph.drawGrid()
      graph.clearGrid()
    }).not.toThrow()

    cleanup()
  })
})

describe('Graph: Background / 背景', () => {
  it('drawBackground / clearBackground: 背景绘制与清除', () => {
    const { graph, cleanup } = createTestGraph()

    expect(() => {
      graph.drawBackground({ color: '#f5f5f5' })
    }).not.toThrow()

    expect(() => {
      graph.clearBackground()
    }).not.toThrow()

    expect(() => {
      graph.updateBackground()
    }).not.toThrow()

    cleanup()
  })
})

describe('Graph: MouseWheel / 鼠标滚轮', () => {
  it('enable / disable / isMouseWheelEnabled: 滚轮控制', () => {
    const { graph, cleanup } = createTestGraph({
      mousewheel: { enabled: true, zoomAtMousePosition: true },
    })

    expect(graph.isMouseWheelEnabled()).toBe(true)

    graph.disableMouseWheel()
    expect(graph.isMouseWheelEnabled()).toBe(false)

    graph.enableMouseWheel()
    expect(graph.isMouseWheelEnabled()).toBe(true)

    graph.toggleMouseWheel(false)
    expect(graph.isMouseWheelEnabled()).toBe(false)
    graph.toggleMouseWheel(true)
    expect(graph.isMouseWheelEnabled()).toBe(true)

    cleanup()
  })
})

describe('Graph: Panning / 拖拽平移', () => {
  it('enable / disable / isPannable: 平移控制', () => {
    const { graph, cleanup } = createTestGraph({
      panning: { enabled: true, eventTypes: ['leftMouseDown'] },
    })

    expect(graph.isPannable()).toBe(true)

    graph.disablePanning()
    expect(graph.isPannable()).toBe(false)

    graph.enablePanning()
    expect(graph.isPannable()).toBe(true)

    graph.togglePanning(false)
    expect(graph.isPannable()).toBe(false)
    graph.togglePanning(true)
    expect(graph.isPannable()).toBe(true)

    cleanup()
  })
})

describe('Graph: Plugin / 插件管理', () => {
  it('use / getPlugin / enablePlugins: 插件使用与控制', () => {
    const { graph, cleanup } = createTestGraph()
    const SnaplinePlugin = new Snapline({
      enabled: true,
    })
    graph.use(SnaplinePlugin)
    const plugin = graph.getPlugin('snapline')
    expect(plugin).toEqual(SnaplinePlugin)

    graph.enablePlugins('snapline')
    expect(graph.isPluginEnabled('snapline')).toBe(true)
    graph.disablePlugins('snapline')
    expect(graph.isPluginEnabled('snapline')).toBe(false)

    const plugins = graph.getPlugins(['snapline'])
    expect(plugins).toEqual([SnaplinePlugin])

    graph.disposePlugins('snapline')
    expect(graph.getPlugin('snapline')).toBeUndefined()

    cleanup()
  })
})

describe('Graph: Dispose / 销毁', () => {
  it('dispose: 销毁实例', () => {
    const { graph, cleanup } = createTestGraph()
    const modelDisposeSpy = vi.spyOn(graph.model, 'dispose')

    graph.dispose()
    expect(modelDisposeSpy).toHaveBeenCalled()

    modelDisposeSpy.mockRestore()
    cleanup()
  })
})

describe('Graph: Utils / 工具方法', () => {
  it('isNode / isEdge: 类型判断', () => {
    const { graph, cleanup } = createTestGraph()
    const node = graph.addNode({ id: 'node1' })
    const edge = graph.addEdge({
      id: 'edge1',
      source: 'node1',
      target: 'node1',
    })

    expect(graph.isNode(node)).toBe(true)
    expect(graph.isNode(edge)).toBe(false)
    expect(graph.isEdge(edge)).toBe(true)
    expect(graph.isEdge(node)).toBe(false)

    cleanup()
  })

  it('isGraph: 实例判断', () => {
    const { graph, cleanup } = createTestGraph()
    const notGraph = null

    expect(Graph.isGraph(graph)).toBe(true)
    expect(Graph.isGraph(notGraph)).toBe(false)

    cleanup()
  })
})

describe('Graph: Boundary / 边界场景测试', () => {
  it('getCommonAncestor: 公共祖先（含null/undefined）', () => {
    const { graph, cleanup } = createTestGraph()
    const node1 = graph.addNode({ id: 'node1' })
    const node2 = graph.addNode({ id: 'node2' })

    expect(graph.getCommonAncestor(node1, node2)).toBeNull()
    expect(graph.getCommonAncestor(node1, null, undefined)).toBeNull()

    cleanup()
  })

  it('getShortestPath: 无路径场景', () => {
    const { graph, cleanup } = createTestGraph()
    const node1 = graph.addNode({ id: 'node1' })
    const node2 = graph.addNode({ id: 'node2' })

    const path = graph.getShortestPath('node1', 'node2')
    expect(path).toEqual([])

    cleanup()
  })

  it('cloneSubGraph: 克隆子图', () => {
    const { graph, cleanup } = createTestGraph()
    const node1 = graph.addNode({ id: 'node1' })
    const node2 = graph.addNode({ id: 'node2' })
    const cells = [node1, node2]
    const subGraph = graph.cloneSubGraph(cells)
    expect(Object.keys(subGraph)).toHaveLength(2)
    const subGraphEmpty = graph.cloneSubGraph([])
    expect(Object.keys(subGraphEmpty)).toHaveLength(0)

    cleanup()
  })

  it('searchCell: 终止迭代', () => {
    const { graph, cleanup } = createTestGraph()
    const node1 = graph.addNode({ id: 'node1' })
    const node2 = graph.addNode({ id: 'node2' })

    const cellIds: string[] = []
    graph.searchCell(node1, (cell) => {
      cellIds.push(cell.id)
      return cell.id !== 'node1'
    })
    expect(cellIds).toEqual(['node1'])

    cleanup()
  })
})

describe('Graph: Static / 静态方法与注册工具', () => {
  it('Graph.render: 静态创建图实例', () => {
    const container = document.createElement('div')
    const graph1 = Graph.render(container)
    expect(Graph.isGraph(graph1)).toBe(true)
    expect(graph1.container).toBe(container)

    const graph2 = Graph.render({ container }, testGraphJSON)
    expect(graph2.getCellById('json-node1')).not.toBeNull()

    graph1.dispose()
    graph2.dispose()
  })

  it('registerNode / unregisterNode: 节点类型注册与注销', () => {
    Graph.registerNode('custom-node', {
      inherit: 'rect',
      width: 100,
      height: 50,
      attrs: { body: { fill: 'lightblue' }, label: { text: 'Custom Node' } },
    })
    const { graph, cleanup } = createTestGraph()
    const node = graph.addNode({ shape: 'custom-node', x: 50, y: 50 })
    expect(node.getBBox()['width']).toBe(100)
    Graph.unregisterNode('custom-node')
    cleanup()
  })
})

describe('Graph: Transform / 补充未覆盖方法', () => {
  it('scale / zoom / rotate / translate', () => {
    const { graph, cleanup } = createTestGraph()
    graph.scale(2, 2)
    expect(graph.scale()).toEqual({ sx: 2, sy: 2 })

    graph.zoom(2)
    expect(typeof graph.zoom()).toBe('number')

    graph.rotate(45)
    expect(graph.rotate().angle).toBe(45)

    graph.translate(10, 20)
    expect(graph.translate()).toEqual({ tx: 10, ty: 20 })

    cleanup()
  })

  it('coord: snapToGrid / pageToLocal / localToPage', () => {
    const { graph, cleanup } = createTestGraph({ grid: { size: 10 } })
    expect(graph.snapToGrid(12, 18)).toEqual({ x: 10, y: 20 })

    const p = graph.pageToLocal({ x: 100, y: 100 })
    expect(p).toHaveProperty('x')
    const back = graph.localToPage(p)
    expect(back).toHaveProperty('x')

    cleanup()
  })

  it('snapToGrid / local/page/client 转换', () => {
    const { graph, cleanup } = createTestGraph()
    expect(graph.snapToGrid({ x: 15, y: 17 })).toEqual({ x: 20, y: 20 })
    expect(graph.pageToLocal(0, 0)).toEqual({ x: 0, y: 0 })
    expect(graph.localToPage(0, 0)).toEqual({ x: 0, y: 0 })
    expect(graph.clientToLocal(0, 0)).toEqual({ x: 0, y: 0 })
    expect(graph.localToClient(0, 0)).toEqual({ x: 0, y: 0 })
    cleanup()
  })

  it('matrix: 读写变换矩阵', () => {
    const { graph, cleanup } = createTestGraph()
    const defaultMatrix = graph.matrix()
    expect(defaultMatrix.a).toBe(1) // 缩放x
    expect(defaultMatrix.d).toBe(1) // 缩放y
    expect(defaultMatrix.e).toBe(0) // 平移x
    expect(defaultMatrix.f).toBe(0) // 平移y

    const newMatrix = new DOMMatrix().scale(2).translate(10, 20)
    graph.matrix(newMatrix)
    const updatedMatrix = graph.matrix()
    expect(updatedMatrix.a).toBe(2)
    expect(updatedMatrix.e).toBe(20)
    expect(updatedMatrix.f).toBe(40)

    cleanup()
  })

  it('zoomTo / zoomToFit: 绝对缩放与适配内容', () => {
    const { graph, cleanup } = createTestGraph()
    graph.zoomTo(2)
    expect(graph.zoom()).toBe(2)

    graph.addNode({ id: 'node1', x: 100, y: 100, width: 50, height: 50 })
    graph.zoomToFit()
    const zoomAfterFit = graph.zoom()
    expect(zoomAfterFit).toBeGreaterThan(1)

    cleanup()
  })

  it('center / centerCell: 居中视图', () => {
    const { graph, cleanup } = createTestGraph()
    const node = graph.addNode({
      id: 'node1',
      x: 200,
      y: 200,
      width: 50,
      height: 50,
    })

    graph.centerCell(node)
    const translateAfterCenter = graph.translate()
    expect(translateAfterCenter.tx).toBeCloseTo(175)
    expect(translateAfterCenter.ty).toBeCloseTo(75)

    graph.centerPoint(100, 100)
    expect(graph.translate()).toEqual({ tx: 300, ty: 200 })

    cleanup()
  })

  it('fitToContent / scaleContentToFit: 内容适配', () => {
    const { graph, cleanup } = createTestGraph()
    graph.addNode({ id: 'node1', x: 0, y: 0, width: 100, height: 100 })
    graph.addNode({ id: 'node2', x: 300, y: 300, width: 100, height: 100 })

    const fitRect = graph.fitToContent()
    expect(fitRect.x).toBeCloseTo(0)
    expect(fitRect.y).toBeCloseTo(0)
    expect(fitRect.width).toBe(400) // 0+300+100
    expect(fitRect.height).toBe(400)

    graph.scaleContentToFit()
    expect(graph.zoom()).toBe(1)

    cleanup()
  })

  it('translateBy: 相对平移', () => {
    const { graph, cleanup } = createTestGraph()
    graph.translate(10, 20)
    graph.translateBy(5, 10) // 相对当前平移 (10+5, 20+10)
    expect(graph.translate()).toEqual({ tx: 15, ty: 30 })

    cleanup()
  })

  it('resize: 调整图尺寸', () => {
    const { graph, cleanup } = createTestGraph()
    expect(() => {
      graph.resize(800, 600)
    }).not.toThrow()

    const mockScroller = { resize: vi.fn() }
    graph.use({
      name: 'scroller',
      init: () => {},
      dispose: () => {},
      ...mockScroller,
    })
    graph.resize(1000, 800)
    expect(mockScroller.resize).toHaveBeenCalledWith(1000, 800)

    cleanup()
  })

  it('getGraphArea / getContentArea / getContentBBox: 获取区域信息', () => {
    const { graph, cleanup } = createTestGraph()
    graph.addNode({ id: 'node1', x: 10, y: 20, width: 50, height: 50 })
    graph.addNode({ id: 'node2', x: 100, y: 200, width: 50, height: 50 })

    const graphArea = graph.getGraphArea()
    expect(graphArea.width).toBeGreaterThan(0)
    expect(graphArea.height).toBeGreaterThan(0)

    const contentArea = graph.getContentArea()
    expect(contentArea.x).toBe(10)
    expect(contentArea.y).toBe(20)
    expect(contentArea.width).toBe(140)
    expect(contentArea.height).toBe(230)

    const contentBBox = graph.getContentBBox()
    expect(contentBBox).toEqual(contentArea)

    cleanup()
  })

  it('getGraphArea: 当存在 scroller 插件时返回可视区域', () => {
    const { graph, cleanup } = createTestGraph()
    const vis = { x: 5, y: 6, width: 123, height: 456 }
    vi.spyOn(graph, 'getPlugin').mockImplementation((name: string) => {
      if (name === 'scroller') {
        return {
          getVisibleArea: vi.fn(() => vis),
        } as any
      }
      return null as any
    })

    const area = graph.getGraphArea()
    expect(area).toEqual(vis)

    cleanup()
  })

  it('positionPoint / positionRect / positionCell / positionContent: 定位控制', () => {
    const { graph, cleanup } = createTestGraph()
    const node = graph.addNode({
      id: 'node1',
      x: 200,
      y: 300,
      width: 50,
      height: 50,
    })
    const rect = { x: 100, y: 200, width: 100, height: 100 }

    graph.positionPoint({ x: 200, y: 300 }, '50%', '50%')
    const translateAfterPoint = graph.translate()
    expect(translateAfterPoint.tx).toBeCloseTo(200)
    expect(translateAfterPoint.ty).toBeCloseTo(0)

    graph.positionRect(rect, 'right')
    expect(graph.translate().tx).toBeGreaterThan(0)

    graph.positionCell(node, 'left')
    expect(graph.translate().tx).toBeLessThan(0)

    graph.positionContent('top')
    expect(graph.translate().ty).toBeLessThan(0)

    cleanup()
  })
})
