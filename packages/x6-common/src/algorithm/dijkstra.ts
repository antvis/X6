import { PriorityQueue } from './priorityqueue'

export namespace Dijkstra {
  export type AdjacencyList = { [key: string]: string[] }
  export type Weight = (u: string, v: string) => number

  export function run(
    adjacencyList: AdjacencyList,
    source: string,
    weight: Weight = (u, v) => 1, // eslint-disable-line
  ) {
    const dist: { [key: string]: number } = {}
    const previous: { [key: string]: string } = {}
    const scanned: { [key: string]: boolean } = {}
    const queue = new PriorityQueue<string>()

    dist[source] = 0

    Object.keys(adjacencyList).forEach((v) => {
      if (v !== source) {
        dist[v] = Infinity
      }
      queue.insert(dist[v], v, v)
    })

    while (!queue.isEmpty()) {
      const u = queue.remove()!
      scanned[u] = true

      const neighbours = adjacencyList[u] || []
      for (let i = 0; i < neighbours.length; i += 1) {
        const v = neighbours[i]
        if (!scanned[v]) {
          const alt = dist[u] + weight(u, v)
          if (alt < dist[v]) {
            dist[v] = alt
            previous[v] = u
            queue.updatePriority(v, alt)
          }
        }
      }
    }

    return previous
  }
}
