import * as util from '../util'
import { constants, UrlConverter } from '../common'
import { Point, FontStyle } from '../struct'
import { Direction, LineCap, LineJoin } from '../types'

export class Canvas2D {
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

  urlConverter: UrlConverter

  constructor() {
    this.urlConverter = new UrlConverter()
    this.reset()
  }

  // #region state

  private createState() {
    const state: Canvas2D.State = {
      tx: 0,
      ty: 0,

      alpha: 1,
      scale: 1,
      transform: null,

      fillAlpha: 1,
      fillColor: null,

      strokeAlpha: 1,
      strokeColor: null,
      strokeWidth: 1,

      gradientFillAlpha: 1,
      gradientColor: null,
      gradientAlpha: 1,
      gradientDirection: 'north',

      dashed: false,
      dashPattern: '3 3',
      fixDash: false,

      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,

      fontColor: '#000000',
      fontBackgroundColor: null,
      fontBorderColor: null,
      fontSize: constants.DEFAULT_FONTSIZE,
      fontFamily: constants.DEFAULT_FONTFAMILY,
      fontStyle: 0,

      shadow: false,
      shadowColor: constants.SHADOWCOLOR,
      shadowAlpha: constants.SHADOW_OPACITY,
      shadowDx: constants.SHADOW_OFFSET_X,
      shadowDy: constants.SHADOW_OFFSET_Y,

      rotation: 0,
      rotationCx: 0,
      rotationCy: 0,
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

  setAlpha(alpha: number) {
    this.state.alpha = alpha
  }

  setFillAlpha(fillAlpha: number) {
    this.state.fillAlpha = fillAlpha
  }

  setFillColor(fillColor?: string | null) {
    this.state.fillColor = Canvas2D.getColor(fillColor)
    this.state.gradientColor = null
  }

  setStrokeAlpha(strokeAlpha: number) {
    this.state.strokeAlpha = strokeAlpha
  }

  setStrokeColor(strokeColor?: string | null) {
    this.state.strokeColor = Canvas2D.getColor(strokeColor)
  }

  setStrokeWidth(strokeWidth: number) {
    this.state.strokeWidth = strokeWidth
  }

  setGradient(
    color1: string,
    color2: string,
    x: number,
    y: number,
    w: number,
    h: number,
    direction: Direction,
    alpha1?: number,
    alpha2?: number,
  ) {
    this.state.fillColor = color1
    this.state.gradientColor = color2
    this.state.gradientDirection = direction
    this.state.gradientFillAlpha = (alpha1 != null) ? alpha1 : 1
    this.state.gradientAlpha = (alpha2 != null) ? alpha2 : 1
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

  setFontBackgroundColor(fontBackgroundColor: string) {
    this.state.fontBackgroundColor = Canvas2D.getColor(fontBackgroundColor)
  }

  setFontBorderColor(fontBorderColor: string) {
    this.state.fontBorderColor = Canvas2D.getColor(fontBorderColor)
  }

  setFontSize(fontSize: number | string) {
    this.state.fontSize = parseFloat(fontSize as string)
  }

  setFontFamily(fontFamily: string) {
    this.state.fontFamily = fontFamily
  }

  setFontStyle(fontStyle: number) {
    this.state.fontStyle = fontStyle == null ? 0 : fontStyle
  }

  setShadow(enabled: boolean) {
    this.state.shadow = enabled
  }

  setShadowColor(shadowColor: string) {
    this.state.shadowColor = Canvas2D.getColor(shadowColor)
  }

  setShadowAlpha(shadowAlpha: number) {
    this.state.shadowAlpha = shadowAlpha
  }

  setShadowOffset(dx: number, dy: number) {
    this.state.shadowDx = dx
    this.state.shadowDy = dy
  }

  // #endregion

  format(value: any) {
    return Math.round(parseFloat(value))
  }

  link(href: string) {
    throw new Error('Method not implemented.')
  }

  rotatePoint(
    x: number,
    y: number,
    theta: number,
    cx: number,
    cy: number,
  ) {
    const rad = util.toRadians(theta)
    return util.rotatePoint(
      new Point(x, y),
      Math.cos(rad),
      Math.sin(rad),
      new Point(cx, cy),
    )
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
      const s = this.state

      for (let i = 0, ii = pts.length; i < ii; i += 2) {
        this.lastX = pts[i]
        this.lastY = pts[i + 1]

        const x = `${this.format((this.lastX + s.tx) * s.scale)}`
        const y = `${this.format((this.lastY + s.ty) * s.scale)}`

        this.path.push(x, y)
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
    x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number,
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
    const curves = util.arcToCurves(
      this.lastX, this.lastY,
      rx, ry,
      angle,
      largeArcFlag, sweepFlag,
      x, y,
    )

    if (curves != null) {
      for (let i = 0, ii = curves.length; i < ii; i += 6) {
        this.curveTo(
          curves[i], curves[i + 1],
          curves[i + 2], curves[i + 3],
          curves[i + 4], curves[i + 5],
        )
      }
    }
  }

  close() {
    this.addOp(this.closeOp)
  }

  end() {
    throw new Error('Method not implemented.')
  }
}

export namespace Canvas2D {
  export interface State {
    tx: number
    ty: number

    /**
     * Opacity for the canvas.
     */
    alpha: number
    scale: number
    transform: string | null

    /**
     * Opacity for background.
     *
     * The background final opacity should be `alpha * fillAlpha`
     */
    fillAlpha: number
    fillColor: string | null

    strokeAlpha: number
    strokeColor: string | null
    strokeWidth: number

    gradientAlpha: number
    gradientFillAlpha: number
    gradientColor: string | null
    gradientDirection: Direction

    dashed: boolean
    dashPattern: string
    /**
     * Specifies if use fixed(`1`) dash size.
     */
    fixDash: boolean

    lineCap: LineCap
    lineJoin: LineJoin
    miterLimit: number

    fontColor: string | null
    fontBackgroundColor: string | null
    fontBorderColor: string | null
    fontSize: number
    fontFamily: string
    fontStyle: FontStyle,

    shadow: boolean,
    shadowColor: string | null
    shadowAlpha: number
    shadowDx: number
    shadowDy: number

    rotation: number
    rotationCx: number
    rotationCy: number
  }

  export function getColor(color?: string | null) {
    return (color === 'none' || color == null) ? null : color
  }
}
