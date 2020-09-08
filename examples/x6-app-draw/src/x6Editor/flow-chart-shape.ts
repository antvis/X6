import { Graph, Dom } from '@antv/x6'

export const FlowChartRect = Graph.registerNode('flow-chart-rect', {
  inherit: 'rect',
  width: 120,
  height: 60,
  attrs: {
    body: {
      stroke: '#ea6b66',
      strokeWidth: 2,
      fill: '#ffcc99',
    },
    fo: {
      refWidth: '100%',
      refHeight: '100%',
    },
    content: {
      contenteditable: 'true',
      class: 'x6-edit-text',
      style: {
        width: '100%',
        textAlign: 'center',
        fontSize: 12,
        color: '#000000',
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
            r: 5,
            magnet: true,
            stroke: '#ea6b66',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      out: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#ea6b66',
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
export const FlowChartPloygon = Graph.registerNode('flow-chart-ploygon', {
  inherit: 'polygon',
  width: 140,
  height: 70,
  attrs: {
    body: {
      stroke: '#ea6b66',
      strokeWidth: 2,
      fill: '#ffcc99',
      refPoints: '60,20 80,60 60,100 40,60',
    },
    fo: {
      refWidth: '100%',
      refHeight: '100%',
    },
    content: {
      contenteditable: 'true',
      class: 'x6-edit-text',
      style: {
        width: '100%',
        textAlign: 'center',
        fontSize: 12,
        color: '#000000',
      },
    },
  },
  markup: [
    {
      tagName: 'polygon',
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
            r: 5,
            magnet: true,
            stroke: '#ea6b66',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      out: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#ea6b66',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#ea6b66',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#ea6b66',
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
