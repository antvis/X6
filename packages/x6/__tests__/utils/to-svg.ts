import { Graph } from '../../src'

export const toSVG = async (
  graph: Graph,
  options: object = {},
): Promise<string | null> => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      graph.toSVG((dataUri) => {
        resolve(dataUri)
      }, options)
    })
  })
}
