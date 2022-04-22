export interface Job {
  id: string
  // priority: number
  cb: () => void
}

let batchSize = 1
let isFlushing = false
let isFlushPending = false
let currentFlushId = 0
const queue: Job[] = []
const frameInterval = 33

let getCurrentTime: () => number
const hasPerformanceNow =
  typeof performance === 'object' && typeof performance.now === 'function'

if (hasPerformanceNow) {
  const localPerformance = performance
  getCurrentTime = () => localPerformance.now()
} else {
  const localDate = Date
  const initialTime = localDate.now()
  getCurrentTime = () => localDate.now() - initialTime
}

let scheduleJob: () => void
let cancelScheduleJob: () => void
if ('requestIdleCallback' in window) {
  scheduleJob = () => {
    if (currentFlushId) {
      cancelScheduleJob()
    }
    currentFlushId = window.requestIdleCallback(flushJobs)
  }
  cancelScheduleJob = () => {
    if (currentFlushId) {
      cancelIdleCallback(currentFlushId)
    }
    currentFlushId = 0
  }
} else {
  scheduleJob = () => {
    if (currentFlushId) {
      cancelScheduleJob()
    }
    currentFlushId = window.setTimeout(flushJobs)
  }
  cancelScheduleJob = () => {
    if (currentFlushId) {
      clearTimeout(currentFlushId)
    }
    currentFlushId = 0
  }
}

export function queueJob(job: Job) {
  queue.push(job)
}

export function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    scheduleJob()
  }
}

function flushJobs() {
  isFlushPending = false
  isFlushing = true

  let jobCounts = 0
  const startTime = getCurrentTime()

  for (let i = 0; i < batchSize; i += 1) {
    const task = queue.shift()
    if (task) {
      try {
        task.cb()
      } catch (error) {
        // pass
      } finally {
        jobCounts += 1
      }
    }
  }

  const spend = getCurrentTime() - startTime
  if (jobCounts !== 0) {
    const averageTime = spend / jobCounts
    batchSize = Math.floor(frameInterval / averageTime)
  }

  isFlushing = false
  cancelScheduleJob()

  if (queue.length) {
    queueFlush()
  }
}
