import { Perimeter } from './perimeter'
import { CellStyle } from '../types'
import { Shapes } from '../struct'

export class StyleSheet {
  styles: {
    defaultNode: CellStyle,
    defaultEdge: CellStyle,
    [name: string]: CellStyle,
  }

  constructor() {
    this.styles = {
      defaultNode: this.createDefaultNodeStyle(),
      defaultEdge: this.createDefaultEdgeStyle(),
    }
  }

  createDefaultNodeStyle(): CellStyle {
    const style: CellStyle = {
      shape: Shapes.rectangle,
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
      shape: Shapes.connector,
      endArrow: Shapes.arrowClassic,
      align: 'center',
      verticalAlign: 'middle',
      stroke: '#8f8f8f',
      fontColor: 'rgba(0, 0, 0, 0.65)',
    }
    return style
  }

  setDefaultNodeStyle(style: CellStyle) {
    this.styles.defaultNode = style
  }

  setDefaultEdgeStyle(style: CellStyle) {
    this.styles.defaultEdge = style
  }

  getDefaultNodeStyle() {
    return this.styles.defaultNode
  }

  getDefaultEdgeStyle() {
    return this.styles.defaultEdge
  }

  setCellStyle(name: string, style: CellStyle) {
    this.styles[name] = style
  }
}
