import * as util from '../util'
import { State } from './state'
import { Dialect } from '../types'
import { globals } from '../option'
import { Rectangle, Point, Overlay } from '../struct'
import { detector, Dictionary, DomEvent, MouseEventEx } from '../common'
import {
  Shape,
  Stencil,
  Connector,
  Text,
  HtmlShape,
  ImageShape,
  RectangleShape,
} from '../shape'

export class Renderer {
  antialiased: boolean = true
  minSvgStrokeWidth: number = 1
  defaultTextShape = Text
  defaultNodeShape = RectangleShape
  defaultEdgeShape = Connector

  /**
   * Specifies if spacing and label position should be ignored
   * if overflow is `fill` or `width`.
   */
  legacySpacing: boolean = true

  /**
   * Specifies if the folding icon should ignore the horizontal
   * orientation of a swimlane.
   */
  legacyControlPosition: boolean = true

  /**
   * Specifies if the enabled state should be ignored in the
   * control click handler (to allow folding in disabled graphs).
   */
  forceControlClickHandler: boolean = false

  redraw(state: State, force: boolean = false, rendering?: boolean) {
    const shapeChanged = this.redrawShape(state, force, rendering)
    if (state.shape != null && (rendering == null || rendering)) {
      this.redrawLabel(state, shapeChanged)
      this.redrawOverlays(state, shapeChanged)
      this.redrawControl(state, shapeChanged)
      this.customRender(state, shapeChanged)
    }
  }

  // #region redraw shape

  protected redrawShape(state: State, force: boolean, rendering?: boolean) {
    const model = state.view.graph.model
    let shapeChanged = false

    // Forces creation of new shape if shape name has changed
    if (
      state.shape != null &&
      state.style != null &&
      state.shape.style != null &&
      state.shape.style.shape !== state.style.shape
    ) {
      state.shape.dispose()
      state.shape = null
    }

    if (
      state.shape == null &&
      state.view.graph.container != null &&
      state.cell !== state.view.currentRoot &&
      (model.isNode(state.cell) || model.isEdge(state.cell))
    ) {
      state.shape = this.createShape(state)
      if (state.shape != null) {
        state.shape.antialiased = this.antialiased
        state.shape.minSvgStrokeWidth = this.minSvgStrokeWidth

        this.createIndicatorShape(state)
        this.initializeShape(state)
        this.createOverlays(state)
        this.installListeners(state)
        // Forces a refresh of the handler if one exists
        if (state.view.graph.selectionHandler) {
          state.view.graph.selectionHandler.updateHandler(state)
        }
      }
    } else if (
      // update shape for style changed
      !force &&
      state.shape != null &&
      (!util.equalEntries(state.shape.style, state.style) ||
        this.hasPlaceholderStyles(state))
    ) {
      state.shape.resetStyle()
      this.configureShape(state)
      if (state.view.graph.selectionHandler) {
        state.view.graph.selectionHandler.updateHandler(state)
      }

      force = true // tslint:disable-line
    }

    if (state.shape != null) {
      // Handles changes of the collapse icon
      this.createFoldingButton(state)

      // Redraws the cell if required, ignores changes to bounds if
      // points are defined as the bounds are updated for the given
      // points inside the shape
      if (force || this.isShapeInvalid(state, state.shape)) {
        if (state.absolutePoints != null) {
          state.shape.points = state.absolutePoints.slice()
          delete state.shape.bounds
        } else {
          delete state.shape.points
          state.shape.bounds = state.bounds.clone()
        }

        // htmlShape
        if (state.shape instanceof HtmlShape) {
          state.shape.markup = state.view.graph.getHtml(state.cell)
          if (state.style.css != null) {
            state.shape.css = state.style.css
          }
        }

        state.shape.className = this.getCellClassName(state)
        state.shape.scale = state.view.scale

        if (rendering == null || rendering) {
          state.shape.redraw()
        } else {
          state.shape.updateBoundingBox()
        }

        shapeChanged = true
      }
    }

    return shapeChanged
  }

