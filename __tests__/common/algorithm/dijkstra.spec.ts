import { describe, expect, it } from 'vitest'
import {
  type DijkstraAdjacencyList,
  type DijkstraWeight,
  dijkstra,
} from '../../../src/common/algorithm'

describe('dijkstra', () => {
  it('should handle simple graph with default weight', () => {
    const graph: DijkstraAdjacencyList = {
      A: ['B', 'C'],
      B: ['D'],
      C: ['D'],
      D: [],
    }

    const result = dijkstra(graph, 'A')

    expect(result).toEqual({
      B: 'A',
      C: 'A',
      D: 'B',
    })
  })

  it('should handle graph with custom weights', () => {
    const graph: DijkstraAdjacencyList = {
      A: ['B', 'C'],
      B: ['D'],
      C: ['D'],
      D: [],
    }

    const weight: DijkstraWeight = (u, v) => {
      if (u === 'A' && v === 'B') return 1
      if (u === 'A' && v === 'C') return 4
      if (u === 'B' && v === 'D') return 2
      if (u === 'C' && v === 'D') return 1
      return 1
    }

    const result = dijkstra(graph, 'A', weight)

    expect(result).toEqual({
      B: 'A',
      C: 'A',
      D: 'B',
    })
  })

  it('should handle single node graph', () => {
    const graph: DijkstraAdjacencyList = {
      A: [],
    }

    const result = dijkstra(graph, 'A')

    expect(result).toEqual({})
  })

  it('should handle disconnected nodes', () => {
    const graph: DijkstraAdjacencyList = {
      A: ['B'],
      B: [],
      C: [],
    }

    const result = dijkstra(graph, 'A')

    expect(result).toEqual({
      B: 'A',
    })
  })

  it('should handle node with undefined adjacency list', () => {
    const graph: DijkstraAdjacencyList = {
      A: ['B'],
      B: ['C'],
    }

    const result = dijkstra(graph, 'A')

    expect(result).toEqual({
      B: 'A',
    })
  })

  it('should handle complex graph with multiple paths', () => {
    const graph: DijkstraAdjacencyList = {
      A: ['B', 'C'],
      B: ['C', 'D'],
      C: ['D'],
      D: ['E'],
      E: [],
    }

    const weight: DijkstraWeight = (u, v) => {
      const weights: { [key: string]: number } = {
        'A-B': 2,
        'A-C': 1,
        'B-C': 1,
        'B-D': 3,
        'C-D': 1,
        'D-E': 1,
      }
      return weights[`${u}-${v}`] || 1
    }

    const result = dijkstra(graph, 'A', weight)

    expect(result).toEqual({
      B: 'A',
      C: 'A',
      D: 'C',
      E: 'D',
    })
  })

  it('should handle empty graph', () => {
    const graph: DijkstraAdjacencyList = {}

    const result = dijkstra(graph, 'A')

    expect(result).toEqual({})
  })

  it('should handle graph where source is not in adjacency list', () => {
    const graph: DijkstraAdjacencyList = {
      B: ['C'],
      C: [],
    }

    const result = dijkstra(graph, 'A')

    expect(result).toEqual({})
  })
})
