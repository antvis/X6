import { Point } from '../geometry'
import { Direction, LineCap, LineJoin } from '../types'
import { globals } from '../option'

export abstract class Canvas2D {
  state: Canvas2D.State
  states: Canvas2D.State[]
  path: string[]
  lastX: number = 0
  lastY: number = 0
  moveOp: string = 'M'
  lineOp: string = 'L'
  quadOp: string = 'Q'
  curveOp: string = 'C'
  closeOp: string = 'Z'

  /**
   * Specifies if events should be handled.
   *
   * Default `false`
   */
  pointerEvents: boolean = false

  /**
   * Switch for rotation of HTML.
   */
  rotateHtml: boolean = true

  constructor() {
    this.reset()
  }

  // #region state

  private createState() {
    const state: Canvas2D.State = {
      tx: 0,
      ty: 0,
      scale: 1,
      transform: null,

      opacity: 1,
      fillOpacity: 1,
      fillColor: null,
      gradientColor: null,
      gradientOpacity: 1,
      gradientFillOpacity: 1,
      gradientDirection: 'north',

      strokeColor: null,
      strokeWidth: 1,
      strokeOpacity: 1,
      dashed: false,
      dashPattern: '3 3',
      fixDash: false,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,

      fontSize: globals.defaultFontSize,
      fontStyle: globals.defaultFontStyle,
      fontColor: globals.defaultFontColor,
      fontFamily: globals.defaultFontFamily,
      fontBorderColor: null,
      fontBackgroundColor: null,

      shadow: false,
      shadowColor: globals.defaultShadowColor,
      shadowOpacity: globals.defaultShadowOpacity,
      shadowOffsetX: globals.defaultShadowOffsetX,
      shadowOffsetY: globals.defaultShadowOffsetY,

      rotation: 0,
      rotationCenterX: 0,
      rotationCenterY: 0,
    }
    return state
  }

  reset() {
    this.state = this.createState()
    this.states = []
  }

  save() {
    this.states.push(this.state)
    this.state = { ...this.state }
  }

  restore() {
    if (this.states.length > 0) {
      this.state = this.states.pop()!
    }
  }

  setOpacity(opacity: number) {
    this.state.opacity = opacity
  }

  setFillOpacity(fillOpacity: number) {
    this.state.fillOpacity = fillOpacity
  }

  setFillColor(fillColor?: string | null) {
    this.state.fillColor = Canvas2D.getColor(fillColor)
    this.state.gradientColor = null
  }

  setStrokeColor(strokeColor?: string | null) {
    this.state.strokeColor = Canvas2D.getColor(strokeColor)
  }

  setStrokeWidth(strokeWidth: number) {
    this.state.strokeWidth = strokeWidth
  }

  setStrokeOpacity(strokeOpacity: number) {
    this.state.strokeOpacity = strokeOpacity
  }

  setGradient(
    color1: string,
    color2: string,
    x: number,
    y: number,
    w: number,
    h: number,
    direction: Direction,
    opacity1?: number,
    opacity2?: number,
  ) {
    this.state.fillColor = color1
    this.state.gradientColor = color2
    this.state.gradientFillOpacity = opacity1 != null ? opacity1 : 1
    this.state.gradientOpacity = opacity2 != null ? opacity2 : 1
    this.state.gradientDirection = direction
  }

  setDashed(dashed: boolean, fixDash: boolean = false) {
    this.state.dashed = dashed
    this.state.fixDash = fixDash
  }

  setDashPattern(dashPattern: string) {
    this.state.dashPattern = dashPattern
  }

  setLineCap(lineCap: LineCap) {
    this.state.lineCap = lineCap
  }

  setLineJoin(lineJoin: LineJoin) {
    this.state.lineJoin = lineJoin
  }

  setMiterLimit(miterLimit: number) {
    this.state.miterLimit = miterLimit
  }

  setFontColor(fontColor: string) {
    this.state.fontColor = Canvas2D.getColor(fontColor)
  }

  setFontBorderColor(fontBorderColor: string) {
    this.state.fontBorderColor = Canvas2D.getColor(fontBorderColor)
  }

  setFontBackgroundColor(fontBackgroundColor: string) {
    this.state.fontBackgroundColor = Canvas2D.getColor(fontBackgroundColor)
  }

