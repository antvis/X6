import { Graph, Node, Edge, NodeView, Point, Angle, Interp } from '@antv/x6'

class BallView extends NodeView {
  protected speed: number = 0
  protected angle: number = 0
  protected stop: (() => void) | null
  protected edge: Edge | null

  protected init() {
    this.stop = this.cell.transition('attrs/label/opacity', 1, {
      delay: (1 + Math.random()) * 3000,
      duration: 3000,
      timing: 'inout',
      interp(a: number, b: number) {
        return function (t: number) {
          return a + b * (1 - Math.abs(1 - 2 * t))
        }
      },
    })

    this.cell.on('transition:complete', ({ cell, path }) => {
      if (path === 'position' && this.speed > 5) {
        this.speed /= cell.prop<number>('bounciness') || 2
        this.fly({ angle: 180 - this.angle, speed: this.speed })
      }
    })

    this.cell.on('change:position', ({ cell, current }) => {
      const node = cell as any as Node
      this.angle = Point.create(node.getPosition()).theta(
        node.previous('position'),
      )

      if (current) {
        if (
          current.x < 0 ||
          current.x > this.graph.options.width - node.getSize().width
        ) {
          this.angle -= 180
          node.position(node.previous('position')!.x, current.y, {
            silent: true,
          })

          cell.stopTransition('position')
        }
      }
    })
  }

  fly(opts: { speed?: number; angle?: number } = {}) {
    const options = {
      speed: 100,
      angle: 90,
      ...opts,
    }

    const pos = this.cell.getPosition()
    const size = this.cell.getSize()

    const h0 = this.graph.options.height - pos.y - size.height
    const v0 = options.speed
    const ga = 9.81
    const sin1 = Math.sin(Angle.toRad(options.angle))

    const flightTime =
      (v0 * sin1 +
        Math.sqrt(Math.pow(v0, 2) * Math.pow(sin1, 2) + 2 * h0 * ga)) /
      ga

    this.cell.transition('position', options, {
      duration: 100 * flightTime,
      interp(
        position: Point.PointLike,
        params: { speed: number; angle: number },
      ) {
        return function (t: number) {
          t = flightTime * t // eslint-disable-line
          return {
            x:
              position.x +
              params.speed * t * Math.cos((Math.PI / 180) * params.angle),
            y:
              position.y -
              params.speed * t * Math.sin((Math.PI / 180) * params.angle) +
              (ga / 2) * t * t,
          }
        }
      },
    })

    this.cell.transition('angle', -options.angle, {
      duration: 100 * flightTime,
    })

    this.speed = options.speed
    this.angle = options.angle
  }

  onMouseDown(e: JQuery.MouseDownEvent, x: number, y: number) {
    // Do not allow drag element while it's still in a transition.
    if (this.cell.getTransitions().indexOf('position') > -1) {
      return
    }

    // Cancel displaying 'drag me!' if dragging already starts.
    if (this.stop) {
      this.stop()
      this.stop = null
    }

    this.edge = this.graph.addEdge({
      shape: 'edge',
      source: this.cell.getBBox().getCenter(),
      target: { x, y },
      zIndex: -1,
      attrs: {
        line: {
          stroke: 'rgba(0,0,0,0.1)',
          strokeWidth: 6,
          targetMarker: {
            stroke: 'black',
            strokeWidth: 2,
            d: 'M 20 -10 L 0 0 L 20 10 z',
          },
        },
      },
    })

    // Change the marker arrow color.
    this.edge.on('change:target', ({ cell }) => {
      const edge = cell as any as Edge
      const sourcePoint = edge.getSourcePoint()!
      const targetPoint = edge.getTargetPoint()!
      const dist = sourcePoint.distance(targetPoint)
      const maxDist = Math.max(
        this.graph.options.width,
        this.graph.options.height,
      )
      const interp = Interp.color('#ffffff', '#ff0000')
      edge.attr('line/targetMarker/fill', interp(dist / maxDist / Math.sqrt(2)))
    })
  }

  onMouseMove(e: JQuery.MouseMoveEvent, x: number, y: number) {
    if (this.edge) {
      this.edge.setTarget({ x, y })
    }
  }

  onMouseUp(e: JQuery.MouseUpEvent, x: number, y: number) {
    if (!this.edge) {
      return
    }

    const sourcePoint = this.edge.getSourcePoint()!
    const targetPoint = this.edge.getTargetPoint()!

    this.edge.remove()
    this.edge = null

    this.fly({
      angle: Math.abs(targetPoint.theta(sourcePoint) - 180),
      speed: sourcePoint.distance(targetPoint) / 2,
    })
  }
}

Graph.registerView('ball', BallView, true)

Graph.registerNode(
  'ball',
  {
    view: 'ball',
    markup: [
      {
        tagName: 'text',
        selector: 'label',
      },
      {
        tagName: 'image',
        selector: 'ball',
      },
    ],
    attrs: {
      label: {
        text: 'Drag me!',
        fontSize: 40,
        fontWeight: 900,
        refX: 0.5,
        refY: -20,
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        fill: 'white',
        strokeWidth: 2,
        stroke: 'black',
        opacity: 0,
        pointerEvents: 'none',
      },
      ball: {
        refWidth: 1,
        refHeight: 1,
      },
    },
  },
  true,
)
