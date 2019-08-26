import * as util from '../util'
import { constants, DomEvent, CustomMouseEvent, detector } from '../common'
import { CellState } from './cell-state'
import { CellOverlay } from './cell-overlay'
import { Shape, Stencil, Connector, RectShape, Text, ImageShape } from '../shape'
import { StyleName, Align, Rectangle, Point } from '../struct'

export class Renderer {
  antiAlias: boolean = true
  defaultEdgeShape = Connector
  defaultVertexShape = RectShape
  defaultTextShape = Text
  minSvgStrokeWidth: number = 1

  /**
   * Specifies if spacing and label position should be ignored
   * if overflow is fill or width.
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

  private getShapeConstructor(state: CellState) {
    let ctor = Renderer.getShape(state.style[StyleName.shape])
    if (ctor == null) {
      ctor = state.cell.isEdge()
        ? this.defaultEdgeShape
        : this.defaultVertexShape
    }

    return ctor
  }

  private createShape(state: CellState): Shape | null {
    let shape = null
    if (state.style != null) {
      // Checks if there is a stencil for the name and creates
      // a shape instance for the stencil if one exists
      const stencil = Stencil.getStencil(state.style[StyleName.shape])
      if (stencil != null) {
        shape = new Shape(stencil)
      } else {
        const ctor = this.getShapeConstructor(state)
        shape = new (ctor as any)()
      }
    }

    return shape
  }

  private createIndicatorShape(state: CellState) {
    if (state != null && state.shape != null) {
      state.shape.indicatorShape = Renderer.getShape(
        state.view.graph.getIndicatorShape(state),
      )
    }
  }

  private initializeShape(state: CellState) {
    if (state != null && state.shape != null) {
      state.shape.dialect = state.view.graph.dialect
      this.configureShape(state)
      state.shape.init(state.view.getDrawPane()!)
    }
  }

  private configureShape(state: CellState) {
    if (state != null && state.shape != null) {
      const graph = state.view.graph
      state.shape.apply(state)
      state.shape.image = graph.getImage(state)
      state.shape.indicatorImage = graph.getIndicatorImage(state)
      state.shape.indicatorColor = graph.getIndicatorColor(state)
      state.shape.indicatorDirection = state.style[constants.STYLE_INDICATOR_DIRECTION]
      state.shape.indicatorStrokeColor = state.style[constants.STYLE_INDICATOR_STROKECOLOR]
      state.shape.indicatorGradientColor = graph.getIndicatorGradientColor(state)

      this.postConfigureShape(state)
    }
  }

  /**
   * Replaces any reserved words used for attributes, eg. inherit,
   * indicated or swimlane for colors in the shape for the given state.
   * This implementation resolves these keywords on the fill, stroke
   * and gradient color keys.
   */
  private postConfigureShape(state: CellState) {
    if (state != null && state.shape != null) {
      this.resolveColor(state, 'fill', StyleName.fillColor)
      this.resolveColor(state, 'stroke', StyleName.strokeColor)
      this.resolveColor(state, 'gradient', StyleName.gradientColor)
      this.resolveColor(state, 'indicatorColor', StyleName.fillColor)
      this.resolveColor(state, 'indicatorGradientColor', StyleName.gradientColor)
    }
  }

  /**
   * Resolves special keywords 'inherit', 'indicated' and 'swimlane' and sets
   * the respective color on the shape.
   */
  private resolveColor(state: CellState, field: string, key: string) {
    const graph = state.view.graph
    const value = (state.shape as any)[field]
    let referenced = null

    if (value === 'inherit') {
      referenced = graph.model.getParent(state.cell)
    } else if (value === 'swimlane') {
      (state.shape as any)[field] = key === StyleName.strokeColor
        ? '#000000'
        : '#ffffff'

      if (graph.model.getTerminal(state.cell, false) != null) {
        referenced = graph.model.getTerminal(state.cell, false)
      } else {
        referenced = state.cell
      }

      referenced = graph.getSwimlane(referenced!)
      // tslint:disable-next-line
      key = graph.swimlaneIndicatorColorAttribute
    } else if (value === 'indicated') {
      (state.shape as any)[field] = state.shape!.indicatorColor
    }

    if (referenced != null) {
      const rstate = graph.view.getState(referenced);
      (state.shape as any)[field] = null

      if (rstate != null) {
        if (rstate.shape != null && field !== 'indicatorColor') {
          (state.shape as any)[field] = (rstate.shape as any)[field]
        } else {
          (state.shape as any)[field] = rstate.style[key]
        }
      }
    }
  }

