import { Point } from './point'

/**
 * Defines an object that contains the constraints about how to
 * connect one side of an edge to its terminal.
 */
export class Constraint {
  /**
   * The fixed location of the connection point.
   */
  public point: Point | null

  /**
   * Specifies if the point should be projected onto the
   * perimeter of the terminal.
   */
  public perimeter: boolean

  /**
   * The name of the constraint.
   */
  public name: string | null

  /**
   * The horizontal offset of the constraint.
   */
  public dx: number

  /**
   * The vertical offset of the constraint.
   */
  public dy: number

  constructor(options: Constraint.Options = {}) {
    this.name = options.name || null
    this.point = options.point || null
    this.perimeter = options.perimeter === false ? false : true
    this.dx = options.dx != null ? options.dx : 0
    this.dy = options.dy != null ? options.dy : 0
  }
}

export namespace Constraint {
  export interface Options {
    /**
     * The fixed location of the connection point.
     */
    point?: Point | null

    /**
     * Specifies if the point should be projected onto the
     * perimeter of the terminal.
     */
    perimeter?: boolean

    /**
     * The name of the constraint.
     */
    name?: string

    /**
     * The horizontal offset of the constraint.
     */
    dx?: number

    /**
     * The vertical offset of the constraint.
     */
    dy?: number
  }
}
