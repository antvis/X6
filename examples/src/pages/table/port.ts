import { Dom, Graph, type Point } from '../../../../src'
import type { PortLayoutCommonArgs } from '../../../../src/registry'

export interface PortArgs extends PortLayoutCommonArgs {
  offset?: number
}

function layout(portsArgs: PortArgs[], p1: Point, groupArgs: PortArgs) {
  return portsArgs.map(({ offset, ...others }) => {
    const p = p1.clone().translate(0, offset || groupArgs.offset || 0)
    if (others.dx || others.dy) {
      p.translate(others.dx || 0, others.dy || 0)
    }

    return {
      angle: 0,
      position: p.toJSON(),
      ...others,
    }
  })
}

Graph.registerPortLayout(
  'table-in',
  (portsArgs, elemBBox, groupArgs) => {
    return layout(portsArgs, elemBBox.getTopLeft(), groupArgs)
  },
  true,
)

Graph.registerPortLayout(
  'table-out',
  (portsArgs, elemBBox, groupArgs) => {
    return layout(portsArgs, elemBBox.getTopRight(), groupArgs)
  },
  true,
)

function getPortMarkup(isLeft: boolean) {
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
        position: 'table-in',
        markup: getPortMarkup(true),
      },
      out: {
        position: 'table-out',
        markup: getPortMarkup(false),
      },
    },
  }
}
