import { Node, Edge } from '@antv/x6'

export const Star = Node.define({
  markup: [
    {
      tagName: 'ellipse',
      selector: 'ellipse',
    },
  ],
  size: {
    width: 30,
    height: 30,
  },
  attrs: {
    ellipse: {
      refCX: '50%',
      refCY: '50%',
      refRx: '50%',
      refRy: '50%',
      fill: 'white',
      stroke: 'white',
      strokeOpacity: 0.5,
      strokeWidth: 8,
      cursor: 'pointer',
    },
  },
})

export const Name = Node.define({
  markup: [
    {
      tagName: 'text',
      selector: 'text',
    },
  ],
  attrs: {
    text: {
      stroke: '#b0c4de',
      fill: '#b0c4de',
      cursor: 'pointer',
      textAnchor: 'middle',
      fontSize: 80,
      fontFamily: 'fantasy',
      fontWeight: 'bold',
      letterSpacing: 10,
    },
  },
})

export class Connection extends Edge {
  highlight() {
    this.attr('line/stroke', '#FF3355')
  }

  unhighlight() {
    this.attr('line/stroke', '#FFCC12')
  }
}

Connection.config({
  markup: [
    {
      tagName: 'path',
      selector: 'line',
      attributes: {
        fill: 'none',
      },
    },
    {
      tagName: 'path',
      selector: 'wrap',
      attributes: {
        fill: 'none',
      },
    },
  ],
  attrs: {
    line: {
      connection: true,
      stroke: '#FFCC12',
      strokeWidth: 8,
    },
    wrap: {
      connection: true,
      stroke: 'transparent',
      strokeWidth: 20,
      cursor: 'pointer',
    },
  },
})
