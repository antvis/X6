import { Edge } from '../../model/edge'
import { EdgeView } from '../../view/edge'
import { Halo } from './index'

export class EdgePreset {
  constructor(private halo: Halo) {}

  get options() {
    return this.halo.options
  }

  get graph() {
    return this.halo.graph
  }

  get model() {
    return this.halo.model
  }

  get view() {
    return this.halo.view
  }

  get cell() {
    return this.halo.cell
  }

  get edge() {
    return this.cell as Edge
  }

  getPresets(): Halo.Options {
    return {
      className: 'type-edge',
      handles: [
        {
          name: 'remove',
          position: 'nw',
          icon: null,
          events: {
            mousedown: this.removeEdge.bind(this),
          },
        },
        {
          name: 'direction',
          position: 'se',
          icon: null,
          events: {
            mousedown: this.directionSwap.bind(this),
          },
        },
      ],
      content: false,
      bbox(view: EdgeView) {
        return view.graph.localToGraph(view.getPointAtRatio(0.5)!)
      },
      tinyThreshold: -1,
      smallThreshold: -1,
    }
  }

  removeEdge() {
    this.cell.remove()
  }

  directionSwap() {
    const source = this.edge.getSource()
    const target = this.edge.getTarget()

    this.edge.prop({
      source: target,
      target: source,
    })
  }
}
