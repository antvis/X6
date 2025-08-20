import {
  EventRaw,
  UIEventRaw,
  DragEventRaw,
  FocusEventRaw,
  MouseEventRaw,
  TouchEventRaw,
  KeyboardEventRaw,
} from './alias'
import { EventObject } from './object'

interface EventBase<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
  TEvent extends EventRaw = any,
> extends EventObject<TDelegateTarget, TData, TCurrentTarget, TTarget, TEvent> {
  relatedTarget?: undefined

  bubbles: boolean
  cancelable: boolean
  eventPhase: number

  detail: undefined
  view: undefined

  button: undefined
  buttons: undefined
  clientX: undefined
  clientY: undefined
  offsetX: undefined
  offsetY: undefined
  pageX: undefined
  pageY: undefined
  screenX: undefined
  screenY: undefined

  /** @deprecated */
  toElement: undefined

  pointerId: undefined
  pointerType: undefined

  /** @deprecated */
  char: undefined
  /** @deprecated */
  charCode: undefined
  key: undefined
  /** @deprecated */
  keyCode: undefined

  changedTouches: undefined
  targetTouches: undefined
  touches: undefined

  which: undefined

  altKey: undefined
  ctrlKey: undefined
  metaKey: undefined
  shiftKey: undefined
}

interface ChangeEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends EventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'change'
}

interface ResizeEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends EventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'resize'
}

interface ScrollEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends EventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'scroll'
}

interface SelectEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends EventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'select'
}

interface SubmitEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends EventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'submit'
}

interface UIEventBase<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
  TEvent extends UIEventRaw = any,
> extends EventObject<TDelegateTarget, TData, TCurrentTarget, TTarget, TEvent> {
  bubbles: boolean
  cancelable: boolean
  eventPhase: number

  detail: number
  view: Window
}

interface MouseEventBase<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends UIEventBase<
    TDelegateTarget,
    TData,
    TCurrentTarget,
    TTarget,
    MouseEventRaw
  > {
  relatedTarget?: EventTarget | null

  button: number
  buttons: number
  clientX: number
  clientY: number
  offsetX: number
  offsetY: number
  pageX: number
  pageY: number
  screenX: number
  screenY: number
  /** @deprecated */
  toElement: Element

  pointerId: undefined
  pointerType: undefined

  /** @deprecated */
  char: undefined
  /** @deprecated */
  charCode: undefined
  key: undefined
  /** @deprecated */
  keyCode: undefined

  changedTouches: undefined
  targetTouches: undefined
  touches: undefined

  which: number

  altKey: boolean
  ctrlKey: boolean

  metaKey: boolean
  shiftKey: boolean
}

export interface ClickEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends MouseEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  relatedTarget?: null
  type: 'click'
}

export interface ContextMenuEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends MouseEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  relatedTarget?: null
  type: 'contextmenu'
}

export interface DoubleClickEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends MouseEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  relatedTarget?: null
  type: 'dblclick'
}

export interface MouseDownEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends MouseEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  relatedTarget?: null
  type: 'mousedown'
}

export interface MouseEnterEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends MouseEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'mouseenter'
}

export interface MouseLeaveEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends MouseEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'mouseleave'
}

export interface MouseMoveEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends MouseEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  relatedTarget?: null
  type: 'mousemove'
}

export interface MouseOutEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends MouseEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'mouseout'
}

export interface MouseOverEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends MouseEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'mouseover'
}

export interface MouseUpEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends MouseEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  relatedTarget?: null
  type: 'mouseup'
}

interface DragEventBase<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends UIEventBase<
    TDelegateTarget,
    TData,
    TCurrentTarget,
    TTarget,
    DragEventRaw
  > {}

export interface DragEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends DragEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'drag'
}

export interface DragEndEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends DragEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'dragend'
}

export interface DragEnterEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends DragEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'dragenter'
}

export interface DragExitEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends DragEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'dragexit'
}

export interface DragLeaveEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends DragEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'dragleave'
}

export interface DragOverEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends DragEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'dragover'
}

export interface DragStartEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends DragEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'dragstart'
}

export interface DropEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends DragEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'drop'
}

interface KeyboardEventBase<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends UIEventBase<
    TDelegateTarget,
    TData,
    TCurrentTarget,
    TTarget,
    KeyboardEventRaw
  > {
  relatedTarget?: undefined

  button: undefined
  buttons: undefined
  clientX: undefined
  clientY: undefined
  offsetX: undefined
  offsetY: undefined
  pageX: undefined
  pageY: undefined
  screenX: undefined
  screenY: undefined
  /** @deprecated */
  toElement: undefined

  pointerId: undefined
  pointerType: undefined

  /** @deprecated */
  char: string | undefined
  /** @deprecated */
  charCode: number
  code: string
  key: string
  /** @deprecated */
  keyCode: number

  changedTouches: undefined
  targetTouches: undefined
  touches: undefined

  which: number

  altKey: boolean
  ctrlKey: boolean

  metaKey: boolean
  shiftKey: boolean
}

export interface KeyDownEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends KeyboardEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'keydown'
}

export interface KeyPressEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends KeyboardEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'keypress'
}

export interface KeyUpEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends KeyboardEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'keyup'
}