  /**
   * Returns true if the given shape must be repainted.
   */
  protected isShapeInvalid(state: State, shape: Shape) {
    return (
      shape.bounds == null ||
      shape.scale !== state.view.scale ||
      (state.absolutePoints == null && !shape.bounds.equals(state.bounds)) ||
      (state.absolutePoints != null &&
        !Point.equalPoints(shape.points!, state.absolutePoints as Point[]))
    )
  }

  protected getShapeConstructor(state: State) {
    let ctor = Shape.getShape(state.style.shape)
    if (ctor == null) {
      ctor = state.cell.isEdge() ? this.defaultEdgeShape : this.defaultNodeShape
    }

    return ctor
  }

  createShape(state: State): Shape | null {
    let shape = null
    // Checks if there is a stencil for the name and creates
    // a shape instance for the stencil if one exists
    const stencil = Stencil.getStencil(state.style.shape)
    if (stencil != null) {
      shape = new Shape(stencil)
    } else {
      const ctor = this.getShapeConstructor(state)
      shape = new (ctor as any)()
    }

    return shape
  }

  protected createIndicatorShape(state: State) {
    if (state != null && state.shape != null) {
      state.shape.indicatorShape = Shape.getShape(
        state.view.graph.cellManager.getIndicatorShape(state),
      )
    }
  }

  protected initializeShape(state: State) {
    if (state != null && state.shape != null) {
      state.shape.dialect = state.view.graph.dialect
      this.configureShape(state)
      state.shape.init(state.view.getDrawPane())
    }
  }

  protected configureShape(state: State) {
    if (state != null && state.shape != null) {
      const graph = state.view.graph
      state.shape.apply(state)
      state.shape.image = graph.cellManager.getImage(state)
      state.shape.indicatorImage = graph.cellManager.getIndicatorImage(state)
      state.shape.indicatorColor = graph.cellManager.getIndicatorColor(state)
      state.shape.indicatorDirection = graph.cellManager.getIndicatorDirection(
        state,
      )
      state.shape.indicatorStrokeColor = graph.cellManager.getIndicatorStrokeColor(
        state,
      )
      state.shape.indicatorGradientColor = graph.cellManager.getIndicatorGradientColor(
        state,
      )

      this.postConfigureShape(state)
    }
  }

  /**
   * Replaces any reserved words used for attributes, eg. inherit,
   * indicated or swimlane for colors in the shape for the given state.
   * This implementation resolves these keywords on the fill, stroke
   * and gradient color keys.
   */
  protected postConfigureShape(state: State) {
    if (state != null && state.shape != null) {
      this.resolveColor(state, 'fill', 'fill')
      this.resolveColor(state, 'stroke', 'stroke')
      this.resolveColor(state, 'gradient', 'gradientColor')
      this.resolveColor(state, 'indicatorColor', 'fill')
      this.resolveColor(state, 'indicatorGradientColor', 'gradientColor')
    }
  }

  /**
   * Resolves special keywords 'inherit', 'indicated' and 'swimlane' and sets
   * the respective color on the shape.
   */
  protected resolveColor(state: State, field: string, key: string) {
    const graph = state.view.graph
    const shape = state.shape as any
    const value = shape[field]
    let referenced = null

    if (value === 'inherit') {
      referenced = graph.model.getParent(state.cell)
    } else if (value === 'swimlane') {
      shape[field] = key === 'stroke' ? '#000000' : '#ffffff'

      if (graph.model.getTerminal(state.cell, false) != null) {
        referenced = graph.model.getTerminal(state.cell, false)
      } else {
        referenced = state.cell
      }

      referenced = graph.getSwimlane(referenced!)
      // tslint:disable-next-line
      key = graph.swimlaneIndicatorColorAttribute
    } else if (value === 'indicated') {
      shape[field] = state.shape!.indicatorColor
    }

    if (referenced != null) {
      const rstate = graph.view.getState(referenced)
      shape[field] = null

      if (rstate != null) {
        if (rstate.shape != null && field !== 'indicatorColor') {
          shape[field] = (rstate.shape as any)[field]
        } else {
          shape[field] = (rstate.style as any)[key]
        }
      }
    }
  }