  setFontSize(fontSize: number | string) {
    this.state.fontSize =
      typeof fontSize === 'number' ? fontSize : parseFloat(fontSize)
  }

  setFontFamily(fontFamily: string) {
    this.state.fontFamily = fontFamily
  }

  setFontStyle(fontStyle: number | null) {
    this.state.fontStyle = fontStyle == null ? 0 : fontStyle
  }

  setShadow(enabled: boolean) {
    this.state.shadow = enabled
  }

  setShadowColor(shadowColor: string) {
    this.state.shadowColor = Canvas2D.getColor(shadowColor)
  }

  setShadowOpacity(shadowOpacity: number) {
    this.state.shadowOpacity = shadowOpacity
  }

  setShadowOffset(dx: number, dy: number) {
    this.state.shadowOffsetX = dx
    this.state.shadowOffsetY = dy
  }

  // #endregion

  format(value: any) {
    return Math.round(parseFloat(value))
  }

  link(href: string) {
    throw new Error('Method not implemented.')
  }

  rotatePoint(x: number, y: number, deg: number, cx: number, cy: number) {
    return Point.rotate({ x, y }, deg, { x: cx, y: cy })
  }

  scale(s: number) {
    this.state.scale *= s
    this.state.strokeWidth *= s
  }

  translate(tx: number, ty: number) {
    this.state.tx += tx
    this.state.ty += ty
  }

  rotate(
    theta: number,
    flipH: boolean,
    flipV: boolean,
    cx: number,
    cy: number,
  ) {
    throw new Error('Method not implemented.')
  }

  addOp(op: string, ...pts: number[]) {
    if (this.path != null) {
      this.path.push(op)
      const state = this.state

      for (let i = 0, ii = pts.length; i < ii; i += 2) {
        this.lastX = pts[i]
        this.lastY = pts[i + 1]
        this.path.push(
          `${this.format((this.lastX + state.tx) * state.scale)}`,
          `${this.format((this.lastY + state.ty) * state.scale)}`,
        )
      }
    }
  }

  begin() {
    this.lastX = 0
    this.lastY = 0
    this.path = []
  }

  moveTo(x: number, y: number) {
    this.addOp(this.moveOp, x, y)
  }

  lineTo(x: number, y: number) {
    this.addOp(this.lineOp, x, y)
  }

  quadTo(x1: number, y1: number, x2: number, y2: number) {
    this.addOp(this.quadOp, x1, y1, x2, y2)
  }

  curveTo(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
  ) {
    this.addOp(this.curveOp, x1, y1, x2, y2, x3, y3)
  }

  arcTo(
    rx: number,
    ry: number,
    angle: number,
    largeArcFlag: number,
    sweepFlag: number,
    x: number,
    y: number,
  ) {
    const curves = Canvas2D.arcToCurves(
      this.lastX,
      this.lastY,
      rx,
      ry,
      angle,
      largeArcFlag,
      sweepFlag,
      x,
      y,
    )

    if (curves != null) {
      for (let i = 0, ii = curves.length; i < ii; i += 6) {
        this.curveTo(
          curves[i],
          curves[i + 1],
          curves[i + 2],
          curves[i + 3],
          curves[i + 4],
          curves[i + 5],
        )
      }
    }
  }

  close() {
    this.addOp(this.closeOp)
  }

  end() {}
}

export namespace Canvas2D {
  export interface State {
    tx: number
    ty: number
    scale: number
    transform: string | null

    /**
     * Opacity for the canvas.
     */
    opacity: number

    /**
     * Opacity for background.
     *
     * The background final opacity should be `opacity * fillOpacity`
     */
    fillOpacity: number
    fillColor: string | null
    gradientColor: string | null
    gradientOpacity: number
    gradientFillOpacity: number
    gradientDirection: Direction

    strokeColor: string | null
    strokeWidth: number
    strokeOpacity: number
    dashed: boolean
    dashPattern: string
    /**
     * Specifies if use fixed(`1`) dash size.
     */
    fixDash: boolean
    lineCap: LineCap
    lineJoin: LineJoin
    miterLimit: number

    fontSize: number
    fontColor: string | null
    fontStyle: number
    fontFamily: string
    fontBorderColor: string | null
    fontBackgroundColor: string | null

    shadow: boolean
    shadowColor: string | null
    shadowOpacity: number
    shadowOffsetX: number
    shadowOffsetY: number

