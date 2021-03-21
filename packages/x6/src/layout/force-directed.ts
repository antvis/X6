import { Point } from '../geometry'
import { Events } from '../common'
import { KeyValue } from '../types'
import { NumberExt } from '../util'
import { Cell } from '../model/cell'
import { Node } from '../model/node'
import { Edge } from '../model/edge'
import { Model } from '../model/model'

export class ForceDirected extends Events {
  t: number

  energy: number

  progress: number

  public readonly options: ForceDirected.Options

  protected edges: Edge[]

  protected nodes: Node[]

  protected nodeData: KeyValue<ForceDirected.NodeData>

  protected edgeData: KeyValue<ForceDirected.EdgeData>

  get model() {
    return this.options.model
  }

  constructor(options: ForceDirected.Options) {
    super()

    this.options = {
      charge: 10,
      edgeDistance: 10,
      edgeStrength: 1,
      ...options,
    }

    this.nodes = this.model.getNodes()
    this.edges = this.model.getEdges()

    this.t = 1
    this.energy = Infinity
    this.progress = 0
  }

  start() {
    const x = this.options.x
    const y = this.options.y
    const width = this.options.width
    const height = this.options.height

    this.nodeData = {}
    this.edgeData = {}

    this.nodes.forEach((node) => {
      const posX = NumberExt.random(x, x + width)
      const posY = NumberExt.random(y, y + height)

      node.position(posX, posY, { forceDirected: true })

      this.nodeData[node.id] = {
        charge: node.prop('charge') || this.options.charge,
        weight: node.prop('weight') || 1,
        x: posX,
        y: posY,
        px: posX,
        py: posY,
        fx: 0,
        fy: 0,
      }
    })

    this.edges.forEach((edge) => {
      this.edgeData[edge.id] = {
        source: edge.getSourceCell()!,
        target: edge.getTargetCell()!,
        strength: edge.prop('strength') || this.options.edgeStrength,
        distance: edge.prop('distance') || this.options.edgeDistance,
      }
    })
  }

  step() {
    if (0.99 * this.t < 0.005) {
      return this.notifyEnd()
    }

    this.energy = 0

    let xBefore = 0
    let yBefore = 0
    let xAfter = 0
    let yAfter = 0

    const nodeCount = this.nodes.length
    const edgeCount = this.edges.length

    for (let i = 0; i < nodeCount - 1; i += 1) {
      const v = this.nodeData[this.nodes[i].id]
      xBefore += v.x
      yBefore += v.y

      for (let j = i + 1; j < nodeCount; j += 1) {
        const u = this.nodeData[this.nodes[j].id]
        const dx = u.x - v.x
        const dy = u.y - v.y
        const distanceSquared = dx * dx + dy * dy
        // const distance = Math.sqrt(distanceSquared)
        const fr = (this.t * v.charge) / distanceSquared
        const fx = fr * dx
        const fy = fr * dy

        v.fx -= fx
        v.fy -= fy
        u.fx += fx
        u.fy += fy

        this.energy += fx * fx + fy * fy
      }
    }

    // Add the last node positions as it couldn't be done in the loops above.
    const last = this.nodeData[this.nodes[nodeCount - 1].id]
    xBefore += last.x
    yBefore += last.y

    // Calculate attractive forces.
    for (let i = 0; i < edgeCount; i += 1) {
      const a = this.edgeData[this.edges[i].id]
      const v = this.nodeData[a.source.id]
      const u = this.nodeData[a.target.id]

      const dx = u.x - v.x
      const dy = u.y - v.y
      const distanceSquared = dx * dx + dy * dy
      const distance = Math.sqrt(distanceSquared)
      const fa = (this.t * a.strength * (distance - a.distance)) / distance
      const fx = fa * dx
      const fy = fa * dy

      const k = v.weight / (v.weight + u.weight)

      v.x += fx * (1 - k)
      v.y += fy * (1 - k)
      u.x -= fx * k
      u.y -= fy * k

      this.energy += fx * fx + fy * fy
    }

    const x = this.options.x
    const y = this.options.y
    const w = this.options.width
    const h = this.options.height
    const gravityCenter = this.options.gravityCenter

    const gravity = 0.1
    const energyBefore = this.energy

    // Set positions on nodes.
    for (let i = 0; i < nodeCount; i += 1) {
      const node = this.nodes[i]
      const data = this.nodeData[node.id]
      const pos = {
        x: data.x,
        y: data.y,
      }

      if (gravityCenter) {
        pos.x += (gravityCenter.x - pos.x) * this.t * gravity
        pos.y += (gravityCenter.y - pos.y) * this.t * gravity
      }

      pos.x += data.fx
      pos.y += data.fy

      // Make sure positions don't go out of the graph area.
      pos.x = Math.max(x, Math.min(x + w, pos.x))
      pos.y = Math.max(y, Math.min(x + h, pos.y))

      // Position Verlet integration.
      const friction = 0.9
      pos.x += friction * (data.px - pos.x)
      pos.y += friction * (data.py - pos.y)

      data.px = pos.x
      data.py = pos.y

      data.fx = 0
      data.fy = 0

      data.x = pos.x
      data.y = pos.y

      xAfter += data.x
      yAfter += data.y

      node.setPosition(pos, { forceDirected: true })
    }

    this.t = this.cool(this.t, this.energy, energyBefore)

    // If the global distance hasn't change much, the layout converged
    // and therefore trigger the `end` event.
    const gdx = xBefore - xAfter
    const gdy = yBefore - yAfter
    const gd = Math.sqrt(gdx * gdx + gdy * gdy)
    if (gd < 1) {
      this.notifyEnd()
    }
  }

  protected cool(t: number, energy: number, energyBefore: number) {
    if (energy < energyBefore) {
      this.progress += 1
      if (this.progress >= 5) {
        this.progress = 0
        return t / 0.99 // Warm up.
      }
    } else {
      this.progress = 0
      return t * 0.99 // Cool down.
    }

    return t // Keep the same temperature.
  }

  protected notifyEnd() {
    this.trigger('end')
  }
}

export namespace ForceDirected {
  export interface Options {
    model: Model
    x: number
    y: number
    width: number
    height: number
    charge?: number
    edgeDistance?: number
    edgeStrength?: number
    gravityCenter?: Point.PointLike
  }

  export interface NodeData {
    x: number
    y: number
    px: number
    py: number
    fx: number
    fy: number
    charge: number
    weight: number
  }

  export interface EdgeData {
    source: Cell
    target: Cell
    strength: number
    distance: number
  }
}
