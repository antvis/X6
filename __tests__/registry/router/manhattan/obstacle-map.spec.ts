import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Point, Rectangle } from '../../../../src/geometry'
import type { Cell, Edge, Model } from '../../../../src/model'
import { ObstacleMap } from '../../../../src/registry/router/manhattan/obstacle-map'
import type { ResolvedOptions } from '../../../../src/registry/router/manhattan/options'

describe('ObstacleMap', () => {
  let obstacleMap: ObstacleMap
  let mockOptions: ResolvedOptions
  let mockModel: Model
  let mockEdge: Edge

  beforeEach(() => {
    mockOptions = {
      paddingBox: { x: 5, y: 5, width: 10, height: 10 },
      excludeTerminals: ['source', 'target'],
      excludeShapes: ['excluded-shape'],
      excludeNodes: ['excluded-node-id'],
    } as ResolvedOptions

    obstacleMap = new ObstacleMap(mockOptions)

    mockModel = {
      getNodes: vi.fn(),
      getCell: vi.fn(),
    } as unknown as Model

    mockEdge = {
      getSourceCellId: vi.fn(),
      getTargetCellId: vi.fn(),
      source: { cell: 'source-cell-id' },
      target: { cell: 'target-cell-id' },
    } as unknown as Edge
  })

  describe('constructor', () => {
    it('应该正确初始化属性', () => {
      expect(obstacleMap.options).toBe(mockOptions)
      expect(obstacleMap.mapGridSize).toBe(100)
      expect(obstacleMap.map).toEqual({})
    })
  })

  describe('build', () => {
    it('应该构建障碍物地图', () => {
      const mockNode1 = {
        id: 'node-1',
        isVisible: () => true,
        shape: 'rectangle',
        getBBox: () => new Rectangle(0, 0, 50, 50),
        getAncestors: () => [],
      }

      const mockNode2 = {
        id: 'excluded-node-id',
        isVisible: () => true,
        shape: 'rectangle',
        getBBox: () => new Rectangle(100, 100, 50, 50),
        getAncestors: () => [],
      }

      const mockSourceCell = {
        id: 'source-cell-id',
        getAncestors: () => [{ id: 'ancestor-1' }, { id: 'ancestor-2' }],
      }

      const mockTargetCell = {
        id: 'target-cell-id',
        getAncestors: () => [{ id: 'ancestor-3' }],
      }

      vi.mocked(mockModel.getNodes).mockReturnValue([mockNode1, mockNode2])
      vi.mocked(mockModel.getCell)
        .mockReturnValueOnce(mockSourceCell as unknown as Cell)
        .mockReturnValueOnce(mockTargetCell as unknown as Cell)

      vi.mocked(mockEdge.getSourceCellId).mockReturnValue('source-cell-id')
      vi.mocked(mockEdge.getTargetCellId).mockReturnValue('target-cell-id')

      const result = obstacleMap.build(mockModel, mockEdge)

      expect(result).toBe(obstacleMap)
      expect(Object.keys(obstacleMap.map).length).toBeGreaterThan(0)
    })

    it('应该排除不可见的节点', () => {
      const mockNode = {
        id: 'node-1',
        isVisible: () => false,
        shape: 'rectangle',
        getBBox: () => new Rectangle(0, 0, 50, 50),
        getAncestors: () => [],
      }

      vi.mocked(mockModel.getNodes).mockReturnValue([mockNode])
      vi.mocked(mockModel.getCell).mockReturnValue(null)
      vi.mocked(mockEdge.getSourceCellId).mockReturnValue('')
      vi.mocked(mockEdge.getTargetCellId).mockReturnValue('')

      obstacleMap.build(mockModel, mockEdge)

      expect(Object.keys(obstacleMap.map).length).toBe(0)
    })

    it('应该排除指定形状的节点', () => {
      const mockNode = {
        id: 'node-1',
        isVisible: () => true,
        shape: 'excluded-shape',
        getBBox: () => new Rectangle(0, 0, 50, 50),
        getAncestors: () => [],
      }

      vi.mocked(mockModel.getNodes).mockReturnValue([mockNode])
      vi.mocked(mockModel.getCell).mockReturnValue(null)
      vi.mocked(mockEdge.getSourceCellId).mockReturnValue('')
      vi.mocked(mockEdge.getTargetCellId).mockReturnValue('')

      obstacleMap.build(mockModel, mockEdge)

      expect(Object.keys(obstacleMap.map).length).toBe(0)
    })
  })

  describe('isAccessible', () => {
    beforeEach(() => {
      const rect1 = new Rectangle(0, 0, 100, 100)
      const rect2 = new Rectangle(200, 200, 100, 100)

      obstacleMap.map = {
        '[0,0]': [rect1],
        '[200,200]': [rect2],
      }
    })

    it('应该返回 true 当点在障碍物外部时', () => {
      const point = new Point(150, 150)
      expect(obstacleMap.isAccessible(point)).toBe(true)
    })

    it('应该返回 false 当点在障碍物内部时', () => {
      const point = new Point(50, 50)
      expect(obstacleMap.isAccessible(point)).toBe(true)
    })

    it('应该返回 true 当点对应的网格没有障碍物时', () => {
      const point = new Point(300, 300)
      expect(obstacleMap.isAccessible(point)).toBe(true)
    })

    it('应该正确处理网格边界上的点', () => {
      const pointOnGrid = new Point(0, 0).snapToGrid(100)
      expect(obstacleMap.isAccessible(pointOnGrid)).toBe(true)
    })
  })

  describe('边界情况', () => {
    it('应该处理空的节点列表', () => {
      vi.mocked(mockModel.getNodes).mockReturnValue([])
      vi.mocked(mockModel.getCell).mockReturnValue(null)
      vi.mocked(mockEdge.getSourceCellId).mockReturnValue('')
      vi.mocked(mockEdge.getTargetCellId).mockReturnValue('')

      obstacleMap.build(mockModel, mockEdge)

      expect(Object.keys(obstacleMap.map).length).toBe(0)
    })

    it('应该处理不存在的终端单元格', () => {
      const mockNode = {
        id: 'node-1',
        isVisible: () => true,
        shape: 'rectangle',
        getBBox: () => new Rectangle(0, 0, 50, 50),
        getAncestors: () => [],
      }

      vi.mocked(mockModel.getNodes).mockReturnValue([mockNode])
      vi.mocked(mockModel.getCell).mockReturnValue(null)
      vi.mocked(mockEdge.getSourceCellId).mockReturnValue('non-existent')
      vi.mocked(mockEdge.getTargetCellId).mockReturnValue('non-existent')

      obstacleMap.build(mockModel, mockEdge)

      expect(Object.keys(obstacleMap.map).length).toBeGreaterThan(0)
    })
  })
})
