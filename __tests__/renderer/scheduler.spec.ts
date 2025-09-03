import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { JOB_PRIORITY, JobQueue } from '../../src/renderer/queueJob'
import { Scheduler } from '../../src/renderer/scheduler'
import { createTestGraph } from '../utils/graph-helpers'

describe('Scheduler', () => {
  let scheduler: Scheduler
  let mockGraph: ReturnType<typeof createTestGraph>['graph']
  let jobQueue: JobQueue
  let cleanup: () => void

  beforeEach(() => {
    const testGraph = createTestGraph()
    mockGraph = testGraph.graph
    cleanup = testGraph.cleanup
    scheduler = new Scheduler(mockGraph)
    jobQueue = new JobQueue()
    scheduler['queue'] = jobQueue
  })

  afterEach(() => {
    // Clear views before disposing to avoid errors with mock objects
    Object.keys(scheduler.views).forEach((id) => {
      delete scheduler.views[id]
    })
    scheduler.dispose()
    cleanup()
    vi.clearAllMocks()
  })

  describe('basic functionality', () => {
    it('should initialize correctly', () => {
      expect(scheduler.views).toEqual({})
      expect(scheduler.willRemoveViews).toEqual({})
    })

    it('should register model event listeners', () => {
      const model = mockGraph.model
      // Spy on the model's on method to verify it's called
      const onSpy = vi.spyOn(model, 'on')

      // Create a new scheduler to test initialization
      const testScheduler = new Scheduler(mockGraph)
      testScheduler['queue'] = jobQueue

      expect(onSpy).toHaveBeenCalledWith(
        'reseted',
        expect.any(Function),
        testScheduler,
      )
      expect(onSpy).toHaveBeenCalledWith(
        'cell:added',
        expect.any(Function),
        testScheduler,
      )
      expect(onSpy).toHaveBeenCalledWith(
        'cell:removed',
        expect.any(Function),
        testScheduler,
      )
      expect(onSpy).toHaveBeenCalledWith(
        'cell:change:zIndex',
        expect.any(Function),
        testScheduler,
      )
      expect(onSpy).toHaveBeenCalledWith(
        'cell:change:visible',
        expect.any(Function),
        testScheduler,
      )

      // Clean up
      testScheduler.dispose()
    })

    it('should handle model reset event', () => {
      const resetSpy = vi
        .spyOn(scheduler as any, 'resetViews')
        .mockImplementation(() => {})
      const renderSpy = vi
        .spyOn(scheduler as any, 'renderViews')
        .mockImplementation(() => {})
      const clearJobsSpy = vi.spyOn(jobQueue, 'clearJobs')

      // Trigger the reset event
      mockGraph.model.trigger('reseted', { options: {} })

      expect(clearJobsSpy).toHaveBeenCalled()
      expect(resetSpy).toHaveBeenCalled()
      expect(renderSpy).toHaveBeenCalledWith([], expect.any(Object))
    })

    it('should handle cell added event', () => {
      const renderSpy = vi
        .spyOn(scheduler as any, 'renderViews')
        .mockImplementation(() => {})

      // Create a real node instead of a mock cell
      const node = mockGraph.addNode({
        id: 'cell1',
        shape: 'rect',
        x: 100,
        y: 100,
        width: 80,
        height: 40,
      })

      expect(renderSpy).toHaveBeenCalledWith([node], expect.any(Object))
    })

    it('should handle cell removed event', () => {
      const mockCell = { id: 'cell1' } as any
      const removeSpy = vi
        .spyOn(scheduler as any, 'removeViews')
        .mockImplementation(() => {})

      // Trigger the cell removed event
      mockGraph.model.trigger('cell:removed', { cell: mockCell })

      expect(removeSpy).toHaveBeenCalledWith([mockCell])
    })

    it('should handle cell z-index change event', () => {
      const mockView: any = {
        cell: { id: 'cell1' },
        isNodeView: vi.fn(() => true),
        isEdgeView: vi.fn(() => false),
        hasAction: vi.fn(() => false),
        dispose: vi.fn(),
      }

      scheduler.views['cell1'] = {
        view: mockView,
        flag: 0,
        options: {},
        state: 1,
      }

      const requestViewUpdateSpy = vi.spyOn(scheduler, 'requestViewUpdate')

      // Trigger the cell z-index change event
      mockGraph.model.trigger('cell:change:zIndex', {
        cell: { id: 'cell1' } as any,
        options: {},
      })

      expect(requestViewUpdateSpy).toHaveBeenCalledWith(
        mockView,
        Scheduler['FLAG_INSERT'],
        {},
        JOB_PRIORITY.Update,
        true,
      )
    })

    it('should handle cell visibility change event', () => {
      const toggleVisibleSpy = vi.spyOn(scheduler as any, 'toggleVisible')

      // Trigger the cell visibility change event
      mockGraph.model.trigger('cell:change:visible', {
        cell: { id: 'cell1' } as any,
        current: true,
      })

      expect(toggleVisibleSpy).toHaveBeenCalledWith({ id: 'cell1' }, true)
    })
  })

  describe('view update requests', () => {
    it('should queue view updates correctly', () => {
      const queueJobSpy = vi.spyOn(jobQueue, 'queueJob')
      const mockView: any = {
        cell: { id: 'test-cell' },
        hasAction: vi.fn(() => false),
        getFlag: vi.fn(),
        confirmUpdate: vi.fn(),
        dispose: vi.fn(),
      }

      scheduler.views['test-cell'] = {
        view: mockView,
        flag: 0,
        options: {},
        state: 1,
      }

      scheduler.requestViewUpdate(mockView, 1, {}, JOB_PRIORITY.Update, false)

      expect(queueJobSpy).toHaveBeenCalledWith({
        id: 'test-cell',
        priority: JOB_PRIORITY.Update,
        cb: expect.any(Function),
      })
    })

    it('should use PRIOR priority for high-priority actions', () => {
      const queueJobSpy = vi.spyOn(jobQueue, 'queueJob')
      const mockView: any = {
        cell: { id: 'test-cell' },
        hasAction: vi.fn(() => true),
        getFlag: vi.fn(),
        confirmUpdate: vi.fn(),
        dispose: vi.fn(),
        isNodeView: vi.fn(() => true),
        isEdgeView: vi.fn(() => false),
      }

      scheduler.views['test-cell'] = {
        view: mockView,
        flag: 0,
        options: {},
        state: 1,
      }

      scheduler.requestViewUpdate(mockView, 1, {}, JOB_PRIORITY.Update, false)

      expect(queueJobSpy).toHaveBeenCalledWith({
        id: 'test-cell',
        priority: JOB_PRIORITY.PRIOR,
        cb: expect.any(Function),
      })
    })

    it('should skip non-existent views', () => {
      const queueJobSpy = vi.spyOn(jobQueue, 'queueJob')
      const mockView: any = {
        cell: { id: 'nonexistent' },
        hasAction: vi.fn(),
      }

      scheduler.requestViewUpdate(mockView, 1, {}, JOB_PRIORITY.Update, false)

      expect(queueJobSpy).not.toHaveBeenCalled()
    })
  })

  describe('view state management', () => {
    it('should check if view is mounted', () => {
      const mockView: any = {
        cell: { id: 'test-cell' },
        dispose: vi.fn(),
      }

      expect(scheduler.isViewMounted(mockView)).toBe(false)

      scheduler.views['test-cell'] = {
        view: mockView,
        flag: 0,
        options: {},
        state: 1, // MOUNTED
      }

      expect(scheduler.isViewMounted(mockView)).toBe(true)
    })
  })

  describe('cleanup', () => {
    it('should unregister event listeners on dispose', () => {
      const model = mockGraph.model
      // Spy on the model's off method to verify it's called
      const offSpy = vi.spyOn(model, 'off')

      scheduler.dispose()

      expect(offSpy).toHaveBeenCalledWith(
        'reseted',
        expect.any(Function),
        scheduler,
      )
      expect(offSpy).toHaveBeenCalledWith(
        'cell:added',
        expect.any(Function),
        scheduler,
      )
      expect(offSpy).toHaveBeenCalledWith(
        'cell:removed',
        expect.any(Function),
        scheduler,
      )
      expect(offSpy).toHaveBeenCalledWith(
        'cell:change:zIndex',
        expect.any(Function),
        scheduler,
      )
      expect(offSpy).toHaveBeenCalledWith(
        'cell:change:visible',
        expect.any(Function),
        scheduler,
      )
    })

    it('should dispose all views', () => {
      const mockView1: any = { dispose: vi.fn() }
      const mockView2: any = { dispose: vi.fn() }

      scheduler.views['cell1'] = {
        view: mockView1,
        flag: 0,
        options: {},
        state: 1,
      }
      scheduler.views['cell2'] = {
        view: mockView2,
        flag: 0,
        options: {},
        state: 1,
      }

      scheduler.dispose()

      expect(mockView1.dispose).toHaveBeenCalled()
      expect(mockView2.dispose).toHaveBeenCalled()
      expect(scheduler.views).toEqual({})
    })
  })

  describe('render area', () => {
    it('should set render area', () => {
      const mockArea: any = { isIntersectWithRect: vi.fn() }
      scheduler.setRenderArea(mockArea)

      expect(scheduler['renderArea']).toBe(mockArea)
    })

    it('should flush waiting views when setting render area', () => {
      const flushWaitingViewsSpy = vi.spyOn(
        scheduler as any,
        'flushWaitingViews',
      )
      const mockArea: any = { isIntersectWithRect: vi.fn() }

      scheduler.setRenderArea(mockArea)

      expect(flushWaitingViewsSpy).toHaveBeenCalled()
    })
  })

  describe('waiting views', () => {
    it('should flush waiting views', () => {
      const mockView: any = {
        cell: {
          id: 'test-cell',
          isNode: vi.fn(() => true),
          isEdge: vi.fn(() => false),
        },
        isNodeView: vi.fn(() => true),
        isEdgeView: vi.fn(() => false),
        hasAction: vi.fn(() => false),
        dispose: vi.fn(),
      }

      scheduler.views['test-cell'] = {
        view: mockView,
        flag: 0,
        options: {},
        state: 2, // WAITING
      }

      const requestViewUpdateSpy = vi.spyOn(scheduler, 'requestViewUpdate')
      const flushSpy = vi.spyOn(scheduler as any, 'flush')

      scheduler['flushWaitingViews']()

      expect(requestViewUpdateSpy).toHaveBeenCalledWith(
        mockView,
        0,
        {},
        JOB_PRIORITY.RenderNode,
        false,
      )
      expect(flushSpy).toHaveBeenCalled()
    })
  })

  describe('async handling', () => {
    it('should use async mode when enabled', () => {
      const queueFlushSpy = vi.spyOn(jobQueue, 'queueFlush')
      const queueFlushSyncSpy = vi.spyOn(jobQueue, 'queueFlushSync')
      mockGraph.options.async = true

      scheduler['flush']()

      expect(queueFlushSpy).toHaveBeenCalled()
      expect(queueFlushSyncSpy).not.toHaveBeenCalled()
    })

    it('should use sync mode when async is disabled', () => {
      const queueFlushSpy = vi.spyOn(jobQueue, 'queueFlush')
      const queueFlushSyncSpy = vi.spyOn(jobQueue, 'queueFlushSync')
      mockGraph.options.async = false

      scheduler['flush']()

      expect(queueFlushSyncSpy).toHaveBeenCalled()
      expect(queueFlushSpy).not.toHaveBeenCalled()
    })
  })

  describe('render priority', () => {
    it('should return RenderNode priority for node views', () => {
      const mockView: any = {
        cell: {
          isNode: vi.fn(() => true),
          isEdge: vi.fn(() => false),
        },
      }

      const priority = (scheduler as any).getRenderPriority(mockView)
      expect(priority).toBe(JOB_PRIORITY.RenderNode)
    })

    it('should return RenderEdge priority for edge views', () => {
      const mockView: any = {
        cell: {
          isNode: vi.fn(() => false),
          isEdge: vi.fn(() => true),
        },
      }

      const priority = (scheduler as any).getRenderPriority(mockView)
      expect(priority).toBe(JOB_PRIORITY.RenderEdge)
    })
  })

  describe('updatable views', () => {
    it('should return true for node views when no render area is set', () => {
      const mockView: any = {
        isNodeView: vi.fn(() => true),
        isEdgeView: vi.fn(() => false),
        cell: {
          getBBox: vi.fn(() => ({
            isIntersectWithRect: vi.fn(() => true),
          })),
        },
      }

      const isUpdatable = (scheduler as any).isUpdatable(mockView)
      expect(isUpdatable).toBe(true)
    })

    it('should check intersection with render area for node views', () => {
      const mockView: any = {
        isNodeView: vi.fn(() => true),
        isEdgeView: vi.fn(() => false),
        cell: {
          getBBox: vi.fn(() => ({
            isIntersectWithRect: vi.fn(() => true),
          })),
        },
      }

      const mockArea: any = {
        isIntersectWithRect: vi.fn(() => true),
      }
      scheduler['renderArea'] = mockArea

      const isUpdatable = (scheduler as any).isUpdatable(mockView)
      expect(isUpdatable).toBe(true)
      expect(mockArea.isIntersectWithRect).toHaveBeenCalled()
    })
  })

  describe('z-index pivots', () => {
    it('should add z-index pivot', () => {
      const pivot = (scheduler as any).addZPivot(10)
      expect(pivot).toBeDefined()
      expect(pivot.nodeType).toBe(8) // Comment node
    })

    it('should remove z-index pivots', () => {
      // Add a pivot first
      const pivot = (scheduler as any).addZPivot(10)

      // Then remove all pivots
      ;(scheduler as any).removeZPivots()

      // Check that zPivots is reset
      expect(scheduler['zPivots']).toEqual({})
    })
  })

  describe('toggle visible', () => {
    it('should toggle visibility of a cell', () => {
      const node = mockGraph.addNode({
        id: 'n2',
        width: 20,
        height: 20,
      })
      mockGraph.addNode({
        id: 'n1',
        width: 20,
        height: 20,
      })
      mockGraph.addNode({
        id: 'n3',
        width: 20,
        height: 20,
      })
      mockGraph.addEdge({
        source: 'n2',
        target: 'n1',
      })
      mockGraph.addEdge({
        source: 'n2',
        target: 'n3',
      })

      scheduler['toggleVisible'](node, false)
    })

    it('should handle connected edges when toggling visibility', () => {
      const mockModel = mockGraph.model
      const getConnectedEdgesSpy = vi
        .spyOn(mockModel, 'getConnectedEdges')
        .mockReturnValue([])

      // Toggle visibility
      ;(scheduler as any).toggleVisible({ id: 'cell1' }, true)

      expect(getConnectedEdgesSpy).toHaveBeenCalledWith({ id: 'cell1' })
    })
  })

  describe('effected edges', () => {
    it('should get effected edges', () => {
      const mockView: any = {
        cell: { id: 'cell1' },
      }

      const mockEdgeView: any = {
        getFlag: vi.fn(() => 1),
        isNodeView: vi.fn(() => false),
        isEdgeView: vi.fn(() => true),
        cell: {
          id: 'edge1',
          getTargetCell: vi.fn(() => null),
          getSourceCell: vi.fn(() => null),
        },
      }

      // Add edge view to scheduler
      scheduler.views['edge1'] = {
        view: mockEdgeView,
        flag: 0,
        options: {},
        state: 1, // MOUNTED
      }

      // Mock model.getConnectedEdges
      const mockModel = mockGraph.model
      const getConnectedEdgesSpy = vi
        .spyOn(mockModel, 'getConnectedEdges')
        .mockReturnValue([
          {
            id: 'edge1',
            getTargetCell: vi.fn(() => null),
            getSourceCell: vi.fn(() => null),
          } as any,
        ])

      const effectedEdges = (scheduler as any).getEffectedEdges(mockView)

      expect(getConnectedEdgesSpy).toHaveBeenCalledWith({ id: 'cell1' })
      expect(effectedEdges).toHaveLength(1)
    })
  })
})
