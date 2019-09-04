import { Point } from './point'

/**
 * Defines an object that contains the constraints about how to
 * connect one side of an edge to its terminal.
 */
export class Constraint {
  constructor(
    /**
     * Specifies the fixed location of the connection point.
     */
    public point: Point | null = null,
    /**
     * Specifies if the point should be projected onto the
     * perimeter of the terminal.
     */
    public perimeter: boolean = true,
    /**
     * Optional string that specifies the name of the constraint.
     */
    public name: string | null = null,
    /**
     * Optional float that specifies the horizontal offset of the constraint.
     */
    public dx: number = 0,
    /**
     * Optional float that specifies the vertical offset of the constraint.
     */
    public dy: number = 0,
  ) { }
}
