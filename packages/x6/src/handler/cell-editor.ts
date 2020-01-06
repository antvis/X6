import { Rectangle } from '../geometry'
import { Platform, StringExt } from '../util'
import { DomUtil, DomEvent } from '../dom'
import { Disposable } from '../entity'
import { Graph } from '../graph'
import { Cell } from '../core/cell'
import { State } from '../core/state'
import { Align } from '../types'
import { globals } from '../option'
import { FontStyle } from '../enum'

export class CellEditor extends Disposable {
  readonly graph: Graph

  private zoomHandler: () => void
  private changeHandler: () => void
  private clearOnChange: boolean
  private resizeTimer: number | null
  private bounds: Rectangle | null

  constructor(graph: Graph) {
    super()

    this.graph = graph

    // Stops editing after zoom changes
    this.zoomHandler = () => {
      if (this.graph.isEditing()) {
        this.resize()
      }
    }

    this.graph.view.on('scale', this.zoomHandler)
    this.graph.view.on('scaleAndTranslate', this.zoomHandler)

    // Adds handling of deleted cells while editing
    this.changeHandler = () => {
      if (
        this.editingCell != null &&
        this.graph.view.getState(this.editingCell) == null
      ) {
        this.stopEditing(true)
      }
    }

    this.graph.model.on('change', this.changeHandler)
  }

  /**
   * Holds the DIV that is used for text editing.
   */
  textarea: HTMLDivElement | null = null

  /**
   * Reference to the label DOM node that has been hidden.
   */
  textNode: HTMLElement | SVGElement | null

  /**
   * Reference to the <mxCell> that is currently being edited.
   */
  editingCell: Cell | null = null

  /**
   * Reference to the event that was used to start editing.
   */
  trigger?: Event

  /**
   * Specifies if the label has been modified.
   */
  modified: boolean = false

  /**
   * Specifies if the textarea should be resized while the text is being edited.
   *
   * Default is `true`.
   */
  autoSize: boolean = true

  /**
   * Specifies if the text should be selected when editing starts.
   *
   * Default is `true`.
   */
  autoSelect: boolean = true

  /**
   * If true, pressing the escape key will stop editing and not accept the new
   * value. Change this to false to accept the new value on escape, and cancel
   * editing on Shift+Escape instead.
   *
   * Default is `true`.
   */
  escape: boolean = true

  /**
   * If `focusLost` should be called if textarea loses the focus.
   *
   * Default is `false`.
   */
  blurEnabled: boolean = false

  /**
   * Holds the current temporary horizontal alignment for the cell style.
   * If this is modified then the current text alignment is changed and
   * the cell style is updated when the value is applied.
   */
  align: Align | null

  /**
   * Holds the initial editing value to check if the current value was modified.
   */
  initialValue: string | null = null

  /**
   * Text to be displayed for empty labels.
   *
   * Default is '' or '<br>' in Firefox as a workaround for the missing
   * cursor bug for empty content editable.
   *
   * This can be set to eg. "[Type Here]" to easier visualize editing of
   * empty labels. The value is only displayed before the first keystroke
   * and is never used as the actual editing value.
   */
  placeholder: string = Platform.IS_FIREFOX ? '<br>' : ''

  /**
   * Specifies the zIndex for the textarea.
   *
   * Default is `5`.
   */
  zIndex: number = 5

  /**
   * Defines the minimum width and height to be used in <resize>. Default is 0x20px.
   */
  minResize: Rectangle = new Rectangle(0, 20)

  /**
   * Correction factor for word wrapping width.
   *
   * Default is `2` in quirks, `0` in IE11 and `1` in other browsers and modes.
   */
  wordWrapPadding = !Platform.IS_IE11 ? 1 : 0

  init() {
    this.textarea = document.createElement('div')
    this.textarea.contentEditable = 'true'

    const prefixCls = this.graph.prefixCls
    this.textarea.className = `${prefixCls}-cell-editor`

    // Workaround for selection outside of DIV if height is 0
    if (Platform.IS_CHROME) {
      this.textarea.style.minHeight = '1em'
    }

    this.textarea.style.position = this.isLegacyEditor()
      ? 'absolute'
      : 'relative'

    this.installListeners(this.textarea)
  }

