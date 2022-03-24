export function debounce<T extends []>(fn: (...args: T) => void, delay = 60) {
  let timer: number | null = null

  return (...args: T) => {
    if (timer) {
      clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
