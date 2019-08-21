import * as util from '../util'
import { constants } from '../common/constants'
import { Shape, Stencil } from '../shape'
import { CellState } from './cell-state'

export class CellRenderer {
  antiAlias: boolean = true
  defaultEdgeShape = mxConnector
  defaultVertexShape = mxRectangleShape
  defaultTextShape = mxText
  minSvgStrokeWidth: number = 1

  /**
   * Specifies if the folding icon should ignore the horizontal
   * orientation of a swimlane.
   */
  legacyControlPosition: boolean = true

  /**
   * Specifies if spacing and label position should be ignored
   * if overflow is fill or width.
   */
  legacySpacing: boolean = true

  /**
   * Specifies if the enabled state should be ignored in the
   * control click handler (to allow folding in disabled graphs).
   */
  forceControlClickHandler: boolean = false

  private getShapeConstructor(state: CellState) {
    let ctor = CellRenderer.getShape(state.style[constants.STYLE_SHAPE])
    if (ctor == null) {
      ctor = state.view.graph.model.isEdge(state.cell)
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
      const stencil = Stencil.getStencil(state.style[constants.STYLE_SHAPE])
      if (stencil != null) {
        shape = new Shape(stencil)
      } else {
        const ctor = this.getShapeConstructor(state)
        shape = new (ctor as any)()
      }
    }

    return shape
  }

  private initializeShape(state: CellState) {
    if (state != null && state.shape != null) {
      state.shape.dialect = state.view.graph.dialect
      this.configureShape(state)
      state.shape.init(state.view.getDrawPane()!)
    }
  }

