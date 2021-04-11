import { Global } from './global'

export class MockRAF {
  protected realRAF: typeof requestAnimationFrame
  protected mockRAF: typeof requestAnimationFrame
  protected realCAF: typeof cancelAnimationFrame
  protected mockCAF: typeof cancelAnimationFrame
  protected realPerf: { now: () => number }
  protected mockPerf: { now: () => number }
  protected callbacks: FrameRequestCallback[] = []
  protected nextTime = 0

  constructor() {
    this.mockRAF = (fn: FrameRequestCallback) => {
      this.callbacks.push(fn)
      return this.callbacks.length - 1
    }

    this.mockCAF = (requestID: number) => {
      this.callbacks.splice(requestID, 1)
    }

    this.mockPerf = {
      now: () => this.nextTime,
    }
  }

  install(win: Global.WindowType) {
    this.realRAF = win.requestAnimationFrame
    this.realCAF = win.cancelAnimationFrame
    this.realPerf = win.performance
    win.requestAnimationFrame = this.mockRAF
    win.cancelAnimationFrame = this.mockCAF
    const w = win as any
    w.performance = this.mockPerf
  }

  uninstall(win: Global.WindowType) {
    const w = win as any

    win.requestAnimationFrame = this.realRAF
    win.cancelAnimationFrame = this.realCAF
    w.performance = this.realPerf

    this.nextTime = 0
    this.callbacks = []
  }

  tick(dt = 1) {
    this.nextTime += dt
    const callbacks = this.callbacks
    this.callbacks = []
    callbacks.forEach((fn) => fn(this.nextTime))
  }
}
