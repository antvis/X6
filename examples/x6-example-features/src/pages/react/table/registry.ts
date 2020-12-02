import { Dom, Markup } from '@antv/x6'

function getPortMarkup(isLeft: boolean): Markup {
  return [
    {
      tagName: 'circle',
      attrs: {
        magnet: 'true',
        fill: 'none',
        stroke: 'transparent',
      },
    },
    {
      tagName: 'foreignObject',
      selector: 'fo',
      attrs: {
        width: 12,
        height: 12,
        x: isLeft ? 8 : -20,
        y: -5,
        magnet: 'true',
      },
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
          },
          children: [
            {
              tagName: 'div',
              selector: 'content',
              style: {
                width: '100%',
                height: '100%',
              },
            },
          ],
        },
      ],
    },
  ]
}

export function getPortsDefinition() {
  return {
    groups: {
      in: {
        position: 'left',
        markup: getPortMarkup(true),
      },
      out: {
        position: 'right',
        markup: getPortMarkup(false),
      },
    },
  }
}