  private createIndicatorShape(state: CellState) {
    if (state != null && state.shape != null) {
      state.shape.indicatorShape = CellRenderer.getShape(
        state.view.graph.getIndicatorShape(state),
      )
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
      this.resolveColor(state, 'indicatorColor', constants.STYLE_FILLCOLOR)
      this.resolveColor(state, 'indicatorGradientColor', constants.STYLE_GRADIENTCOLOR)
      this.resolveColor(state, 'fill', constants.STYLE_FILLCOLOR)
      this.resolveColor(state, 'stroke', constants.STYLE_STROKECOLOR)
      this.resolveColor(state, 'gradient', constants.STYLE_GRADIENTCOLOR)
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
      (state.shape as any)[field] = key === constants.STYLE_STROKECOLOR
        ? '#000000'
        : '#ffffff'

      if (graph.model.getTerminal(state.cell, false) != null) {
        referenced = graph.model.getTerminal(state.cell, false)
      } else {
        referenced = state.cell
      }

      referenced = graph.getSwimlane(referenced)
      // tslint:disable-next-line
      key = graph.swimlaneIndicatorColorAttribute
    } else if (value === 'indicated') {
      (state.shape as any)[field] = state.shape.indicatorColor
    }

    if (referenced != null) {
      const rstate = graph.view.getState(referenced);
      (state.shape as any)[field] = null

      if (rstate != null) {
        if (rstate.shape != null && field !== 'indicatorColor') {
          (state.shape as any)[field] = rstate.shape[field]
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
    // LATER: Check if the color has actually changed
    if (state.style != null) {
      const values = ['inherit', 'swimlane', 'indicated']
      const styles = [
        constants.STYLE_FILLCOLOR,
        constants.STYLE_STROKECOLOR,
        constants.STYLE_GRADIENTCOLOR,
      ]

      for (let i = 0, ii = styles.length; i < ii; i += 1) {
        if (values.includes(state.style[styles[i]])) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Returns the value to be used for the label.
   */
  getLabelValue(state: CellState) {
    return state.view.graph.getLabel(state.cell)
  }

  /**
   * Creates the label for the given cell state.
   *
   * Parameters:
   *
   * state - <mxCellState> for which the label should be created.
   */
  createLabel(state: CellState, value: string) {
    const graph = state.view.graph
    const isEdge = graph.getModel().isEdge(state.cell)

    if (state.style[constants.STYLE_FONTSIZE] > 0 || state.style[constants.STYLE_FONTSIZE] == null) {
      // Avoids using DOM node for empty labels
      const isForceHtml = (graph.isHtmlLabel(state.cell) || (value != null && mxUtils.isNode(value)))

      state.text = new this.defaultTextShape(value, new mxRectangle(),
                                             (state.style[constants.STYLE_ALIGN] || constants.ALIGN_CENTER),
                                             graph.getVerticalAlign(state),
                                             state.style[constants.STYLE_FONTCOLOR],
                                             state.style[constants.STYLE_FONTFAMILY],
                                             state.style[constants.STYLE_FONTSIZE],
                                             state.style[constants.STYLE_FONTSTYLE],
                                             state.style[constants.STYLE_SPACING],
                                             state.style[constants.STYLE_SPACING_TOP],
                                             state.style[constants.STYLE_SPACING_RIGHT],
                                             state.style[constants.STYLE_SPACING_BOTTOM],
                                             state.style[constants.STYLE_SPACING_LEFT],
                                             state.style[constants.STYLE_HORIZONTAL],
                                             state.style[constants.STYLE_LABEL_BACKGROUNDCOLOR],
                                             state.style[constants.STYLE_LABEL_BORDERCOLOR],
                                             graph.isWrapping(state.cell) && graph.isHtmlLabel(state.cell),
                                             graph.isLabelClipped(state.cell),
                                             state.style[constants.STYLE_OVERFLOW],
                                             state.style[constants.STYLE_LABEL_PADDING],
                                             mxUtils.getValue(state.style, constants.STYLE_TEXT_DIRECTION, constants.DEFAULT_TEXT_DIRECTION))
      state.text.opacity = mxUtils.getValue(state.style, constants.STYLE_TEXT_OPACITY, 100)
      state.text.dialect = (isForceHtml) ? constants.DIALECT_STRICTHTML : state.view.graph.dialect
      state.text.style = state.style
      state.text.state = state
      this.initializeLabel(state, state.text)

      // Workaround for touch devices routing all events for a mouse gesture
      // (down, move, up) via the initial DOM node. IE additionally redirects
      // the event via the initial DOM node but the event source is the node
      // under the mouse, so we need to check if this is the case and force
      // getCellAt for the subsequent mouseMoves and the final mouseUp.
      let forceGetCell = false

      let getState  (evt) {
        let result = state

        if (mxClient.IS_TOUCH || forceGetCell) {
          const x = mxEvent.getClientX(evt)
          const y = mxEvent.getClientY(evt)

          // Dispatches the drop event to the graph which
          // consumes and executes the source function
          const pt = mxUtils.convertPoint(graph.container, x, y)
          result = graph.view.getState(graph.getCellAt(pt.x, pt.y))
        }

        return result
      }

      // TODO: Add handling for special touch device gestures
      mxEvent.addGestureListeners(state.text.node,
                                  mxUtils.bind(this, function (evt) {
                                    if (this.isLabelEvent(state, evt)) {
                                      graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, state))
                                      forceGetCell = graph.dialect != constants.DIALECT_SVG &&
              mxEvent.getSource(evt).nodeName == 'IMG'
                                    }
                                  }),
                                  mxUtils.bind(this, function (evt) {
                                    if (this.isLabelEvent(state, evt)) {
                                      graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, getState(evt)))
                                    }
                                  }),
                                  mxUtils.bind(this, function (evt) {
                                    if (this.isLabelEvent(state, evt)) {
                                      graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt, getState(evt)))
                                      forceGetCell = false
                                    }
                                  }),
      )

      // Uses double click timeout in mxGraph for quirks mode
      if (graph.nativeDblClickEnabled) {
        mxEvent.addListener(state.text.node, 'dblclick',
                            mxUtils.bind(this, function (evt) {
                              if (this.isLabelEvent(state, evt)) {
                                graph.dblClick(evt, state.cell)
                                mxEvent.consume(evt)
                              }
                            }),
        )
      }
    }
  }

  /**
   * Initiailzes the label with a suitable container.
   */
  initializeLabel(state, shape) {
    if (mxClient.IS_SVG && mxClient.NO_FO && shape.dialect != constants.DIALECT_SVG) {
      shape.init(state.view.graph.container)
    }
    else {
      shape.init(state.view.getDrawPane())
    }
  }

