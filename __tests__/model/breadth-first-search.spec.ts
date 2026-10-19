import { describe, expect, it } from 'vitest'
import { Model } from '../../src'

function createModel(ids: string[], edges: [string, string][]) {
  const model = new Model()
  ids.forEach((id) => {
    model.addNode({ id, shape: 'rect' })
  })
  edges.forEach(([source, target]) => {
    model.addEdge({ source, target })
  })
  return model
}

function traverse(
  model: Model,
  start = 'a',
  prune?: string,
  breadthFirst = true,
) {
  const calls: [string, number][] = []
  model.search(
    model.getCell(start),
    (cell, distance) => {
      calls.push([cell.id, distance])
      return cell.id !== prune
    },
    { breadthFirst, outgoing: true, incoming: false },
  )
  return calls
}

describe('breadth-first search distances', () => {
  it('keeps the shorter distance of a node already in the queue', () => {
    const model = createModel(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'c'],
        ['c', 'd'],
      ],
    )

    expect(traverse(model)).toEqual([
      ['a', 0],
      ['b', 1],
      ['c', 1],
      ['d', 2],
    ])
  })

  it('reports minimum hop counts on a converging cyclic graph', () => {
    const model = createModel(
      ['a', 'b', 'c', 'd', 'e'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'c'],
        ['b', 'd'],
        ['c', 'd'],
        ['d', 'a'],
        ['d', 'e'],
      ],
    )

    expect(traverse(model)).toEqual([
      ['a', 0],
      ['b', 1],
      ['c', 1],
      ['d', 2],
      ['e', 3],
    ])
  })

  it('includes all direct successors when filtering by distance', () => {
    const model = createModel(
      ['a', 'b', 'c'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'c'],
      ],
    )
    const source = model.getCell('a')
    const searchOptions = { breadthFirst: true, distance: 1 }

    expect(
      model.getSuccessors(source, searchOptions).map((cell) => cell.id),
    ).toEqual(['b', 'c'])
    expect(model.isSuccessor(source, model.getCell('c'), searchOptions)).toBe(
      true,
    )
  })

  it('does not expand a pruned branch but still visits other branches', () => {
    const model = createModel(
      ['a', 'b', 'c', 'd', 'e'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
        ['c', 'e'],
      ],
    )

    expect(traverse(model, 'a', 'b')).toEqual([
      ['a', 0],
      ['b', 1],
      ['c', 1],
      ['e', 2],
    ])
  })

  it('visits incoming neighbors at their minimum distance', () => {
    const model = createModel(
      ['a', 'b', 'c'],
      [
        ['b', 'a'],
        ['c', 'a'],
        ['c', 'b'],
      ],
    )
    const calls: [string, number][] = []
    model.breadthFirstSearch(
      model.getCell('a'),
      (cell, distance) => {
        calls.push([cell.id, distance])
      },
      { incoming: true, outgoing: false },
    )
    expect(calls).toEqual([
      ['a', 0],
      ['b', 1],
      ['c', 1],
    ])
  })

  it('visits an isolated source once at distance zero', () => {
    const model = createModel(['a', 'b'], [])
    expect(traverse(model)).toEqual([['a', 0]])
  })

  it('preserves depth-first traversal through the search entry point', () => {
    const model = createModel(
      ['a', 'b', 'c', 'd'],
      [
        ['a', 'b'],
        ['a', 'c'],
        ['b', 'd'],
      ],
    )
    expect(traverse(model, 'a', undefined, false)).toEqual([
      ['a', 0],
      ['b', 1],
      ['d', 2],
      ['c', 1],
    ])
  })
})
