import { beforeEach, describe, expect, it, vi } from 'vitest'
import { JOB_PRIORITY, type Job, JobQueue } from '../../src/renderer/queueJob'

// Mock performance.now for consistent testing
const mockPerformanceNow = vi.fn()
Object.defineProperty(global, 'performance', {
  value: {
    now: mockPerformanceNow,
  },
  writable: true,
})

// Mock requestIdleCallback and cancelIdleCallback
const mockRequestIdleCallback = vi.fn()
const mockCancelIdleCallback = vi.fn()
Object.defineProperty(window, 'requestIdleCallback', {
  value: mockRequestIdleCallback,
})
Object.defineProperty(window, 'cancelIdleCallback', {
  value: mockCancelIdleCallback,
})

// Mock setTimeout and clearTimeout
const mockSetTimeout = vi.fn()
const mockClearTimeout = vi.fn()
Object.defineProperty(window, 'setTimeout', {
  value: mockSetTimeout,
})
Object.defineProperty(window, 'clearTimeout', {
  value: mockClearTimeout,
})

describe('JobQueue', () => {
  let jobQueue: JobQueue

  beforeEach(() => {
    jobQueue = new JobQueue()
    vi.clearAllMocks()
    mockPerformanceNow.mockReturnValue(0)
  })

  describe('queueJob', () => {
    it('should execute job immediately if it has PRIOR priority', () => {
      const mockCb = vi.fn()
      const job: Job = {
        id: '1',
        priority: JOB_PRIORITY.PRIOR,
        cb: mockCb,
      }

      jobQueue.queueJob(job)

      expect(mockCb).toHaveBeenCalled()
      expect(jobQueue['queue'].length).toBe(0)
    })

    it('should add job to queue if it does not have PRIOR priority', () => {
      const mockCb = vi.fn()
      const job: Job = {
        id: '1',
        priority: JOB_PRIORITY.Update,
        cb: mockCb,
      }

      jobQueue.queueJob(job)

      expect(mockCb).not.toHaveBeenCalled()
      expect(jobQueue['queue'].length).toBe(1)
      expect(jobQueue['queue'][0]).toBe(job)
    })

    it('should maintain priority order when adding jobs', () => {
      const job1: Job = {
        id: '1',
        priority: JOB_PRIORITY.Update,
        cb: vi.fn(),
      }
      const job2: Job = {
        id: '2',
        priority: JOB_PRIORITY.RenderNode,
        cb: vi.fn(),
      }
      const job3: Job = {
        id: '3',
        priority: JOB_PRIORITY.RenderEdge,
        cb: vi.fn(),
      }

      // Priority: Update < RenderEdge < RenderNode
      jobQueue.queueJob(job1)
      jobQueue.queueJob(job2)
      jobQueue.queueJob(job3)

      expect(jobQueue['queue']).toEqual([job2, job3, job1])
    })
  })

  describe('queueFlush', () => {
    it('should schedule flush if not already flushing or pending', () => {
      jobQueue.queueFlush()

      expect(jobQueue['isFlushPending']).toBe(true)
      if ('requestIdleCallback' in window) {
        expect(mockRequestIdleCallback).toHaveBeenCalled()
      } else {
        expect(mockSetTimeout).toHaveBeenCalled()
      }
    })

    it('should not schedule flush if already pending', () => {
      jobQueue['isFlushPending'] = true

      jobQueue.queueFlush()

      expect(jobQueue['isFlushPending']).toBe(true)
      expect(mockRequestIdleCallback).not.toHaveBeenCalled()
      expect(mockSetTimeout).not.toHaveBeenCalled()
    })

    it('should not schedule flush if already flushing', () => {
      jobQueue['isFlushing'] = true

      jobQueue.queueFlush()

      expect(jobQueue['isFlushPending']).toBe(false)
      expect(mockRequestIdleCallback).not.toHaveBeenCalled()
      expect(mockSetTimeout).not.toHaveBeenCalled()
    })
  })

  describe('queueFlushSync', () => {
    it('should flush jobs synchronously if not already flushing or pending', () => {
      const mockCb = vi.fn()
      const job: Job = {
        id: '1',
        priority: JOB_PRIORITY.Update,
        cb: mockCb,
      }
      jobQueue.queueJob(job)

      jobQueue.queueFlushSync()

      expect(jobQueue['isFlushPending']).toBe(false)
      expect(jobQueue['isFlushing']).toBe(false)
      expect(mockCb).toHaveBeenCalled()
      expect(jobQueue['queue'].length).toBe(0)
      expect(mockSetTimeout).not.toHaveBeenCalled()
      expect(mockRequestIdleCallback).not.toHaveBeenCalled()
    })

    it('should not flush if already pending', () => {
      jobQueue['isFlushPending'] = true
      const mockCb = vi.fn()
      const job: Job = {
        id: '1',
        priority: JOB_PRIORITY.Update,
        cb: mockCb,
      }
      jobQueue.queueJob(job)

      jobQueue.queueFlushSync()

      expect(jobQueue['isFlushPending']).toBe(true)
      expect(jobQueue['isFlushing']).toBe(false)
      expect(mockCb).not.toHaveBeenCalled()
    })

    it('should not flush if already flushing', () => {
      jobQueue['isFlushing'] = true
      const mockCb = vi.fn()
      const job: Job = {
        id: '1',
        priority: JOB_PRIORITY.Update,
        cb: mockCb,
      }
      jobQueue.queueJob(job)

      jobQueue.queueFlushSync()

      expect(jobQueue['isFlushPending']).toBe(false)
      expect(jobQueue['isFlushing']).toBe(true)
      expect(mockCb).not.toHaveBeenCalled()
    })
  })

  describe('clearJobs', () => {
    it('should clear the queue and reset state', () => {
      const mockCb = vi.fn()
      const job: Job = {
        id: '1',
        priority: JOB_PRIORITY.Update,
        cb: mockCb,
      }
      jobQueue.queueJob(job)
      jobQueue['isFlushing'] = true
      jobQueue['isFlushPending'] = true
      jobQueue['scheduleId'] = 1
      jobQueue['scheduleMode'] = 'idle'

      jobQueue.clearJobs()

      expect(jobQueue['queue'].length).toBe(0)
      expect(jobQueue['isFlushing']).toBe(false)
      expect(jobQueue['isFlushPending']).toBe(false)
      expect(jobQueue['scheduleId']).toBe(0)
      if ('cancelIdleCallback' in window) {
        expect(mockCancelIdleCallback).toHaveBeenCalled()
      } else {
        expect(mockClearTimeout).toHaveBeenCalled()
      }
    })
  })

  describe('flushJobs', () => {
    it('should flush jobs in priority order', () => {
      const mockCb1 = vi.fn()
      const mockCb2 = vi.fn()
      const job1: Job = {
        id: '1',
        priority: JOB_PRIORITY.RenderNode,
        cb: mockCb1,
      }
      const job2: Job = {
        id: '2',
        priority: JOB_PRIORITY.Update,
        cb: mockCb2,
      }
      jobQueue.queueJob(job1)
      jobQueue.queueJob(job2)

      jobQueue.flushJobs()

      expect(jobQueue['isFlushing']).toBe(false)
      expect(jobQueue['isFlushPending']).toBe(false)
      expect(mockCb1).toHaveBeenCalledBefore(mockCb2)
      expect(jobQueue['queue'].length).toBe(0)
    })

    it('should respect frame interval and continue flushing if queue is not empty', () => {
      mockPerformanceNow.mockImplementation(() => 0)
      const mockCb1 = vi.fn()
      const mockCb2 = vi.fn()
      const job1: Job = {
        id: '1',
        priority: JOB_PRIORITY.Update,
        cb: mockCb1,
      }
      const job2: Job = {
        id: '2',
        priority: JOB_PRIORITY.Update,
        cb: mockCb2,
      }
      jobQueue.queueJob(job1)
      jobQueue.queueJob(job2)

      // Simulate that first job takes more than frame interval
      mockPerformanceNow
        .mockImplementationOnce(() => 0)
        .mockImplementationOnce(() => 40)

      jobQueue.flushJobs()

      expect(mockCb1).toHaveBeenCalled()
      expect(mockCb2).not.toHaveBeenCalled()
      expect(jobQueue['isFlushPending']).toBe(true)
      expect(jobQueue['isFlushing']).toBe(false)
    })
  })

  describe('flushJobsSync', () => {
    it('should flush all jobs synchronously', () => {
      const mockCb1 = vi.fn()
      const mockCb2 = vi.fn()
      const job1: Job = {
        id: '1',
        priority: JOB_PRIORITY.Update,
        cb: mockCb1,
      }
      const job2: Job = {
        id: '2',
        priority: JOB_PRIORITY.Update,
        cb: mockCb2,
      }
      jobQueue.queueJob(job1)
      jobQueue.queueJob(job2)

      jobQueue.flushJobsSync()

      expect(jobQueue['isFlushing']).toBe(false)
      expect(jobQueue['isFlushPending']).toBe(false)
      expect(mockCb1).toHaveBeenCalled()
      expect(mockCb2).toHaveBeenCalled()
      expect(jobQueue['queue'].length).toBe(0)
    })

    it('should handle errors in job callbacks', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('Test error')
      const job: Job = {
        id: '1',
        priority: JOB_PRIORITY.Update,
        cb: () => {
          throw error
        },
      }
      jobQueue.queueJob(job)

      jobQueue.flushJobsSync()

      expect(consoleSpy).toHaveBeenCalledWith(error)
      expect(jobQueue['queue'].length).toBe(0)
      consoleSpy.mockRestore()
    })
  })

  describe('findInsertionIndex', () => {
    it('should return correct insertion index for new job', () => {
      const job1: Job = {
        id: '1',
        priority: JOB_PRIORITY.RenderNode,
        cb: vi.fn(),
      }
      const job2: Job = {
        id: '2',
        priority: JOB_PRIORITY.Update,
        cb: vi.fn(),
      }
      const job3: Job = {
        id: '3',
        priority: JOB_PRIORITY.RenderEdge,
        cb: vi.fn(),
      }

      jobQueue['queue'] = [job1, job3, job2] // Sorted by priority: RenderNode, RenderEdge, Update

      const newJob: Job = {
        id: '4',
        priority: JOB_PRIORITY.RenderEdge,
        cb: vi.fn(),
      }

      const index = (jobQueue as any).findInsertionIndex(newJob)
      expect(index).toBe(2) // Should be inserted after job3 since priorities are equal and we use stable sort
    })

    it('should return 0 for highest priority job', () => {
      const job1: Job = {
        id: '1',
        priority: JOB_PRIORITY.Update,
        cb: vi.fn(),
      }
      jobQueue['queue'] = [job1]

      const newJob: Job = {
        id: '2',
        priority: JOB_PRIORITY.RenderNode,
        cb: vi.fn(),
      }

      const index = (jobQueue as any).findInsertionIndex(newJob)
      expect(index).toBe(0)
    })

    it('should return queue length for lowest priority job', () => {
      const job1: Job = {
        id: '1',
        priority: JOB_PRIORITY.RenderNode,
        cb: vi.fn(),
      }
      jobQueue['queue'] = [job1]

      const newJob: Job = {
        id: '2',
        priority: JOB_PRIORITY.Update,
        cb: vi.fn(),
      }

      const index = (jobQueue as any).findInsertionIndex(newJob)
      expect(index).toBe(1)
    })
  })

  // Additional tests aligned with current JobQueue behavior
  describe('queueJob - dedup and priority reorder', () => {
    it('deduplicates by id and updates callback without growing queue', () => {
      const cb1 = vi.fn()
      const cb2 = vi.fn()
      const job1: Job = { id: 'dup', priority: JOB_PRIORITY.Update, cb: cb1 }
      const job2: Job = { id: 'dup', priority: JOB_PRIORITY.Update, cb: cb2 }

      jobQueue.queueJob(job1)
      jobQueue.queueJob(job2)

      expect(jobQueue['queue'].length).toBe(1)
      expect(jobQueue['queue'][0].cb).toBe(cb2)

      jobQueue.flushJobsSync()
      expect(cb1).not.toHaveBeenCalled()
      expect(cb2).toHaveBeenCalled()
    })

    it('re-orders existing job when its priority changes', () => {
      const cb = vi.fn()
      const edgeJob: Job = {
        id: 'e',
        priority: JOB_PRIORITY.RenderEdge,
        cb: vi.fn(),
      }
      const updateJob: Job = { id: 'u', priority: JOB_PRIORITY.Update, cb }

      jobQueue.queueJob(edgeJob)
      jobQueue.queueJob(updateJob)

      const upgraded: Job = { id: 'u', priority: JOB_PRIORITY.RenderNode, cb }
      jobQueue.queueJob(upgraded)

      expect(jobQueue['queue'][0].id).toBe('u')
      expect(jobQueue['queue'][0].priority).toBe(JOB_PRIORITY.RenderNode)
      expect(jobQueue['queue'][1].id).toBe('e')
    })
  })

  describe('flushJobs - idle deadline budget', () => {
    it('caps budget using idle deadline timeRemaining', () => {
      const mockCb1 = vi.fn()
      const mockCb2 = vi.fn()
      jobQueue.queueJob({ id: '1', priority: JOB_PRIORITY.Update, cb: mockCb1 })
      jobQueue.queueJob({ id: '2', priority: JOB_PRIORITY.Update, cb: mockCb2 })

      const fakeDeadline = { timeRemaining: () => 5 } as any
      mockPerformanceNow
        .mockImplementationOnce(() => 0)
        .mockImplementationOnce(() => 6)

      jobQueue.flushJobs(fakeDeadline)

      expect(mockCb1).toHaveBeenCalled()
      expect(mockCb2).not.toHaveBeenCalled()
      expect(jobQueue['isFlushPending']).toBe(true)
      expect(jobQueue['isFlushing']).toBe(false)
    })
  })

  describe('cancelScheduleJob - modes', () => {
    it('cancels RAF schedule when mode is raf', () => {
      let cancelRAFSpy: any
      if ('cancelAnimationFrame' in window) {
        cancelRAFSpy = vi.spyOn(window, 'cancelAnimationFrame')
      } else {
        const mock = vi.fn()
        Object.defineProperty(window, 'cancelAnimationFrame', { value: mock })
        cancelRAFSpy = vi.spyOn(window, 'cancelAnimationFrame' as any)
      }

      jobQueue['scheduleMode'] = 'raf'
      jobQueue['scheduleId'] = 1

      jobQueue.clearJobs()

      expect(cancelRAFSpy).toHaveBeenCalled()
    })

    it('cancels timeout schedule when mode is timeout', () => {
      jobQueue['scheduleMode'] = 'timeout'
      jobQueue['scheduleId'] = 1

      jobQueue.clearJobs()

      expect(mockClearTimeout).toHaveBeenCalled()
    })
  })

  describe('getCurrentTime', () => {
    it('should use performance.now if available', () => {
      mockPerformanceNow.mockReturnValue(1000)
      const time = jobQueue['getCurrentTime']()
      expect(time).toBe(1000)
      expect(mockPerformanceNow).toHaveBeenCalled()
    })

    it('should fallback to Date.now if performance.now is not available', () => {
      const originalDateNow = Date.now
      const mockDateNow = vi.fn().mockReturnValue(1000)
      Object.defineProperty(Date, 'now', { value: mockDateNow })

      jobQueue = new JobQueue()
      const originalPerformance = global.performance
      global.performance = undefined as any

      // Mock Date.now to return a specific value
      mockDateNow.mockReturnValue(2000)

      const time = jobQueue['getCurrentTime']()
      expect(time).toBe(1000)
      expect(mockDateNow).toHaveBeenCalled()

      // Restore original implementations
      global.performance = originalPerformance
      Object.defineProperty(Date, 'now', { value: originalDateNow })
    })
  })
})