  /**
   * Resolves special keywords 'inherit', 'indicated' and 'swimlane' and sets
   * the respective color on the shape.
   */
  checkPlaceholderStyles(state: CellState) {
    if (state.style != null) {
      const values = ['inherit', 'swimlane', 'indicated']
      const styles = [
        StyleName.fillColor,
        StyleName.strokeColor,
        StyleName.gradientColor,
      ]

      for (let i = 0, ii = styles.length; i < ii; i += 1) {
        if (values.includes(state.style[styles[i]])) {
          return true
        }
      }
    }

    return false
  }

  getLabelValue(state: CellState) {
    return state.view.graph.getLabel(state.cell)
  }

  createLabel(state: CellState, value: string) {
    const graph = state.view.graph

    if (
      state.style[StyleName.fontSize] > 0 ||
      state.style[StyleName.fontSize] == null
    ) {
      // Avoids using DOM node for empty labels
      const isForceHtml = (
        graph.isHtmlLabel(state.cell) ||
        (value != null && util.isHTMLNode(value))
      )

      state.text = new this.defaultTextShape(
        value,
        new Rectangle(),
        {
          align: (state.style[StyleName.align] || Align.center) as Align,
          valign: graph.getVerticalAlign(state),
          color: state.style[StyleName.fontColor],
          family: state.style[StyleName.fontFamily],
          size: state.style[StyleName.fontSize],
          fontStyle: state.style[StyleName.fontStyle],
          spacing: state.style[StyleName.spacing],
          spacingTop: state.style[StyleName.spacingTop],
          spacingRight: state.style[StyleName.spacingRight],
          spacingBottom: state.style[StyleName.spacingBottom],
          spacingLeft: state.style[StyleName.spacingLeft],
          horizontal: state.style[StyleName.horizontal],
          background: state.style[StyleName.labelBackgroundColor],
          border: state.style[StyleName.labelBorderColor],
          wrap: graph.isWrapping(state.cell) && graph.isHtmlLabel(state.cell),
          clipped: graph.isLabelClipped(state.cell),
          overflow: state.style[StyleName.overflow],
          labelPadding: state.style[StyleName.labelPadding],
          textDirection: util.getValue(
            state.style,
            StyleName.textDirection,
            constants.DEFAULT_TEXT_DIRECTION,
          ),
        },
      )

      state.text.opacity = util.getNumber(state.style, StyleName.textOpacity, 100)
      state.text.dialect = isForceHtml
        ? constants.DIALECT_STRICTHTML
        : state.view.graph.dialect

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
        let result: CellState = state

        if (detector.SUPPORT_TOUCH || forceGetCell) {
          const x = DomEvent.getClientX(e)
          const y = DomEvent.getClientY(e)

          // Dispatches the drop event to the graph which
          // consumes and executes the source function
          const pt = util.convertPoint(graph.container, x, y)
          result = graph.view.getState(graph.getCellAt(pt.x, pt.y))!
        }

        return result
      }

      // TODO: Add handling for special touch device gestures
      DomEvent.addGestureListeners(
        state.text.elem!,
        (e: MouseEvent) => {
          if (this.isLabelEvent(state, e)) {
            graph.fireMouseEvent(DomEvent.MOUSE_DOWN, new CustomMouseEvent(e, state))
            forceGetCell = (
              graph.dialect !== constants.DIALECT_SVG &&
              util.getNodeName(DomEvent.getSource(e)) === 'img'
            )
          }
        },
        (e: MouseEvent) => {
          if (this.isLabelEvent(state, e)) {
            graph.fireMouseEvent(DomEvent.MOUSE_MOVE, new CustomMouseEvent(e, getState(e)))
          }
        },
        (e: MouseEvent) => {
          if (this.isLabelEvent(state, e)) {
            graph.fireMouseEvent(DomEvent.MOUSE_UP, new CustomMouseEvent(e, getState(e)))
            forceGetCell = false
          }
        },
      )

      // Uses double click timeout in mxGraph for quirks mode
      if (graph.nativeDblClickEnabled) {
        DomEvent.addListener(
          state.text.elem!,
          'dblclick',
          (e: MouseEvent) => {
            if (this.isLabelEvent(state, e)) {
              graph.dblClick(e, state.cell)
              DomEvent.consume(e)
            }
          },
        )
      }
    }
  }

  private initializeLabel(state: CellState, shape: Shape) {
    if (detector.NO_FOREIGNOBJECT && shape.dialect !== constants.DIALECT_SVG) {
      shape.init(state.view.graph.container)
    } else {
      shape.init(state.view.getDrawPane()!)
    }
  }

  createCellOverlays(state: CellState) {
    const graph = state.view.graph
    const overlays = graph.getCellOverlays(state.cell)
    let map: WeakMap<CellOverlay, ImageShape> | null = null
    let set: CellOverlay[] | null = null

    if (overlays != null) {
      map = new WeakMap<CellOverlay, ImageShape>()
      set = []

      overlays.forEach((overlay) => {
        let shape: ImageShape | null = null

        if (state.overlayMap && state.overlayMap.has(overlay)) {
          shape = state.overlayMap.get(overlay)!

          // remove used from set and map
          state.overlayMap.delete(overlay)
          const index = state.overlaySet!.indexOf(overlay)
          state.overlaySet!.splice(index, 1)
        }

        if (shape == null) {
          const img = new ImageShape(new Rectangle(), overlay.image.src)
          img.dialect = state.view.graph.dialect
          img.preserveImageAspect = false
          img.overlay = overlay

          this.initializeOverlay(state, img)
          this.installCellOverlayListeners(state, overlay, img)

          if (overlay.cursor != null) {
            img.elem!.style.cursor = overlay.cursor
          }

          map!.set(overlay, img)
          set!.push(overlay)
        } else {
          map!.set(overlay, shape)
          set!.push(overlay)
        }
      })
    }

    // clean unused
    if (state.overlaySet != null) {
      state.overlaySet.forEach((overlay) => {
        const shape = state.overlayMap!.get(overlay)!
        shape.destroy()
      })
    }

    state.overlayMap = map
    state.overlaySet = set
  }

  private initializeOverlay(state: CellState, overlayShape: Shape) {
    overlayShape.init(state.view.getOverlayPane()!)
  }

  private installCellOverlayListeners(
    state: CellState,
    overlay: CellOverlay,
    overlayShape: Shape,
  ) {
    const graph = state.view.graph
    const elem = overlayShape.elem!

    DomEvent.addListener(elem, 'click', (evt) => {
      if (graph.isEditing()) {
        graph.stopEditing(!graph.isInvokesStopCellEditing())
      }

      overlay.trigger('clicl', { cell: state.cell })
    })

    DomEvent.addGestureListeners(
      elem,
      (e: MouseEvent) => { DomEvent.consume(e) },
      (e: MouseEvent) => {
        graph.fireMouseEvent(
          DomEvent.MOUSE_MOVE,
          new CustomMouseEvent(e, state),
        )
      },
    )

    if (detector.SUPPORT_TOUCH) {
      DomEvent.addListener(elem, 'touchend', (evt) => {
        overlay.trigger('clicl', { cell: state.cell })
      })
    }
  }

  createControl(state: CellState) {
    const graph = state.view.graph
    const image = graph.getFoldingImage(state)

    if (graph.foldingEnabled && image != null) {
      if (state.control == null) {
        const b = new Rectangle(0, 0, image.width, image.height)
        state.control = new ImageShape(b, image.src)
        state.control.dialect = graph.dialect
        state.control.preserveImageAspect = false

        this.initControl(
          state,
          state.control,
          true,
          this.createControlClickHandler(state),
        )
      }
    } else if (state.control != null) {
      state.control.destroy()
      state.control = null
    }
  }

  createControlClickHandler(state: CellState) {
    const graph = state.view.graph
    return (e: MouseEvent) => {
      if (this.forceControlClickHandler || graph.isEnabled()) {
        const collapsed = !graph.isCellCollapsed(state.cell)
        graph.foldCells(collapsed, false, [state.cell], false, e)
        DomEvent.consume(e)
      }
    }
  }

  private initControl(
    state: CellState,
    control: ImageShape,
    handleEvents: boolean,
    clickHandler: (e: MouseEvent) => any,
  ) {
    const graph = state.view.graph

    // In the special case where the label is in HTML and the display is SVG the image
    // should go into the graph container directly in order to be clickable. Otherwise
    // it is obscured by the HTML label that overlaps the cell.
    const isForceHtml = (
      graph.isHtmlLabel(state.cell) &&
      detector.NO_FOREIGNOBJECT &&
      graph.dialect === constants.DIALECT_SVG
    )

    if (isForceHtml) {
      control.dialect = constants.DIALECT_PREFERHTML
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

      DomEvent.addGestureListeners(
        elem,
        (e: MouseEvent) => {
          first = new Point(DomEvent.getClientX(e), DomEvent.getClientY(e))
          graph.fireMouseEvent(DomEvent.MOUSE_DOWN, new CustomMouseEvent(e, state))
          DomEvent.consume(e)
        },
        (e: MouseEvent) => {
          graph.fireMouseEvent(DomEvent.MOUSE_MOVE, new CustomMouseEvent(e, state))
        },
        (e: MouseEvent) => {
          graph.fireMouseEvent(DomEvent.MOUSE_UP, new CustomMouseEvent(e, state))
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

  /**
   * Returns true if the event is for the shape of the given state.
   */
  isShapeEvent(state: CellState, e: MouseEvent) {
    return true
  }

  /**
   * Returns true if the event is for the label of the given state.
   */
  isLabelEvent(state: CellState, e: MouseEvent) {
    return true
  }

  installListeners(state: CellState) {
    const graph = state.view.graph
    const elem = state.shape!.elem!

    // Workaround for touch devices routing all events for a mouse
    // gesture (down, move, up) via the initial DOM node. Same for
    // HTML images in all IE versions (VML images are working).
    const getState = (e: MouseEvent) => {
      let result: CellState = state

      if ((
        graph.dialect !== constants.DIALECT_SVG &&
        util.getNodeName(DomEvent.getSource(e)) === 'img'
      ) || detector.SUPPORT_TOUCH
      ) {
        const x = DomEvent.getClientX(e)
        const y = DomEvent.getClientY(e)

        // Dispatches the drop event to the graph which
        // consumes and executes the source function
        const pt = util.convertPoint(graph.container, x, y)
        result = graph.view.getState(graph.getCellAt(pt.x, pt.y))!
      }

      return result
    }

    DomEvent.addGestureListeners(
      elem,
      (e: MouseEvent) => {
        if (this.isShapeEvent(state, e)) {
          graph.fireMouseEvent(DomEvent.MOUSE_DOWN, new CustomMouseEvent(e, state))
        }
      },
      (e: MouseEvent) => {
        if (this.isShapeEvent(state, e)) {
          graph.fireMouseEvent(DomEvent.MOUSE_MOVE, new CustomMouseEvent(e, getState(e)))
        }
      },
      (e: MouseEvent) => {
        if (this.isShapeEvent(state, e)) {
          graph.fireMouseEvent(DomEvent.MOUSE_UP, new CustomMouseEvent(e, getState(e)))
        }
      },
    )

    // Uses double click timeout in mxGraph for quirks mode
    if (graph.nativeDblClickEnabled) {
      DomEvent.addListener(elem, 'dblclick', (e: MouseEvent) => {
        if (this.isShapeEvent(state, e)) {
          graph.dblClick(e, state.cell)
          DomEvent.consume(e)
        }
      })
    }
  }

  redrawLabel(state: CellState, forced?: boolean) {
    const graph = state.view.graph
    const value = this.getLabelValue(state)
    const wrapping = graph.isWrapping(state.cell)
    const clipping = graph.isLabelClipped(state.cell)
    const isForceHtml = (
      state.view.graph.isHtmlLabel(state.cell) ||
      (value != null && util.isHTMLNode(value))
    )

    const dialect = isForceHtml ? constants.DIALECT_STRICTHTML : state.view.graph.dialect
    const overflow = state.style[StyleName.overflow] || 'visible'

    if (
      state.text != null && (
        state.text.wrap !== wrapping ||
        state.text.clipped !== clipping ||
        state.text.overflow !== overflow ||
        state.text.dialect !== dialect
      )) {
      state.text.destroy()
      state.text = null
    }

    if (
      state.text == null &&
      value != null &&
      (util.isHTMLNode(value) || value.length > 0)
    ) {
      this.createLabel(state, value)
    } else if (
      state.text != null &&
      (value == null || value.length === 0)
    ) {
      state.text.destroy()
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
        state.text.valign = graph.getVerticalAlign(state)
      }

      const bounds = this.getLabelBounds(state)
      const nextScale = this.getTextScale(state)

      if (
        forced ||
        state.text.value !== value ||
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
          Math.round((state.text.bounds.width / state.text.scale * nextScale) - bounds.width) !== 0
        ) {
          state.unscaledWidth = null
        }

        state.text.dialect = dialect
        state.text.value = value
        state.text.bounds = bounds
        state.text.scale = nextScale
        state.text.wrap = wrapping
        state.text.clipped = clipping
        state.text.overflow = overflow

        // Preserves visible state
        const vis = state.text!.elem!.style.visibility
        this.redrawLabelShape(state.text)
        state.text!.elem!.style.visibility = vis
      }
    }
  }

  isTextShapeInvalid(state: CellState, shape: Text) {
    const check = (prop: string, stylename: string, defaultValue?: any) => {
      let result = false

      const raw = (shape as any)[prop]
      const set = (state.style[stylename] || defaultValue)

      // Workaround for spacing added to directional spacing
      if (
        stylename === 'spacingTop' ||
        stylename === 'spacingRight' ||
        stylename === 'spacingBottom' ||
        stylename === 'spacingLeft'
      ) {
        result = parseFloat(raw) - shape.spacing !== set
      } else {
        result = raw !== set
      }

      return result
    }

    return check('fontStyle', StyleName.fontStyle, constants.DEFAULT_FONTSTYLE) ||
      check('family', StyleName.fontFamily, constants.DEFAULT_FONTFAMILY) ||
      check('size', StyleName.fontSize, constants.DEFAULT_FONTSIZE) ||
      check('color', StyleName.fontColor, 'black') ||
      check('align', StyleName.align, '') ||
      check('valign', StyleName.verticalAlign, '') ||
      check('spacing', StyleName.spacing, 2) ||
      check('spacingTop', StyleName.spacingTop, 0) ||
      check('spacingRight', StyleName.spacingRight, 0) ||
      check('spacingBottom', StyleName.spacingBottom, 0) ||
      check('spacingLeft', StyleName.spacingLeft, 0) ||
      check('horizontal', StyleName.horizontal, true) ||
      check('background', StyleName.labelBackgroundColor) ||
      check('border', StyleName.labelBorderColor) ||
      check('opacity', StyleName.textOpacity, 100) ||
      check('textDirection', StyleName.textDirection, constants.DEFAULT_TEXT_DIRECTION)
  }

  redrawLabelShape(shape: Shape) {
    shape.redraw()
  }

  getTextScale(state: CellState) {
    return state.view.scale
  }

  getLabelBounds(state: CellState) {
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
      if (state.text!.isPaintBoundsInverted()) {
        const tmp = bounds.x
        bounds.x = bounds.y
        bounds.y = tmp
      }

      bounds.x += state.bounds.x
      bounds.y += state.bounds.y

      // Minimum of 1 fixes alignment bug in HTML labels
      bounds.width = Math.max(1, state.bounds.width)
      bounds.height = Math.max(1, state.bounds.height)

      const sc = util.getValue(state.style, StyleName.strokeColor, constants.NONE)
      if (sc !== constants.NONE && sc !== '') {
        const s = util.getNumber(state.style, StyleName.strokeWidth, 1) * scale
        const dx = 1 + Math.floor((s - 1) / 2)
        const dh = Math.floor(s + 1)

        bounds.x += dx
        bounds.y += dx
        bounds.width -= dh
        bounds.height -= dh
      }
    }

    if (state.text!.isPaintBoundsInverted()) {
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

      const h = util.getValue(state.style, StyleName.labelPosition, Align.center)
      const v = util.getValue(state.style, StyleName.verticalLabelPosition, Align.middle)

      if (h === constants.ALIGN_CENTER && v === constants.ALIGN_MIDDLE) {
        bounds = state.shape.getLabelBounds(bounds)
      }
    }

    // Label width style overrides actual label width
    const lw = util.getValue(state.style, StyleName.labelWidth, null)
    if (lw != null) {
      bounds.width = parseFloat(lw) * scale
    }

    if (!isEdge) {
      this.rotateLabelBounds(state, bounds)
    }

    return bounds
  }

  rotateLabelBounds(state: CellState, bounds: Rectangle) {
    bounds.y -= state.text!.margin.y * bounds.height
    bounds.x -= state.text!.margin.x * bounds.width

    if (
      !this.legacySpacing || (
        state.style[StyleName.overflow] !== 'fill' &&
        state.style[StyleName.overflow] !== 'width')
    ) {
      const s = state.view.scale
      const spacing = state.text!.getSpacing()
      bounds.x += spacing.x * s
      bounds.y += spacing.y * s

      const h = util.getValue(state.style, StyleName.labelPosition, Align.center)
      const v = util.getValue(state.style, StyleName.verticalLabelPosition, Align.middle)
      const lw = util.getValue(state.style, StyleName.labelWidth, null)

      bounds.width = Math.max(
        0,
        bounds.width - (
          (h === Align.center && lw == null)
            ? (state.text!.spacingLeft * s + state.text!.spacingRight * s)
            : 0
        ),
      )

      bounds.height = Math.max(
        0,
        bounds.height - (v === Align.middle
          ? (state.text!.spacingTop * s + state.text!.spacingBottom * s)
          : 0
        ),
      )
    }

    const theta = state.text!.getTextRotation()

    // Only needed if rotated around another center
    if (theta !== 0 && state != null && state.cell.isNode()) {
      const cx = state.bounds.getCenterX()
      const cy = state.bounds.getCenterY()
      if (bounds.x !== cx || bounds.y !== cy) {
        const rad = theta * (Math.PI / 180)
        const pt = util.rotatePoint(
          new Point(bounds.x, bounds.y),
          Math.cos(rad),
          Math.sin(rad),
          new Point(cx, cy),
        )

        bounds.x = pt.x
        bounds.y = pt.y
      }
    }
  }

  redrawCellOverlays(state: CellState, forced?: boolean) {
    this.createCellOverlays(state)
    if (state.overlayMap != null) {
      const rot = util.mod(util.getNumber(state.style, StyleName.rotation, 0), 90)
      const rad = util.toRadians(rot)
      const cos = Math.cos(rad)
      const sin = Math.sin(rad)

      state.overlaySet!.forEach((overlay) => {
        const shape = state.overlayMap!.get(overlay)!
        const bounds = shape.overlay!.getBounds(state)

        if (!state.view.graph.getModel().isEdge(state.cell)) {
          if (state.shape != null && rot !== 0) {
            let cx = bounds.getCenterX()
            let cy = bounds.getCenterY()

            const point = util.rotatePoint(
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

  redrawControl(state: CellState, forced?: boolean) {
    const image = state.view.graph.getFoldingImage(state)

    if (state.control != null && image != null) {
      const bounds = this.getControlBounds(state, image.width, image.height)
      const s = state.view.scale
      const r = (this.legacyControlPosition)
        ? util.getNumber(state.style, StyleName.rotation, 0)
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

  getControlBounds(state: CellState, w: number, h: number) {
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
            rot = util.getValue(state.style, constants.STYLE_ROTATION, 0)
          } else {
            if (state.shape.isPaintBoundsInverted()) {
              const t = (state.bounds.width - state.bounds.height) / 2
              cx += t
              cy -= t
            }
          }

          if (rot !== 0) {
            const rad = util.toRadians(rot)
            const cos = Math.cos(rad)
            const sin = Math.sin(rad)

            const point = util.rotatePoint(
              new Point(cx, cy),
              cos,
              sin,
              state.bounds.getCenter(),
            )
            cx = point.x
            cy = point.y
          }
        }
      }

      return state.view.graph.getModel().isEdge(state.cell)
        ? new Rectangle(
          Math.round(cx - w / 2 * s),
          Math.round(cy - h / 2 * s),
          Math.round(w * s),
          Math.round(h * s),
        )
        : new Rectangle(
          Math.round(cx - w / 2 * s),
          Math.round(cy - h / 2 * s),
          Math.round(w * s),
          Math.round(h * s),
        )
    }

    return null
  }

  /**
   * Inserts the given array of `Shape`s after the given nodes in the DOM.
   *
   * Parameters:
   *
   * shapes - Array of <mxShapes> to be inserted.
   * node - Node in <drawPane> after which the shapes should be inserted.
   * htmlNode - Node in the graph container after which the shapes should be inserted that
   * will not go into the <drawPane> (eg. HTML labels without foreignObjects).
   */
  insertStateAfter(
    state: CellState,
    node: HTMLElement | null,
    htmlNode: HTMLElement | null,
  ) {
    const shapes = this.getShapesForState(state)
    shapes.forEach((shape) => {
      if (shape != null && shape.elem != null) {
        const html = (
          shape.elem.parentNode !== state.view.getDrawPane() &&
          shape.elem.parentNode !== state.view.getOverlayPane()
        )

        const temp = html ? htmlNode : node

        if (temp != null && temp.nextSibling !== shape.elem) {
          // prepend
          if (temp.nextSibling == null) {
            temp.parentNode!.appendChild(shape.elem)
          } else {
            temp.parentNode!.insertBefore(shape.elem, temp.nextSibling)
          }
        } else if (temp == null) {
          // Special case: First HTML node should be first sibling after canvas
          if (shape.elem.parentNode === state.view.graph.container) {
            let canvas = state.view.getCanvas()
            while (canvas != null && canvas.parentNode !== state.view.graph.container) {
              canvas = canvas.parentNode as HTMLElement
            }

            if (canvas != null && canvas.nextSibling != null) {
              if (canvas.nextSibling !== shape.elem) {
                shape.elem.parentNode.insertBefore(shape.elem, canvas.nextSibling)
              }
            } else {
              shape.elem.parentNode.appendChild(shape.elem)
            }
          } else if (
            shape.elem.parentNode!.firstChild != null &&
            shape.elem.parentNode!.firstChild !== shape.elem
          ) {
            // Inserts the node as the first child of the parent to implement the order
            shape.elem.parentNode!.insertBefore(shape.elem, shape.elem.parentNode!.firstChild)
          }
        }

        if (html) {
          htmlNode = shape.elem as HTMLElement // tslint:disable-line
        } else {
          node = shape.elem as HTMLElement // tslint:disable-line
        }
      }
    })

    return [node, htmlNode]
  }

  getShapesForState(state: CellState) {
    return [state.shape, state.text, state.control]
  }

  /**
   * Updates the bounds or points and scale of the shapes for the given cell
   * state. This is called in mxGraphView.validatePoints as the last step of
   * updating all cells.
   */
  redraw(
    state: CellState,
    force: boolean = false,
    rendering: boolean = false,
  ) {
    const shapeChanged = this.redrawShape(state, force, rendering)

    if (state.shape != null && (rendering == null || rendering)) {
      this.redrawLabel(state, shapeChanged)
      this.redrawCellOverlays(state, shapeChanged)
      this.redrawControl(state, shapeChanged)
    }
  }

  /**
   * Redraws the shape for the given cell state.
   */
  private redrawShape(state: CellState, force: boolean, rendering: boolean) {
    const model = state.view.graph.model
    let shapeChanged = false

    // Forces creation of new shape if shape style has changed
    if (
      state.shape != null &&
      state.style != null &&
      state.shape.style != null &&
      state.shape.style[constants.STYLE_SHAPE] !== state.style[constants.STYLE_SHAPE]
    ) {
      state.shape.destroy()
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
        state.shape.minSvgStrokeWidth = this.minSvgStrokeWidth
        state.shape.antiAlias = this.antiAlias

        this.createIndicatorShape(state)
        this.initializeShape(state)
        this.createCellOverlays(state)
        this.installListeners(state)

        // Forces a refresh of the handler if one exists
        if (state.view.graph.selectionCellsHandler) {
          state.view.graph.selectionCellsHandler.updateHandler(state)
        }
      }
    } else if (
      !force &&
      state.shape != null &&
      (
        !util.equalEntries(state.shape.style, state.style) ||
        this.checkPlaceholderStyles(state)
      )
    ) {
      state.shape.resetStyle()
      this.configureShape(state)
      // LATER: Ignore update for realtime to fix reset of current gesture
      state.view.graph.selectionCellsHandler.updateHandler(state)
      force = true // tslint:disable-line
    }

    if (state.shape != null) {
      // Handles changes of the collapse icon
      this.createControl(state)

      // Redraws the cell if required, ignores changes to bounds if points are
      // defined as the bounds are updated for the given points inside the shape
      if (force || this.isShapeInvalid(state, state.shape)) {
        if (state.absolutePoints != null) {
          state.shape.points = state.absolutePoints.slice() as Point[]
          delete state.shape.bounds
        } else {
          delete state.shape.points
          state.shape.bounds = state.bounds.clone()
        }

        state.shape.scale = state.view.scale

        if (rendering == null || rendering) {
          this.doRedrawShape(state)
        } else {
          state.shape.updateBoundingBox()
        }

        shapeChanged = true
      }
    }

    return shapeChanged
  }

  /**
   * Invokes redraw on the shape of the given state.
   */
  private doRedrawShape(state: CellState) {
    state.shape!.redraw()
  }

  /**
   * Returns true if the given shape must be repainted.
   */
  isShapeInvalid(state: CellState, shape: Shape) {
    return (
      shape.bounds == null ||
      shape.scale !== state.view.scale ||
      (
        state.absolutePoints == null &&
        !shape.bounds.equals(state.bounds)
      ) ||
      (
        state.absolutePoints != null &&
        !util.equalPoints(shape.points!, state.absolutePoints as Point[])
      )
    )
  }

  /**
   * Destroys the shapes associated with the given cell state.
   */
  destroy(state: CellState) {
    // 一个 Cell 一定包含自己的基础图形 -> shape
    // 可能包含一个 label 图形 -> text
    // 可能包含一个 control 图形 -> control
    // 可能包含多个 overlays 图形 -> overlays

    if (state.shape != null) {
      if (state.text != null) {
        state.text.destroy()
        state.text = null
      }

      if (state.overlayMap && state.overlaySet) {
        state.overlaySet.forEach((overlay) => {
          const shape = state.overlayMap!.get(overlay)!
          shape.destroy()
        })

        state.overlaySet = null
        state.overlayMap = null
      }

      if (state.control != null) {
        state.control.destroy()
        state.control = null
      }

      state.shape.destroy()
      state.shape = null
    }
  }
}

export namespace Renderer {
  export type ShapeClass = new (...args: any[]) => Shape

  const shapes: { [name: string]: ShapeClass } = {}

  export function registerShape(name: string, ctor: ShapeClass) {
    shapes[name] = ctor
  }

  export function getShape(name: string) {
    return name != null && shapes[name] || null
  }
}