interface TouchEventBase<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends UIEventBase<
    TDelegateTarget,
    TData,
    TCurrentTarget,
    TTarget,
    TouchEventRaw
  > {
  relatedTarget?: undefined

  button: undefined
  buttons: undefined
  clientX: undefined
  clientY: undefined
  offsetX: undefined
  offsetY: undefined

  pageY: undefined
  screenX: undefined
  screenY: undefined
  /** @deprecated */
  toElement: undefined

  pointerId: undefined
  pointerType: undefined

  /** @deprecated */
  char: undefined
  /** @deprecated */
  charCode: undefined
  key: undefined
  /** @deprecated */
  keyCode: undefined

  changedTouches: TouchList
  targetTouches: TouchList
  touches: TouchList

  which: undefined

  altKey: boolean
  ctrlKey: boolean

  metaKey: boolean
  shiftKey: boolean
}

export interface TouchCancelEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends TouchEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'touchcancel'
}

export interface TouchEndEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends TouchEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'touchend'
}

export interface TouchMoveEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends TouchEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'touchmove'
}

export interface TouchStartEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends TouchEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'touchstart'
}

interface FocusEventBase<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends UIEventBase<
    TDelegateTarget,
    TData,
    TCurrentTarget,
    TTarget,
    FocusEventRaw
  > {
  relatedTarget?: EventTarget | null

  button: undefined
  buttons: undefined
  clientX: undefined
  clientY: undefined
  offsetX: undefined
  offsetY: undefined
  pageX: undefined
  pageY: undefined
  screenX: undefined
  screenY: undefined

  /** @deprecated */
  toElement: undefined

  pointerId: undefined
  pointerType: undefined

  /** @deprecated */
  char: undefined
  /** @deprecated */
  charCode: undefined
  key: undefined
  /** @deprecated */
  keyCode: undefined

  changedTouches: undefined
  targetTouches: undefined
  touches: undefined

  which: undefined

  altKey: undefined
  ctrlKey: undefined
  metaKey: undefined
  shiftKey: undefined
}

export interface BlurEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends FocusEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'blur'
}

export interface FocusEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends FocusEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'focus'
}

export interface FocusInEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends FocusEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'focusin'
}

export interface FocusOutEvent<
  TDelegateTarget = any,
  TData = any,
  TCurrentTarget = any,
  TTarget = any,
> extends FocusEventBase<TDelegateTarget, TData, TCurrentTarget, TTarget> {
  type: 'focusout'
}

interface TypeToTriggeredEventMap<
  TDelegateTarget,
  TData,
  TCurrentTarget,
  TTarget,
> {
  // Event

  change: ChangeEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  resize: ResizeEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  scroll: ScrollEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  select: SelectEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  submit: SubmitEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>

  // UIEvent

  // MouseEvent

  click: ClickEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  contextmenu: ContextMenuEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  dblclick: DoubleClickEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  mousedown: MouseDownEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  mouseenter: MouseEnterEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  mouseleave: MouseLeaveEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  mousemove: MouseMoveEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  mouseout: MouseOutEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  mouseover: MouseOverEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  mouseup: MouseUpEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>

  // DragEvent

  drag: DragEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  dragend: DragEndEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  dragenter: DragEnterEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  dragexit: DragExitEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  dragleave: DragLeaveEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  dragover: DragOverEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  dragstart: DragStartEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  drop: DropEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>

  // KeyboardEvent

  keydown: KeyDownEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  keypress: KeyPressEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  keyup: KeyUpEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>

  // TouchEvent

  touchcancel: TouchCancelEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  touchend: TouchEndEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  touchmove: TouchMoveEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  touchstart: TouchStartEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>

  // FocusEvent

  blur: BlurEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  focus: FocusEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  focusin: FocusInEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>
  focusout: FocusOutEvent<TDelegateTarget, TData, TCurrentTarget, TTarget>

  [type: string]: EventObject<TDelegateTarget, TData, TCurrentTarget, TTarget>
}

export type EventHandlerBase<TContext, T> = (
  this: TContext,
  e: T,
  ...args: any[]
) => any

export type EventHandler<TCurrentTarget, TData = undefined> = EventHandlerBase<
  TCurrentTarget,
  EventObject<TCurrentTarget, TData>
>

export type TypeEventHandler<
  TDelegateTarget,
  TData,
  TCurrentTarget,
  TTarget,
  TType extends keyof TypeToTriggeredEventMap<
    TDelegateTarget,
    TData,
    TCurrentTarget,
    TTarget
  >,
> = EventHandlerBase<
  TCurrentTarget,
  TypeToTriggeredEventMap<
    TDelegateTarget,
    TData,
    TCurrentTarget,
    TTarget
  >[TType]
>

export interface TypeEventHandlers<
  TDelegateTarget,
  TData,
  TCurrentTarget,
  TTarget,
> extends TypeEventHandlersBase<
    TDelegateTarget,
    TData,
    TCurrentTarget,
    TTarget
  > {
  // No idea why it's necessary to include `object` in the union but otherwise TypeScript complains that
  // derived types of Event are not assignable to Event.
  [type: string]:
    | TypeEventHandler<TDelegateTarget, TData, TCurrentTarget, TTarget, string>
    | false
    | undefined
    | Record<string, unknown>
}

type TypeEventHandlersBase<TDelegateTarget, TData, TCurrentTarget, TTarget> = {
  [TType in keyof TypeToTriggeredEventMap<
    TDelegateTarget,
    TData,
    TCurrentTarget,
    TTarget
  >]?:
    | TypeEventHandler<TDelegateTarget, TData, TCurrentTarget, TTarget, string>
    | false
    | Record<string, unknown>
}
