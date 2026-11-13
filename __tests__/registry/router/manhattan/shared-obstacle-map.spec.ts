import { describe, expect, it } from 'vitest'
import { Model, Node } from '../../../../src'
import { Line, Point, Rectangle } from '../../../../src/geometry'
import { getSharedObstacleMap } from '../../../../src/registry/router/manhattan/obstacle-map'
import {
  defaults,
  type ManhattanRouterOptions,
  resolveOptions,
} from '../../../../src/registry/router/manhattan/options'
import { router } from '../../../../src/registry/router/manhattan/router'
import type { EdgeView } from '../../../../src/view'

function options(overrides: Partial<ManhattanRouterOptions> = {}) {
  return resolveOptions({ ...defaults, padding: 0, ...overrides })
}

function addNode(model: Model, id: string, x: number) {
  return model.addNode({ id, shape: 'rect', x, y: 0, width: 40, height: 40 })
}

describe('shared Manhattan obstacle map', () => {
  it('shares the map across edges with equivalent exclusions', () => {
    const model = new Model()
    const a = addNode(model, 'a', 0)
    const b = addNode(model, 'b', 100)
    const c = addNode(model, 'c', 200)
    const first = model.addEdge({ source: a, target: b })
    const second = model.addEdge({ source: b, target: c })
    const resolved = options()

    const map = getSharedObstacleMap(model, first, resolved)
    expect(getSharedObstacleMap(model, second, resolved)).toBe(map)
    expect(map.isAccessible(new Point(20, 20))).toBe(false)
  })

  it("does not reuse another edge's excluded terminals", () => {
    const model = new Model()
    const a = addNode(model, 'a', 0)
    const b = addNode(model, 'b', 100)
    const c = addNode(model, 'c', 200)
    const first = model.addEdge({ source: a, target: b })
    const second = model.addEdge({ source: b, target: c })
    const resolved = options({ excludeTerminals: ['source', 'target'] })

    expect(
      getSharedObstacleMap(model, first, resolved).isAccessible(
        new Point(20, 20),
      ),
    ).toBe(true)
    const secondMap = getSharedObstacleMap(model, second, resolved)
    expect(secondMap.isAccessible(new Point(20, 20))).toBe(false)
    expect(secondMap.isAccessible(new Point(220, 20))).toBe(true)
    const firstAgain = getSharedObstacleMap(model, first, resolved)
    expect(firstAgain.isAccessible(new Point(20, 20))).toBe(true)
    expect(firstAgain.isAccessible(new Point(220, 20))).toBe(false)
  })

  it('routes around a node previously excluded for another edge', () => {
    const model = new Model()
    const obstacle = addNode(model, 'obstacle', 0)
    const first = model.addEdge({ source: obstacle, target: { x: 210, y: 20 } })
    const second = model.addEdge({
      source: { x: -90, y: 20 },
      target: { x: 210, y: 20 },
    })
    const rawOptions: ManhattanRouterOptions = {
      ...defaults,
      padding: 10,
      snapToGrid: false,
      excludeTerminals: ['source'],
      fallbackRouter() {
        throw new Error('The unobstructed detour should not require fallback')
      },
    }
    getSharedObstacleMap(model, first, resolveOptions(rawOptions))
    const view = {
      cell: second,
      graph: { model },
      sourceBBox: new Rectangle(-100, 10, 20, 20),
      targetBBox: new Rectangle(200, 10, 20, 20),
      sourceAnchor: new Point(-90, 20),
      targetAnchor: new Point(210, 20),
    } as EdgeView

    const vertices = router.call(view, [], rawOptions, view) as Point[]
    expect(vertices.some((point) => point.y !== 20)).toBe(true)
    const points = [view.sourceAnchor, ...vertices, view.targetAnchor]
    const paddedObstacle = obstacle.getBBox().inflate(10)
    points.slice(1).forEach((point, index) => {
      const previous = points[index]
      expect(point.x === previous.x || point.y === previous.y).toBe(true)
      expect(new Line(previous, point).intersect(paddedObstacle)).toBeNull()
    })
  })

  it('keeps terminal ancestors specific to each edge with default options', () => {
    const model = new Model()
    const firstParent = addNode(model, 'first-parent', 0)
    const secondParent = addNode(model, 'second-parent', 200)
    const a = addNode(model, 'a', 400)
    const b = addNode(model, 'b', 500)
    const target = addNode(model, 'target', 600)
    firstParent.addChild(a)
    secondParent.addChild(b)
    const first = model.addEdge({ source: a, target })
    const second = model.addEdge({ source: b, target })
    const resolved = options()

    expect(
      getSharedObstacleMap(model, first, resolved).isAccessible(
        new Point(20, 20),
      ),
    ).toBe(true)
    const map = getSharedObstacleMap(model, second, resolved)
    expect(map.isAccessible(new Point(20, 20))).toBe(false)
    expect(map.isAccessible(new Point(220, 20))).toBe(true)
  })

  it('updates ancestor exclusions after reparenting a terminal', () => {
    const model = new Model()
    const firstParent = addNode(model, 'first-parent', 0)
    const secondParent = addNode(model, 'second-parent', 200)
    const source = addNode(model, 'source', 400)
    const target = addNode(model, 'target', 600)
    firstParent.addChild(source)
    const edge = model.addEdge({ source, target })
    const resolved = options()
    getSharedObstacleMap(model, edge, resolved)

    secondParent.addChild(source)
    const map = getSharedObstacleMap(model, edge, resolved)
    expect(map.isAccessible(new Point(20, 20))).toBe(false)
    expect(map.isAccessible(new Point(220, 20))).toBe(true)
  })

  it('rebuilds when an obstacle is hidden and shown', () => {
    const model = new Model()
    const obstacle = addNode(model, 'obstacle', 0)
    const edge = model.addEdge({
      source: { x: -100, y: 20 },
      target: { x: 100, y: 20 },
    })
    const resolved = options()
    expect(
      getSharedObstacleMap(model, edge, resolved).isAccessible(
        new Point(20, 20),
      ),
    ).toBe(false)

    obstacle.hide()
    expect(
      getSharedObstacleMap(model, edge, resolved).isAccessible(
        new Point(20, 20),
      ),
    ).toBe(true)
    obstacle.show()
    expect(
      getSharedObstacleMap(model, edge, resolved).isAccessible(
        new Point(20, 20),
      ),
    ).toBe(false)
  })

  it('rebuilds when a node changes to an excluded shape', () => {
    const model = new Model()
    const obstacle = addNode(model, 'obstacle', 0)
    const edge = model.addEdge({
      source: { x: -100, y: 20 },
      target: { x: 100, y: 20 },
    })
    const resolved = options({ excludeShapes: ['circle'] })
    expect(
      getSharedObstacleMap(model, edge, resolved).isAccessible(
        new Point(20, 20),
      ),
    ).toBe(false)

    obstacle.setProp('shape', 'circle')
    expect(
      getSharedObstacleMap(model, edge, resolved).isAccessible(
        new Point(20, 20),
      ),
    ).toBe(true)
  })

  it('distinguishes excluded node IDs containing cache-key delimiters', () => {
    const model = new Model()
    addNode(model, 'a|b', 0)
    addNode(model, 'a', 100)
    addNode(model, 'b', 200)
    const edge = model.addEdge({
      source: { x: -100, y: 20 },
      target: { x: 300, y: 20 },
    })
    getSharedObstacleMap(model, edge, options({ excludeNodes: ['a|b'] }))

    const map = getSharedObstacleMap(
      model,
      edge,
      options({ excludeNodes: ['a', 'b'] }),
    )
    expect(map.isAccessible(new Point(20, 20))).toBe(false)
    expect(map.isAccessible(new Point(120, 20))).toBe(true)
  })

  it('distinguishes an indexed node exclusion from a foreign node with the same ID', () => {
    const model = new Model()
    const obstacle = addNode(model, 'obstacle', 0)
    const foreign = new Node({ id: obstacle.id, shape: 'rect' })
    const edge = model.addEdge({
      source: { x: -100, y: 20 },
      target: { x: 100, y: 20 },
    })

    const excluded = getSharedObstacleMap(
      model,
      edge,
      options({ excludeNodes: [obstacle] }),
    )
    expect(excluded.isAccessible(new Point(20, 20))).toBe(true)
    const included = getSharedObstacleMap(
      model,
      edge,
      options({ excludeNodes: [foreign] }),
    )
    expect(included.isAccessible(new Point(20, 20))).toBe(false)
    const equivalent = getSharedObstacleMap(model, edge, options())
    expect(equivalent).toBe(included)
    const byId = getSharedObstacleMap(
      model,
      edge,
      options({ excludeNodes: [obstacle.id] }),
    )
    expect(byId.isAccessible(new Point(20, 20))).toBe(true)
  })

  it('retains invalidation on position and size changes', () => {
    const model = new Model()
    const obstacle = addNode(model, 'obstacle', 0)
    const edge = model.addEdge({
      source: { x: -100, y: 20 },
      target: { x: 300, y: 20 },
    })
    const resolved = options()
    getSharedObstacleMap(model, edge, resolved)

    obstacle.position(100, 0)
    const moved = getSharedObstacleMap(model, edge, resolved)
    expect(moved.isAccessible(new Point(20, 20))).toBe(true)
    expect(moved.isAccessible(new Point(120, 20))).toBe(false)
    obstacle.resize(140, 40)
    expect(
      getSharedObstacleMap(model, edge, resolved).isAccessible(
        new Point(220, 20),
      ),
    ).toBe(false)
  })
})
