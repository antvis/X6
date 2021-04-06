import { Global } from './global'

export class MockRAF {
  protected realRAF: typeof requestAnimationFrame
  protected mockRAF: typeof requestAnimationFrame
  protected realCAF: typeof cancelAnimationFrame
  protected mockCAF: typeof cancelAnimationFrame
  protected callbacks: FrameRequestCallback[] = []
  protected nextTime = 0

  constructor() {
    this.mockRAF = (fn: FrameRequestCallback) => {
      this.callbacks.push(fn)
      return this.callbacks.length
    }

    this.mockCAF = (requestID: number) => {
      this.callbacks.splice(requestID, 1)
    }
  }

  install(global: Global.WindowType) {
    this.realRAF = global.requestAnimationFrame
    this.realCAF = global.cancelAnimationFrame
    global.requestAnimationFrame = this.mockRAF
    global.cancelAnimationFrame = this.mockCAF
  }

  uninstall(global: Global.WindowType) {
    global.requestAnimationFrame = this.realRAF
    global.cancelAnimationFrame = this.realCAF
    this.nextTime = 0
    this.callbacks = []
  }

  tick(dt?: number) {
    this.nextTime += dt || 1
    this.callbacks.forEach((fn) => {
      fn(this.nextTime)
    })
    this.callbacks = []
  }
}