  /**
   * Creates the actual shape for showing the overlay for the given cell state.
   */
  createCellOverlays(state) {
    const graph = state.view.graph
    const overlays = graph.getCellOverlays(state.cell)
    let dict = null

    if (overlays != null) {
      dict = new mxDictionary()

      for (let i = 0; i < overlays.length; i++) {
        const shape = (state.overlays != null) ? state.overlays.remove(overlays[i]) : null

        if (shape == null) {
          const tmp = new mxImageShape(new mxRectangle(), overlays[i].image.src)
          tmp.dialect = state.view.graph.dialect
          tmp.preserveImageAspect = false
          tmp.overlay = overlays[i]
          this.initializeOverlay(state, tmp)
          this.installCellOverlayListeners(state, overlays[i], tmp)

          if (overlays[i].cursor != null) {
            tmp.node.style.cursor = overlays[i].cursor
          }

          dict.put(overlays[i], tmp)
        }
        else {
          dict.put(overlays[i], shape)
        }
      }
    }

    // Removes unused
    if (state.overlays != null) {
      state.overlays.visit(function (id, shape) {
        shape.destroy()
      })
    }

    state.overlays = dict
  }

  /**
   *
   * 创建 overlay 节点并 append 到 OverlayPane 中
   *
   * Initializes the given overlay.
   */
  initializeOverlay(state, overlay) {
    overlay.init(state.view.getOverlayPane())
  }

  /**
   * Installs the listeners for the given <mxCellState>, <mxCellOverlay> and
   * <mxShape> that represents the overlay.
   */
  installCellOverlayListeners(state, overlay, shape) {
    const graph = state.view.graph

    mxEvent.addListener(shape.node, 'click', function (evt) {
      if (graph.isEditing()) {
        graph.stopEditing(!graph.isInvokesStopCellEditing())
      }

      overlay.fireEvent(new mxEventObject(mxEvent.CLICK,
                                          'event', evt, 'cell', state.cell))
    })

    mxEvent.addGestureListeners(shape.node,
                                function (evt) {
                                  mxEvent.consume(evt)
                                },
                                function (evt) {
                                  graph.fireMouseEvent(mxEvent.MOUSE_MOVE,
                                                       new mxMouseEvent(evt, state))
                                })

    if (mxClient.IS_TOUCH) {
      mxEvent.addListener(shape.node, 'touchend', function (evt) {
        overlay.fireEvent(new mxEventObject(mxEvent.CLICK,
                                            'event', evt, 'cell', state.cell))
      })
    }
  }

  /**
   * Creates the control for the given cell state.
   */
  createControl(state) {
    const graph = state.view.graph
    const image = graph.getFoldingImage(state)

    if (graph.foldingEnabled && image != null) {
      if (state.control == null) {
        const b = new mxRectangle(0, 0, image.width, image.height)
        state.control = new mxImageShape(b, image.src)
        state.control.preserveImageAspect = false
        state.control.dialect = graph.dialect

        this.initControl(state, state.control, true, this.createControlClickHandler(state))
      }
    }
    else if (state.control != null) {
      state.control.destroy()
      state.control = null
    }
  }

  /**
   * Hook for creating the click handler for the folding icon.
   */
  createControlClickHandler(state) {
    const graph = state.view.graph

    return mxUtils.bind(this, function (evt) {
      if (this.forceControlClickHandler || graph.isEnabled()) {
        const collapse = !graph.isCellCollapsed(state.cell)
        graph.foldCells(collapse, false, [state.cell], null, evt)
        mxEvent.consume(evt)
      }
    })
  }

