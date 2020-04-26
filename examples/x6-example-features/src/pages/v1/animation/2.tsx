import React from 'react'
import { v1, Point, Angle } from '@antv/x6'
import { NodeView } from '@antv/x6/es/v1/core/node-view'
import { Interpolation } from '@antv/x6/es/v1/animation'
import '../../index.less'
import '../index.less'

class BallView extends NodeView {
  protected speed: number = 0
  protected angle: number = 0
  protected timerId: number = 0
  protected edge: v1.Edge

  protected init() {
    this.timerId = this.cell.transition('attrs/label/opacity', 1, {
      delay: (1 + Math.random()) * 3000,
      duration: 3000,
      timing: 'inout',
      interpolation: function(a: number, b: number) {
        return function(t: number) {
          return a + b * (1 - Math.abs(1 - 2 * t))
        }
      },
    })

    this.cell.on('transition:end', ({ cell, path }) => {
      if (path == 'position' && this.speed > 5) {
        this.speed /= cell.prop<number>('bounciness') || 2
        this.fly({ angle: 180 - this.angle, speed: this.speed })
      }
    })

    this.cell.on('change:position', ({ cell, current }) => {
      const node = (cell as any) as v1.Node
      this.angle = Point.create(node.getPosition()).theta(
        node.previous('position'),
      )
      //this.speed = we are using constant speed for simplicity

      if (current) {
        if (
          current.x < 0 ||
          current.x > this.graph.options.width - node.getSize().width
        ) {
          this.angle -= 180
          node.pos(node.previous('position')!.x, current.y, { silent: true })
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

    var ga = 9.81
    var h0 =
      this.graph.options.height - this.cell.position.y - this.cell.sizes.height
    var v0 = options.speed
    var sin1 = Math.sin(Angle.toRad(options.angle))

    var flightTime =
      (v0 * sin1 +
        Math.sqrt(Math.pow(v0, 2) * Math.pow(sin1, 2) + 2 * h0 * ga)) /
      ga

    this.cell.transition('position', options, {
      duration: 100 * flightTime,
      interpolation(
        position: Point.PointLike,
        params: { speed: number; angle: number },
      ) {
        return function(t: number) {
          t = flightTime * t
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

    this.cell.transition('rotation', -options.angle, {
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
    if (this.timerId) {
      clearTimeout(this.timerId)
      delete this.timerId
    }
    this.edge = this.graph.addEdge({
      type: 'edge',
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
    }) as any
    // Change the marker arrow color.
    this.edge.on('change:target', ({ cell }) => {
      const edge = (cell as any) as v1.Edge
      const sourcePoint = edge.getSourcePoint()!
      const targetPoint = edge.getTargetPoint()!
      const dist = sourcePoint.distance(targetPoint)
      const maxDist = Math.max(
        this.graph.options.width,
        this.graph.options.height,
      )
      const interpolation = Interpolation.color('#ffffff', '#ff0000')
      edge.attr(
        'line/targetMarker/fill',
        interpolation(dist / maxDist / Math.sqrt(2)),
      )
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
    delete this.edge

    this.fly({
      angle: Math.abs(targetPoint.theta(sourcePoint) - 180),
      speed: sourcePoint.distance(targetPoint) / 2,
    })
  }
}

v1.ViewRegistry.register('ball', BallView as any)

v1.NodeRegistry.register('ball', {
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
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new v1.Graph({
      container: this.container,
      width: 650,
      height: 400,
      gridSize: 1,
    })

    graph.addNode({
      type: 'ball',
      x: 250,
      y: 370,
      width: 30,
      height: 30,
      bounciness: 3,
      attrs: {
        image: {
          'xlink:href':
            'data:image/svg+xml;base64,PHN2ZyB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyIgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIiB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIgaWQ9InN2ZzIiIHZpZXdCb3g9IjAgMCA1MTAgNTEwIiB2ZXJzaW9uPSIxLjEiIGlua3NjYXBlOnZlcnNpb249IjAuNDcgcjIyNTgzIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBzb2RpcG9kaTpkb2NuYW1lPSJibHVlIGJhbGwuc3ZnIj4KICA8c29kaXBvZGk6bmFtZWR2aWV3IHBhZ2Vjb2xvcj0iI2ZmZmZmZiIgYm9yZGVyY29sb3I9IiM2NjY2NjYiIGJvcmRlcm9wYWNpdHk9IjEiIG9iamVjdHRvbGVyYW5jZT0iMTAiIGdyaWR0b2xlcmFuY2U9IjEwIiBndWlkZXRvbGVyYW5jZT0iMTAiIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIiBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIiBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjEwMjQiIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjU0OCIgaWQ9Im5hbWVkdmlldzE2IiBzaG93Z3JpZD0iZmFsc2UiIGlua3NjYXBlOnNuYXAtZ2xvYmFsPSJmYWxzZSIgaW5rc2NhcGU6em9vbT0iMC40MzY2Mzc1MyIgaW5rc2NhcGU6Y3g9IjI1Ni4yMzMxMSIgaW5rc2NhcGU6Y3k9IjI1OC44NTEwNyIgaW5rc2NhcGU6d2luZG93LXg9Ii04IiBpbmtzY2FwZTp3aW5kb3cteT0iLTgiIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIvPgogIDxkZWZzIGlkPSJkZWZzNCI+CiAgICA8aW5rc2NhcGU6cGF0aC1lZmZlY3QgZWZmZWN0PSJzcGlybyIgaWQ9InBhdGgtZWZmZWN0MzYyMCIgaXNfdmlzaWJsZT0idHJ1ZSIvPgogICAgPGlua3NjYXBlOnBlcnNwZWN0aXZlIHNvZGlwb2RpOnR5cGU9Imlua3NjYXBlOnBlcnNwM2QiIGlua3NjYXBlOnZwX3g9IjAgOiAyNTUgOiAxIiBpbmtzY2FwZTp2cF95PSIwIDogMTAwMCA6IDAiIGlua3NjYXBlOnZwX3o9IjUxMCA6IDI1NSA6IDEiIGlua3NjYXBlOnBlcnNwM2Qtb3JpZ2luPSIyNTUgOiAxNzAgOiAxIiBpZD0icGVyc3BlY3RpdmUxOCIvPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJsaW5lYXJHcmFkaWVudDM1OTQiPgogICAgICA8c3RvcCBpZD0ic3RvcDM1OTYiIHN0b3AtY29sb3I9IiNGRkYiIG9mZnNldD0iMCIvPgogICAgICA8c3RvcCBpZD0ic3RvcDM1OTgiIHN0b3AtY29sb3I9IiMwMDAiIHN0b3Atb3BhY2l0eT0iMC40MTA3MTQzIiBvZmZzZXQ9IjEiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8ZmlsdGVyIGlkPSJmaWx0ZXI0MDY3IiBoZWlnaHQ9IjEuMjYwMTk3MiIgd2lkdGg9IjEuMjg0MjYyOCIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiB5PSItMC4xMzAwOTg1OCIgeD0iLTAuMTQyMTMxNCI+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpZD0iZmVHYXVzc2lhbkJsdXI0MDY5IiBzdGREZXZpYXRpb249IjEuOTEyMzg5NCIvPgogICAgPC9maWx0ZXI+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InJhZGlhbEdyYWRpZW50NDA4MyIgeGxpbms6aHJlZj0iI2xpbmVhckdyYWRpZW50MzU5NCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGN5PSI0NzkuNTQiIGN4PSIyNzIuMTUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLTAuMzExNjQ5OTIsMS4zMTAxMDczLC0xLjMxMDE2NjEsLTAuMzExNjYzODksMTA0MS4yNzkxLDE5OS4yMDMwOSkiIHI9IjI1My4yNiIvPgogICAgPGZpbHRlciB4PSItMC4xNDMxMjQ1NSIgeT0iLTAuMTMxMDEwNzYiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiIgd2lkdGg9IjEuMjg2MjQ5IiBoZWlnaHQ9IjEuMjYyMDIxNSIgaWQ9ImZpbHRlcjM2MDEiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyMy4xMDkyNDgiIGlkPSJmZUdhdXNzaWFuQmx1cjM2MDMiLz4KICAgIDwvZmlsdGVyPgogICAgPGZpbHRlciB4PSItMC4xNDIxMzE0IiB5PSItMC4xMzAwOTg1OCIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiB3aWR0aD0iMS4yODQyNjI4IiBoZWlnaHQ9IjEuMjYwMTk3MiIgaWQ9ImZpbHRlcjM2MDUiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyMi45NDg2NzMiIGlkPSJmZUdhdXNzaWFuQmx1cjM2MDciLz4KICAgIDwvZmlsdGVyPgogICAgPGZpbHRlciB4PSItMC4xNDIxMzE0IiB5PSItMC4xMzAwOTg1OCIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIiB3aWR0aD0iMS4yODQyNjI4IiBoZWlnaHQ9IjEuMjYwMTk3MiIgaWQ9ImZpbHRlcjM2MDkiPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyMi45NDg2NzMiIGlkPSJmZUdhdXNzaWFuQmx1cjM2MTEiLz4KICAgIDwvZmlsdGVyPgogICAgPGZpbHRlciBpbmtzY2FwZTpjb2xsZWN0PSJhbHdheXMiIGlkPSJmaWx0ZXIzNzU2Ij4KICAgICAgPGZlR2F1c3NpYW5CbHVyIGlua3NjYXBlOmNvbGxlY3Q9ImFsd2F5cyIgc3RkRGV2aWF0aW9uPSI3LjMxNTE1MzMiIGlkPSJmZUdhdXNzaWFuQmx1cjM3NTgiLz4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KICA8bWV0YWRhdGEgaWQ9Im1ldGFkYXRhNyI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KICAgICAgICA8ZGM6dGl0bGUvPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZyBpZD0ibGF5ZXIxIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNTQuMjg1NjksLTIyOC4wNzY0OSkiPgogICAgPHBhdGggaWQ9InBhdGgyODE4IiBzdHJva2UtbGluZWpvaW49ImJldmVsIiBzdHlsZT0ic3Ryb2tlLWRhc2hhcnJheTpub25lOyIgZD0iTTY2MCw0ODUuNzhhMjUyLjg2LDI1Mi44NiwwLDEsMSwwLC0wLjU2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0LC0yKSIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAuNDc5IiBzdHJva2U9IiM3ODc4NzgiIHN0cm9rZS1taXRlcmxpbWl0PSI0IiBzdHJva2Utd2lkdGg9IjAuODAwMDAwMDEiIGZpbGw9IiMxMDZkZDUiLz4KICAgIDxwYXRoIGlkPSJwYXRoMzU5MiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNCwtMikiIGZpbGw9InVybCgjcmFkaWFsR3JhZGllbnQ0MDgzKSIgZD0iTTY2MCw0ODUuNzhhMjUyLjg2LDI1Mi44NiwwLDEsMSwwLC0wLjU2Ii8+CiAgICA8cGF0aCBpZD0icGF0aDQwNzgiIGQ9Ik02NjAsNDg1Ljc4YTI1Mi44NiwyNTIuODYsMCwxLDEsMCwtMC41NiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNCwtMikiIGZpbGw9InVybCgjcmFkaWFsR3JhZGllbnQ0MDgzKSIvPgogIDwvZz4KPC9zdmc+',
        },
      },
    })

    graph.addNode({
      type: 'ball',
      x: 400,
      y: 350,
      width: 50,
      height: 50,
      bounciness: 1.5,
      attrs: {
        image: {
          'xlink:href':
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iODAwIiBoZWlnaHQ9IjgwMCIgdmlld0JveD0iLTEwNSAtMTA1IDIxMCAyMTAiPgogICA8ZGVmcz4KICAgICAgPGNsaXBQYXRoIGlkPSJiYWxsIj4KICAgICAgICAgPGNpcmNsZSByPSIxMDAiIHN0cm9rZS13aWR0aD0iMCIvPgogICAgICA8L2NsaXBQYXRoPgogICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InNoYWRvdzEiIGN4PSIuNCIgY3k9Ii4zIiByPSIuOCI+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIuNCIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICAgIDxzdG9wIG9mZnNldD0iLjgiIHN0b3AtY29sb3I9IiNFRUVFRUUiIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9InNoYWRvdzIiIGN4PSIuNSIgY3k9Ii41IiByPSIuNSI+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSJ3aGl0ZSIgc3RvcC1vcGFjaXR5PSIwIi8+CiAgICAgICAgPHN0b3Agb2Zmc2V0PSIuOCIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCIvPgogICAgICAgIDxzdG9wIG9mZnNldD0iLjk5IiBzdG9wLWNvbG9yPSJibGFjayIgc3RvcC1vcGFjaXR5PSIuMyIvPgogICAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iYmxhY2siIHN0b3Atb3BhY2l0eT0iMSIvPgogICAgICA8L3JhZGlhbEdyYWRpZW50PgogICAgICA8ZyBpZD0iYmxhY2tfc3R1ZmYiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsaXAtcGF0aD0idXJsKCNiYWxsKSI+CiAgICAgICAgIDxnIGZpbGw9ImJsYWNrIj4KICAgICAgICAgICAgPHBhdGggZD0iTSA2LC0zMiBRIDI2LC0yOCA0NiwtMTkgUSA1NywtMzUgNjQsLTQ3IFEgNTAsLTY4IDM3LC03NiBRIDE3LC03NSAxLC02OCBRIDQsLTUxIDYsLTMyIi8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gLTI2LC0yIFEgLTQ1LC04IC02MiwtMTEgUSAtNzQsNSAtNzYsMjIgUSAtNjksNDAgLTUwLDU0IFEgLTMyLDQ3IC0xNywzOSBRIC0yMywxNSAtMjYsLTIiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAtOTUsMjIgUSAtMTAyLDEyIC0xMDIsLTggViA4MCBIIC04NSBRIC05NSw0NSAtOTUsMjIiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSA1NSwyNCBRIDQxLDQxIDI0LDUyIFEgMjgsNjUgMzEsNzkgUSA1NSw3OCA2OCw2NyBRIDc4LDUwIDgwLDM1IFEgNjUsMjggNTUsMjQiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAwLDEyMCBMIC0zLDk1IFEgLTI1LDkzIC00Miw4MiBRIC01MCw4NCAtNjAsODEiLz4KICAgICAgICAgICAgPHBhdGggZD0iTSAtOTAsLTQ4IFEgLTgwLC01MiAtNjgsLTQ5IFEgLTUyLC03MSAtMzUsLTc3IFEgLTM1LC0xMDAgLTQwLC0xMDAgSCAtMTAwIi8+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gMTAwLC01NSBMIDg3LC0zNyBRIDk4LC0xMCA5Nyw1IEwgMTAwLDYiLz4KICAgICAgICAgPC9nPgogICAgICAgICA8ZyBmaWxsPSJub25lIj4KICAgICAgICAgICAgPHBhdGggZD0iTSA2LC0zMiBRIC0xOCwtMTIgLTI2LC0yICAgICAgICAgICAgICAgICAgICAgIE0gNDYsLTE5IFEgNTQsNSA1NSwyNCAgICAgICAgICAgICAgICAgICAgICBNIDY0LC00NyBRIDc3LC00NCA4NywtMzcgICAgICAgICAgICAgICAgICAgICAgTSAzNywtNzYgUSAzOSwtOTAgMzYsLTEwMCAgICAgICAgICAgICAgICAgICAgICBNIDEsLTY4IFEgLTEzLC03NyAtMzUsLTc3ICAgICAgICAgICAgICAgICAgICAgIE0gLTYyLC0xMSBRIC02NywtMjUgLTY4LC00OSAgICAgICAgICAgICAgICAgICAgICBNIC03NiwyMiBRIC04NSwyNCAtOTUsMjIgICAgICAgICAgICAgICAgICAgICAgTSAtNTAsNTQgUSAtNDksNzAgLTQyLDgyICAgICAgICAgICAgICAgICAgICAgIE0gLTE3LDM5IFEgMCw0OCAyNCw1MiAgICAgICAgICAgICAgICAgICAgICBNIDMxLDc5IFEgMjAsOTIgLTMsOTUgICAgICAgICAgICAgICAgICAgICAgTSA2OCw2NyBMIDgwLDgwICAgICAgICAgICAgICAgICAgICAgIE0gODAsMzUgUSA5MCwyNSA5Nyw1ICAgICAgICAgICAgICIvPgogICAgICAgICA8L2c+CiAgICAgIDwvZz4KICAgPC9kZWZzPgogICA8Y2lyY2xlIHI9IjEwMCIgZmlsbD0id2hpdGUiIHN0cm9rZT0ibm9uZSIvPgogICA8Y2lyY2xlIHI9IjEwMCIgZmlsbD0idXJsKCNzaGFkb3cxKSIgc3Ryb2tlPSJub25lIi8+CiAgIDx1c2UgeGxpbms6aHJlZj0iI2JsYWNrX3N0dWZmIiBzdHJva2U9IiNFRUUiIHN0cm9rZS13aWR0aD0iNyIvPgogICA8dXNlIHhsaW5rOmhyZWY9IiNibGFja19zdHVmZiIgc3Ryb2tlPSIjREREIiBzdHJva2Utd2lkdGg9IjQiLz4KICAgPHVzZSB4bGluazpocmVmPSIjYmxhY2tfc3R1ZmYiIHN0cm9rZT0iIzk5OSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgIDx1c2UgeGxpbms6aHJlZj0iI2JsYWNrX3N0dWZmIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgPGNpcmNsZSByPSIxMDAiIGZpbGw9InVybCgjc2hhZG93MikiIHN0cm9rZT0ibm9uZSIvPgo8L3N2Zz4=',
        },
      },
    })
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <div
          ref={this.refContainer}
          className="x6-graph"
          style={{
            backgroundImage: 'linear-gradient(to bottom, #00BFFF , #FFFFFF)',
          }}
        />
      </div>
    )
  }
}