  /**
   * Returns true if the SVG root element in the graph does not have CSS
   * position absolute. In these cases the text editor must use CSS position
   * absolute to avoid an offset but it will have a less accurate line
   * wrapping width during the text editing preview.
   */
  protected isLegacyEditor() {
    let absoluteRoot = false

    if (this.graph.dialect === 'svg') {
      const drawPane = this.graph.view.getDrawPane() as SVGElement
      const root = drawPane.ownerSVGElement
      if (root != null) {
        absoluteRoot = DomUtil.getComputedStyle(root).position === 'absolute'
      }
    }

    return !absoluteRoot
  }

  protected installListeners(elem: HTMLDivElement) {
    // Applies value if text is dragged
    DomEvent.addListener(elem, 'dragstart', e => {
      this.graph.stopEditing(false)
      DomEvent.consume(e)
    })

    DomEvent.addListener(elem, 'blur', () => {
      if (this.blurEnabled) {
        this.focusLost()
      }
    })

    // Updates modified state and handles placeholder text
    DomEvent.addListener(elem, 'keydown', (e: KeyboardEvent) => {
      if (!DomEvent.isConsumed(e)) {
        if (this.isStopEditingEvent(e)) {
          this.graph.stopEditing(false)
          DomEvent.consume(e)
        } else if (e.keyCode === 27) {
          this.graph.stopEditing(this.isCancelEditingKeyEvent(e))
          DomEvent.consume(e)
        }
      }
    })

    // Keypress only fires if printable key was pressed and
    // handles removing the empty placeholder
    const keypressHandler = (e: KeyboardEvent) => {
      if (this.editingCell != null) {
        // Clears the initial empty label on the first keystroke
        // and workaround for FF which fires keypress for delete and backspace
        if (
          this.clearOnChange &&
          elem.innerHTML === this.getEmptyLabelText(this.editingCell) &&
          (!Platform.IS_FIREFOX || (e.keyCode !== 8 && e.keyCode !== 46))
        ) {
          this.clearOnChange = false
          elem.innerHTML = ''
        }
      }
    }

    DomEvent.addListener(elem, 'keypress', keypressHandler)
    DomEvent.addListener(elem, 'paste', keypressHandler)

    // Handler for updating the empty label text value after a change
    const keyupHandler = () => {
      if (this.editingCell != null && this.textarea != null) {
        // Uses an optional text value for empty labels which is cleared
        // when the first keystroke appears. This makes it easier to see
        // that a label is being edited even if the label is empty.

        // In Safari and FF, an empty text is represented by <BR>
        // which isn't enough to force a valid size
        if (
          this.textarea.innerHTML.length === 0 ||
          this.textarea.innerHTML === '<br>'
        ) {
          this.textarea.innerHTML = this.getEmptyLabelText(this.editingCell)
          this.clearOnChange = this.textarea.innerHTML.length > 0
        } else {
          this.clearOnChange = false
        }
      }
    }

    const keyup = !Platform.IS_IE11 && !Platform.IS_IE ? 'input' : 'keyup'
    DomEvent.addListener(elem, keyup, keyupHandler)
    DomEvent.addListener(elem, 'cut', keyupHandler)
    DomEvent.addListener(elem, 'paste', keyupHandler)

    // Adds automatic resizing of the textbox while typing
    // using input, keyup and/or DOM change events
    const resizeHandler = (e: KeyboardEvent) => {
      if (this.editingCell && this.autoSize && !DomEvent.isConsumed(e)) {
        // Asynchronous is needed for keydown and shows better results for
        // input events overall (ie non-blocking and cases where the
        // offsetWidth/-Height was wrong at this time)
        if (this.resizeTimer != null) {
          window.clearTimeout(this.resizeTimer)
        }

        this.resizeTimer = window.setTimeout(() => {
          this.resizeTimer = null
          this.resize()
        })
      }
    }

    const keydown = !Platform.IS_IE11 && !Platform.IS_IE ? 'input' : 'keydown'
    DomEvent.addListener(elem, keydown, resizeHandler)
    DomEvent.addListener(window, 'resize', resizeHandler)

    DomEvent.addListener(elem, 'cut', resizeHandler)
    DomEvent.addListener(elem, 'paste', resizeHandler)
  }

