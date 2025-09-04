import * as sinon from 'sinon'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Line, Path, Point } from '../../../src/geometry'
import type { Edge } from '../../../src/model'
import {
  buildPath,
  buildRoundedSegment,
  createJumps,
  createLines,
  findLineIntersections,
  getDistence,
  jumpover,
  setupUpdating,
} from '../../../src/registry/connector/jumpover'
import type { EdgeView } from '../../../src/view'

describe('jumpover connector', () => {
  let mockGraph: any
  let mockView: EdgeView
  let mockCell: Edge

  beforeEach(() => {
    mockGraph = {
      on: vi.fn(),
      findViewByCell: vi.fn(),
      model: {
        getEdges: vi.fn(() => []),
      },
      options: {
        connecting: {
          connector: {},
        },
      },
    }

    mockCell = {
      once: vi.fn(),
      getConnector: vi.fn(() => ({ name: 'jumpover' })),
    } as any

    mockView = {
      graph: mockGraph,
      cell: mockCell,
      sourcePoint: new Point(0, 0),
      targetPoint: new Point(100, 100),
      routePoints: [],
      update: vi.fn(),
    } as any
  })

  describe('setupUpdating', () => {
    it('should initialize update list on first call', () => {
      setupUpdating(mockView)

      expect(mockGraph._jumpOverUpdateList).toBeDefined()
      expect(mockGraph.on).toHaveBeenCalledWith(
        'cell:mouseup',
        expect.any(Function),
      )
      expect(mockGraph.on).toHaveBeenCalledWith(
        'model:reseted',
        expect.any(Function),
      )
    })

    it('should add view to existing update list', () => {
      mockGraph._jumpOverUpdateList = []
      setupUpdating(mockView)

      expect(mockGraph._jumpOverUpdateList).toContain(mockView)
    })

    it('should not add view twice', () => {
      mockGraph._jumpOverUpdateList = [mockView]
      setupUpdating(mockView)

      expect(mockGraph._jumpOverUpdateList.length).toBe(1)
    })

    it('should setup cleanup on cell events', () => {
      setupUpdating(mockView)

      expect(mockCell.once).toHaveBeenCalledWith(
        'change:connector',
        expect.any(Function),
      )
      expect(mockCell.once).toHaveBeenCalledWith(
        'removed',
        expect.any(Function),
      )
    })

    it('should reset update list on model reset', () => {
      setupUpdating(mockView)

      const resetHandler = mockGraph.on.mock.calls.find(
        (call) => call[0] === 'model:reseted',
      )[1]
      resetHandler()

      expect(mockGraph._jumpOverUpdateList).toEqual([])
    })
  })

  describe('createLines', () => {
    it('should create lines from points', () => {
      const sourcePoint = new Point(0, 0)
      const targetPoint = new Point(100, 100)
      const route = [new Point(50, 0), new Point(50, 100)]

      const lines = createLines(sourcePoint, targetPoint, route)

      expect(lines).toHaveLength(3)
      expect(lines[0]).toBeInstanceOf(Line)
      expect(lines[0].start).toEqual(sourcePoint)
      expect(lines[0].end).toEqual(route[0])
    })

    it('should work with empty route', () => {
      const sourcePoint = new Point(0, 0)
      const targetPoint = new Point(100, 100)

      const lines = createLines(sourcePoint, targetPoint)

      expect(lines).toHaveLength(1)
      expect(lines[0].start).toEqual(sourcePoint)
      expect(lines[0].end).toEqual(targetPoint)
    })
  })

  describe('findLineIntersections', () => {
    it('should find intersections between lines', () => {
      const line = new Line(new Point(0, 50), new Point(100, 50))
      const crossLines = [new Line(new Point(50, 0), new Point(50, 100))]

      const intersections = findLineIntersections(line, crossLines)

      expect(intersections).toHaveLength(1)
      expect(intersections[0]).toEqual(new Point(50, 50))
    })

    it('should ignore intersections at start points', () => {
      const line = new Line(new Point(0, 0), new Point(100, 100))
      const crossLines = [new Line(new Point(0, 0), new Point(50, 50))]

      const intersections = findLineIntersections(line, crossLines)

      expect(intersections).toHaveLength(0)
    })

    it('should ignore intersections at end points', () => {
      const line = new Line(new Point(0, 0), new Point(100, 100))
      const crossLines = [new Line(new Point(50, 50), new Point(100, 100))]

      const intersections = findLineIntersections(line, crossLines)

      expect(intersections).toHaveLength(0)
    })

    it('should return empty array when no intersections', () => {
      const line = new Line(new Point(0, 0), new Point(100, 0))
      const crossLines = [new Line(new Point(0, 50), new Point(100, 50))]

      const intersections = findLineIntersections(line, crossLines)

      expect(intersections).toHaveLength(0)
    })
  })

  describe('getDistence', () => {
    it('should calculate squared distance between points', () => {
      const p1 = new Point(0, 0)
      const p2 = new Point(3, 4)

      const distance = getDistence(p1, p2)

      expect(distance).toBe(25) // 3^2 + 4^2 = 25
    })
  })

  describe('createJumps', () => {
    it('should create jumps at intersection points', () => {
      const line = new Line(new Point(0, 0), new Point(100, 0))
      const intersections = [new Point(50, 0)]
      const jumpSize = 5

      const jumps = createJumps(line, intersections, jumpSize)

      expect(jumps).toHaveLength(3)
    })

    it('should handle close intersections by merging', () => {
      const line = new Line(new Point(0, 0), new Point(100, 0))
      const intersections = [new Point(50, 0), new Point(52, 0)]
      const jumpSize = 5

      const jumps = createJumps(line, intersections, jumpSize)

      expect(jumps.length).toBeGreaterThan(0)
    })

    it('should handle jump too close to start', () => {
      const line = new Line(new Point(0, 0), new Point(100, 0))
      const intersections = [new Point(5, 0)]
      const jumpSize = 10

      const jumps = createJumps(line, intersections, jumpSize)

      expect(jumps).toContain(line)
    })

    it('should handle jump too close to end', () => {
      const line = new Line(new Point(0, 0), new Point(100, 0))
      const intersections = [new Point(95, 0)]
      const jumpSize = 10

      const jumps = createJumps(line, intersections, jumpSize)

      expect(jumps).toContain(line)
    })
  })

  describe('buildPath', () => {
    it('should build path with arc jumps', () => {
      const lines = [new Line(new Point(0, 0), new Point(100, 0))]
      const path = buildPath(lines, 5, 'arc', 0)

      expect(path).toBeInstanceOf(Path)
    })

    it('should build path with gap jumps', () => {
      const lines = [new Line(new Point(0, 0), new Point(100, 0))]
      const path = buildPath(lines, 5, 'gap', 0)

      expect(path).toBeInstanceOf(Path)
    })

    it('should build path with cubic jumps', () => {
      const lines = [new Line(new Point(0, 0), new Point(100, 0))]
      const path = buildPath(lines, 5, 'cubic', 0)

      expect(path).toBeInstanceOf(Path)
    })

    it('should handle rounded segments', () => {
      const lines = [
        new Line(new Point(0, 0), new Point(50, 0)),
        new Line(new Point(50, 0), new Point(50, 50)),
      ]
      const path = buildPath(lines, 5, 'arc', 10)

      expect(path).toBeInstanceOf(Path)
    })
  })

  describe('buildRoundedSegment', () => {
    it('should build rounded segment', () => {
      const path = new Path()
      const offset = 10
      const curr = new Point(50, 50)
      const prev = new Point(0, 50)
      const next = new Point(50, 0)

      buildRoundedSegment(offset, path, curr, prev, next)

      expect(path.segments.length).toBeGreaterThan(0)
    })
  })

  describe('jumpover', () => {
    beforeEach(() => {
      mockView.graph = mockGraph
      mockView.cell = mockCell
    })

    it('should handle multiple edges', () => {
      const otherCell = { getConnector: vi.fn(() => ({ name: 'jumpover' })) }
      const otherView = {
        sourcePoint: new Point(0, 100),
        targetPoint: new Point(100, 0),
        routePoints: [],
      }

      mockGraph.model.getEdges.mockReturnValue([mockCell, otherCell])
      mockGraph.findViewByCell.mockReturnValue(otherView)

      const result = jumpover.call(
        mockView,
        new Point(0, 0),
        new Point(100, 100),
        [],
        {},
      )

      expect(typeof result).toBe('string')
    })

    it('should filter ignored connectors', () => {
      const otherCell = { getConnector: vi.fn(() => ({ name: 'smooth' })) }
      mockGraph.model.getEdges.mockReturnValue([mockCell, otherCell])

      const result = jumpover.call(
        mockView,
        new Point(0, 0),
        new Point(100, 100),
        [],
        {
          ignoreConnectors: ['smooth'],
        },
      )

      expect(typeof result).toBe('string')
    })

    it('should return raw path when raw option is true', () => {
      mockGraph.model.getEdges.mockReturnValue([mockCell])

      const result = jumpover.call(
        mockView,
        new Point(0, 0),
        new Point(100, 100),
        [],
        { raw: true },
      )

      expect(result).toBeInstanceOf(Path)
    })

    it('should handle null view in linkViews', () => {
      const otherCell = { getConnector: vi.fn(() => ({ name: 'jumpover' })) }
      mockGraph.model.getEdges.mockReturnValue([mockCell, otherCell])
      mockGraph.findViewByCell.mockReturnValue(null)

      const result = jumpover.call(
        mockView,
        new Point(0, 0),
        new Point(100, 100),
        [],
        {},
      )

      expect(typeof result).toBe('string')
    })

    it('should filter edges by index and connector type', () => {
      const otherCell1 = { getConnector: vi.fn(() => ({ name: 'jumpover' })) }
      const otherCell2 = { getConnector: vi.fn(() => ({ name: 'normal' })) }
      mockGraph.model.getEdges.mockReturnValue([
        otherCell1,
        mockCell,
        otherCell2,
      ])

      const result = jumpover.call(
        mockView,
        new Point(0, 0),
        new Point(100, 100),
        [],
        {},
      )

      expect(typeof result).toBe('string')
    })

    it('should handle default connector from graph options', () => {
      const otherCell = { getConnector: vi.fn(() => null) }
      mockGraph.model.getEdges.mockReturnValue([mockCell, otherCell])
      mockGraph.options.connecting.connector = { name: 'default' }

      const result = jumpover.call(
        mockView,
        new Point(0, 0),
        new Point(100, 100),
        [],
        {},
      )

      expect(typeof result).toBe('string')
    })
  })
})
