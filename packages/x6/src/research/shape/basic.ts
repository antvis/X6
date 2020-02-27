import { Node } from '../core/node'
import { registerNode } from '../registry/node'

function getMarkup(tagName: string) {
  return `<g class="rotatable"><g class="scalable"><${tagName}/></g><text/></g>`
}

const commonAttr = {
  '.': { fill: '#ffffff', stroke: 'none' },
}

const textAttr = {
  fill: '#000000',
  text: '',
  fontSize: 14,
  refX: 0.5,
  refY: 0.5,
  textAnchor: 'middle',
  yAlignment: 'middle',
  fontFamily: 'Arial, helvetica, sans-serif',
}

const shapeAttr = {
  fill: '#ffffff',
  stroke: '#000000',
}

// tslint:disable-next-line
export const Rect1 = registerNode('rect', {
  markup: getMarkup('rect'),
  attrs: {
    ...commonAttr,
    rect: {
      ...shapeAttr,
      width: 100,
      height: 60,
    },
    text: {
      ...textAttr,
      refX: 0.5,
      refY: 0.5,
    },
  },
})

export class Rect extends Node {}
Rect.setDefaults({
  markup: getMarkup('rect'),
  attrs: {
    ...commonAttr,
    rect: {
      ...shapeAttr,
      width: 100,
      height: 60,
    },
    text: {
      ...textAttr,
      refX: 0.5,
      refY: 0.5,
    },
  },
})

export class Circle extends Node {}
Circle.setDefaults({
  markup: getMarkup('circle'),
  size: { width: 60, height: 60 },
  attrs: {
    ...commonAttr,
    circle: {
      ...shapeAttr,
      r: 30,
      cx: 30,
      cy: 30,
    },
    text: {
      ...textAttr,
      refX: 0.5,
      refY: 0.5,
    },
  },
})

export class Ellipse extends Node {}
Ellipse.setDefaults({
  markup: getMarkup('ellipse'),
  size: { width: 60, height: 40 },
  attrs: {
    ...commonAttr,
    ellipse: {
      ...shapeAttr,
      rx: 30,
      ry: 20,
      cx: 30,
      cy: 20,
    },
    text: {
      ...textAttr,
      refX: 0.5,
      refY: 0.5,
    },
  },
})

export class Polygon extends Node {}
Polygon.setDefaults({
  markup: getMarkup('polygon'),
  size: { width: 60, height: 40 },
  attrs: {
    ...commonAttr,
    polygon: {
      ...shapeAttr,
    },
    text: {
      ...textAttr,
      refX: 0.5,
      refDy: 20,
    },
  },
})

export class Polyline extends Node {}
Polyline.setDefaults({
  markup: getMarkup('polyline'),
  size: { width: 60, height: 40 },
  attrs: {
    ...commonAttr,
    polyline: {
      ...shapeAttr,
    },
    text: {
      ...textAttr,
      refX: 0.5,
      refDy: 20,
    },
  },
})

export class Image extends Node {}
Image.setDefaults({
  markup: getMarkup('image'),
  attrs: {
    ...commonAttr,
    text: {
      ...textAttr,
      refX: 0.5,
      refDy: 20,
    },
  },
})

export class Path extends Node {}
Path.setDefaults({
  markup: getMarkup('path'),
  size: { width: 60, height: 60 },
  attrs: {
    ...commonAttr,
    path: {
      ...shapeAttr,
    },
    text: {
      ...textAttr,
      ref: 'path',
      refX: 0.5,
      refDy: 10,
    },
  },
})

export class Rhombus extends Path {}
Rhombus.setDefaults({
  attrs: {
    path: {
      d: 'M 30 0 L 60 30 30 60 0 30 z',
    },
    text: {
      refY: 0.5,
      refDy: null,
      yAlignment: 'middle',
    },
  },
})
