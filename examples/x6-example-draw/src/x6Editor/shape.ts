import { Graph, Dom } from '@antv/x6'
import { FLOW_CHART_RECT } from './constant'

export default function registerShape() {
  Graph.registerNode('flow_chart_rect', {
    inherit: 'rect',
    width: FLOW_CHART_RECT.width,
    height: FLOW_CHART_RECT.height,
    attrs: {
      fo: {
        refWidth: '100%',
        refHeight: '100%',
      },
      content: {
        contenteditable: 'true',
      }
    },
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
        style: {
          strokeWidth: 1,
        },
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
                style: {
                  width: '100%',
                  minHeight: '12px',
                  textAlign: 'center',
                  fontSize: '12px'
                },
              },
            ],
          },
        ],
      }
    ],
    ports: {
      groups: {
        in: {
          position: 'top',
          attrs: {
            circle: {
              r: 3,
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
              r: 3,
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
        }, {
          group: 'out',
        }
      ]
    }
  })
}