  protected isCancelEditingKeyEvent(e: KeyboardEvent) {
    return (
      this.escape ||
      DomEvent.isShiftDown(e) ||
      DomEvent.isControlDown(e) ||
      DomEvent.isMetaDown(e)
    )
  }

  protected isStopEditingEvent(e: KeyboardEvent) {
    return (
      e.keyCode === 113 /* F2 */ ||
      (this.graph.isStopEditingOnEnter() &&
      e.keyCode === 13 /* Enter */ &&
        !DomEvent.isControlDown(e) &&
        !DomEvent.isShiftDown(e))
    )
  }

  protected focusLost() {
    this.stopEditing(!this.graph.isInvokesStopCellEditing())
  }

  protected isAutoSelectText() {
    return this.autoSelect
  }

  protected clearSelection() {
    DomUtil.clearSelection()
  }

  /**
   * Returns true if the label should be hidden while the cell is being
   * edited.
   */
  protected isHideLabel(state: State) {
    return true
  }

  setAlign(align: Align) {
    if (this.textarea != null) {
      this.textarea.style.textAlign = align
    }

    this.align = align
    this.resize()
  }

  protected applyValue(state: State, value: string) {
    this.graph.updateLabel(state.cell, value, this.trigger)
  }

  protected getInitialValue(state: State, trigger?: Event) {
    const content = this.graph.getEditingContent(state.cell, trigger) || ''
    let result = StringExt.escape(content)

    result = DomUtil.replaceTrailingNewlines(result, '<div><br></div>')

    return result.replace(/\n/g, '<br>')
  }

  protected getCurrentValue(state: State) {
    return DomUtil.extractTextWithWhitespace(this.textarea!.childNodes as any)
  }

  isEventSource(e: Event) {
    return DomEvent.getSource(e) === this.textarea
  }

