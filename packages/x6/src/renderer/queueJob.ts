export class JobQueue {
  private isFlushing = false
  private isFlushPending = false
  private scheduleId = 0
  private queue: Job[] = []
  private frameInterval = 33
  private initialTime = Date.now()

  queueJob(job: Job) {
    if (job.priority === JOB_PRIORITY.PRIOR) {
      job.cb()
    } else {
      const index = this.findInsertionIndex(job)
      if (index >= 0) {
        this.queue.splice(index, 0, job)
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
    this.isFlushing = false
    this.isFlushPending = false
    this.cancelScheduleJob()
  }

  flushJobs() {
    this.isFlushPending = false
    this.isFlushing = true

    const startTime = this.getCurrentTime()

    let job
    while ((job = this.queue.shift())) {
      try {
        job.cb()
      } catch (error) {
        // pass
      }
      if (this.getCurrentTime() - startTime >= this.frameInterval) {
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

    let job
    while ((job = this.queue.shift())) {
      try {
        job.cb()
      } catch (error) {
        // eslint-disable-next-line
        console.log(error)
      }
    }

    this.isFlushing = false
  }

  private findInsertionIndex(job: Job) {
    let start = 0
    while (this.queue[start] && this.queue[start].priority >= job.priority) {
      start += 1
    }
    return start
  }

  private scheduleJob() {
    if ('requestIdleCallback' in window) {
      if (this.scheduleId) {
        this.cancelScheduleJob()
      }
      this.scheduleId = window.requestIdleCallback(this.flushJobs.bind(this), {
        timeout: 100,
      })
    } else {
      if (this.scheduleId) {
        this.cancelScheduleJob()
      }
      this.scheduleId = (window as Window).setTimeout(this.flushJobs.bind(this))
    }
  }

  private cancelScheduleJob() {
    if ('cancelIdleCallback' in window) {
      if (this.scheduleId) {
        window.cancelIdleCallback(this.scheduleId)
      }
      this.scheduleId = 0
    } else {
      if (this.scheduleId) {
        clearTimeout(this.scheduleId)
      }
      this.scheduleId = 0
    }
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
  RenderEdge = 1,
  RenderNode = 2,
  Update = 3,
  PRIOR = 100,
}

// function findInsertionIndex(job: Job) {
//   let start = 0
//   for (let i = 0, len = queue.length; i < len; i += 1) {
//     const j = queue[i]
//     if (j.id === job.id) {
//       console.log('xx', j.bit, job.bit)
//     }
//     if (j.id === job.id && (job.bit ^ (job.bit & j.bit)) === 0) {
//       return -1
//     }
//     if (j.priority <= job.priority) {
//       start += 1
//     }
//   }
//   return start
// }
