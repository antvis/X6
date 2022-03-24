import { TypeEventHandler } from './types'

// export class EventListener<TElement extends Element> {}

export interface EventListener<TElement extends Element>
  extends EventListener.Methods<TElement> {}

export namespace EventListener {
  export interface Methods<TElement extends Node> {
    blur(): this
    blur(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'blur'>
        | false,
    ): this
    blur<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'blur'>
        | false,
    ): this

    focus(): this
    focus(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'focus'>
        | false,
    ): this
    focus<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'focus'>
        | false,
    ): this

    focusin(): this
    focusin(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'focusin'>
        | false,
    ): this
    focusin<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'focusin'>
        | false,
    ): this

    focusout(): this
    focusout(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'focusout'>
        | false,
    ): this
    focusout<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'focusout'>
        | false,
    ): this

    resize(): this
    resize(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'resize'>
        | false,
    ): this
    resize<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'resize'>
        | false,
    ): this

    scroll(): this
    scroll(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'scroll'>
        | false,
    ): this
    scroll<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'scroll'>
        | false,
    ): this

    click(): this
    click(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'click'>
        | false,
    ): this
    click<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'click'>
        | false,
    ): this

    dblclick(): this
    dblclick(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'dblclick'>
        | false,
    ): this
    dblclick<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'dblclick'>
        | false,
    ): this

    mousedown(): this
    mousedown(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'mousedown'>
        | false,
    ): this
    mousedown<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'mousedown'>
        | false,
    ): this

    mouseup(): this
    mouseup(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'mouseup'>
        | false,
    ): this
    mouseup<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'mouseup'>
        | false,
    ): this

    mousemove(): this
    mousemove(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'mousemove'>
        | false,
    ): this
    mousemove<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'mousemove'>
        | false,
    ): this

    mouseover(): this
    mouseover(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'mouseover'>
        | false,
    ): this
    mouseover<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'mouseover'>
        | false,
    ): this

    mouseout(): this
    mouseout(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'mouseout'>
        | false,
    ): this
    mouseout<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'mouseout'>
        | false,
    ): this

    mouseenter(): this
    mouseenter(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'mouseenter'>
        | false,
    ): this
    mouseenter<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'mouseenter'>
        | false,
    ): this

    mouseleave(): this
    mouseleave(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'mouseleave'>
        | false,
    ): this
    mouseleave<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'mouseleave'>
        | false,
    ): this

    change(): this
    change(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'change'>
        | false,
    ): this
    change<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'change'>
        | false,
    ): this

    select(): this
    select(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'select'>
        | false,
    ): this
    select<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'select'>
        | false,
    ): this

    submit(): this
    submit(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'submit'>
        | false,
    ): this
    submit<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'submit'>
        | false,
    ): this

    keydown(): this
    keydown(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'keydown'>
        | false,
    ): this
    keydown<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'keydown'>
        | false,
    ): this

    keypress(): this
    keypress(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'keypress'>
        | false,
    ): this
    keypress<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'keypress'>
        | false,
    ): this

    keyup(): this
    keyup(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'keyup'>
        | false,
    ): this
    keyup<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'keyup'>
        | false,
    ): this

    contextmenu(): this
    contextmenu(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'contextmenu'>
        | false,
    ): this
    contextmenu<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'contextmenu'>
        | false,
    ): this

    touchstart(): this
    touchstart(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'touchstart'>
        | false,
    ): this
    touchstart<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'touchstart'>
        | false,
    ): this

    touchmove(): this
    touchmove(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'touchmove'>
        | false,
    ): this
    touchmove<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'touchmove'>
        | false,
    ): this

    touchleave(): this
    touchleave(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'touchleave'>
        | false,
    ): this
    touchleave<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'touchleave'>
        | false,
    ): this

    touchend(): this
    touchend(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'touchend'>
        | false,
    ): this
    touchend<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'touchend'>
        | false,
    ): this

    touchcancel(): this
    touchcancel(
      handler:
        | TypeEventHandler<TElement, null, TElement, TElement, 'touchcancel'>
        | false,
    ): this
    touchcancel<TData>(
      eventData: TData,
      handler:
        | TypeEventHandler<TElement, TData, TElement, TElement, 'touchcancel'>
        | false,
    ): this
  }
}

export namespace EventListener {
  // Generate interface
  // eslint-disable-next-line no-constant-condition
  // if (false) {
  //   const events = [
  //     'blur',
  //     'focus',
  //     'focusin',
  //     'focusout',
  //     'resize',
  //     'scroll',
  //     'click',
  //     'dblclick',
  //     'mousedown',
  //     'mouseup',
  //     'mousemove',
  //     'mouseover',
  //     'mouseout',
  //     'mouseenter',
  //     'mouseleave',
  //     'change',
  //     'select',
  //     'submit',
  //     'keydown',
  //     'keypress',
  //     'keyup',
  //     'contextmenu',
  //     'touchstart',
  //     'touchmove',
  //     'touchleave',
  //     'touchend',
  //     'touchcancel',
  //   ] as const
  //   events.forEach((event) => {
  //     EventListener.prototype[event] = function <TData>(
  //       this: EventListener<Element>,
  //       eventData?: TData | TypeEventHandler<any, any, any, any, any> | false,
  //       handler?: TypeEventHandler<any, any, any, any, any> | false,
  //     ) {
  //       if (eventData == null) {
  //         this.trigger(event)
  //       } else {
  //         this.on(event, null, eventData, handler!)
  //       }
  //       return this
  //     }
  //   })
  //   const methods = events.map(
  //     (event) =>
  //       `
  //   ${event}(): this
  //   ${event}(
  //     handler:
  //       | TypeEventHandler<TElement, null, TElement, TElement, '${event}'>
  //       | false,
  //   ): this
  //   ${event}<TData>(
  //     eventData: TData,
  //     handler:
  //       | TypeEventHandler<TElement, TData, TElement, TElement, '${event}'>
  //       | false,
  //   ): this
  //   `,
  //   )
  //   // eslint-disable-next-line no-console
  //   console.log(methods.join('\n'))
  // }
}
