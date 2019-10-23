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
    }
  },
  {
    title: 'Rounded Rectangle',
    tags: 'rounded rect rectangle box',
    width: 120,
    height: 60,
    style: {
      shape: 'rectangle',
      rounded: true,
    }
  },
  {
    title: 'Text',
    data: 'Text',
    tags: 'text textbox textarea label',
    width: 40,
    height: 20,
    style: {
      shape: 'label',
    }
  },
  {
    title: 'Ellipse',
    tags: 'oval ellipse state',
    width: 120,
    height: 80,
    style: {
      shape: 'ellipse',
      rounded: true,
    }
  },
  {
    title: 'Square',
    tags: 'square',
    width: 80,
    height: 80,
    style: {
      shape: 'rectangle',
      aspect: true,
    }
  },
  {
    title: 'Circle',
    tags: 'circle',
    width: 80,
    height: 80,
    style: {
      shape: 'ellipse',
      aspect: true,
    }
  },
  {
    title: 'Diamond',
    tags: 'diamond rhombus if condition decision conditional question test',
    width: 80,
    height: 80,
    style: {
      shape: 'rhombus',
    }
  },
  {
    title: 'Hexagon',
    tags: 'hexagon preparation',
    width: 120,
    height: 80,
    style: {
      shape: 'hexagon',
    }
  },
  {
    title: 'Triangle',
    tags: 'triangle logic inverter buffer',
    width: 60,
    height: 80,
    style: {
      shape: 'triangle',
    }
  },
  {
    title: 'Cylinder',
    tags: 'cylinder data database',
    width: 60,
    height: 80,
    style: {
      shape: 'cylinder',
    }
  },
  {
    title: 'Cloud',
    tags: 'cloud network',
    width: 120,
    height: 80,
    style: {
      shape: 'cloud',
    }
  },
  {
    title: 'Actor',
    tags: 'user person human stickman',
    width: 40,
    height: 60,
    style: {
      shape: 'actor',
    }
  },
]
