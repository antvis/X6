import { Point } from './point'

export class Anchor {
  /**
   * The fixed location of the connection point.
   */
  public position: Point | null

  /**
   * Specifies if the point should be projected onto the
   * perimeter of the terminal.
   */
  public perimeter: boolean

  /**
   * The name of the anchor.
   */
  public name: string | null

  /**
   * The horizontal offset of the anchor.
   */
  public dx: number

  /**
   * The vertical offset of the anchor.
   */
  public dy: number

  constructor(options: Anchor.AnchorLike | Anchor.Data = {}) {
    if (Array.isArray(options)) {
      this.name = null
      this.dx = options[2] != null ? options[2] : 0
      this.dy = options[3] != null ? options[3] : 0
      this.position = new Point(options[0], options[1])
      this.perimeter = true
    } else {
      this.name = options.name || null
      this.dx = options.dx != null ? options.dx : 0
      this.dy = options.dy != null ? options.dy : 0
      this.perimeter = options.perimeter === false ? false : true

      if (options.x != null || options.y != null) {
        this.position = new Point(
          options.x != null ? options.x : 0,
          options.y != null ? options.y : 0,
        )
      } else {
        this.position = null
      }
    }
  }
}

export namespace Anchor {
  export interface AnchorLike {
    name?: string | null

    x?: number | null

    y?: number | null

    /**
     * The horizontal offset of the anchor.
     */
    dx?: number | null

    /**
     * The vertical offset of the anchor.
     */
    dy?: number | null

    /**
     * Specifies if the point should be projected onto the
     * perimeter of the terminal.
     */
    perimeter?: boolean | null
  }

  export type Data = [number, number, (number | null)?, (number | null)?]
}
