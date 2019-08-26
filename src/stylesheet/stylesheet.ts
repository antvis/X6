import { Perimeter } from './perimeter'
import { CellStyle } from '../types'
import { ShapeName } from '../struct'

export class Stylesheet {
  styles: { [name: string]: CellStyle }

  constructor() {
    this.styles = {}
    this.setDefaultNodeStyle(this.createDefaultNodeStyle())
    this.setDefaultEdgeStyle(this.createDefaultEdgeStyle())
  }

  createDefaultNodeStyle(): CellStyle {
    const style: CellStyle = {
      shape: ShapeName.rectangle,
      perimeter: Perimeter.rectangle,
      align: 'center',
      verticalAlign: 'middle',
      fill: '#C3D9FF',
      stroke: '#6482B9',
      fontColor: '#774400',
    }

    return style
  }

  createDefaultEdgeStyle(): CellStyle {
    const style: CellStyle = {
      shape: ShapeName.connector,
      endArrow: ShapeName.arrowClassic,
      align: 'center',
      verticalAlign: 'middle',
      stroke: '#6482B9',
      fontColor: '#446299',
    }
    return style
  }

  setDefaultNodeStyle(style: CellStyle) {
    this.setCellStyle('defaultNode', style)
  }

  setDefaultEdgeStyle(style: CellStyle) {
    this.setCellStyle('defaultEdge', style)
  }

  getDefaultNodeStyle() {
    return this.styles['defaultNode'] as CellStyle
  }

  getDefaultEdgeStyle() {
    return this.styles['defaultEdge'] as CellStyle
  }

  setCellStyle(name: string, style: CellStyle) {
    this.styles[name] = style
  }
}
