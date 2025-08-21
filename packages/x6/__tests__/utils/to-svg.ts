import { Graph } from '../../src'

export const toSVG = async (
  graph: Graph,
  options: object = {},
  timeout = 5000,
): Promise<string | null> => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      console.error('SVG export timed out')
      resolve(null)
    }, timeout)

    try {
      // 使用requestAnimationFrame确保在下一帧渲染完成后再导出
      requestAnimationFrame(() => {
        graph.toSVG((dataUri) => {
          clearTimeout(timer)
          resolve(dataUri)
        }, options)
      })
    } catch (error) {
      console.error('SVG export error:', error)
      clearTimeout(timer)
      resolve(null)
    }
  })
}
