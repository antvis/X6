export interface Job {
  id: string
  priority: JOB_PRIORITY
  cb: () => void
}

export enum JOB_PRIORITY {
  Manual = 1,
  Render = 2,
}

let isFlushing = false
let isFlushPending = false
let scheduleId = 0
const queue: Job[] = []
const frameInterval = 33
let time = 0

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
    if (scheduleId) {
      cancelScheduleJob()
    }
    scheduleId = window.requestIdleCallback(flushJobs, { timeout: 100 })
  }
  cancelScheduleJob = () => {
    if (scheduleId) {
      cancelIdleCallback(scheduleId)
    }
    scheduleId = 0
  }
} else {
  scheduleJob = () => {
    if (scheduleId) {
      cancelScheduleJob()
    }
    scheduleId = window.setTimeout(flushJobs)
  }
  cancelScheduleJob = () => {
    if (scheduleId) {
      clearTimeout(scheduleId)
    }
    scheduleId = 0
  }
}

export function queueJob(job: Job) {
  const index = findInsertionIndex(job)
  if (index >= 0) {
    queue.splice(index, 0, job)
  }
}

export function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    scheduleJob()
  }
}

export function clearJobs() {
  queue.length = 0
  isFlushing = false
  isFlushPending = false
  cancelScheduleJob()
}

export function resetTimer() {
  time = performance.now()
}

function flushJobs() {
  isFlushPending = false
  isFlushing = true

  const startTime = getCurrentTime()

  let job
  while ((job = queue.shift())) {
    try {
      job.cb()
    } catch (error) {
      // pass
    }
    if (getCurrentTime() - startTime >= frameInterval) {
      break
    }
  }

  isFlushing = false

  if (queue.length) {
    queueFlush()
  } else {
    console.log('spend', performance.now() - time) // eslint-disable-line
  }
}

function findInsertionIndex(job: Job) {
  let start = 0
  while (queue[start] && queue[start].priority <= job.priority) {
    start += 1
  }
  return start
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
