import { Node, Edge, Shape } from '@antv/x6'

export class TreeNode extends Node {
  private collapsed: boolean = false

  protected postprocess() {
    this.toggleCollapse(false)
  }

  isCollapsed() {
    return this.collapsed === true
  }

  toggleButtonVisibility(visible: boolean) {
    this.attr('buttonGroup', { display: visible ? 'block' : 'none' })
  }

  toggleCollapse(collapsed: boolean) {
    const target = collapsed == null ? !this.collapsed : collapsed
    if (!target) {
      this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9', strokeWidth: 1.6 })
    } else {
      this.attr('buttonSign', { d: 'M 2 5 8 5', strokeWidth: 1.8 })
    }
    this.collapsed = target
  }
}

TreeNode.config({
  zIndex: 2,
  markup: [
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted',
          },
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'none',
            'pointer-events': 'none',
          },
        },
      ],
    },
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: '#ffffff',
      stroke: '#a0a0a0',
    },
    label: {
      textWrap: {
        ellipsis: true,
        width: -10,
      },
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 12,
    },
    buttonGroup: {
      refX: '100%',
      refY: '50%',
    },
    button: {
      fill: '#4C65DD',
      stroke: 'none',
      x: -10,
      y: -10,
      height: 20,
      width: 30,
      rx: 10,
      ry: 10,
      cursor: 'pointer',
      event: 'node:collapse',
    },
    buttonSign: {
      refX: 5,
      refY: -5,
      stroke: '#FFFFFF',
      strokeWidth: 1.6,
    },
  },
})

export class TreeEdge extends Shape.Edge {
  isHidden() {
    var node = this.getTargetNode() as TreeNode
    return !node || !node.isVisible()
  }
}

TreeEdge.config({
  zIndex: 1,
  attrs: {
    line: {
      stroke: '#a0a0a0',
      strokeWidth: 1,
      targetMarker: null,
    },
  },
})

Node.registry.register('tree-node', TreeNode as typeof Node)
Edge.registry.register('tree-edge', TreeEdge as typeof Edge)
