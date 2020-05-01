import { Point } from '../../../geometry'
import { Node } from '../../core/node'
import { Transform } from './index'

export const BATCH_NAME = 'transform'
export const DIRECTIONS = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
export const POSITIONS: Node.ResizeDirection[] = [
  'top-left',
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left',
]

export const documentEvents = {
  mousemove: 'onMouseMove',
  touchmove: 'onMouseMove',
  mouseup: 'onMouseUp',
  touchend: 'onMouseUp',
}

export const defaultOptions: Transform.Options = {
  minWidth: 0,
  minHeight: 0,
  maxWidth: Infinity,
  maxHeight: Infinity,
  rotateGrid: 15,
  rotatable: true,
  preserveAspectRatio: false,
  orthogonalResizing: true,
}

export namespace EventData {
  export interface Resizing {
    action: 'resizing'
    selector: 'bottomLeft' | 'bottomRight' | 'topRight' | 'topLeft'
    direction: Node.ResizeDirection
    trueDirection: Node.ResizeDirection
    relativeDirection: Node.ResizeDirection
    resizeX: number
    resizeY: number
    angle: number
  }

  export interface Rotating {
    action: 'rotating'
    center: Point.PointLike
    angle: number
    start: number
  }
}
