import { Graph } from '../../src'

export const toSVG = async (
  graph: Graph,
  options: object = {},
  timeout = 5000,
): Promise<string | null> => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(null)
    }, timeout)

    try {
      graph.toSVG((dataUri) => {
        clearTimeout(timer)
        resolve(dataUri)
      }, options)
    } catch (error) {
      clearTimeout(timer)
      resolve(null)
    }
  })
}