  protected hasPlaceholderStyles(state: State) {
    if (state.style != null) {
      const styles = ['fill', 'stroke', 'gradientColor']
      const values = ['inherit', 'swimlane', 'indicated']

      for (let i = 0, ii = styles.length; i < ii; i += 1) {
        if (values.includes((state.style as any)[styles[i]])) {
          return true
        }
      }
    }

    return false
  }

  protected createOverlays(state: State) {
    const graph = state.view.graph
    const overlays = graph.getOverlays(state.cell)
    let dic: Dictionary<Overlay, ImageShape> | null = null

    if (overlays != null) {
      dic = new Dictionary<Overlay, ImageShape>()
      overlays.forEach(overlay => {
        let shape: ImageShape | null = null

        if (state.overlays && state.overlays.has(overlay)) {
          shape = state.overlays.get(overlay)!
          // remove used from set and map
          state.overlays.delete(overlay)
        }

        if (shape == null) {
          shape = new ImageShape(new Rectangle(), overlay.image.src)
          shape.dialect = state.view.graph.dialect
          shape.preserveImageAspect = false
          shape.overlay = overlay

          this.initializeOverlay(state, shape)
          this.installOverlayListeners(state, overlay, shape)

          if (overlay.cursor != null) {
            shape.elem!.style.cursor = overlay.cursor
          }
        }

        dic!.set(overlay, shape)
      })
    }

    // clean unused
    if (state.overlays != null) {
      state.overlays.each(shape => shape && shape.dispose())
    }

    state.overlays = dic
  }

  protected initializeOverlay(state: State, overlayShape: Shape) {
    overlayShape.init(state.view.getOverlayPane())
  }

  protected installOverlayListeners(
    state: State,
    overlay: Overlay,
    overlayShape: Shape,
  ) {
    const graph = state.view.graph
    const elem = overlayShape.elem!

    DomEvent.addListener(elem, 'click', evt => {
      if (graph.isEditing()) {
        graph.stopEditing(!graph.isInvokesStopCellEditing())
      }

      overlay.trigger('click', { cell: state.cell })
    })

    DomEvent.addMouseListeners(
      elem,
      (e: MouseEvent) => {
        DomEvent.consume(e)
      },
      (e: MouseEvent) => {
        graph.fireMouseEvent(DomEvent.MOUSE_MOVE, new MouseEventEx(e, state))
      },
    )

    if (detector.SUPPORT_TOUCH) {
      DomEvent.addListener(elem, 'touchend', evt => {
        overlay.trigger('click', { cell: state.cell })
      })
    }
  }

  protected installListeners(state: State) {
    const graph = state.view.graph
    const elem = state.shape!.elem!

    // Workaround for touch devices routing all events for a mouse
    // gesture (down, move, up) via the initial DOM node. Same for
    // HTML images in all IE versions (VML images are working).
    const getState = (e: MouseEvent) => {
      let result: State = state

      if (
        (graph.dialect !== 'svg' &&
          util.getNodeName(DomEvent.getSource(e)) === 'img') ||
        detector.SUPPORT_TOUCH
      ) {
        const x = DomEvent.getClientX(e)
        const y = DomEvent.getClientY(e)

        // Dispatches the drop event to the graph which
        // consumes and executes the source function
        const pt = util.clientToGraph(graph.container, x, y)
        result = graph.view.getState(graph.getCellAt(pt.x, pt.y))!
      }

      return result
    }

    DomEvent.addMouseListeners(
      elem,
      (e: MouseEvent) => {
        if (this.isShapeEvent(state, e)) {
          graph.fireMouseEvent(DomEvent.MOUSE_DOWN, new MouseEventEx(e, state))
        }
      },
      (e: MouseEvent) => {
        if (this.isShapeEvent(state, e)) {
          graph.fireMouseEvent(
            DomEvent.MOUSE_MOVE,
            new MouseEventEx(e, getState(e)),
          )
        }
      },
      (e: MouseEvent) => {
        if (this.isShapeEvent(state, e)) {
          graph.fireMouseEvent(
            DomEvent.MOUSE_UP,
            new MouseEventEx(e, getState(e)),
          )
        }
      },
    )

    // Uses double click timeout in mxGraph for quirks mode
    if (graph.nativeDblClickEnabled) {
      DomEvent.addListener(elem, 'dblclick', (e: MouseEvent) => {
        if (this.isShapeEvent(state, e)) {
          graph.eventloop.dblClick(e, state.cell)
          DomEvent.consume(e)
        }
      })
    }
  }

