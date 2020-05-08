export const requestAnimationFrame = (function () {
  let raf

  const win = window as any
  if (win != null) {
    raf =
      win.requestAnimationFrame ||
      win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame ||
      win.oRequestAnimationFrame ||
      win.msRequestAnimationFrame

    if (raf != null) {
      raf = raf.bind(win)
    }
  }

  if (raf == null) {
    let lastTime = 0

    raf = (callback: FrameRequestCallback) => {
      const currTime = new Date().getTime()
      const timeToCall = Math.max(0, 16 - (currTime - lastTime))
      const id = setTimeout(() => {
        callback(currTime + timeToCall)
      }, timeToCall)

      lastTime = currTime + timeToCall

      return id
    }
  }

  return raf as (callback: FrameRequestCallback) => number
})()

export const cancelAnimationFrame = (function () {
  let caf

  const win = window as any
  if (win != null) {
    caf =
      win.cancelAnimationFrame ||
      win.webkitCancelAnimationFrame ||
      win.webkitCancelRequestAnimationFrame ||
      win.msCancelAnimationFrame ||
      win.msCancelRequestAnimationFrame ||
      win.oCancelAnimationFrame ||
      win.oCancelRequestAnimationFrame ||
      win.mozCancelAnimationFrame ||
      win.mozCancelRequestAnimationFrame

    if (caf) {
      caf = caf.bind(win)
    }
  }

  if (caf == null) {
    caf = clearTimeout
  }

  return caf as (handle: number) => void
})()
