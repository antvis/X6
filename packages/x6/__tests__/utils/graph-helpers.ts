import { vi } from 'vitest'
import { Graph } from '../../src'

export function createTestContainer(width = 800, height = 600) {
  const el = document.createElement('div')
  el.style.width = `${width}px`
  el.style.height = `${height}px`
  el.style.position = 'relative'
  document.body.appendChild(el)
  return el
}

export function createTestGraph(options: Partial<Graph.Options> = {}) {
  const container = createTestContainer()
  const graph = new Graph({
    container,
    width: 800,
    height: 600,
    connecting: { allowBlank: false },
    interacting: { magnetConnectable: true },
    ...options,
  })
  const cleanup = () => {
    graph.dispose()
    container.remove()
  }
  return { graph, container, cleanup }
}

export async function flushAll() {
  // 统一冲刷定时器、raf
  await Promise.resolve()
  vi.advanceTimersByTime(200)
  await Promise.resolve()
}