  protected createFoldingButton(state: State) {
    const graph = state.view.graph
    const image = graph.getFoldingImage(state)

    if (graph.cellsFoldable && image != null) {
      if (state.control == null) {
        const bounds = new Rectangle(0, 0, image.width, image.height)
        state.control = new ImageShape(bounds, image.src)
        state.control.dialect = graph.dialect
        state.control.preserveImageAspect = false

        this.initFoldingButton(
          state,
          state.control,
          true,
          this.createFoldingClickHandler(state),
        )
      }
    } else if (state.control != null) {
      state.control.dispose()
      state.control = null
    }
  }

  protected createFoldingClickHandler(state: State) {
    const graph = state.view.graph
    return (e: MouseEvent) => {
      if (this.forceControlClickHandler || graph.isEnabled()) {
        const collapsed = !graph.isCellCollapsed(state.cell)
        graph.foldCells(collapsed, false, [state.cell], false)
        DomEvent.consume(e)
      }
    }
  }

  protected initFoldingButton(
    state: State,
    control: ImageShape,
    handleEvents: boolean,
    clickHandler: (e: MouseEvent) => any,
  ) {
    const graph = state.view.graph

    // In the special case where the label is in HTML and the display is SVG the image
    // should go into the graph container directly in order to be clickable. Otherwise
    // it is obscured by the HTML label that overlaps the cell.
    const isForceHtml =
      graph.isHtmlLabel(state.cell) &&
      detector.NO_FOREIGNOBJECT &&
      graph.dialect === 'svg'

    if (isForceHtml) {
      control.dialect = 'html'
      control.init(graph.container)
      control.elem!.style.zIndex = '1'
    } else {
      control.init(state.view.getOverlayPane()!)
    }

    const elem = control.elem!

    // Workaround for missing click event on iOS is to check tolerance below
    if (clickHandler != null && !detector.IS_IOS) {
      if (graph.isEnabled()) {
        elem.style.cursor = 'pointer'
      }

      DomEvent.addListener(elem, 'click', clickHandler)
    }

    if (handleEvents) {
      let first: Point | null = null

      DomEvent.addMouseListeners(
        elem,
        (e: MouseEvent) => {
          first = new Point(DomEvent.getClientX(e), DomEvent.getClientY(e))
          graph.fireMouseEvent(DomEvent.MOUSE_DOWN, new MouseEventEx(e, state))
          DomEvent.consume(e)
        },
        (e: MouseEvent) => {
          graph.fireMouseEvent(DomEvent.MOUSE_MOVE, new MouseEventEx(e, state))
        },
        (e: MouseEvent) => {
          graph.fireMouseEvent(DomEvent.MOUSE_UP, new MouseEventEx(e, state))
          DomEvent.consume(e)
        },
      )

      // Uses capture phase for event interception to stop bubble phase
      if (clickHandler != null && detector.IS_IOS) {
        DomEvent.addListener(elem, 'touchend', (e: TouchEvent) => {
          if (first != null) {
            const tol = graph.tolerance
            if (
              Math.abs(first.x - DomEvent.getClientX(e)) < tol &&
              Math.abs(first.y - DomEvent.getClientY(e)) < tol
            ) {
              clickHandler.call(clickHandler, e)
              DomEvent.consume(e)
            }
          }
        })
      }
    }

    return elem
  }

  // #endregion

  // #region redrawlabel