  resize() {
    const state = this.graph.view.getState(this.editingCell)
    if (state == null) {
      this.stopEditing(true)
    } else if (this.textarea != null) {
      const scale = this.graph.view.scale
      const isEdge = this.graph.model.isEdge(state.cell)
      let m = null

      if (!this.autoSize || state.style.overflow === 'fill') {
        // Specifies the bounds of the editor box
        this.bounds = this.getEditorBounds(state)
        this.textarea.style.width = DomUtil.toPx(
          Math.round(this.bounds.width / scale),
        )
        this.textarea.style.height = DomUtil.toPx(
          Math.round(this.bounds.height / scale),
        )
        this.textarea.style.left = DomUtil.toPx(
          Math.max(0, Math.round(this.bounds.x + 1)),
        )
        this.textarea.style.top = DomUtil.toPx(
          Math.max(0, Math.round(this.bounds.y + 1)),
        )

        // Installs native word wrapping and avoids word wrap for empty label placeholder
        if (
          this.graph.isWrapping(state.cell) &&
          (this.bounds.width >= 2 || this.bounds.height >= 2) &&
          this.textarea.innerHTML !== this.getEmptyLabelText(this.editingCell!)
        ) {
          this.textarea.style.wordWrap = 'normal'
          this.textarea.style.whiteSpace = 'normal'

          if (state.style.overflow !== 'fill') {
            this.textarea.style.width = DomUtil.toPx(
              Math.round(this.bounds.width / scale) + this.wordWrapPadding,
            )
          }
        } else {
          this.textarea.style.whiteSpace = 'nowrap'
          if (state.style.overflow !== 'fill') {
            this.textarea.style.width = ''
          }
        }
      } else {
        const lw = state.style.labelWidth
        m = state.text && this.align ? state.text.margin : null

        if (m == null) {
          m = Align.getAlignmentAsPoint(
            this.align || state.style.align || 'center',
            state.style.verticalAlign || 'middle',
          )
        }

        if (isEdge) {
          this.bounds = new Rectangle(
            state.absoluteOffset.x,
            state.absoluteOffset.y,
            0,
            0,
          )
          if (lw != null) {
            const tmp = (lw + 2) * scale
            this.bounds.width = tmp
            this.bounds.x += m.x * tmp
          }
        } else {
          let bds = state.bounds.clone()
          const hpos = state.style.labelPosition || 'center'
          const vpos = state.style.labelVerticalPosition || 'middle'

          bds =
            state.shape != null && hpos === 'center' && vpos === 'middle'
              ? state.shape.getLabelBounds(bds)
              : bds

          if (lw != null) {
            bds.width = lw * scale
          }

          if (
            !state.view.graph.renderer.legacySpacing ||
            state.style.overflow !== 'width'
          ) {
            const spacing = (state.style.spacing || 0) * scale
            const spacingTop = (state.style.spacingTop || 0) * scale + spacing
            const spacingRight =
              (state.style.spacingRight || 0) * scale + spacing
            const spacingBottom =
              (state.style.spacingRight || 0) * scale + spacing
            const spacingLeft = (state.style.spacingLeft || 0) * scale + spacing
            const hpos = state.style.labelPosition || 'center'
            const vpos = state.style.labelVerticalPosition || 'middle'

            bds = new Rectangle(
              bds.x + spacingLeft,
              bds.y + spacingTop,
              bds.width -
                (hpos === 'center' && lw == null
                  ? spacingLeft + spacingRight
                  : 0),
              bds.height - (vpos === 'middle' ? spacingTop + spacingBottom : 0),
            )
          }

          this.bounds = new Rectangle(
            bds.x + state.absoluteOffset.x,
            bds.y + state.absoluteOffset.y,
            bds.width,
            bds.height,
          )
        }

        // Needed for word wrap inside text blocks with oversize lines to match
        // the final result where the width of the longest line is used as the
        // reference for text alignment in the cell.

        if (
          this.graph.isWrapping(state.cell) &&
          (this.bounds.width >= 2 || this.bounds.height >= 2) &&
          this.textarea.innerHTML !== this.getEmptyLabelText(this.editingCell!)
        ) {
          this.textarea.style.wordWrap = 'normal'
          this.textarea.style.whiteSpace = 'normal'

          // Forces automatic reflow if text is removed from an oversize label and normal word wrap
          const tmp =
            Math.round(this.bounds.width / scale) + this.wordWrapPadding
          if (this.textarea.style.position !== 'relative') {
            this.textarea.style.width = DomUtil.toPx(tmp)

            if (this.textarea.scrollWidth > tmp) {
              this.textarea.style.width = DomUtil.toPx(
                this.textarea.scrollWidth,
              )
            }
          } else {
            this.textarea.style.maxWidth = DomUtil.toPx(tmp)
          }
        } else {
          // KNOWN: Trailing cursor in IE9 quirks mode is not visible
          this.textarea.style.whiteSpace = 'nowrap'
          this.textarea.style.width = ''
        }

        this.textarea.style.left = DomUtil.toPx(
          Math.max(
            0,
            Math.round(this.bounds.x - m.x * (this.bounds.width - 2)) + 1,
          ),
        ) // tslint:disable-line
        this.textarea.style.top = DomUtil.toPx(
          Math.max(
            0,
            Math.round(
              this.bounds.y -
                m.y * (this.bounds.height - 4) +
                (m.y === -1 ? 3 : 0),
            ) + 1,
          ),
        ) // tslint:disable-line
      }

      DomUtil.setPrefixedStyle(
        this.textarea.style,
        'transformOrigin',
        '0px 0px',
      )

      let transform = `scale(${scale},${scale})`
      if (m != null) {
        transform += ` translate(${m.x * 100}%,${m.y * 100}%)`
      }
      DomUtil.setPrefixedStyle(this.textarea.style, 'transform', transform)
    }
  }

  getBackgroundColor(state: State) {
    return ''
  }

