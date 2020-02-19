import { Cell } from './cell'
import { Point } from '../../geometry'

export class Edge extends Cell {
  public source: Cell | null
  public target: Cell | null

  /**
   * The source `Point` of the edge. This is used if the edge does not
   * have a source node. Otherwise it is ignored.
   */
  public sourcePoint: Point | null

  /**
   * The target `Point` of the edge. This is used if the  edge does not
   * have a target node. Otherwise it is ignored.
   */
  public targetPoint: Point | null

  /**
   * Specifies the control points along the edge. These points are the
   * intermediate points on the edge, for the endpoints use `targetPoint`
   * and `sourcePoint` or set the terminals of the edge to a non-null value.
   */
  public points: Point[] | null

  constructor() {
    super()
  }

  isEdge() {
    return true
  }

  disconnect(options: Cell.SetOptions) {
    // return this.store.set(
    //   {
    //     source: { x: 0, y: 0 },
    //     target: { x: 0, y: 0 },
    //   },
    //   options,
    // )
  }
}
