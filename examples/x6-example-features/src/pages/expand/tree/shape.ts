import { Node, Edge } from '@antv/x6'

export class TreeNode extends Node {
  isHidden() {
    return !!this.get('hidden')
  }

  isCollapsed() {
    return !!this.get('collapsed')
  }

  toggleButtonVisibility(visible: boolean) {
    this.attr('buttonGroup', { display: visible ? 'block' : 'none' })
  }

  toggleButtonSign(plus: boolean) {
    if (plus) {
      this.attr('buttonSign', { d: 'M 1 5 9 5 M 5 1 5 9', strokeWidth: 1.6 })
    } else {
      this.attr('buttonSign', { d: 'M 2 5 8 5', strokeWidth: 1.8 })
    }
  }
}

TreeNode.config({
  zIndex: 2,
  width: 100,
  height: 28,
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
    root: {
      pointerEvents: 'none',
    },
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
      fontSize: 14,
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
      event: 'element:collapse',
    },
    buttonSign: {
      refX: 5,
      refY: -5,
      stroke: '#FFFFFF',
      strokeWidth: 1.6,
    },
  },
})

export class TreeEdge extends Edge {
  isHidden() {
    var node = this.getTargetNode() as TreeNode
    return !node || node.isHidden()
  }
}

TreeEdge.config({
  zIndex: 1,
  attrs: {
    root: {
      pointerEvents: 'none',
    },
    line: {
      stroke: '#a0a0a0',
      strokeWidth: 1,
      targetMarker: null,
    },
  },
})