  startEditing(cell: Cell, trigger?: Event) {
    this.stopEditing(true)
    this.align = null

    if (this.textarea == null) {
      this.init()
    }

    this.graph.hideTooltip()
    const state = this.graph.view.getState(cell)
    if (state != null && this.textarea != null) {
      // Configures the style of the in-place editor
      const size = state.style.fontSize || globals.defaultFontSize
      const family = state.style.fontFamily || globals.defaultFontFamily
      const color = state.style.fontColor || globals.defaultFontColor
      const align = state.style.align || 'left'
      const fontStyle = state.style.fontStyle
      const bold = FontStyle.isBold(fontStyle)
      const italic = FontStyle.isItalic(fontStyle)
      const uline = FontStyle.isUnderlined(fontStyle)

      const style = this.textarea.style

      style.lineHeight = `${globals.defaultLineHeight}`
      style.backgroundColor = this.getBackgroundColor(state)
      style.textDecoration = uline ? 'underline' : ''
      style.fontWeight = bold ? 'bold' : 'normal'
      style.fontStyle = italic ? 'italic' : ''
      style.fontSize = DomUtil.toPx(Math.round(size))
      style.zIndex = `${this.zIndex}`
      style.fontFamily = family
      style.textAlign = align
      style.outline = 'none'
      style.color = color

      let dir = state.style.textDirection || ''
      if (dir === 'auto') {
        if (
          state.text != null &&
          state.text.dialect !== 'html' &&
          !DomUtil.isHtmlElement(state.text.value)
        ) {
          dir = state.text.getAutoDirection()
        }
      }

      if (dir === 'ltr' || dir === 'rtl') {
        this.textarea.setAttribute('dir', dir)
      } else {
        this.textarea.removeAttribute('dir')
      }

      // Sets the initial editing value
      this.textarea.innerHTML = this.getInitialValue(state, trigger) || ''
      this.initialValue = this.textarea.innerHTML

      // Uses an optional text value for empty labels which is cleared
      // when the first keystroke appears. This makes it easier to see
      // that a label is being edited even if the label is empty.
      if (
        this.textarea.innerHTML.length === 0 ||
        this.textarea.innerHTML === '<br>'
      ) {
        this.textarea.innerHTML = this.getEmptyLabelText(cell)
        this.clearOnChange = true
      } else {
        this.clearOnChange =
          this.textarea.innerHTML === this.getEmptyLabelText(cell)
      }

      this.graph.container.appendChild(this.textarea)

      // Update this after firing all potential events
      // that could update the cleanOnChange flag
      this.editingCell = cell
      this.trigger = trigger
      this.textNode = null

      if (state.text != null && this.isHideLabel(state)) {
        this.textNode = state.text.elem
        this.textNode!.style.visibility = 'hidden'
      }

      // Workaround for initial offsetHeight not ready for heading in markup
      if (
        this.autoSize &&
        (this.graph.model.isEdge(state.cell) || state.style.overflow !== 'fill')
      ) {
        window.setTimeout(() => {
          this.resize()
        })
      }

      this.resize()

      // Workaround for NS_ERROR_FAILURE in FF
      try {
        // Prefers blinking cursor over no selected text if empty
        this.textarea.focus()

        if (
          this.isAutoSelectText() &&
          this.textarea.innerHTML.length > 0 &&
          (this.textarea.innerHTML !== this.getEmptyLabelText(cell) ||
            !this.clearOnChange)
        ) {
          document.execCommand('selectAll', false)
        }
      } catch (e) {
        // pass
      }
    }
  }

  /**
   * Stops the editor and applies the value if cancel is false.
   */
  stopEditing(cancel: boolean = false) {
    if (this.editingCell != null) {
      if (this.textNode != null) {
        this.textNode.style.visibility = ''
        this.textNode = null
      }

      const state = !cancel ? this.graph.view.getState(this.editingCell) : null
      const initial = this.initialValue

      this.initialValue = null
      this.editingCell = null
      this.trigger = undefined
      this.bounds = null

      if (this.textarea != null) {
        this.textarea.blur()
        this.clearSelection()
        DomUtil.remove(this.textarea)

        if (
          this.clearOnChange &&
          this.textarea.innerHTML === this.getEmptyLabelText(this.editingCell!)
        ) {
          this.textarea.innerHTML = ''
          this.clearOnChange = false
        }

        if (
          state != null &&
          (this.textarea.innerHTML !== initial || this.align != null)
        ) {
          this.prepareTextarea()
          const value = this.getCurrentValue(state)

          this.graph.batchUpdate(() => {
            if (value != null) {
              this.applyValue(state, value)
            }

            if (this.align != null) {
              this.graph.updateCellsStyle('align', this.align, [state.cell])
            }
          })
        }

        // Forces new instance on next edit for undo history reset
        DomEvent.release(this.textarea)
        this.textarea = null
        this.align = null
      }
    }
  }

  protected prepareTextarea() {
    if (
      this.textarea != null &&
      this.textarea.lastChild != null &&
      this.textarea.lastChild.nodeName.toLocaleLowerCase() === 'br'
    ) {
      this.textarea.removeChild(this.textarea.lastChild)
    }
  }

