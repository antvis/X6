import { Shape, Edge } from '@antv/x6'
import './edge.less'

export class BaseEdge extends Shape.Edge {
  // eslint-disable-next-line class-methods-use-this
  isGroupEdge() {
    return false
  }
}

export class GuideEdge extends BaseEdge {}

GuideEdge.config({
  shape: 'GuideEdge',
  connector: { name: 'pai' },
  zIndex: 2,
  attrs: {
    line: {
      stroke: '#808080',
      strokeWidth: 1,
      targetMarker: {
        stroke: 'none',
        fill: 'none',
      },
    },
  },
})

export class X6DemoGroupEdge extends GuideEdge {
  // eslint-disable-next-line class-methods-use-this
  isGroupEdge() {
    return true
  }
}

X6DemoGroupEdge.config({
  shape: 'X6DemoGroupEdge',
})

Edge.registry.register({
  GuideEdge: GuideEdge as any,
  X6DemoGroupEdge: X6DemoGroupEdge as any,
})
