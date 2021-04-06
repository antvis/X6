import { Global } from '../../global'
import { Queue } from './queue'

export namespace Timing {
  export const timer = () => Global.window.performance || Global.window.Date

  let frames = new Queue<Frame>()
  let timeouts = new Queue<Timeout>()
  let immediates = new Queue<Frame>()
  let nextTickId: number | null = null

  export function clean() {
    frames = new Queue<Frame>()
    timeouts = new Queue<Timeout>()
    immediates = new Queue<Frame>()
  }

  export function frame(fn: Callback) {
    const node = frames.push({ fn })
    tick()
    return node
  }

  export function timeout(fn: Callback, delay = 0) {
    const node = timeouts.push({ fn, time: timer().now() + delay })
    tick()
    return node
  }

  export function immediate(fn: Callback) {
    const node = immediates.push({ fn })
    tick()
    return node
  }

  export function cancelFrame(node: Queue.Item<Frame> | null) {
    if (node) {
      frames.remove(node)
    }
  }

  export function clearTimeout(node: Queue.Item<Timeout> | null) {
    if (node) {
      timeouts.remove(node)
    }
  }

  export function cancelImmediate(node: Queue.Item<Frame> | null) {
    if (node) {
      immediates.remove(node)
    }
  }

  function tick() {
    if (nextTickId === null) {
      nextTickId = requestAnimationFrame()
    }
  }

  function requestAnimationFrame() {
    return Global.window.requestAnimationFrame(run)
  }

  function run(now: number) {
    // Run all the timeouts we can run, if they are not ready yet, add them
    // to the end of the queue immediately!
    let nextTimeout = null
    const lastTimeout = timeouts.last()
    while ((nextTimeout = timeouts.shift())) {
      // Run the timeout if its time, or push it to the end
      if (now >= nextTimeout.time) {
        nextTimeout.fn(now)
      } else {
        timeouts.push(nextTimeout)
      }

      // If we hit the last item, we should stop shifting out more items
      if (nextTimeout === lastTimeout) {
        break
      }
    }

    // Run all of the animation frames
    let nextFrame = null
    const lastFrame = frames.last()
    while ((nextFrame = frames.shift())) {
      nextFrame.fn(now)
      // If we hit the last item, we should stop shifting out more items
      if (nextFrame === lastFrame) {
        break
      }
    }

    let nextImmediate = null
    while ((nextImmediate = immediates.shift())) {
      nextImmediate.fn(now)
    }

    // If we have remaining timeouts or frames, run until we don't anymore
    const next = timeouts.first() || frames.first()
    nextTickId = next ? requestAnimationFrame() : null
  }
}

export namespace Timing {
  export type Callback = (now: number) => any

  export interface Frame {
    fn: Callback
  }

  export interface Timeout {
    fn: Callback
    time: number
  }
}