  /**
   * Returns the minimum width and height for editing the given state.
   */
  protected getMinimumSize(state: State) {
    return new Rectangle(
      0,
      0,
      30,
      this.textarea!.style.textAlign === 'left' ? 120 : 40,
    )
  }

  /**
   * Returns the <mxRectangle> that defines the bounds of the editor.
   */
  getEditorBounds(state: State) {
    const scale = this.graph.view.scale
    const minSize = this.getMinimumSize(state)
    const minWidth = minSize.width
    const minHeight = minSize.height
    const isEdge = this.graph.model.isEdge(state.cell)

    let result = null

    if (
      !isEdge &&
      state.view.graph.renderer.legacySpacing &&
      state.style.overflow === 'fill'
    ) {
      result = state.shape!.getLabelBounds(state.bounds.clone())
    } else {
      const spacing = (state.style.spacing || 0) * scale
      const spacingTop = (state.style.spacingTop || 0) * scale + spacing
      const spacingRight = (state.style.spacingRight || 0) * scale + spacing
      const spacingBottom = (state.style.spacingRight || 0) * scale + spacing
      const spacingLeft = (state.style.spacingLeft || 0) * scale + spacing

      result = new Rectangle(
        state.bounds.x,
        state.bounds.y,
        Math.max(minWidth, state.bounds.width - spacingLeft - spacingRight),
        Math.max(minHeight, state.bounds.height - spacingTop - spacingBottom),
      )

      const hpos = state.style.labelPosition || 'center'
      const vpos = state.style.labelVerticalPosition || 'middle'

      result =
        state.shape != null && hpos === 'center' && vpos === 'middle'
          ? state.shape.getLabelBounds(result)
          : result

      if (isEdge) {
        result.x = state.absoluteOffset.x
        result.y = state.absoluteOffset.y

        if (state.text != null && state.text.boundingBox != null) {
          // Workaround for label containing just spaces in which case
          // the bounding box location contains negative numbers
          if (state.text.boundingBox.x > 0) {
            result.x = state.text.boundingBox.x
          }

          if (state.text.boundingBox.y > 0) {
            result.y = state.text.boundingBox.y
          }
        }
      } else if (state.text != null && state.text.boundingBox != null) {
        result.x = Math.min(result.x, state.text.boundingBox.x)
        result.y = Math.min(result.y, state.text.boundingBox.y)
      }

      result.x += spacingLeft
      result.y += spacingTop

      if (state.text != null && state.text.boundingBox != null) {
        if (!isEdge) {
          result.width = Math.max(result.width, state.text.boundingBox.width)
          result.height = Math.max(result.height, state.text.boundingBox.height)
        } else {
          result.width = Math.max(minWidth, state.text.boundingBox.width)
          result.height = Math.max(minHeight, state.text.boundingBox.height)
        }
      }

      // Applies the horizontal and vertical label positions
      if (this.graph.model.isNode(state.cell)) {
        const horizontal = state.style.labelPosition || 'center'
        if (horizontal === 'left') {
          result.x -= state.bounds.width
        } else if (horizontal === 'right') {
          result.x += state.bounds.width
        }

        const vertical = state.style.labelVerticalPosition || 'middle'
        if (vertical === 'top') {
          result.y -= state.bounds.height
        } else if (vertical === 'bottom') {
          result.y += state.bounds.height
        }
      }
    }

    return new Rectangle(
      Math.round(result.x),
      Math.round(result.y),
      Math.round(result.width),
      Math.round(result.height),
    )
  }

  /**
   * Returns the initial label value to be used of the label of the given
   * cell is empty. This label is displayed and cleared on the first keystroke.
   */
  getEmptyLabelText(cell: Cell) {
    return this.placeholder
  }

  /**
   * Returns the cell that is currently being edited or null if no cell is
   * being edited.
   */
  getEditingCell() {
    return this.editingCell
  }

  @Disposable.dispose()
  dispose() {
    if (this.textarea != null) {
      DomEvent.release(this.textarea)
      DomUtil.remove(this.textarea)
      this.textarea = null
    }

    if (this.changeHandler != null) {
      this.graph.model.off(null, this.changeHandler)
    }

    if (this.zoomHandler) {
      this.graph.view.off(null, this.zoomHandler)
    }
  }
}
