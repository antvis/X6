import React from 'react'
import { Graph, Node, NodeView, Dom, Vector, Point, Angle } from '@antv/x6'
import '../index.less'

class ConveyorNode extends Node {
  addPallet() {
    this.prop('hasPallet', true)
  }

  removePallet() {
    this.prop('hasPallet', false)
  }

  hasPallet() {
    return !!this.prop('hasPallet')
  }

  switchPallet() {
    if (this.hasPallet()) {
      this.removePallet()
    } else {
      this.addPallet()
    }
  }

  getOuterRectBBox() {
    var size = this.getSize()
    var bbox = {
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
    }

    return bbox
  }

  getInnerRectBBox() {
    var padding = 2
    var size = this.getSize()
    var bbox = {
      x: padding,
      y: padding,
      width: size.width - 2 * padding,
      height: size.height - 2 * padding,
    }

    return bbox
  }
}

const innerRect = Vector.create('rect').addClass('rect-inner').node
const outerRect = Vector.create('rect').addClass('rect-outer').node

class ConveyorNodeView extends NodeView<ConveyorNode> {
  svgOuterRect: SVGRectElement
  svgInnerRect: SVGRectElement

  confirmUpdate(flag: number) {
    if (this.hasAction(flag, 'markup')) this.renderMarkup()
    if (this.hasAction(flag, 'pallet')) this.updatePallet()
    if (this.hasAction(flag, 'resize')) this.resize()
    if (this.hasAction(flag, 'rotate')) this.rotate()
    if (this.hasAction(flag, 'translate')) this.translate()
  }

  renderMarkup() {
    this.svgOuterRect = outerRect.cloneNode()
    this.svgInnerRect = innerRect.cloneNode()
    this.container.appendChild(this.svgOuterRect)
    this.container.appendChild(this.svgInnerRect)
  }

  updatePallet() {
    var palletColor = this.cell.hasPallet() ? 'blue' : 'red'
    Dom.attr(this.svgInnerRect, 'fill', palletColor)
  }

  updateRectsDimensions() {
    var node = this.cell
    Dom.attr(this.svgOuterRect, node.getOuterRectBBox())
    Dom.attr(this.svgInnerRect, node.getInnerRectBBox())
  }

  resize() {
    this.updateRectsDimensions()
  }

  translate() {
    var node = this.cell
    var position = node.getPosition()
    Dom.translate(this.container, position.x, position.y, { absolute: true })
  }

  rotate() {
    var node = this.cell
    var angle = node.getAngle()
    var size = node.getSize()
    Dom.rotate(this.container, angle, size.width / 2, size.height / 2, {
      absolute: true,
    })
  }
}

ConveyorNodeView.config({
  bootstrap: ['translate', 'resize', 'rotate', 'pallet', 'markup'],
  actions: {
    size: ['resize', 'rotate'],
    angle: ['rotate'],
    position: ['translate'],
    hasPallet: ['pallet'],
  },
})

Node.registry.register('performance_conveyor', ConveyorNode, true)
NodeView.registry.register('performance_conveyor_view', ConveyorNodeView, true)

ConveyorNode.config({ view: 'performance_conveyor_view' })

function createCircle(
  center: Point.PointLike,
  radius: number,
  rectSize: number,
) {
  var nodes = []

  for (var angle = 0; angle < 360; angle += 3) {
    var p = Point.fromPolar(radius, Angle.toRad(angle), center)

    var conveyorElement = new ConveyorNode({
      position: { x: p.x, y: p.y },
      size: { width: rectSize, height: rectSize },
      angle: -angle,
    })

    if (nodes.length % 2 === 0) {
      conveyorElement.addPallet()
    } else {
      conveyorElement.removePallet()
    }

    nodes.push(conveyorElement)
  }

  return nodes
}

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
      width: 1000,
      height: 1000,
      grid: 1,
      background: {
        color: '#000000',
      },
    })

    // efficient drawing
    var rectSize = 18
    var center = graph.getGraphArea().getCenter()
    var radius = 1000 / 2
    var nodes: ConveyorNode[] = []
    for (var i = 0; i < 10; i++) {
      nodes.push(...createCircle(center, radius - 50 - i * 30, rectSize))
    }

    graph.model.resetCells(nodes)

    //

    var frames = 0
    var startTime = Date.now()
    var prevTime = startTime
    var fpsElement = document.getElementById('fps') as HTMLElement

    var updateConveyor = function () {
      for (i = 0; i < nodes.length; i += 1) {
        nodes[i].switchPallet()
      }

      var time = Date.now()
      frames++

      if (time > prevTime + 1000) {
        var fps = Math.round((frames * 1000) / (time - prevTime))
        prevTime = time
        frames = 0
        fpsElement.textContent = 'FPS: ' + fps
      }
    }

    setInterval(updateConveyor, 100)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        className="x6-graph-wrap"
        style={{
          backgroundColor: '#000',
        }}
      >
        <div
          id="fps"
          style={{
            position: 'fixed',
            color: '#fff',
            top: 10,
            left: 10,
          }}
        />
        <div
          ref={this.refContainer}
          className="x6-graph"
          style={{ boxShadow: 'none' }}
        />
      </div>
    )
  }
}
