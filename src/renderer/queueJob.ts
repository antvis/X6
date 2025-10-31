const SCHEDULE_MODE = {
  idle: 'idle',
  raf: 'raf',
  timeout: 'timeout',
} as const

type ScheduleMode = (typeof SCHEDULE_MODE)[keyof typeof SCHEDULE_MODE]

export class JobQueue {
  private isFlushing = false
  private isFlushPending = false
  private scheduleId = 0
  private queue: Job[] = []
  private frameInterval = 16
  private initialTime = Date.now()
  private pendingJobs = new Map<string, Job>()
  private scheduleMode: ScheduleMode | null = null

  queueJob(job: Job) {
    if (job.priority & JOB_PRIORITY.PRIOR) {
      job.cb()
    } else {
      const existing = this.pendingJobs.get(job.id)
      if (existing) {
        // 仅更新已有任务的回调与优先级
        existing.cb = job.cb
        if (job.priority !== existing.priority) {
          existing.priority = job.priority
          const idx = this.queue.indexOf(existing)
          if (idx >= 0) {
            this.queue.splice(idx, 1)
            const newIndex = this.findInsertionIndex(existing)
            this.queue.splice(newIndex, 0, existing)
          }
        }
      } else {
        const index = this.findInsertionIndex(job)
        this.queue.splice(index, 0, job)
        this.pendingJobs.set(job.id, job)
      }
    }
  }

  queueFlush() {
    if (!this.isFlushing && !this.isFlushPending) {
      this.isFlushPending = true
      this.scheduleJob()
    }
  }

  queueFlushSync() {
    if (!this.isFlushing && !this.isFlushPending) {
      this.isFlushPending = true
      this.flushJobsSync()
    }
  }

  clearJobs() {
    this.queue.length = 0
    this.pendingJobs.clear()
    this.isFlushing = false
    this.isFlushPending = false
    this.cancelScheduleJob()
  }

  flushJobs(deadline?: IdleDeadline) {
    this.isFlushPending = false
    this.isFlushing = true

    const startTime = this.getCurrentTime()
    let budget = this.frameInterval
    if (deadline && typeof deadline.timeRemaining === 'function') {
      const remain = deadline.timeRemaining()
      // 防止过长占用单帧
      budget = Math.max(0, Math.min(budget, remain))
    }

    while (this.queue.length > 0) {
      const job = this.queue.shift()!
      job.cb()
      this.pendingJobs.delete(job.id)
      if (this.getCurrentTime() - startTime >= budget) {
        break
      }
    }

    this.isFlushing = false

    if (this.queue.length) {
      this.queueFlush()
    }
  }

  flushJobsSync() {
    this.isFlushPending = false
    this.isFlushing = true

    while (this.queue.length > 0) {
      const job = this.queue.shift()!
      try {
        job.cb()
      } catch (error) {
        console.error(error)
      }
      this.pendingJobs.delete(job.id)
    }

    this.isFlushing = false
  }

  private findInsertionIndex(job: Job) {
    let left = 0
    let ins = this.queue.length
    let right = ins - 1
    const priority = job.priority
    while (left <= right) {
      const mid = ((right - left) >> 1) + left
      if (priority <= this.queue[mid].priority) {
        left = mid + 1
      } else {
        ins = mid
        right = mid - 1
      }
    }
    return ins
  }

  private scheduleJob() {
    if (this.scheduleId) {
      this.cancelScheduleJob()
    }
    if ('requestIdleCallback' in window) {
      this.scheduleMode = SCHEDULE_MODE.idle
      this.scheduleId = window.requestIdleCallback(
        (deadline: IdleDeadline) => this.flushJobs(deadline),
        {
          timeout: 100,
        },
      )
    } else if ('requestAnimationFrame' in window) {
      this.scheduleMode = SCHEDULE_MODE.raf
      this.scheduleId = (window as Window).requestAnimationFrame(() =>
        this.flushJobs(),
      )
    } else {
      this.scheduleMode = SCHEDULE_MODE.timeout
      this.scheduleId = (window as Window).setTimeout(() => this.flushJobs())
    }
  }

  private cancelScheduleJob() {
    if (!this.scheduleId) return
    const cancelMethods: Partial<Record<ScheduleMode, (id: number) => void>> = {
      [SCHEDULE_MODE.idle]: window?.cancelIdleCallback,
      [SCHEDULE_MODE.raf]: window?.cancelAnimationFrame,
      [SCHEDULE_MODE.timeout]: window?.clearTimeout,
    }
    const mode = this.scheduleMode
    const cancelMethod = mode ? cancelMethods[mode] : undefined
    if (typeof cancelMethod === 'function') {
      cancelMethod(this.scheduleId as number)
    }
    this.scheduleId = 0
    this.scheduleMode = null
  }

  private getCurrentTime() {
    const hasPerformanceNow =
      typeof performance === 'object' && typeof performance.now === 'function'
    if (hasPerformanceNow) {
      return performance.now()
    }
    return Date.now() - this.initialTime
  }
}

export interface Job {
  id: string
  priority: JOB_PRIORITY
  cb: () => void
}

export enum JOB_PRIORITY {
  Update = /*    */ 1 << 1,
  RenderEdge = /**/ 1 << 2,
  RenderNode = /**/ 1 << 3,
  PRIOR = /*     */ 1 << 20,
}
