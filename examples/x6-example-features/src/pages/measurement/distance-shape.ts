import { Graph, Shape, EdgeView, Edge, Registry, Point, Angle } from '@antv/x6'

Graph.registerNode(
  'distance-node',
  Shape.Rect.define({
    width: 120,
    height: 120,
    zIndex: 1,
    attrs: {
      body: {
        fill: '#f5f5f5',
        stroke: '#d9d9d9',
        strokeWidth: 1,
        rx: 2,
        ry: 2,
      },
    },
  }),
  true,
)

namespace DistanceEdge {
  export interface DistanceAnchorOptions {
    type: Edge.TerminalType
  }

  export interface DistanceTextOptions {
    unit?: string
    precision?: number
    ratio?: number
    offset?: number
  }

  export function getDistanceText(
    view: EdgeView,
    options: DistanceTextOptions = {},
  ) {
    const unit = options.unit || ''
    const precision = options.precision || 0
    const length = view.getConnectionLength()
    return length != null ? `${length.toFixed(precision)}${unit}` : ''
  }
}

export const DistanceEdgeBase = Graph.registerEdge(
  'distance-edge',
  {
    markup: [
      {
        tagName: 'path',
        selector: 'sourceAnchorLine',
        groupSelector: 'anchorLines',
      },
      {
        tagName: 'path',
        selector: 'targetAnchorLine',
        groupSelector: 'anchorLines',
      },
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
      {
        tagName: 'text',
        selector: 'distanceLabel',
      },
    ],
    attrs: {
      lines: {
        connection: true,
        strokeLinejoin: 'round',
      },
      line: {
        stroke: '#333333',
        strokeWidth: 2,
        targetMarker: {
          tagName: 'path',
          strokeWidth: 2,
          d: 'M 0 10 0 -10 M 10 10 0 0 10 -10',
          fill: 'none',
        },
        sourceMarker: {
          tagName: 'path',
          strokeWidth: 2,
          d: 'M 0 10 0 -10 M 10 10 0 0 10 -10',
          fill: 'none',
        },
      },
      wrapper: {
        strokeWidth: 10,
      },
      anchorLines: {
        stroke: '#333333',
        strokeWidth: 1,
        strokeDasharray: '1,2',
      },
      sourceAnchorLine: {
        distanceAnchor: {
          type: 'source',
        },
      },
      targetAnchorLine: {
        distanceAnchor: {
          type: 'target',
        },
      },
      distanceLabel: {
        fontFamily: 'sans-serif',
        fontWeight: 'lighter',
        fontSize: 14,
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        distanceText: {
          unit: 'px',
          precision: 0,
          ratio: 0.5,
          offset: 12,
        },
      },
    },
    attrHooks: {
      distanceAnchor: {
        set(val, { view }) {
          if (typeof val === 'object') {
            const attr = (val as {}) as DistanceEdge.DistanceAnchorOptions
            const edgeView = view as EdgeView
            const anchor = edgeView.getTerminalAnchor(attr.type)
            const kont = edgeView.getTerminalConnectionPoint(attr.type)
            return {
              d: `M ${anchor.x} ${anchor.y} ${kont.x} ${kont.y}`,
            }
          }
        },
      },
      distanceText: {
        set(val, options) {
          const view = options.view as EdgeView
          const attr = (val as {}) as DistanceEdge.DistanceTextOptions
          const text = DistanceEdge.getDistanceText(view, attr)
          const raw = Registry.Attr.presets.text as Registry.Attr.SetDefinition
          raw.set.call(this, text, options)

          // label position
          const ratio = attr.ratio || 0.5
          const offset = attr.offset || 0
          const tangent = view.getTangentAtRatio(ratio)
          let start: Point
          let angle: number
          if (tangent) {
            angle = tangent.vector().vectorAngle(new Point(1, 0))
            start = tangent.start
          } else {
            start = view.path.start!
            angle = 0
          }

          let y = offset
          let transform: string
          if (angle === 0) {
            transform = `translate(${start.x},${start.y})`
          } else {
            const fixed = Angle.normalize(((angle + 90) % 180) - 90)
            if (angle !== fixed) {
              y = -offset
            }
            transform = `translate(${start.x},${start.y}) rotate(${fixed})`
          }

          return { transform, y }
        },
      },
    },
  },
  true,
)

Graph.registerEdge(
  'distance-edge-normal',
  DistanceEdgeBase.define({
    zIndex: 2,
    attrs: {
      distanceLabel: {
        fill: '#464554',
        distanceText: {
          precision: 1,
        },
      },
      line: {
        stroke: '#464554',
      },
      anchorLines: {
        strokeDasharray: 'none',
        stroke: '#D2D2D2',
      },
    },
  }),
  true,
)

Graph.registerEdge(
  'distance-edge-main',
  DistanceEdgeBase.define({
    zIndex: 3,
    attrs: {
      distanceLabel: {
        fill: '#4666E5',
        distanceText: {
          precision: 1,
        },
      },
      line: {
        stroke: '#4666E5',
      },
      anchorLines: {
        strokeDasharray: 'none',
        stroke: '#D2D2D2',
      },
    },
  }),
  true,
)
