import { Node, Markup, ObjectExt } from '@antv/x6'

export class AngularShape<
  Properties extends AngularShape.Properties = AngularShape.Properties,
> extends Node<Properties> {}

export namespace AngularShape {
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

export namespace AngularShape {
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

  AngularShape.config<Properties>({
    view: 'angular-shape-view',
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

  Node.registry.register('angular-shape', AngularShape, true)
}
