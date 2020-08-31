import { Graph, Dom } from '@antv/x6'

export const FlowChartRect = Graph.registerNode('flow-chart-rect', {
  inherit: 'rect',
  width: 120,
  height: 60,
  attrs: {
    body: {
      stroke: '#31d0c6',
      strokeWidth: 2,
      fill: '#f8b9a6',
    },
    fo: {
      refWidth: '100%',
      refHeight: '100%',
    },
    content: {
      contenteditable: 'true',
      style: {
        width: '100%',
        minHeight: '12px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#fff',
      },
    },
  },
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'foreignObject',
      selector: 'fo',
      children: [
        {
          ns: Dom.ns.xhtml,
          tagName: 'body',
          selector: 'foBody',
          attrs: {
            xmlns: Dom.ns.xhtml,
          },
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          children: [
            {
              tagName: 'div',
              selector: 'content',
            },
          ],
        },
      ],
    },
  ],
  ports: {
    groups: {
      in: {
        position: 'top',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      out: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 6,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
    },
    items: [
      {
        group: 'in',
      },
      {
        group: 'out',
      },
    ],
  },
})
