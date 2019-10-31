import '../../../../../src/addon/shapes'
import { Style } from '../../../../../src'

export interface DataItem {
  title: string
  tags: string
  data?: any,
  width: number
  height: number
  style: Style
}

export const generals: DataItem[] = [
  {
    title: 'Rectangle',
    tags: 'rect rectangle box',
    width: 120,
    height: 60,
    style: {
      shape: 'rectangle',
    },
  },
  {
    title: 'Rounded Rectangle',
    tags: 'rounded rect rectangle box',
    width: 120,
    height: 60,
    style: {
      shape: 'rectangle',
      rounded: true,
    },
  },
  {
    title: 'Text',
    data: 'Text',
    tags: 'text textbox textarea label',
    width: 40,
    height: 20,
    style: {
      shape: 'rectangle',
      stroke: 'none',
      fill: 'none',
      align: 'center',
      verticalAlign: 'middle',
      whiteSpace: 'wrap',
      overflow: 'hidden',
      htmlLabel: true,
    },
  },
  {
    title: 'Textbox',
    data: '<h1>Heading</h1><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>',
    tags: 'text textbox textarea',
    width: 190,
    height: 120,
    style: {
      shape: 'rectangle',
      stroke: 'none',
      fill: 'none',
      align: 'left',
      verticalAlign: 'middle',
      whiteSpace: 'wrap',
      htmlLabel: true,
    },
  },
  {
    title: 'Ellipse',
    tags: 'oval ellipse state',
    width: 120,
    height: 80,
    style: {
      shape: 'ellipse',
      rounded: true,
    },
  },
  {
    title: 'Square',
    tags: 'square',
    width: 80,
    height: 80,
    style: {
      shape: 'rectangle',
      aspect: true,
    },
  },
  {
    title: 'Circle',
    tags: 'circle',
    width: 80,
    height: 80,
    style: {
      shape: 'ellipse',
      aspect: true,
    },
  },
  {
    title: 'Process',
    tags: 'process task',
    width: 120,
    height: 60,
    style: {
      shape: 'process',
      aspect: true,
    },
  },
  {
    title: 'Diamond',
    tags: 'diamond rhombus if condition decision conditional question test',
    width: 80,
    height: 80,
    style: {
      shape: 'rhombus',
    },
  },
  {
    title: 'Parallelogram',
    tags: 'parallelogram',
    width: 120,
    height: 60,
    style: {
      shape: 'parallelogram',
      aspect: true,
    },
  },
  {
    title: 'Hexagon',
    tags: 'hexagon preparation',
    width: 120,
    height: 80,
    style: {
      shape: 'hexagon',
    },
  },
  {
    title: 'Triangle',
    tags: 'triangle logic inverter buffer',
    width: 60,
    height: 80,
    style: {
      shape: 'triangle',
    },
  },
  {
    title: 'Cylinder',
    tags: 'cylinder data database',
    width: 60,
    height: 80,
    style: {
      shape: 'cylinder',
    },
  },
  {
    title: 'Cloud',
    tags: 'cloud network',
    width: 120,
    height: 80,
    style: {
      shape: 'cloud',
    },
  },
  {
    title: 'Document',
    tags: 'document doc file',
    width: 120,
    height: 80,
    style: {
      shape: 'document',
      boundedLbl: true,
    },
  },
  {
    title: 'Internal Storage',
    tags: 'internal storage',
    width: 80,
    height: 80,
    style: {
      shape: 'internalStorage',
      backgroundOutline: true,
    },
  },
  {
    title: 'Cube',
    tags: 'cube',
    width: 120,
    height: 80,
    style: {
      shape: 'cube',
      boundedLbl: true,
      backgroundOutline: true,
      darkOpacity: 0.05,
      darkOpacity2: 0.1,
    },
  },
  {
    title: 'Step',
    tags: 'step',
    width: 120,
    height: 80,
    style: {
      shape: 'step',
      perimeter: 'stepPerimeter',
    },
  },
  {
    title: 'Trapezoid',
    tags: 'trapezoid',
    width: 120,
    height: 60,
    style: {
      shape: 'trapezoid',
      perimeter: 'trapezoidPerimeter',
    },
  },
  {
    title: 'Tape',
    tags: 'tape',
    width: 120,
    height: 100,
    style: {
      shape: 'tape',
    },
  },
  {
    title: 'Note',
    tags: 'note',
    width: 80,
    height: 100,
    style: {
      shape: 'note',
      backgroundOutline: true,
      darkOpacity: 0.05,
    },
  },
  {
    title: 'Card',
    tags: 'card',
    width: 80,
    height: 100,
    style: {
      shape: 'card',
    },
  },
  {
    title: 'Callout',
    tags: 'bubble chat thought speech message',
    width: 120,
    height: 100,
    style: {
      shape: 'callout',
      perimeter: 'calloutPerimeter',
    },
  },
  {
    title: 'Actor',
    tags: 'user person human stickman',
    width: 30,
    height: 60,
    style: {
      shape: 'umlActor',
      labelVerticalPosition: 'bottom',
      labelBackgroundColor: '#ffffff',
      verticalAlign: 'top',
    },
  },
  {
    title: 'Or',
    tags: 'logic or',
    width: 60,
    height: 60,
    style: {
      shape: 'xor',
    },
  },
  {
    title: 'And',
    tags: 'logic and',
    width: 60,
    height: 60,
    style: {
      shape: 'or',
    },
  },
  {
    title: 'Data Storage',
    tags: 'data storage',
    width: 60,
    height: 60,
    style: {
      shape: 'dataStorage',
    },
  },
]