  protected redrawLabel(state: State, forced?: boolean) {
    const graph = state.view.graph
    const txt = this.getLabelValue(state)
    const wrapping = graph.isWrapping(state.cell)
    const clipping = graph.isLabelClipped(state.cell)

    const isForceHtml =
      state.view.graph.isHtmlLabel(state.cell) ||
      (txt != null && util.isHtmlElem(txt))

    const dialect: Dialect = isForceHtml ? 'html' : state.view.graph.dialect
    const overflow = state.style.overflow || 'visible'

    if (
      state.text != null &&
      (state.text.wrap !== wrapping ||
        state.text.clipped !== clipping ||
        state.text.overflow !== overflow ||
        state.text.dialect !== dialect)
    ) {
      state.text.dispose()
      state.text = null
    }

    if (
      state.text == null &&
      txt != null &&
      (util.isHtmlElem(txt) || (txt as string).length > 0)
    ) {
      this.createLabel(state, txt)
    } else if (
      state.text != null &&
      (txt == null || (txt as string).length === 0)
    ) {
      state.text.dispose()
      state.text = null
    }

    if (state.text != null) {
      // Forced is true if the style has changed, so to get the updated
      // result in getLabelBounds we apply the new style to the shape
      if (forced) {
        // Checks if a full repaint is needed
        if (
          state.text.lastValue != null &&
          this.isTextShapeInvalid(state, state.text)
        ) {
          // Forces a full repaint
          state.text.lastValue = null
        }

        state.text.resetStyle()
        state.text.apply(state)

        // Special case where value is obtained via hook in graph
        state.text.verticalAlign = graph.cellManager.getVerticalAlign(state)
      }

      const bounds = this.getLabelBounds(state)
      const nextScale = this.getTextScale(state)

      if (
        forced ||
        state.text.value !== txt ||
        state.text.wrap !== wrapping ||
        state.text.overflow !== overflow ||
        state.text.clipped !== clipping ||
        state.text.scale !== nextScale ||
        state.text.dialect !== dialect ||
        !state.text.bounds.equals(bounds)
      ) {
        // Forces an update of the text bounding box
        if (
          state.text.bounds.width !== 0 &&
          state.unscaledWidth != null &&
          Math.round(
            (state.text.bounds.width / state.text.scale) * nextScale -
              bounds.width,
          ) !== 0
        ) {
          state.unscaledWidth = null
        }

        state.text.dialect = dialect
        state.text.scale = nextScale
        state.text.value = txt!
        state.text.bounds = bounds
        state.text.wrap = wrapping
        state.text.clipped = clipping
        state.text.overflow = overflow

        // Preserves visible state
        const vis = state.text!.elem!.style.visibility
        this.redrawLabelShape(state)
        state.text!.elem!.style.visibility = vis
      }
    }
  }

  getLabelValue(state: State) {
    return state.view.graph.getLabel(state.cell)
  }

