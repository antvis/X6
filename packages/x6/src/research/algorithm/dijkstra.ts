import { PriorityQueue } from './priority-queue'

export function dijkstra(
  adjacencyList: { [key: string]: string },
  source: string,
  weight: (u: string, v: string) => number = (u, v) => 1,
) {
  const previous: { [key: string]: string } = {}
  const scanned: { [key: string]: boolean } = {}
  const dist: { [key: string]: number } = {}
  const queue = new PriorityQueue<string>()

  dist[source] = 0

  for (const v in adjacencyList) {
    if (v !== source) {
      dist[v] = Infinity
    }
    queue.insert(dist[v], v, v)
  }

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
