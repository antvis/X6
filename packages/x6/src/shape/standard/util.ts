import { Markup } from '../../view'

export function getMarkup(tagName: string, selector: string = 'body'): Markup {
  return [
    {
      tagName,
      selector,
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ]
}

export const bodyAttr = {
  fill: '#ffffff',
  stroke: '#333333',
  strokeWidth: 2,
}

export const labelAttr = {
  fontSize: 14,
  fill: '#333333',
  refX: '50%',
  refY: '50%',
  textAnchor: 'middle',
  textVerticalAnchor: 'middle',
}