  protected createLabel(state: State, value: HTMLElement | string) {
    const graph = state.view.graph

    if (state.style.fontSize == null || state.style.fontSize > 0) {
      // Avoids using DOM node for empty labels
      const isForceHtml =
        graph.isHtmlLabel(state.cell) ||
        (value != null && util.isHtmlElem(value))

      state.text = new this.defaultTextShape(value, new Rectangle(), {
        align: graph.cellManager.getAlign(state),
        valign: graph.cellManager.getVerticalAlign(state),
        color: state.style.fontColor,
        family: state.style.fontFamily,
        size: state.style.fontSize,
        fontStyle: state.style.fontStyle,
        spacing: state.style.spacing,
        spacingTop: state.style.spacingTop,
        spacingRight: state.style.spacingRight,
        spacingBottom: state.style.spacingBottom,
        spacingLeft: state.style.spacingLeft,
        horizontal: state.style.horizontal,
        background: state.style.labelBackgroundColor,
        border: state.style.labelBorderColor,
        wrap: graph.isWrapping(state.cell) && graph.isHtmlLabel(state.cell),
        clipped: graph.isLabelClipped(state.cell),
        overflow: state.style.overflow,
        labelPadding: state.style.labelPadding,
        textDirection: state.style.textDirection || '',
      })

      state.text.opacity = state.style.textOpacity || 100
      state.text.dialect = isForceHtml ? 'html' : state.view.graph.dialect

      state.text.style = state.style
      state.text.state = state

      this.initializeLabel(state, state.text)

      // Workaround for touch devices routing all events for a mouse gesture
      // (down, move, up) via the initial DOM node. IE additionally redirects
      // the event via the initial DOM node but the event source is the node
      // under the mouse, so we need to check if this is the case and force
      // getCellAt for the subsequent mouseMoves and the final mouseUp.
      let forceGetCell = false

      const getState = (e: MouseEvent) => {
        let result: State = state

        if (detector.SUPPORT_TOUCH || forceGetCell) {
          const x = DomEvent.getClientX(e)
          const y = DomEvent.getClientY(e)

          // Dispatches the drop event to the graph which
          // consumes and executes the source function
          const pt = util.clientToGraph(graph.container, x, y)
          result = graph.view.getState(graph.getCellAt(pt.x, pt.y))!
        }

        return result
      }

      // TODO: Add handling for special touch device gestures
      DomEvent.addMouseListeners(
        state.text.elem!,
        (e: MouseEvent) => {
          if (this.isLabelEvent(state, e)) {
            graph.fireMouseEvent(
              DomEvent.MOUSE_DOWN,
              new MouseEventEx(e, state),
            )
            forceGetCell =
              graph.dialect !== 'svg' &&
              util.getNodeName(DomEvent.getSource(e)) === 'img'
          }
        },
        (e: MouseEvent) => {
          if (this.isLabelEvent(state, e)) {
            graph.fireMouseEvent(
              DomEvent.MOUSE_MOVE,
              new MouseEventEx(e, getState(e)),
            )
          }
        },
        (e: MouseEvent) => {
          if (this.isLabelEvent(state, e)) {
            graph.fireMouseEvent(
              DomEvent.MOUSE_UP,
              new MouseEventEx(e, getState(e)),
            )
            forceGetCell = false
          }
        },
      )

      // Uses double click timeout in mxGraph for quirks mode
      if (graph.nativeDblClickEnabled) {
        DomEvent.addListener(state.text.elem!, 'dblclick', (e: MouseEvent) => {
          if (this.isLabelEvent(state, e)) {
            graph.eventloop.dblClick(e, state.cell)
            DomEvent.consume(e)
          }
        })
      }
    }
  }

  protected initializeLabel(state: State, shape: Shape) {
    if (detector.NO_FOREIGNOBJECT && shape.dialect !== 'svg') {
      shape.init(state.view.graph.container)
    } else {
      shape.init(state.view.getDrawPane())
    }
  }

  protected getLabelBounds(state: State) {
    const graph = state.view.graph
    const scale = state.view.scale
    const isEdge = graph.getModel().isEdge(state.cell)
    let bounds = new Rectangle(state.absoluteOffset.x, state.absoluteOffset.y)

    if (isEdge) {
      const spacing = state.text!.getSpacing()
      bounds.x += spacing.x * scale
      bounds.y += spacing.y * scale

      const geo = graph.getCellGeometry(state.cell)

      if (geo != null) {
        bounds.width = Math.max(0, geo.bounds.width * scale)
        bounds.height = Math.max(0, geo.bounds.height * scale)
      }
    } else {
      // Inverts label position
      if (state.text!.drawBoundsInverted()) {
        const tmp = bounds.x
        bounds.x = bounds.y
        bounds.y = tmp
      }

      bounds.x += state.bounds.x
      bounds.y += state.bounds.y

      // Minimum of 1 fixes alignment bug in HTML labels
      bounds.width = Math.max(1, state.bounds.width)
      bounds.height = Math.max(1, state.bounds.height)

      const sc = state.style.stroke || 'none'
      if (sc !== 'none' && sc !== '') {
        const sw = (state.style.strokeWidth || 1) * scale
        const dx = 1 + Math.floor((sw - 1) / 2)
        const dh = Math.floor(sw + 1)

        bounds.x += dx
        bounds.y += dx
        bounds.width -= dh
        bounds.height -= dh
      }
    }

    if (state.text!.drawBoundsInverted()) {
      // Rotates around center of state
      const t = (state.bounds.width - state.bounds.height) / 2
      bounds.x += t
      bounds.y -= t
      const tmp = bounds.width
      bounds.width = bounds.height
      bounds.height = tmp
    }

    // Shape can modify its label bounds
    if (state.shape != null) {
      const h = state.style.labelPosition || 'center'
      const v = state.style.labelVerticalPosition || 'middle'
      if (h === 'center' && v === 'middle') {
        bounds = state.shape.getLabelBounds(bounds)
      }
    }

    // Label width style overrides actual label width
    const lw = state.style.labelWidth
    if (lw != null) {
      bounds.width = lw * scale
    }

    if (!isEdge) {
      this.rotateLabelBounds(state, bounds)
    }

    return bounds
  }

