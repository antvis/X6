import { ObjectExt, Markup, Node } from '@antv/x6'

export class ReactShape<
  Properties extends ReactShape.Properties = ReactShape.Properties,
> extends Node<Properties> {}

export namespace ReactShape {
  export type Primer =
    | 'rect'
    | 'circle'
    | 'path'
    | 'ellipse'
    | 'polygon'
    | 'polyline'

  export interface Properties extends Node.Properties {
    primer?: Primer
  }
}

export namespace ReactShape {
  function getMarkup(primer?: Primer) {
    const markup: Markup.JSONMarkup[] = []
    const content = Markup.getForeignObjectMarkup()

    if (primer) {
      markup.push(
        ...[
          {
            tagName: primer,
            selector: 'body',
          },
          content,
        ],
      )
    } else {
      markup.push(content)
    }

    return markup
  }

  ReactShape.config<Properties>({
    view: 'react-shape-view',
    markup: getMarkup(),
    attrs: {
      body: {
        fill: 'none',
        stroke: 'none',
        refWidth: '100%',
        refHeight: '100%',
      },
      fo: {
        refWidth: '100%',
        refHeight: '100%',
      },
    },
    propHooks(metadata: Properties) {
      if (metadata.markup == null) {
        const primer = metadata.primer
        if (primer) {
          metadata.markup = getMarkup(primer)

          let attrs = {}
          switch (primer) {
            case 'circle':
              attrs = {
                refCx: '50%',
                refCy: '50%',
                refR: '50%',
              }
              break
            case 'ellipse':
              attrs = {
                refCx: '50%',
                refCy: '50%',
                refRx: '50%',
                refRy: '50%',
              }
              break
            default:
              break
          }
          metadata.attrs = ObjectExt.merge(
            {},
            {
              body: {
                refWidth: null,
                refHeight: null,
                ...attrs,
              },
            },
            metadata.attrs || {},
          )
        }
      }
      return metadata
    },
  })

  Node.registry.register('react-shape', ReactShape, true)
}