  /**
   * Initializes the given control and returns the corresponding DOM node.
   *
   * Parameters:
   *
   * state - <mxCellState> for which the control should be initialized.
   * control - <mxShape> to be initialized.
   * handleEvents - Boolean indicating if mousedown and mousemove should fire events via the graph.
   * clickHandler - Optional function to implement clicks on the control.
   */
  initControl(state, control, handleEvents, clickHandler) {
    const graph = state.view.graph

    // In the special case where the label is in HTML and the display is SVG the image
    // should go into the graph container directly in order to be clickable. Otherwise
    // it is obscured by the HTML label that overlaps the cell.
    const isForceHtml = graph.isHtmlLabel(state.cell) && mxClient.NO_FO &&
      graph.dialect == constants.DIALECT_SVG

    if (isForceHtml) {
      control.dialect = constants.DIALECT_PREFERHTML
      control.init(graph.container)
      control.node.style.zIndex = 1
    }
    else {
      control.init(state.view.getOverlayPane())
    }

    const node = control.innerNode || control.node

    // Workaround for missing click event on iOS is to check tolerance below
    if (clickHandler != null && !mxClient.IS_IOS) {
      if (graph.isEnabled()) {
        node.style.cursor = 'pointer'
      }

      mxEvent.addListener(node, 'click', clickHandler)
    }

    if (handleEvents) {
      let first = null

      mxEvent.addGestureListeners(node,
                                  function (evt) {
                                    first = new mxPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt))
                                    graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, state))
                                    mxEvent.consume(evt)
                                  },
                                  function (evt) {
                                    graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, state))
                                  },
                                  function (evt) {
                                    graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt, state))
                                    mxEvent.consume(evt)
                                  })

      // Uses capture phase for event interception to stop bubble phase
      if (clickHandler != null && mxClient.IS_IOS) {
        node.addEventListener('touchend', function (evt) {
          if (first != null) {
            const tol = graph.tolerance

            if (Math.abs(first.x - mxEvent.getClientX(evt)) < tol &&
              Math.abs(first.y - mxEvent.getClientY(evt)) < tol) {
              clickHandler.call(clickHandler, evt)
              mxEvent.consume(evt)
            }
          }
        },                    true)
      }
    }

    return node
  }

  /**
   * Returns true if the event is for the shape of the given state. This
   * implementation always returns true.
   *
   * Parameters:
   *
   * state - <mxCellState> whose shape fired the event.
   * evt - Mouse event which was fired.
   */
  isShapeEvent(state: CellState, evt) {
    return true
  }

  /**
   * Function: isLabelEvent
   *
   * Returns true if the event is for the label of the given state. This
   * implementation always returns true.
   *
   * Parameters:
   *
   * state - <mxCellState> whose label fired the event.
   * evt - Mouse event which was fired.
   */
  isLabelEvent(state: CellState, evt) {
    return true
  }

  /**
   * Installs the event listeners for the given cell state.
   *
   * Parameters:
   *
   * state - <mxCellState> for which the event listeners should be isntalled.
   */
  installListeners(state: CellState) {
    const graph = state.view.graph

    // Workaround for touch devices routing all events for a mouse
    // gesture (down, move, up) via the initial DOM node. Same for
    // HTML images in all IE versions (VML images are working).
    let getState  (evt) {
      let result = state

      if ((graph.dialect != constants.DIALECT_SVG && mxEvent.getSource(evt).nodeName == 'IMG') || mxClient.IS_TOUCH) {
        const x = mxEvent.getClientX(evt)
        const y = mxEvent.getClientY(evt)

        // Dispatches the drop event to the graph which
        // consumes and executes the source function
        const pt = mxUtils.convertPoint(graph.container, x, y)
        result = graph.view.getState(graph.getCellAt(pt.x, pt.y))
      }

      return result
    }

    mxEvent.addGestureListeners(state.shape.node,
                                mxUtils.bind(this, function (evt) {
                                  if (this.isShapeEvent(state, evt)) {
                                    graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, state))
                                  }
                                }),
                                mxUtils.bind(this, function (evt) {
                                  if (this.isShapeEvent(state, evt)) {
                                    graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, getState(evt)))
                                  }
                                }),
                                mxUtils.bind(this, function (evt) {
                                  if (this.isShapeEvent(state, evt)) {
                                    graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt, getState(evt)))
                                  }
                                }),
    )

    // Uses double click timeout in mxGraph for quirks mode
    if (graph.nativeDblClickEnabled) {
      mxEvent.addListener(state.shape.node, 'dblclick',
                          mxUtils.bind(this, function (evt) {
                            if (this.isShapeEvent(state, evt)) {
                              graph.dblClick(evt, state.cell)
                              mxEvent.consume(evt)
                            }
                          }),
      )
    }
  }

  /**
   * Redraws the label for the given cell state.
   *
   * Parameters:
   *
   * state - <mxCellState> whose label should be redrawn.
   */
  redrawLabel(state: CellState, forced) {
    const graph = state.view.graph
    const value = this.getLabelValue(state)
    const wrapping = graph.isWrapping(state.cell)
    const clipping = graph.isLabelClipped(state.cell)
    const isForceHtml = (state.view.graph.isHtmlLabel(state.cell) || (value != null && mxUtils.isNode(value)))
    const dialect = (isForceHtml) ? constants.DIALECT_STRICTHTML : state.view.graph.dialect
    const overflow = state.style[constants.STYLE_OVERFLOW] || 'visible'

    if (state.text != null && (state.text.wrap != wrapping || state.text.clipped != clipping ||
      state.text.overflow != overflow || state.text.dialect != dialect)) {
      state.text.destroy()
      state.text = null
    }

    if (state.text == null && value != null && (mxUtils.isNode(value) || value.length > 0)) {
      this.createLabel(state, value)
    }
    else if (state.text != null && (value == null || value.length == 0)) {
      state.text.destroy()
      state.text = null
    }

    if (state.text != null) {
      // Forced is true if the style has changed, so to get the updated
      // result in getLabelBounds we apply the new style to the shape
      if (forced) {
        // Checks if a full repaint is needed
        if (state.text.lastValue != null && this.isTextShapeInvalid(state, state.text)) {
          // Forces a full repaint
          state.text.lastValue = null
        }

        state.text.resetStyles()
        state.text.apply(state)

        // Special case where value is obtained via hook in graph
        state.text.valign = graph.getVerticalAlign(state)
      }

      const bounds = this.getLabelBounds(state)
      const nextScale = this.getTextScale(state)

      if (forced || state.text.value != value || state.text.isWrapping != wrapping ||
        state.text.overflow != overflow || state.text.isClipping != clipping ||
        state.text.scale != nextScale || state.text.dialect != dialect ||
        !state.text.bounds.equals(bounds)) {
        // Forces an update of the text bounding box
        if (state.text.bounds.width != 0 && state.unscaledWidth != null &&
          Math.round((state.text.bounds.width /
            state.text.scale * nextScale) - bounds.width) != 0) {
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
        const vis = state.text.node.style.visibility
        this.redrawLabelShape(state.text)
        state.text.node.style.visibility = vis
      }
    }
  }

  /**
   * Function: isTextShapeInvalid
   *
   * Returns true if the style for the text shape has changed.
   *
   * Parameters:
   *
   * state - <mxCellState> whose label should be checked.
   * shape - <mxText> shape to be checked.
   */
  isTextShapeInvalid(state, shape) {
    function check(property, stylename, defaultValue) {
      let result = false

      // Workaround for spacing added to directional spacing
      if (stylename == 'spacingTop' || stylename == 'spacingRight' ||
        stylename == 'spacingBottom' || stylename == 'spacingLeft') {
        result = parseFloat(shape[property]) - parseFloat(shape.spacing) !=
          (state.style[stylename] || defaultValue)
      }
      else {
        result = shape[property] != (state.style[stylename] || defaultValue)
      }

      return result
    }

    return check('fontStyle', constants.STYLE_FONTSTYLE, constants.DEFAULT_FONTSTYLE) ||
      check('family', constants.STYLE_FONTFAMILY, constants.DEFAULT_FONTFAMILY) ||
      check('size', constants.STYLE_FONTSIZE, constants.DEFAULT_FONTSIZE) ||
      check('color', constants.STYLE_FONTCOLOR, 'black') ||
      check('align', constants.STYLE_ALIGN, '') ||
      check('valign', constants.STYLE_VERTICAL_ALIGN, '') ||
      check('spacing', constants.STYLE_SPACING, 2) ||
      check('spacingTop', constants.STYLE_SPACING_TOP, 0) ||
      check('spacingRight', constants.STYLE_SPACING_RIGHT, 0) ||
      check('spacingBottom', constants.STYLE_SPACING_BOTTOM, 0) ||
      check('spacingLeft', constants.STYLE_SPACING_LEFT, 0) ||
      check('horizontal', constants.STYLE_HORIZONTAL, true) ||
      check('background', constants.STYLE_LABEL_BACKGROUNDCOLOR) ||
      check('border', constants.STYLE_LABEL_BORDERCOLOR) ||
      check('opacity', constants.STYLE_TEXT_OPACITY, 100) ||
      check('textDirection', constants.STYLE_TEXT_DIRECTION, constants.DEFAULT_TEXT_DIRECTION)
  }

  /**
   * Called to invoked redraw on the given text shape.
   *
   * Parameters:
   *
   * shape - <mxText> shape to be redrawn.
   */
  redrawLabelShape(shape: Shape) {
    shape.redraw()
  }

  /**
   * Returns the scaling used for the label of the given state
   *
   * Parameters:
   *
   * state - <mxCellState> whose label scale should be returned.
   */
  getTextScale(state: CellState) {
    return state.view.scale
  }

  /**
   * Returns the bounds to be used to draw the label of the given state.
   *
   * Parameters:
   *
   * state - <mxCellState> whose label bounds should be returned.
   */
  getLabelBounds(state) {
    const graph = state.view.graph
    const scale = state.view.scale
    const isEdge = graph.getModel().isEdge(state.cell)
    let bounds = new mxRectangle(state.absoluteOffset.x, state.absoluteOffset.y)

    if (isEdge) {
      const spacing = state.text.getSpacing()
      bounds.x += spacing.x * scale
      bounds.y += spacing.y * scale

      const geo = graph.getCellGeometry(state.cell)

      if (geo != null) {
        bounds.width = Math.max(0, geo.width * scale)
        bounds.height = Math.max(0, geo.height * scale)
      }
    }
    else {
      // Inverts label position
      if (state.text.isPaintBoundsInverted()) {
        const tmp = bounds.x
        bounds.x = bounds.y
        bounds.y = tmp
      }

      bounds.x += state.x
      bounds.y += state.y

      // Minimum of 1 fixes alignment bug in HTML labels
      bounds.width = Math.max(1, state.width)
      bounds.height = Math.max(1, state.height)

      const sc = mxUtils.getValue(state.style, constants.STYLE_STROKECOLOR, constants.NONE)

      if (sc != constants.NONE && sc != '') {
        const s = parseFloat(mxUtils.getValue(state.style, constants.STYLE_STROKEWIDTH, 1)) * scale
        const dx = 1 + Math.floor((s - 1) / 2)
        const dh = Math.floor(s + 1)

        bounds.x += dx
        bounds.y += dx
        bounds.width -= dh
        bounds.height -= dh
      }
    }

    if (state.text.isPaintBoundsInverted()) {
      // Rotates around center of state
      const t = (state.width - state.height) / 2
      bounds.x += t
      bounds.y -= t
      const tmp = bounds.width
      bounds.width = bounds.height
      bounds.height = tmp
    }

    // Shape can modify its label bounds
    if (state.shape != null) {
      const hpos = mxUtils.getValue(state.style, constants.STYLE_LABEL_POSITION, constants.ALIGN_CENTER)
      const vpos = mxUtils.getValue(state.style, constants.STYLE_VERTICAL_LABEL_POSITION, constants.ALIGN_MIDDLE)

      if (hpos == constants.ALIGN_CENTER && vpos == constants.ALIGN_MIDDLE) {
        bounds = state.shape.getLabelBounds(bounds)
      }
    }

    // Label width style overrides actual label width
    const lw = mxUtils.getValue(state.style, constants.STYLE_LABEL_WIDTH, null)

    if (lw != null) {
      bounds.width = parseFloat(lw) * scale
    }

    if (!isEdge) {
      this.rotateLabelBounds(state, bounds)
    }

    return bounds
  }

  /**
   * Function: rotateLabelBounds
   *
   * Adds the shape rotation to the given label bounds and
   * applies the alignment and offsets.
   *
   * Parameters:
   *
   * state - <mxCellState> whose label bounds should be rotated.
   * bounds - <mxRectangle> the rectangle to be rotated.
   */
  rotateLabelBounds(state, bounds) {
    bounds.y -= state.text.margin.y * bounds.height
    bounds.x -= state.text.margin.x * bounds.width

    if (!this.legacySpacing || (state.style[constants.STYLE_OVERFLOW] != 'fill' && state.style[constants.STYLE_OVERFLOW] != 'width')) {
      const s = state.view.scale
      const spacing = state.text.getSpacing()
      bounds.x += spacing.x * s
      bounds.y += spacing.y * s

      const hpos = mxUtils.getValue(state.style, constants.STYLE_LABEL_POSITION, constants.ALIGN_CENTER)
      const vpos = mxUtils.getValue(state.style, constants.STYLE_VERTICAL_LABEL_POSITION, constants.ALIGN_MIDDLE)
      const lw = mxUtils.getValue(state.style, constants.STYLE_LABEL_WIDTH, null)

      bounds.width = Math.max(0, bounds.width - ((hpos == constants.ALIGN_CENTER && lw == null) ? (state.text.spacingLeft * s + state.text.spacingRight * s) : 0))
      bounds.height = Math.max(0, bounds.height - ((vpos == constants.ALIGN_MIDDLE) ? (state.text.spacingTop * s + state.text.spacingBottom * s) : 0))
    }

    const theta = state.text.getTextRotation()

    // Only needed if rotated around another center
    if (theta != 0 && state != null && state.view.graph.model.isVertex(state.cell)) {
      const cx = state.getCenterX()
      const cy = state.getCenterY()

      if (bounds.x != cx || bounds.y != cy) {
        const rad = theta * (Math.PI / 180)
        pt = mxUtils.getRotatedPoint(new mxPoint(bounds.x, bounds.y),
                                     Math.cos(rad), Math.sin(rad), new mxPoint(cx, cy))

        bounds.x = pt.x
        bounds.y = pt.y
      }
    }
  }

  /**
   * Function: redrawCellOverlays
   *
   * Redraws the overlays for the given cell state.
   *
   * Parameters:
   *
   * state - <mxCellState> whose overlays should be redrawn.
   */
  redrawCellOverlays(state, forced) {
    this.createCellOverlays(state)

    if (state.overlays != null) {
      const rot = mxUtils.mod(mxUtils.getValue(state.style, constants.STYLE_ROTATION, 0), 90)
      const rad = mxUtils.toRadians(rot)
      const cos = Math.cos(rad)
      const sin = Math.sin(rad)

      state.overlays.visit(function (id, shape) {
        const bounds = shape.overlay.getBounds(state)

        if (!state.view.graph.getModel().isEdge(state.cell)) {
          if (state.shape != null && rot != 0) {
            let cx = bounds.getCenterX()
            let cy = bounds.getCenterY()

            const point = mxUtils.getRotatedPoint(new mxPoint(cx, cy), cos, sin,
                                                  new mxPoint(state.getCenterX(), state.getCenterY()))

            cx = point.x
            cy = point.y
            bounds.x = Math.round(cx - bounds.width / 2)
            bounds.y = Math.round(cy - bounds.height / 2)
          }
        }

        if (forced || shape.bounds == null || shape.scale != state.view.scale ||
          !shape.bounds.equals(bounds)) {
          shape.bounds = bounds
          shape.scale = state.view.scale
          shape.redraw()
        }
      })
    }
  }

  /**
   * Function: redrawControl
   *
   * Redraws the control for the given cell state.
   *
   * Parameters:
   *
   * state - <mxCellState> whose control should be redrawn.
   */
  redrawControl(state, forced) {
    const image = state.view.graph.getFoldingImage(state)

    if (state.control != null && image != null) {
      const bounds = this.getControlBounds(state, image.width, image.height)
      const r = (this.legacyControlPosition) ?
        mxUtils.getValue(state.style, constants.STYLE_ROTATION, 0) :
        state.shape.getTextRotation()
      const s = state.view.scale

      if (forced || state.control.scale != s || !state.control.bounds.equals(bounds) ||
        state.control.rotation != r) {
        state.control.rotation = r
        state.control.bounds = bounds
        state.control.scale = s

        state.control.redraw()
      }
    }
  }

  /**
   * Function: getControlBounds
   *
   * Returns the bounds to be used to draw the control (folding icon) of the
   * given state.
   */
  getControlBounds(state, w, h) {
    if (state.control != null) {
      const s = state.view.scale
      let cx = state.getCenterX()
      let cy = state.getCenterY()

      if (!state.view.graph.getModel().isEdge(state.cell)) {
        cx = state.x + w * s
        cy = state.y + h * s

        if (state.shape != null) {
          // TODO: Factor out common code
          let rot = state.shape.getShapeRotation()

          if (this.legacyControlPosition) {
            rot = mxUtils.getValue(state.style, constants.STYLE_ROTATION, 0)
          }
          else {
            if (state.shape.isPaintBoundsInverted()) {
              const t = (state.width - state.height) / 2
              cx += t
              cy -= t
            }
          }

          if (rot != 0) {
            const rad = mxUtils.toRadians(rot)
            const cos = Math.cos(rad)
            const sin = Math.sin(rad)

            const point = mxUtils.getRotatedPoint(new mxPoint(cx, cy), cos, sin,
                                                  new mxPoint(state.getCenterX(), state.getCenterY()))
            cx = point.x
            cy = point.y
          }
        }
      }

      return (state.view.graph.getModel().isEdge(state.cell)) ?
        new mxRectangle(Math.round(cx - w / 2 * s), Math.round(cy - h / 2 * s), Math.round(w * s), Math.round(h * s))
        : new mxRectangle(Math.round(cx - w / 2 * s), Math.round(cy - h / 2 * s), Math.round(w * s), Math.round(h * s))
    }

    return null
  }

  /**
   * Function: insertStateAfter
   *
   * Inserts the given array of <mxShapes> after the given nodes in the DOM.
   *
   * Parameters:
   *
   * shapes - Array of <mxShapes> to be inserted.
   * node - Node in <drawPane> after which the shapes should be inserted.
   * htmlNode - Node in the graph container after which the shapes should be inserted that
   * will not go into the <drawPane> (eg. HTML labels without foreignObjects).
   */
  insertStateAfter(state, node, htmlNode) {
    const shapes = this.getShapesForState(state)

    for (let i = 0; i < shapes.length; i++) {
      if (shapes[i] != null && shapes[i].node != null) {
        const html = shapes[i].node.parentNode != state.view.getDrawPane() &&
          shapes[i].node.parentNode != state.view.getOverlayPane()
        const temp = (html) ? htmlNode : node

        if (temp != null && temp.nextSibling != shapes[i].node) {
          if (temp.nextSibling == null) {
            temp.parentNode.appendChild(shapes[i].node)
          }
          else {
            temp.parentNode.insertBefore(shapes[i].node, temp.nextSibling)
          }
        }
        else if (temp == null) {
          // Special case: First HTML node should be first sibling after canvas
          if (shapes[i].node.parentNode == state.view.graph.container) {
            let canvas = state.view.canvas

            while (canvas != null && canvas.parentNode != state.view.graph.container) {
              canvas = canvas.parentNode
            }

            if (canvas != null && canvas.nextSibling != null) {
              if (canvas.nextSibling != shapes[i].node) {
                shapes[i].node.parentNode.insertBefore(shapes[i].node, canvas.nextSibling)
              }
            }
            else {
              shapes[i].node.parentNode.appendChild(shapes[i].node)
            }
          }
          else if (shapes[i].node.parentNode.firstChild != null && shapes[i].node.parentNode.firstChild != shapes[i].node) {
            // Inserts the node as the first child of the parent to implement the order
            shapes[i].node.parentNode.insertBefore(shapes[i].node, shapes[i].node.parentNode.firstChild)
          }
        }

        if (html) {
          htmlNode = shapes[i].node
        }
        else {
          node = shapes[i].node
        }
      }
    }

    return [node, htmlNode]
  }

  /**
   * Function: getShapesForState
   *
   * Returns the <mxShapes> for the given cell state in the order in which they should
   * appear in the DOM.
   *
   * Parameters:
   *
   * state - <mxCellState> whose shapes should be returned.
   */
  getShapesForState(state: CellState) {
    return [state.shape, state.text, state.control]
  }

  /**
   * Updates the bounds or points and scale of the shapes for the given cell
   * state. This is called in mxGraphView.validatePoints as the last step of
   * updating all cells.
   *
   * Parameters:
   *
   * state - <mxCellState> for which the shapes should be updated.
   * force - Optional boolean that specifies if the cell should be reconfiured
   * and redrawn without any additional checks.
   * rendering - Optional boolean that specifies if the cell should actually
   * be drawn into the DOM. If this is false then redraw and/or reconfigure
   * will not be called on the shape.
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
        state.view.graph.selectionCellsHandler.updateHandler(state)
      }
    } else if (
      !force &&
      state.shape != null &&
      (
        !mxUtils.equalEntries(state.shape.style, state.style) ||
        this.checkPlaceholderStyles(state)
      )
    ) {
      state.shape.resetStyles()
      this.configureShape(state)
      // LATER: Ignore update for realtime to fix reset of current gesture
      state.view.graph.selectionCellsHandler.updateHandler(state)
      force = true
    }

    if (state.shape != null) {
      // Handles changes of the collapse icon
      this.createControl(state)

      // Redraws the cell if required, ignores changes to bounds if points are
      // defined as the bounds are updated for the given points inside the shape
      if (force || this.isShapeInvalid(state, state.shape)) {
        if (state.absolutePoints != null) {
          state.shape.points = state.absolutePoints.slice()
          state.shape.bounds = null
        } else {
          state.shape.points = null
          state.shape.bounds = new Rect(state.x, state.y, state.width, state.height)
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
      shape.scale != state.view.scale ||
      (state.absolutePoints == null && !shape.bounds.equals(state)) ||
      (state.absolutePoints != null && !mxUtils.equalPoints(shape.points, state.absolutePoints)))
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

      if (state.overlays != null) {
        state.overlays.visit((id, shape) => {
          shape.destroy()
        })

        state.overlays = null
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

export namespace CellRenderer {
  const shapes: { [name: string]: Shape } = {}

  export function registerShape(name: string, shape: Shape) {
    shapes[name] = shape
  }

  export function getShape(name: string) {
    return shapes[name] || null
  }
}