  protected getTextScale(state: State) {
    return state.view.scale
  }

  protected redrawLabelShape(state: State) {
    const shape = state.text!
    shape.className = this.getLabelClassName(state)
    shape.redraw()
  }

  /**
   * Returns true if the event is for the shape of the given state.
   */
  protected isShapeEvent(state: State, e: MouseEvent) {
    return true
  }

  /**
   * Returns true if the event is for the label of the given state.
   */
  protected isLabelEvent(state: State, e: MouseEvent) {
    return true
  }

  protected isTextShapeInvalid(state: State, shape: Text) {
    const check = (prop: string, styleName: string, defaultValue?: any) => {
      let result = false

      const raw = (shape as any)[prop]
      const set = (state.style as any)[styleName] || defaultValue

      // Workaround for spacing added to directional spacing
      if (
        styleName === 'spacingTop' ||
        styleName === 'spacingRight' ||
        styleName === 'spacingBottom' ||
        styleName === 'spacingLeft'
      ) {
        result = parseFloat(raw) - shape.spacing !== set
      } else {
        result = raw !== set
      }

      return result
    }

    return (
      check('fontStyle', 'fontStyle', globals.defaultFontStyle) ||
      check('family', 'fontFamily', globals.defaultFontFamily) ||
      check('size', 'fontSize', globals.defaultFontSize) ||
      check('color', 'fontColor', globals.defaultFontColor) ||
      check('align', 'align', '') ||
      check('valign', 'verticalAlign', '') ||
      check('spacing', 'spacing', 2) ||
      check('spacingTop', 'spacingTop', 0) ||
      check('spacingRight', 'spacingRight', 0) ||
      check('spacingBottom', 'spacingBottom', 0) ||
      check('spacingLeft', 'spacingLeft', 0) ||
      check('horizontal', 'horizontal', true) ||
      check('background', 'labelBackgroundColor') ||
      check('border', 'labelBorderColor') ||
      check('opacity', 'textOpacity', 100) ||
      check('textDirection', 'textDirection', '')
    )
  }

  protected rotateLabelBounds(state: State, bounds: Rectangle) {
    bounds.y -= state.text!.margin.y * bounds.height
    bounds.x -= state.text!.margin.x * bounds.width

    if (
      !this.legacySpacing ||
      (state.style.overflow !== 'fill' && state.style.overflow !== 'width')
    ) {
      const s = state.view.scale
      const spacing = state.text!.getSpacing()
      bounds.x += spacing.x * s
      bounds.y += spacing.y * s

      const h = state.style.labelPosition || 'center'
      const v = state.style.labelVerticalPosition || 'middle'
      const lw = state.style.labelWidth

      bounds.width = Math.max(
        0,
        bounds.width -
          (h === 'center' && lw == null
            ? state.text!.spacingLeft * s + state.text!.spacingRight * s
            : 0),
      )

      bounds.height = Math.max(
        0,
        bounds.height -
          (v === 'middle'
            ? state.text!.spacingTop * s + state.text!.spacingBottom * s
            : 0),
      )
    }

    const theta = state.text!.getTextRotation()

    // Only needed if rotated around another center
    if (theta !== 0 && state != null && state.cell.isNode()) {
      const cx = state.bounds.getCenterX()
      const cy = state.bounds.getCenterY()
      if (bounds.x !== cx || bounds.y !== cy) {
        const pt = util.rotatePoint(
          new Point(bounds.x, bounds.y),
          theta,
          new Point(cx, cy),
        )

        bounds.x = pt.x
        bounds.y = pt.y
      }
    }
  }

  // #endregion

  // #region className

