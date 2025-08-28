import { describe, expect, it, vi } from 'vitest'
import { Collection, Edge, Graph, Model, Node } from '../../src'

describe('Model', () => {
  it('should create a new Model instance', () => {
    const model = new Model()
    expect(model).toBeInstanceOf(Model)
    expect(model.collection).toBeInstanceOf(Collection)
  })

  it('should create a new Model instance with initial cells', () => {
    const cells = [new Node(), new Edge()]
    const model = new Model(cells)
    expect(model.collection.length).toBe(2)
  })

  it('should notify listeners when an event is triggered', () => {
    const model = new Model()
    const listener = vi.fn()
    model.on('test', listener)
    model.notify('test', { value: 'test' })
    expect(listener).toHaveBeenCalledWith({ value: 'test' })
  })

  it('should notify graph when an event is triggered and graph is set', () => {
    const model = new Model()
    const container = document.createElement('div')
    document.body.appendChild(container)
    const graph = new Graph({ container: container, model: model })
    model.graph = graph
    const listener = vi.fn()
    graph.on('test', listener)
    model.notify('test', { value: 'test' })
    expect(listener).toHaveBeenCalledWith({ value: 'test' })
    document.body.removeChild(container)
  })

  it('should sort collection on cell:change:zIndex event', () => {
    const model = new Model()
    const sortSpy = vi.spyOn(model.collection, 'sort')
    model.collection.trigger('cell:change:zIndex')
    expect(sortSpy).toHaveBeenCalled()
  })

  it('should add a node to the model', () => {
    const model = new Model()
    const node = model.addNode({ shape: 'rect' })
    expect(node).toBeInstanceOf(Node)
    expect(model.has(node)).toBe(true)
  })

  it('should update a node in the model', () => {
    const model = new Model()
    const node = model.addNode({ id: 'test', shape: 'rect' })
    const updateSpy = vi.spyOn(node, 'setProp')
    model.updateNode({ id: 'test', width: 100 })
    expect(updateSpy).toHaveBeenCalledWith('id', 'test', {})
  })

  it('should add an edge to the model', () => {
    const model = new Model()
    const edge = model.addEdge({ shape: 'edge' })
    expect(edge).toBeInstanceOf(Edge)
    expect(model.has(edge)).toBe(true)
  })

  it('should update an edge in the model', () => {
    const model = new Model()
    const edge = model.addEdge({ id: 'test', shape: 'edge' })
    const updateSpy = vi.spyOn(edge, 'setProp')
    model.updateEdge({ id: 'test', source: 'node1' })
    expect(updateSpy).toHaveBeenCalledWith(
      'source',
      {
        cell: 'node1',
      },
      {},
    )
  })

  it('should add a cell to the model', () => {
    const model = new Model()
    const cell = new Node()
    model.addCell(cell)
    expect(model.has(cell)).toBe(true)
  })

  it('should add multiple cells to the model', () => {
    const model = new Model()
    const cells = [new Node(), new Edge()]
    model.addCells(cells)
    expect(model.total()).toBe(2)
  })

  it('should update a cell in the model', () => {
    const model = new Model()
    const cell = model.addNode({ id: 'test', shape: 'rect' })
    const updateSpy = vi.spyOn(cell, 'setProp')
    model.updateCell({ id: 'test', width: 100 })
    expect(updateSpy).toHaveBeenCalledWith('width', 100, {})
  })

  it('should remove a cell from the model by id', () => {
    const model = new Model()
    const cell = model.addNode({ id: 'test', shape: 'rect' })
    model.removeCell('test')
    expect(model.has(cell)).toBe(false)
  })

  it('should remove a cell from the model by cell instance', () => {
    const model = new Model()
    const cell = model.addNode({ id: 'test', shape: 'rect' })
    model.removeCell(cell)
    expect(model.has(cell)).toBe(false)
  })

  it('should update cell id', () => {
    const model = new Model()
    const cell = model.addNode({ id: 'test', shape: 'rect' })
    const newCell = model.updateCellId(cell, 'test2')
    expect(model.has('test')).toBe(false)
    expect(model.has('test2')).toBe(true)
    expect(newCell.id).toBe('test2')
  })

  it('should remove multiple cells from the model', () => {
    const model = new Model()
    const cells = [
      model.addNode({ id: 'node1', shape: 'rect' }),
      model.addEdge({ id: 'edge1', shape: 'edge' }),
    ]
    model.removeCells(['node1', 'edge1'])
    expect(model.total()).toBe(0)
  })

  it('should remove connected edges from a cell', () => {
    const model = new Model()
    const node = model.addNode({ id: 'node1', shape: 'rect' })
    const edge = model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const removeSpy = vi.spyOn(edge, 'remove')
    model.removeConnectedEdges(node)
    expect(removeSpy).toHaveBeenCalled()
  })

  it('should disconnect connected edges from a cell', () => {
    const model = new Model()
    const node = model.addNode({ id: 'node1', shape: 'rect' })
    const edge = model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    model.disconnectConnectedEdges(node)
    expect(edge.getSource()).toEqual({ x: 0, y: 0 })
  })

  it('should check if the model has a cell by id', () => {
    const model = new Model()
    model.addNode({ id: 'test', shape: 'rect' })
    expect(model.has('test')).toBe(true)
  })

  it('should check if the model has a cell by cell instance', () => {
    const model = new Model()
    const cell = model.addNode({ id: 'test', shape: 'rect' })
    expect(model.has(cell)).toBe(true)
  })

  it('should get the total number of cells in the model', () => {
    const model = new Model()
    model.addNode({ shape: 'rect' })
    model.addEdge({ shape: 'edge' })
    expect(model.total()).toBe(2)
  })

  it('should get the index of a cell in the model', () => {
    const model = new Model()
    const cell = model.addNode({ shape: 'rect' })
    expect(model.indexOf(cell)).toBe(0)
  })

  it('should get a cell from the model by id', () => {
    const model = new Model()
    model.addNode({ id: 'test', shape: 'rect' })
    const cell = model.getCell('test')
    expect(cell).toBeInstanceOf(Node)
  })

  it('should get all cells from the model', () => {
    const model = new Model()
    model.addNode({ shape: 'rect' })
    model.addEdge({ shape: 'edge' })
    const cells = model.getCells()
    expect(cells.length).toBe(2)
  })

  it('should get the first cell from the model', () => {
    const model = new Model()
    model.addNode({ shape: 'rect' })
    const cell = model.getFirstCell()
    expect(cell).toBeInstanceOf(Node)
  })

  it('should get the last cell from the model', () => {
    const model = new Model()
    model.addNode({ shape: 'rect' })
    model.addEdge({ shape: 'edge' })
    const cell = model.getLastCell()
    expect(cell).toBeInstanceOf(Edge)
  })

  it('should get the minimum z-index from the model', () => {
    const model = new Model()
    model.addNode({ shape: 'rect', zIndex: 1 })
    model.addEdge({ shape: 'edge', zIndex: 0 })
    expect(model.getMinZIndex()).toBe(0)
  })

  it('should get the maximum z-index from the model', () => {
    const model = new Model()
    model.addNode({ shape: 'rect', zIndex: 1 })
    model.addEdge({ shape: 'edge', zIndex: 0 })
    expect(model.getMaxZIndex()).toBe(1)
  })

  it('should get all nodes from the model', () => {
    const model = new Model()
    model.addNode({ shape: 'rect' })
    model.addEdge({ shape: 'edge' })
    const nodes = model.getNodes()
    expect(nodes.length).toBe(1)
    expect(nodes[0]).toBeInstanceOf(Node)
  })

  it('should get all edges from the model', () => {
    const model = new Model()
    model.addNode({ shape: 'rect' })
    model.addEdge({ shape: 'edge' })
    const edges = model.getEdges()
    expect(edges.length).toBe(1)
    expect(edges[0]).toBeInstanceOf(Edge)
  })

  it('should get outgoing edges for a cell', () => {
    const model = new Model()
    const node = model.addNode({ id: 'node1', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const edges = model.getOutgoingEdges(node)
    expect(edges).not.toBeNull()
    expect(edges!.length).toBe(1)
  })

  it('should get incoming edges for a cell', () => {
    const model = new Model()
    const node = model.addNode({ id: 'node1', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node2',
      target: 'node1',
    })
    const edges = model.getIncomingEdges(node)
    expect(edges).not.toBeNull()
    expect(edges!.length).toBe(1)
  })

  it('should get connected edges for a cell', () => {
    const model = new Model()
    const node = model.addNode({ id: 'node1', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const edges = model.getConnectedEdges(node)
    expect(edges.length).toBe(1)
  })

  it('should get roots', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const roots = model.getRoots()
    expect(roots.length).toBe(1)
    expect(roots[0]).toBe(node1)
  })

  it('should get leafs', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const leafs = model.getLeafs()
    expect(leafs.length).toBe(1)
    expect(leafs[0]).toBe(node2)
  })

  it('should check if a cell is a root', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    expect(model.isRoot(node1)).toBe(true)
    expect(model.isRoot(node2)).toBe(false)
  })

  it('should check if a cell is a leaf', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    expect(model.isLeaf(node1)).toBe(false)
    expect(model.isLeaf(node2)).toBe(true)
  })

  it('should get neighbors', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const neighbors = model.getNeighbors(node1)
    expect(neighbors.length).toBe(1)
    expect(neighbors[0]).toBe(node2)
  })

  it('should check if a cell is a neighbor', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    expect(model.isNeighbor(node1, node2)).toBe(true)
    expect(model.isNeighbor(node2, node1)).toBe(true)
  })

  it('should get successors', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const successors = model.getSuccessors(node1)
    expect(successors.length).toBe(1)
    expect(successors[0]).toBe(node2)
  })

  it('should check if a cell is a successor', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    expect(model.isSuccessor(node1, node2)).toBe(true)
    expect(model.isSuccessor(node2, node1)).toBe(false)
  })

  it('should get predecessors', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const predecessors = model.getPredecessors(node2)
    expect(predecessors.length).toBe(1)
    expect(predecessors[0]).toBe(node1)
  })

  it('should check if a cell is a predecessor', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    expect(model.isPredecessor(node2, node1)).toBe(true)
    expect(model.isPredecessor(node1, node2)).toBe(false)
  })

  it('should get common ancestor', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    const ancestor = model.getCommonAncestor(node1, node2)
    expect(ancestor).toBeNull()
  })

  it('should get subgraph', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    const edge1 = model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const subgraph = model.getSubGraph([node1, node2])
    expect(subgraph.length).toBe(3)
    expect(subgraph).toContain(node1)
    expect(subgraph).toContain(node2)
    expect(subgraph).toContain(edge1)
  })

  it('should clone subgraph', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const cloned = model.cloneSubGraph([node1, node2])
    expect(Object.keys(cloned).length).toBe(3)
  })

  it('should get nodes from point', () => {
    const model = new Model()
    const node1 = model.addNode({
      id: 'node1',
      shape: 'rect',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
    })
    const nodes = model.getNodesFromPoint(20, 20)
    expect(nodes.length).toBe(1)
    expect(nodes[0]).toBe(node1)
  })

  it('should get nodes in area', () => {
    const model = new Model()
    const node1 = model.addNode({
      id: 'node1',
      shape: 'rect',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
    })
    const nodes = model.getNodesInArea(10, 10, 50, 50)
    expect(nodes.length).toBe(1)
    expect(nodes[0]).toBe(node1)
  })

  it('should get edges in area', () => {
    const model = new Model()
    const edge1 = model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: { x: 10, y: 10 },
      target: { x: 60, y: 60 },
    })
    const edges = model.getEdgesInArea(10, 10, 50, 50)
    expect(edges.length).toBe(1)
    expect(edges[0]).toBe(edge1)
  })

  it('should get nodes under node', () => {
    const model = new Model()
    const node1 = model.addNode({
      id: 'node1',
      shape: 'rect',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
    })
    const node2 = model.addNode({
      id: 'node2',
      shape: 'rect',
      x: 20,
      y: 20,
      width: 30,
      height: 30,
    })
    node2.setParent(node1)
    const nodes = model.getNodesUnderNode(node1)
    expect(nodes.length).toBe(0)
  })

  it('should get all cells bbox', () => {
    const model = new Model()
    const node1 = model.addNode({
      id: 'node1',
      shape: 'rect',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
    })
    const bbox = model.getAllCellsBBox()
    expect(bbox).toEqual(node1.getBBox())
  })

  it('should get cells bbox', () => {
    const model = new Model()
    const node1 = model.addNode({
      id: 'node1',
      shape: 'rect',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
    })
    const bbox = model.getCellsBBox([node1])
    expect(bbox).toEqual(node1.getBBox())
  })

  it('should breadth first search', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const iterator = vi.fn()
    model.breadthFirstSearch(node1, iterator)
    expect(iterator).toHaveBeenCalledTimes(2)
  })

  it('should depth first search', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const iterator = vi.fn()
    model.depthFirstSearch(node1, iterator)
    expect(iterator).toHaveBeenCalledTimes(2)
  })

  it('should get shortest path', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })
    const path = model.getShortestPath(node1, node2)
    expect(path).toEqual(['node1', 'node2'])
  })

  it('should translate', () => {
    const model = new Model()
    const node1 = model.addNode({
      id: 'node1',
      shape: 'rect',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
    })
    const translateSpy = vi.spyOn(node1, 'translate')
    model.translate(10, 10, {})
    expect(translateSpy).toHaveBeenCalledWith(10, 10, {
      translateBy: 'node1',
      tx: 10,
      ty: 10,
    })
  })

  it('should resize', () => {
    const model = new Model()
    const node1 = model.addNode({
      id: 'node1',
      shape: 'rect',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
    })
    const scaleSpy = vi.spyOn(node1, 'scale')
    model.resize(100, 100, {})
    expect(scaleSpy).toHaveBeenCalled()
  })

  it('should resize cells', () => {
    const model = new Model()
    const node1 = model.addNode({
      id: 'node1',
      shape: 'rect',
      x: 10,
      y: 10,
      width: 50,
      height: 50,
    })
    const scaleSpy = vi.spyOn(node1, 'scale')
    model.resizeCells(100, 100, [node1], {})
    expect(scaleSpy).toHaveBeenCalled()
  })

  it('should parseJSON', () => {
    const model = new Model()
    const cells = model.parseJSON({
      cells: [
        {
          id: 'node1',
          shape: 'rect',
          x: 10,
          y: 10,
          width: 50,
          height: 50,
        },
      ],
    })
    expect(cells.length).toBe(1)
    expect(cells[0]).toBeInstanceOf(Node)
  })

  it('should fromJSON', () => {
    const model = new Model()
    model.fromJSON({
      cells: [
        {
          id: 'node1',
          shape: 'rect',
          x: 10,
          y: 10,
          width: 50,
          height: 50,
        },
      ],
    })
    expect(model.total()).toBe(1)
  })

  it('should start batch', () => {
    const model = new Model()
    const notifySpy = vi.spyOn(model, 'notify')
    model.startBatch('test', { value: 'test' })
    expect(model.hasActiveBatch('test')).toBe(true)
    expect(notifySpy).toHaveBeenCalledWith('batch:start', {
      name: 'test',
      data: { value: 'test' },
    })
  })

  it('should stop batch', () => {
    const model = new Model()
    model.startBatch('test', { value: 'test' })
    const notifySpy = vi.spyOn(model, 'notify')
    model.stopBatch('test', { value: 'test' })
    expect(model.hasActiveBatch('test')).toBe(false)
    expect(notifySpy).toHaveBeenCalledWith('batch:stop', {
      name: 'test',
      data: { value: 'test' },
    })
  })

  it('should batch update', () => {
    const model = new Model()
    const startBatchSpy = vi.spyOn(model, 'startBatch')
    const stopBatchSpy = vi.spyOn(model, 'stopBatch')
    const result = model.batchUpdate('test', () => 'result', { value: 'test' })
    expect(startBatchSpy).toHaveBeenCalledWith('test', { value: 'test' })
    expect(stopBatchSpy).toHaveBeenCalledWith('test', { value: 'test' })
    expect(result).toBe('result')
  })

  it('should has active batch', () => {
    const model = new Model()
    model.startBatch('test')
    expect(model.hasActiveBatch('test')).toBe(true)
    model.stopBatch('test')
    expect(model.hasActiveBatch('test')).toBe(false)
  })

  it('should dispose', () => {
    const model = new Model()
    const collectionDisposeSpy = vi.spyOn(model.collection, 'dispose')
    model.dispose()
    expect(collectionDisposeSpy).toHaveBeenCalled()
  })

  it('Model.isModel should return true for Model instances', () => {
    const model = new Model()
    expect(Model.isModel(model)).toBe(true)
  })

  it('Model.isModel should return false for non-Model instances', () => {
    expect(Model.isModel({})).toBe(false)
    expect(Model.isModel(null)).toBe(false)
    expect(Model.isModel(undefined)).toBe(false)
  })

  it('clear method should remove all cells from the model', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })
    const edge1 = model.addEdge({
      id: 'edge1',
      shape: 'edge',
      source: 'node1',
      target: 'node2',
    })

    expect(model.getCells().length).toBe(3)
    model.clear()
    expect(model.getCells().length).toBe(0)
    expect(model.has(node1)).toBe(false)
    expect(model.has(node2)).toBe(false)
    expect(model.has(edge1)).toBe(false)
  })

  it('resetCells method should reset the cells in the model', () => {
    const model = new Model()
    const node1 = model.addNode({ id: 'node1', shape: 'rect' })
    const node2 = model.addNode({ id: 'node2', shape: 'rect' })

    expect(model.getCells().length).toBe(2)

    const newCells = [
      new Node({ id: 'node3', shape: 'rect' }),
      new Node({ id: 'node4', shape: 'rect' }),
    ]

    model.resetCells(newCells)

    expect(model.getCells().length).toBe(2)
    expect(model.getCell('node3')).toBeInstanceOf(Node)
    expect(model.getCell('node4')).toBeInstanceOf(Node)
  })
})
