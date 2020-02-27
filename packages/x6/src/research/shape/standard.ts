import { Node } from '../core/node'

export class Rectangle extends Node {}
Rectangle.setDefaults({
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 2,
      stroke: '#000000',
      fill: '#FFFFFF',
    },
    label: {
      fontSize: 14,
      fill: '#333333',
      textVerticalAnchor: 'middle',
      textAnchor: 'middle',
      refX: '50%',
      refY: '50%',
    },
  },
})

export class Circle extends Node {}
Circle.setDefaults({
  markup: [
    {
      tagName: 'circle',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      refCx: '50%',
      refCy: '50%',
      refR: '50%',
      strokeWidth: 2,
      stroke: '#333333',
      fill: '#FFFFFF',
    },
    label: {
      textVerticalAnchor: 'middle',
      textAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 14,
      fill: '#333333',
    },
  },
})

export class Ellipse extends Node {}

Ellipse.setDefaults({
  markup: [
    {
      tagName: 'ellipse',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      refCx: '50%',
      refCy: '50%',
      refRx: '50%',
      refRy: '50%',
      strokeWidth: 2,
      stroke: '#333333',
      fill: '#FFFFFF',
    },
    label: {
      textVerticalAnchor: 'middle',
      textAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 14,
      fill: '#333333',
    },
  },
})

export class Path extends Node {}
Path.setDefaults({
  markup: [
    {
      tagName: 'path',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      refD: 'M 0 0 L 10 0 10 10 0 10 Z',
      strokeWidth: 2,
      stroke: '#333333',
      fill: '#FFFFFF',
    },
    label: {
      textVerticalAnchor: 'middle',
      textAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 14,
      fill: '#333333',
    },
  },
})

export class Polygon extends Node {}
Polygon.setDefaults({
  markup: [
    {
      tagName: 'polygon',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      refPoints: '0 0 10 0 10 10 0 10',
      strokeWidth: 2,
      stroke: '#333333',
      fill: '#FFFFFF',
    },
    label: {
      textVerticalAnchor: 'middle',
      textAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 14,
      fill: '#333333',
    },
  },
})

export class Polyline extends Node {}
Polyline.setDefaults({
  markup: [
    {
      tagName: 'polyline',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      refPoints: '0 0 10 0 10 10 0 10 0 0',
      strokeWidth: 2,
      stroke: '#333333',
      fill: '#FFFFFF',
    },
    label: {
      textVerticalAnchor: 'middle',
      textAnchor: 'middle',
      refX: '50%',
      refY: '50%',
      fontSize: 14,
      fill: '#333333',
    },
  },
})

export class Image extends Node {}
Image.setDefaults({
  markup: [
    {
      tagName: 'image',
      selector: 'image',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    image: {
      refWidth: '100%',
      refHeight: '100%',
      // xlinkHref: '[URL]'
    },
    label: {
      textVerticalAnchor: 'top',
      textAnchor: 'middle',
      refX: '50%',
      refY: '100%',
      refY2: 10,
      fontSize: 14,
      fill: '#333333',
    },
  },
})

export class BorderedImage extends Node {}
BorderedImage.setDefaults({
  markup: [
    {
      tagName: 'rect',
      selector: 'background',
      attributes: {
        stroke: 'none',
      },
    },
    {
      tagName: 'image',
      selector: 'image',
    },
    {
      tagName: 'rect',
      selector: 'border',
      attributes: {
        fill: 'none',
      },
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    border: {
      refWidth: '100%',
      refHeight: '100%',
      stroke: '#333333',
      strokeWidth: 2,
    },
    background: {
      refWidth: -1,
      refHeight: -1,
      x: 0.5,
      y: 0.5,
      fill: '#FFFFFF',
    },
    image: {
      // xlinkHref: '[URL]'
      refWidth: -1,
      refHeight: -1,
      x: 0.5,
      y: 0.5,
    },
    label: {
      textVerticalAnchor: 'top',
      textAnchor: 'middle',
      refX: '50%',
      refY: '100%',
      refY2: 10,
      fontSize: 14,
      fill: '#333333',
    },
  },
})

export class EmbeddedImage extends Node {}
EmbeddedImage.setDefaults({
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'image',
      selector: 'image',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      stroke: '#333333',
      fill: '#FFFFFF',
      strokeWidth: 2,
    },
    image: {
      // xlinkHref: '[URL]'
      refWidth: '30%',
      refHeight: -20,
      x: 10,
      y: 10,
      preserveAspectRatio: 'xMidYMin',
    },
    label: {
      textVerticalAnchor: 'top',
      textAnchor: 'left',
      refX: '30%',
      refX2: 20, // 10 + 10
      refY: 10,
      fontSize: 14,
      fill: '#333333',
    },
  },
})
