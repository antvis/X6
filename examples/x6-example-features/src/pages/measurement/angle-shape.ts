import {
  Graph,
  Node,
  Edge,
  Shape,
  EdgeView,
  Line,
  Angle,
  Registry,
} from '@antv/x6'

Graph.registerNode(
  'angle-node',
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

Graph.registerEdge(
  'angle-edge',
  {
    markup: [
      {
        tagName: 'path',
        selector: 'wrap',
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
        attrs: {
          fill: 'none',
          pointerEvents: 'none',
        },
      },
      {
        tagName: 'path',
        selector: 'sourceAngle',
        groupSelector: 'angles',
        attrs: {
          cursor: 'pointer',
        },
      },
      {
        tagName: 'path',
        selector: 'targetAngle',
        groupSelector: 'angles',
        attrs: {
          cursor: 'pointer',
        },
      },
      {
        tagName: 'text',
        selector: 'sourceAngleLabel',
        groupSelector: 'angleLabels',
      },
      {
        tagName: 'text',
        selector: 'targetAngleLabel',
        groupSelector: 'angleLabels',
      },
    ],
    attrs: {
      wrapper: {
        connection: true,
        strokeWidth: 10,
        strokeLinejoin: 'round',
      },
      line: {
        connection: true,
        stroke: '#333333',
        strokeWidth: 2,
        strokeLinejoin: 'round',
      },
      angles: {
        stroke: '#333333',
        fill: 'none',
        strokeWidth: 1,
        angle: {
          radius: 40,
          pie: false,
        },
      },
      sourceAngle: {
        angle: {
          type: 'source',
        },
      },
      targetAngle: {
        angle: {
          type: 'target',
        },
      },
      angleLabels: {
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
        fill: '#333',
        fontSize: 11,
        fontFamily: 'sans-serif',
        angleText: {
          distance: 23,
          precision: 0,
        },
      },
      sourceAngleLabel: {
        angleText: {
          type: 'source',
        },
      },
      targetAngleLabel: {
        angleText: {
          type: 'target',
        },
      },
    },
    attrHooks: {
      angle: {
        set(val, { view }) {
          const defaults = { d: 'M 0 0 0 0' }
          if (val == null || typeof val !== 'object') {
            return defaults
          }

          const attr = (val as {}) as AngleEdge.AngleOptions
          var angleRadius = attr.radius || 40
          var angleStart = attr.start || 'self'
          var anglePie = attr.pie || false
          var angleDirection = attr.direction || 'small'

          const meta = AngleEdge.getArcMeta(view as EdgeView, attr.type, {
            angle: attr.value,
            radius: angleRadius,
            start: angleStart,
            direction: angleDirection,
          })

          if (meta == null) {
            return defaults
          }

          var connectionPoint = meta.connectionPoint,
            linkArcPoint = meta.arcPoint1,
            otherArcPoint = meta.arcPoint2,
            arcAngle = meta.arcAngle,
            largeArcFlag = meta.largeArcFlag,
            sweepFlag = meta.sweepFlag

          const segments = [
            `M ${linkArcPoint.x} ${linkArcPoint.y}`,
            // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
            `A ${angleRadius} ${angleRadius} ${arcAngle} ${largeArcFlag} ${sweepFlag} ${otherArcPoint.x} ${otherArcPoint.y}`,
          ]

          if (anglePie) {
            segments.push(`L ${connectionPoint.x} ${connectionPoint.y} Z`)
          }

          return {
            d: segments.join(' '),
          }
        },
      },
      angleText: {
        set(val, options) {
          let text = ''
          const view = options.view as EdgeView
          const attr = (val as {}) as AngleEdge.AngleTextOptions

          let meta = AngleEdge.getArcMeta(view, attr.type, { radius: 40 })
          if (meta) {
            text = AngleEdge.getAngleText({
              angle: meta.angleBetween,
              precision: attr.precision,
            })
          }
          const raw = Registry.Attr.presets.text as Registry.Attr.SetDefinition
          raw.set.call(this, text, options)

          // update text position
          const distance = attr.distance || 60
          meta = AngleEdge.getArcMeta(view, attr.type, { radius: distance })
          if (!meta) {
            return {}
          }
          var line: Line
          const connectionPoint = meta.connectionPoint
          const arcPoint1 = meta.arcPoint1
          const arcPoint2 = meta.arcPoint2
          const angleBetween = meta.angleBetween
          const largeArcFlag = meta.largeArcFlag

          if (Math.abs(angleBetween - 180) < 1e-6) {
            const p = arcPoint1
              .clone()
              .rotate(largeArcFlag ? 90 : -90, connectionPoint)
            line = new Line(connectionPoint, p).setLength(distance)
          } else {
            const c = new Line(arcPoint1, arcPoint2).getCenter()
            ;(line = new Line(connectionPoint, c).setLength(distance)),
              largeArcFlag && line.scale(-1, -1, line.start)
          }

          const pos = line.end
          const angle = Angle.normalize(((line.angle() + 90) % 180) - 90)

          return {
            transform: `translate(${pos.x}, ${pos.y}) rotate(${angle})`,
          }
        },
      },
    },
  },
  true,
)

namespace Cache {
  function ensure(view: EdgeView) {
    const cacheKey = 'angleData'
    const cache = view.getDataOfElement(view.container)
    if (!(cacheKey in cache)) {
      cache[cacheKey] = {}
    }
    return (cache[cacheKey] as Object) as {
      [key: string]: AngleEdge.Metadata | null
    }
  }

  export function get(
    view: EdgeView,
    type: Edge.TerminalType,
  ): AngleEdge.Metadata | null {
    const cache = ensure(view)
    return cache[type] || null
  }

  export function set(
    view: EdgeView,
    type: Edge.TerminalType,
    meta: AngleEdge.Metadata | null,
  ) {
    const cache = ensure(view)
    cache[type] = meta
    return meta
  }
}

namespace AngleEdge {
  export type AngleStart = 'self' | 'source' | 'target'
  export type AngleDirection = 'clockwise' | 'anticlockwise' | 'small' | 'large'
  export type Metadata = ReturnType<typeof calc>

  export interface AngleOptions {
    type: Edge.TerminalType
    start?: AngleStart
    direction?: AngleDirection
    radius?: number
    value?: number
    pie?: boolean
  }

  export interface AngleTextOptions {
    type: Edge.TerminalType
    precision?: number
    distance?: number
  }

  export function getArcMeta(
    edgeView: EdgeView,
    terminalType: Edge.TerminalType,
    options: {
      angle?: number
      radius: number
      start?: AngleStart
      direction?: AngleDirection
    },
  ): Metadata | null {
    let meta = Cache.get(edgeView, terminalType)
    if (meta) {
      return meta
    }

    const isValidAngle = typeof options.angle === 'number'
    const terminalView = edgeView.getTerminalView(terminalType)

    if (!terminalView && !isValidAngle) {
      return null
    }

    var isTarget = terminalType === 'target'
    var tangent = edgeView.getTangentAtRatio(isTarget ? 1 : 0)
    if (!tangent) {
      return null
    }

    if (isTarget) {
      tangent.scale(-1, -1, tangent.start)
    }

    // angle is specified
    if (typeof options.angle === 'number') {
      const ref = tangent.clone().rotate(-options.angle, tangent.start)
      meta = calc(tangent, ref, {
        start: 'target',
        radius: options.radius,
        direction: options.angle < 0 ? 'clockwise' : 'anticlockwise',
      })
    } else if (terminalView) {
      const terminalCell = terminalView.cell
      if (terminalCell.isEdge()) {
        // terminal is another edge
        const terminalEdgeView = terminalView as EdgeView
        const p = terminalEdgeView.getClosestPointLength(tangent.start)!
        const ref = terminalEdgeView.getTangentAtLength(p)!
        meta = calc(tangent, ref, options)
      } else if (terminalCell.isNode()) {
        // terminal is node
        const magnet = edgeView.getTerminalMagnet(terminalType) as SVGElement
        if (!magnet) {
          return null
        }

        const angleRadius = options.radius
        const angleDirection = options.direction
        const terminalNode = terminalCell as Node
        const bbox = terminalNode.getBBox()
        const angle = terminalNode.getAngle()
        const center = bbox.getCenter()
        const magnetBBox = terminalView.getUnrotatedBBoxOfElement(magnet)
        const end = tangent.clone().setLength(1).end.rotate(angle, center)

        if (magnetBBox.containsPoint(end)) {
          return null
        }

        let sweepFlag = 0
        let tx = 0
        let ty = 0
        let arcAngle = tangent.angle() - angle

        if (end.y > magnetBBox.y + magnetBBox.height || end.y < magnetBBox.y) {
          arcAngle += 90
          tx = angleRadius
        } else {
          ty = angleRadius
        }

        arcAngle = Angle.normalize(arcAngle)

        const quadrant = Math.floor(arcAngle / 90)
        switch (quadrant) {
          case 0:
            sweepFlag = 1
            break
          case 1:
            sweepFlag = 0
            break
          case 2:
            tx *= -1
            ty *= -1
            sweepFlag = 1
            break
          case 3:
            tx *= -1
            ty *= -1
            sweepFlag = 0
        }

        let sweep = false
        switch (angleDirection) {
          case 'large':
            sweep = true
            break
          case 'anticlockwise':
            sweep = 0 === quadrant || 2 === quadrant
            break
          case 'clockwise':
            sweep = 1 === quadrant || 3 === quadrant
            break
        }

        if (sweep) {
          tx *= -1
          ty *= -1
          sweepFlag ^= 1
        }

        const startLine = tangent.setLength(angleRadius)
        const connectionPoint = startLine.start
        const arcPoint1 = startLine.end
        const arcPoint2 = connectionPoint
          .clone()
          .translate(tx, ty)
          .rotate(-angle, connectionPoint)
        let angleBetween = connectionPoint.angleBetween(arcPoint1, arcPoint2)
        if (180 < angleBetween) {
          angleBetween = 360 - angleBetween
        }

        meta = {
          connectionPoint: connectionPoint,
          arcPoint1: arcPoint1,
          arcPoint2: arcPoint2,
          sweepFlag: sweepFlag,
          largeArcFlag: 0,
          arcAngle: arcAngle,
          angleBetween: angleBetween,
        }
      }
    }

    Cache.set(edgeView, terminalType, meta)

    return meta
  }

  function calc(
    line: Line,
    ref: Line,
    options: {
      radius: number
      start?: AngleStart
      direction?: AngleDirection
    },
  ) {
    const angleStart = options.start
    const angleRadius = options.radius
    let angleDirection = options.direction

    const startLine = line.setLength(angleRadius)
    const endLine = ref.setLength(angleRadius)

    const arcAngle = line.angle()
    const connectionPoint = startLine.start
    const arcPoint1 = startLine.end
    let arcPoint2 = endLine.end
    let angleBetween = connectionPoint.angleBetween(arcPoint1, arcPoint2)
    let sweepFlag = 1
    let largeArcFlag = 0

    const quadrant = Math.floor(angleBetween / 90)
    let reflect = false
    let antifix = false
    let normalize = true

    switch (angleStart) {
      case 'target': {
        if (angleDirection === 'small') {
          angleDirection = angleBetween < 180 ? 'clockwise' : 'anticlockwise'
        }

        if (angleDirection === 'large') {
          angleDirection = 180 < angleBetween ? 'clockwise' : 'anticlockwise'
        }

        switch (angleDirection) {
          case 'anticlockwise':
            if (0 < angleBetween && angleBetween < 180) {
              largeArcFlag ^= 1
            }
            antifix = true
            break
          case 'clockwise':
          default:
            if (180 <= angleBetween) {
              largeArcFlag ^= 1
            }
            sweepFlag ^= 1
            break
        }

        normalize = false
        break
      }

      case 'source': {
        if (angleDirection === 'small') {
          angleDirection = 180 < angleBetween ? 'clockwise' : 'anticlockwise'
        } else if (angleDirection === 'large') {
          angleDirection = angleBetween < 180 ? 'clockwise' : 'anticlockwise'
        }

        switch (angleDirection) {
          case 'anticlockwise': {
            if (180 < angleBetween) {
              largeArcFlag ^= 1
            }
            sweepFlag = 1
            antifix = true
            break
          }
          default:
          case 'clockwise': {
            if (angleBetween < 180) {
              largeArcFlag ^= 1
            }
            sweepFlag = 0
            break
          }
        }

        normalize = false
        reflect = true
        angleBetween = Angle.normalize(angleBetween + 180)
        break
      }

      case 'self':
      default: {
        switch (angleDirection) {
          case 'anticlockwise': {
            reflect = 0 === quadrant || 1 === quadrant
            sweepFlag = 1
            antifix = true
            break
          }

          case 'clockwise': {
            reflect = 2 === quadrant || 3 === quadrant
            sweepFlag = 0
            antifix = false
            break
          }

          case 'small': {
            reflect = 1 === quadrant || 2 === quadrant
            sweepFlag = 0 === quadrant || 2 === quadrant ? 0 : 1
            antifix = 1 === quadrant || 3 === quadrant
            break
          }

          case 'large': {
            reflect = 0 === quadrant || 3 === quadrant
            sweepFlag = 1 === quadrant || 3 === quadrant ? 0 : 1
            antifix = 0 === quadrant || 2 === quadrant
            break
          }
        }
      }
    }

    if (reflect) {
      arcPoint2 = arcPoint2.reflection(connectionPoint)
    }

    if (normalize && 180 <= angleBetween) {
      angleBetween = Angle.normalize(angleBetween - 180)
    }

    if (antifix) {
      angleBetween = Angle.normalize((normalize ? 180 : 360) - angleBetween)
    }

    return {
      connectionPoint: connectionPoint,
      arcPoint1: arcPoint1,
      arcPoint2: arcPoint2,
      largeArcFlag: largeArcFlag,
      sweepFlag: sweepFlag,
      arcAngle: arcAngle,
      angleBetween: angleBetween,
    }
  }

  export function getAngleText(
    options: { angle?: number; precision?: number } = {},
  ) {
    const angle = options.angle != null ? options.angle : 0
    const decimalPoints = options.precision == null ? 2 : options.precision
    return `${angle.toFixed(decimalPoints)}°`
  }
}