  protected getCellClassName(state: State) {
    const graph = state.view.graph
    const model = graph.model
    const cell = state.cell
    const prefixCls = graph.prefixCls
    const isEdge = model.isEdge(cell)
    const isNode = model.isNode(cell)

    let className = `${prefixCls}-cell`
    if (isEdge) {
      className += ` ${prefixCls}-edge`
    }
    if (isNode) {
      className += ` ${prefixCls}-node`
    }

    const manual = graph.getCellClassName(cell)
    if (manual != null && manual.length > 0) {
      className += ` ${manual}`
    }

    return className
  }

  protected getLabelClassName(state: State) {
    const graph = state.view.graph
    const prefixCls = graph.prefixCls
    let className = `${prefixCls}-label`
    const manual = graph.getLabelClassName(state.cell)
    if (manual != null && manual.length > 0) {
      className += ` ${manual}`
    }
    return className
  }

  // #endregion

  protected redrawOverlays(state: State, forced?: boolean) {
    this.createOverlays(state)
    if (state.overlays != null) {
      const rot = util.mod(util.getRotation(state), 90)
      const rad = util.toRad(rot)
      const cos = Math.cos(rad)
      const sin = Math.sin(rad)

      state.overlays.each(img => {
        const shape = img!
        const bounds = shape.overlay!.getBounds(state)
        if (!state.view.graph.getModel().isEdge(state.cell)) {
          if (state.shape != null && rot !== 0) {
            let cx = bounds.getCenterX()
            let cy = bounds.getCenterY()

            const point = util.rotatePointEx(
              new Point(cx, cy),
              cos,
              sin,
              state.bounds.getCenter(),
            )

            cx = point.x
            cy = point.y
            bounds.x = Math.round(cx - bounds.width / 2)
            bounds.y = Math.round(cy - bounds.height / 2)
          }
        }

        if (
          forced ||
          shape.bounds == null ||
          shape.scale !== state.view.scale ||
          !shape.bounds.equals(bounds)
        ) {
          shape.bounds = bounds
          shape.scale = state.view.scale
          shape.redraw()
        }
      })
    }
  }

  protected redrawControl(state: State, forced?: boolean) {
    const image = state.view.graph.getFoldingImage(state)

    if (state.control != null && image != null) {
      const bounds = this.getControlBounds(state, image.width, image.height)
      const s = state.view.scale
      const r = this.legacyControlPosition
        ? state.style.rotation || 0
        : state.shape!.getTextRotation()

      if (
        forced ||
        state.control.scale !== s ||
        !state.control.bounds.equals(bounds!) ||
        state.control.rotation !== r
      ) {
        state.control.rotation = r
        state.control.bounds = bounds!
        state.control.scale = s

        state.control.redraw()
      }
    }
  }

  protected getControlBounds(state: State, w: number, h: number) {
    if (state.control != null) {
      const s = state.view.scale
      let cx = state.bounds.getCenterX()
      let cy = state.bounds.getCenterY()

      if (!state.view.graph.getModel().isEdge(state.cell)) {
        cx = state.bounds.x + w * s
        cy = state.bounds.y + h * s

        if (state.shape != null) {
          // TODO: Factor out common code
          let rot = state.shape.getShapeRotation()

          if (this.legacyControlPosition) {
            rot = state.style.rotation || 0
          } else {
            if (state.shape.drawBoundsInverted()) {
              const t = (state.bounds.width - state.bounds.height) / 2
              cx += t
              cy -= t
            }
          }

          if (rot !== 0) {
            const p = util.rotatePoint(
              new Point(cx, cy),
              rot,
              state.bounds.getCenter(),
            )
            cx = p.x
            cy = p.y
          }
        }
      }

      return state.view.graph.getModel().isEdge(state.cell)
        ? new Rectangle(
            Math.round(cx - (w / 2) * s),
            Math.round(cy - (h / 2) * s),
            Math.round(w * s),
            Math.round(h * s),
          )
        : new Rectangle(
            Math.round(cx - (w / 2) * s),
            Math.round(cy - (h / 2) * s),
            Math.round(w * s),
            Math.round(h * s),
          )
    }

    return null
  }

  protected customRender(state: State, shapeChanged: boolean) {
    const render = state.cell.getRender()
    if (render != null && state.shape != null) {
      render.call(state.view.graph, state.shape.elem, state.cell)
    }
  }
}
