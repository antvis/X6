import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CoordManager } from '../../src/graph/coord'
import { Graph } from '../../src/graph'
import { Point, Rectangle } from '../../src/geometry'

describe('CoordManager', () => {
  let graph: Graph
  let coord: CoordManager

  beforeEach(() => {
    const container = document.createElement('div')
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const stage = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    svg.appendChild(stage)
    const mockMatrix = {
      multiply: vi.fn().mockReturnThis(),
      inverse: vi.fn().mockReturnThis(),
    }
    graph = new Graph({ container })
    graph.view = {
      svg,
      stage,
    } as any

    vi.spyOn(graph, 'matrix').mockReturnValue({
      inverse: () => ({ multiply: vi.fn(), inverse: () => ({}) }),
      multiply: vi.fn().mockReturnValue(mockMatrix),
    } as any)

    coord = new CoordManager(graph)
  })

  it('getClientMatrix should return SVG matrix', () => {
    const m = coord.getClientMatrix()
    expect(m).toBeDefined()
  })

  it('getClientOffset should return Point from svg.getBoundingClientRect', () => {
    const rectSpy = vi
      .spyOn(coord.view.svg, 'getBoundingClientRect')
      .mockReturnValue({
        left: 10,
        top: 20,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as any)
    const p = coord.getClientOffset()
    expect(p).toBeInstanceOf(Point)
    expect(p.x).toBe(10)
    expect(p.y).toBe(20)
    rectSpy.mockRestore()
  })

  it('getPageOffset should return client offset plus scroll', () => {
    vi.spyOn(coord, 'getClientOffset').mockReturnValue(new Point(5, 5))
    vi.stubGlobal('scrollX', 2)
    vi.stubGlobal('scrollY', 3)
    const p = coord.getPageOffset()
    expect(p.x).toBe(7)
    expect(p.y).toBe(8)
  })

  it('snapToGrid should snap Point/number to grid', () => {
    vi.spyOn(graph, 'getGridSize').mockReturnValue(10)
    vi.spyOn(coord, 'clientToLocalPoint').mockReturnValue(new Point(12, 18))
    const p = coord.snapToGrid(12, 18)
    expect(p.x % 10).toBe(0)
    expect(p.y % 10).toBe(0)
    const point = new Point(15, 25)
    const p2 = coord.snapToGrid(point)
    expect(p2).toBeInstanceOf(Point)
  })

  it('localToGraphPoint should transform point using graph matrix', () => {
    const pt = coord.localToGraphPoint(1, 2)
    expect(pt).toBeInstanceOf(Point)
  })

  it('localToClientPoint should transform point using client matrix', () => {
    const pt = coord.localToClientPoint(1, 2)
    expect(pt).toBeInstanceOf(Point)
  })

  it('localToPagePoint should add page offset', () => {
    vi.spyOn(coord, 'localToGraphPoint').mockReturnValue(new Point(5, 5))
    vi.spyOn(coord, 'getPageOffset').mockReturnValue(new Point(2, 3))
    const pt = coord.localToPagePoint(1, 1)
    expect(pt.x).toBe(7)
    expect(pt.y).toBe(8)
  })

  it('localToGraphRect should transform rectangle', () => {
    const rect = coord.localToGraphRect(1, 2, 3, 4)
    expect(rect).toBeInstanceOf(Rectangle)
  })

  it('localToClientRect should transform rectangle', () => {
    const rect = coord.localToClientRect(1, 2, 3, 4)
    expect(rect).toBeInstanceOf(Rectangle)
  })

  it('localToPageRect should add page offset', () => {
    vi.spyOn(coord, 'localToGraphRect').mockReturnValue(
      new Rectangle(1, 2, 3, 4),
    )
    vi.spyOn(coord, 'getPageOffset').mockReturnValue(new Point(1, 1))
    const rect = coord.localToPageRect(1, 2, 3, 4)
    expect(rect.x).toBe(2)
    expect(rect.y).toBe(3)
  })

  it('graphToLocalPoint should inverse transform', () => {
    const pt = coord.graphToLocalPoint(1, 2)
    expect(pt).toBeInstanceOf(Point)
  })

  it('clientToLocalPoint should inverse client matrix', () => {
    const pt = coord.clientToLocalPoint(1, 2)
    expect(pt).toBeInstanceOf(Point)
  })

  it('clientToGraphPoint should combine graph and client matrix', () => {
    const pt = coord.clientToGraphPoint(1, 2)
    expect(pt).toBeInstanceOf(Point)
  })

  it('pageToLocalPoint should diff page offset and transform', () => {
    vi.spyOn(coord, 'getPageOffset').mockReturnValue(new Point(1, 1))
    const pt = coord.pageToLocalPoint(2, 3)
    expect(pt).toBeInstanceOf(Point)
  })

  it('graphToLocalRect should inverse transform rectangle', () => {
    const rect = coord.graphToLocalRect(1, 2, 3, 4)
    expect(rect).toBeInstanceOf(Rectangle)
  })

  it('clientToLocalRect should inverse client matrix', () => {
    const rect = coord.clientToLocalRect(1, 2, 3, 4)
    expect(rect).toBeInstanceOf(Rectangle)
  })

  it('clientToGraphRect should combine graph and client matrix', () => {
    const rect = coord.clientToGraphRect(1, 2, 3, 4)
    expect(rect).toBeInstanceOf(Rectangle)
  })

  it('pageToLocalRect should diff page offset and inverse transform', () => {
    vi.spyOn(coord, 'getPageOffset').mockReturnValue(new Point(1, 1))
    const rect = coord.pageToLocalRect(2, 3, 4, 5)
    expect(rect).toBeInstanceOf(Rectangle)
  })
})
