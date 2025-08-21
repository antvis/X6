import { expect, vi } from 'vitest'
import { createTestGraph, toSVG } from '../utils'

describe('Graph: 基础节点/边操作', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())
  const dir = `${__dirname}/__snapshots__`
  it('addNode / getCell / removeNode', async () => {
    const { graph, cleanup } = createTestGraph()

    const node = graph.addNode({
      id: 'n1',
      x: 40,
      y: 50,
      width: 120,
      height: 40,
      label: 'Hello',
      attrs: { body: { stroke: '#333' } },
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
    const { graph: g1, cleanup: c1 } = createTestGraph()
    g1.addNode({
      id: 'n1',
      x: 10,
      y: 20,
      width: 80,
      height: 40,
      attrs: { body: { fill: '#f00' } },
    })
    g1.addNode({
      id: 'n2',
      x: 150,
      y: 20,
      width: 80,
      height: 40,
      attrs: { body: { fill: '#0f0' } },
    })
    g1.addEdge({
      id: 'e1',
      source: 'n1',
      target: 'n2',
      labels: [{ attrs: { label: { text: 'Hello' } } }],
    })
    const json = g1.toJSON()
    const { graph: g2, cleanup: c2 } = createTestGraph()
    g2.fromJSON(json)
    const json2 = g2.toJSON()
    expect(json2).toEqual(json)
    c1()
    c2()
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

    // 用端口 id 连接
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
    vi.useRealTimers()
    const { graph, cleanup } = createTestGraph({
      // connecting: { router: { name: 'manhattan' }, connector: 'rounded' },
    })
    graph.addNode({ id: 'a', x: 60, y: 60, width: 80, height: 40, label: 'A' })
    graph.addNode({
      id: 'b',
      x: 260,
      y: 200,
      width: 80,
      height: 40,
      label: 'B',
    })

    graph.addEdge({
      id: 'e1',
      source: 'a',
      target: 'b',
      labels: [{ attrs: { label: { text: 'A→B' } } }],
    })

    expect(graph.getCellById('e1')).toBeTruthy()
    const svg = await toSVG(graph)
    expect(svg).toMatchFileSnapshot(`${dir}/graph.svg`)

    cleanup()
  })
})
