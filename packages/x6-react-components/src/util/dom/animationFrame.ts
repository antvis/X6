import { safeWindow } from './executionEnvironment'

let animationFrameTime = 0

const nativeRequestAnimationFrame = safeWindow(
  (window) =>
    window.requestAnimationFrame || (window as any).webkitRequestAnimationFrame,
)

export const cancelAnimationFrame = safeWindow((window) =>
  (
    window.cancelAnimationFrame ||
    (window as any).webkitCancelAnimationFrame ||
    window.clearTimeout
  ).bind(window),
)

export const requestAnimationFrame = nativeRequestAnimationFrame
  ? nativeRequestAnimationFrame.bind(window)
  : (callback: FrameRequestCallback): number => {
      const currTime = Date.now()
      const timeDelay = Math.max(0, 16 - (currTime - animationFrameTime))
      animationFrameTime = currTime + timeDelay
      return window.setTimeout(() => {
        callback(Date.now())
      }, timeDelay)
    }
