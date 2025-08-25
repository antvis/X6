import { describe, expect, it } from 'vitest'
import { Edge } from '../../src/shape/edge'

describe('shape/edge', () => {
  it('should have correct markup structure', () => {
    expect(Edge.getMarkup()).toEqual([
      {
        tagName: 'path',
        selector: 'wrap',
        groupSelector: 'lines',
        attrs: {
          fill: 'none',
          cursor: 'pointer',
          stroke: 'transparent',
          strokeLinecap: 'round',
        },
      },
      {
        tagName: 'path',
        selector: 'line',
        groupSelector: 'lines',
        attrs: {
          fill: 'none',
          pointerEvents: 'none',
        },
      },
    ])
  })

  it('should have correct default attributes', () => {
    expect(Edge.getDefaults()).toEqual({
      attrs: {
        line: {
          stroke: '#333',
          strokeWidth: 2,
          targetMarker: 'classic',
        },
        lines: {
          connection: true,
          strokeLinejoin: 'round',
        },
        wrap: {
          strokeWidth: 10,
        },
      },
      shape: 'edge',
    })
  })
})
