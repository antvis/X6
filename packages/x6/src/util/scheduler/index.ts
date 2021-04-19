export namespace Scheduler {
  type FlushTaskFn = () => void
  type ITaskCallback = ((data: any) => void | ITaskCallback) | null

  interface ITask {
    callback: ITaskCallback
    data?: any
  }

  const queue: ITask[] = []
  const threshold: number = 1000 / 60
  const unit: FlushTaskFn[] = []
  let deadline = 0

  const getTime = () => performance.now()
  const peek = (queue: ITask[]) => queue[0]
  const schedule = (cb: FlushTaskFn) => unit.push(cb) === 1 && postMessage()

  const postMessage = (() => {
    const cb = () => unit.splice(0, unit.length).forEach((c) => c())
    if (typeof MessageChannel !== 'undefined') {
      const { port1, port2 } = new MessageChannel()
      port1.onmessage = cb
      return () => port2.postMessage(null)
    }
    return () => setTimeout(cb)
  })()

  const flushTask = () => {
    deadline = getTime() + threshold
    let job = peek(queue)
    while (job && !shouldYield()) {
      const { callback, data } = job
      job.callback = null
      const next = callback && callback(data)
      if (next) {
        job.callback = next
      } else {
        queue.shift()
      }
      job = peek(queue)
    }
    job && schedule(flushTask)
  }

  export const scheduleTask = (callback: ITaskCallback, data?: any) => {
    const task = {
      callback,
      data,
    }
    queue.push(task)
    schedule(flushTask)
  }

  export const shouldYield = (): boolean => {
    return (
      (navigator as any)?.scheduling?.isInputPending() || getTime() >= deadline
    )
  }
}