    rotation: number
    rotationCenterX: number
    rotationCenterY: number
  }

  export function getColor(color?: string | null) {
    return color === 'none' || color == null ? null : color
  }
}

export namespace Canvas2D {
  /**
   * Converts the given arc to a series of curves.
   */
  export function arcToCurves(
    x0: number,
    y0: number,
    r1: number,
    r2: number,
    angle: number,
    largeArcFlag: number,
    sweepFlag: number,
    x: number,
    y: number,
  ) {
    if (r1 === 0 || r2 === 0) {
      return []
    }

    x -= x0 // tslint:disable-line
    y -= y0 // tslint:disable-line
    r1 = Math.abs(r1) // tslint:disable-line
    r2 = Math.abs(r2) // tslint:disable-line

    const fS = sweepFlag
    const psai = angle
    const ctx = -x / 2
    const cty = -y / 2
    const cpsi = Math.cos((psai * Math.PI) / 180)
    const spsi = Math.sin((psai * Math.PI) / 180)
    const rxd = cpsi * ctx + spsi * cty
    const ryd = -1 * spsi * ctx + cpsi * cty
    const rxdd = rxd * rxd
    const rydd = ryd * ryd
    const r1x = r1 * r1
    const r2y = r2 * r2
    const lamda = rxdd / r1x + rydd / r2y

    let sds

    if (lamda > 1) {
      r1 = Math.sqrt(lamda) * r1 // tslint:disable-line
      r2 = Math.sqrt(lamda) * r2 // tslint:disable-line
      sds = 0
    } else {
      let seif = 1
      if (largeArcFlag === fS) {
        seif = -1
      }

      sds =
        seif *
        Math.sqrt(
          (r1x * r2y - r1x * rydd - r2y * rxdd) / (r1x * rydd + r2y * rxdd),
        )
    }

    const txd = (sds * r1 * ryd) / r2
    const tyd = (-1 * sds * r2 * rxd) / r1
    const tx = cpsi * txd - spsi * tyd + x / 2
    const ty = spsi * txd + cpsi * tyd + y / 2

    let rad = Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1) - Math.atan2(0, 1)
    let s1 = rad >= 0 ? rad : 2 * Math.PI + rad
    rad =
      Math.atan2((-ryd - tyd) / r2, (-rxd - txd) / r1) -
      Math.atan2((ryd - tyd) / r2, (rxd - txd) / r1)
    let dr = rad >= 0 ? rad : 2 * Math.PI + rad

    if (fS === 0 && dr > 0) {
      dr -= 2 * Math.PI
    } else if (fS !== 0 && dr < 0) {
      dr += 2 * Math.PI
    }

    const sse = (dr * 2) / Math.PI
    const seg = Math.ceil(sse < 0 ? -1 * sse : sse)
    const segr = dr / seg
    const t =
      ((8 / 3) * Math.sin(segr / 4) * Math.sin(segr / 4)) / Math.sin(segr / 2)
    const cpsir1 = cpsi * r1
    const cpsir2 = cpsi * r2
    const spsir1 = spsi * r1
    const spsir2 = spsi * r2

    let mc = Math.cos(s1)
    let ms = Math.sin(s1)
    let x2 = -t * (cpsir1 * ms + spsir2 * mc)
    let y2 = -t * (spsir1 * ms - cpsir2 * mc)
    let x3 = 0
    let y3 = 0

    const result = []

    for (let n = 0; n < seg; n += 1) {
      s1 += segr
      mc = Math.cos(s1)
      ms = Math.sin(s1)

      x3 = cpsir1 * mc - spsir2 * ms + tx
      y3 = spsir1 * mc + cpsir2 * ms + ty
      const dx = -t * (cpsir1 * ms + spsir2 * mc)
      const dy = -t * (spsir1 * ms - cpsir2 * mc)

      // CurveTo updates x0, y0 so need to restore it
      const index = n * 6
      result[index] = Number(x2 + x0)
      result[index + 1] = Number(y2 + y0)
      result[index + 2] = Number(x3 - dx + x0)
      result[index + 3] = Number(y3 - dy + y0)
      result[index + 4] = Number(x3 + x0)
      result[index + 5] = Number(y3 + y0)

      x2 = x3 + dx
      y2 = y3 + dy
    }

    return result
  }
}
