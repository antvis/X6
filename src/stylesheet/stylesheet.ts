import { Perimeter } from './perimeter'
import { CellStyle } from '../types'
import { ShapeName } from '../struct'

export class StyleSheet {
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
      fill: '#f6edfc',
      stroke: '#712ed1',
      fontColor: 'rgba(0, 0, 0, 0.65)',
    }

    return style
  }

  createDefaultEdgeStyle(): CellStyle {
    const style: CellStyle = {
      shape: ShapeName.connector,
      endArrow: ShapeName.arrowClassic,
      align: 'center',
      verticalAlign: 'middle',
      stroke: '#8f8f8f',
      fontColor: 'rgba(0, 0, 0, 0.65)',
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
