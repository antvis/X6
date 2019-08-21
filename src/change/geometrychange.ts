import { IChange } from './change'
import { Cell } from '../core/cell'
import { Model } from '../core/model'
import { Geometry } from '../core/geometry'

export class GeometryChange implements IChange {
  public readonly model: Model
  private cell: Cell
  private geometry: Geometry
  private previous: Geometry

  constructor(model: Model, cell: Cell, geometry: Geometry) {
    this.model = model
    this.cell = cell
    this.geometry = geometry
    this.previous = geometry
  }

  execute() {
    if (this.cell != null) {
      this.geometry = this.previous
      this.previous = this.model.doGeometryChange(this.cell, this.previous)
    }
  }
}
