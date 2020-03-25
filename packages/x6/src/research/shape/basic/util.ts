export const rootAttr = {
  '.': {
    fill: '#ffffff',
    stroke: 'none',
  },
}

export const shapeAttr = {
  fill: '#ffffff',
  stroke: '#000000',
}

export const textAttr = {
  text: '',
  fontSize: 14,
  fill: '#000000',
  textAnchor: 'middle',
  yAlignment: 'middle',
  fontFamily: 'Arial, helvetica, sans-serif',
}

export function getMarkup(tagName: string, noText: boolean = false) {
  return `<g class="rotatable"><g class="scalable"><${tagName}/></g>${
    noText ? '' : '<text/>'
  }</g>`
}

export function getName(name: string) {
  return `basic.${name}`
}
