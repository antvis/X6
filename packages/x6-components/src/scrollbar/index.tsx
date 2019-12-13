import React from 'react'
import clamp from 'clamp'
import classNames from 'classnames'
import keys from 'rc-util/lib/KeyCode'
import { WheelHandler } from '../util/dom/WheelHandler'
import { MouseMoveTracker } from '../util/dom/MouseMoveTracker'

export class Scrollbar extends React.PureComponent<Scrollbar.Props> {
  private thumbElem: HTMLDivElement
  private containerElem: HTMLDivElement
  private wheelHandler: WheelHandler
  private mouseMoveTracker: MouseMoveTracker
  private scale: number
  private thumbSize: number

  UNSAFE_componentWillMount() {
    this.wheelHandler = new WheelHandler({
      onWheel: this.isHorizontal() ? this.onWheelX : this.onWheelY,
      shouldHandleScrollX: true,
      shouldHandleScrollY: true,
      stopPropagation: this.props.stopPropagation,
    })

    this.mouseMoveTracker = new MouseMoveTracker({
      elem: document.documentElement,
      onMouseMove: this.onMouseMove,
      onMouseMoveEnd: this.onMouseMoveEnd,
    })
  }

  componentWillUnmount() {
    this.mouseMoveTracker.release()
    delete this.mouseMoveTracker
  }

  isHorizontal() {
    return this.props.orientation === 'horizontal'
  }

  fixPosition(position: number) {
    const max = this.props.contentSize - this.props.containerSize
    return clamp(position, 0, max)
  }

  triggerCallback = (nextPosition: number) => {
    const max = this.props.contentSize - this.props.containerSize
    const position = clamp(nextPosition, 0, max)
    if (position !== this.props.scrollPosition) {
      this.props.onScroll(position)
    }
  }

  onWheel = (delta: number) => {
    this.triggerCallback(this.props.scrollPosition + delta)
  }

  onWheelX = (deltaX: number, deltaY: number) => {
    if (Math.abs(deltaX) >= Math.abs(deltaY)) {
      this.onWheel(deltaX)
    }
  }

  onWheelY = (deltaX: number, deltaY: number) => {
    if (Math.abs(deltaX) <= Math.abs(deltaY)) {
      this.onWheel(deltaY)
    }
  }

  onKeyDown = (e: React.KeyboardEvent) => {
    const keyCode = e.keyCode

    // let focus move off the scrollbar
    if (keyCode === keys.TAB) {
      return
    }

    const { contentSize, containerSize } = this.props
    let distance = this.props.keyboardScrollAmount
    let direction = 0

    if (this.isHorizontal()) {
      switch (keyCode) {
        case keys.HOME:
          direction = -1
          distance = contentSize
          break

        case keys.LEFT:
          direction = -1
          break

        case keys.RIGHT:
          direction = 1
          break

        default:
          return
      }
    } else {
      switch (keyCode) {
        case keys.SPACE:
          if (e.shiftKey) {
            direction = -1
          } else {
            direction = 1
          }
          break

        case keys.HOME:
          direction = -1
          distance = contentSize
          break

        case keys.UP:
          direction = -1
          break

        case keys.DOWN:
          direction = 1
          break

        case keys.PAGE_UP:
          direction = -1
          distance = containerSize
          break

        case keys.PAGE_DOWN:
          direction = 1
          distance = containerSize
          break

        default:
          return
      }
    }

    e.preventDefault()

    this.triggerCallback(this.props.scrollPosition + distance! * direction)
  }

  onMouseDown = (e: React.MouseEvent) => {
    if (e.target !== this.thumbElem) {
      const nativeEvent = e.nativeEvent as any
      const position = this.isHorizontal()
        ? nativeEvent.offsetX || nativeEvent.layerX
        : nativeEvent.offsetY || nativeEvent.layerY

      // mousedown on the scroll-track directly, move the
      // center of the scroll-face to the mouse position.
      this.triggerCallback((position - this.thumbSize * 0.5) / this.scale)
    } else {
      this.mouseMoveTracker.capture(e)
    }

    if (this.props.stopPropagation) {
      e.stopPropagation()
    }

    // focus the container so it may receive keyboard events
    this.containerElem.focus()
  }

  onMouseMove = (deltaX: number, deltaY: number) => {
    let delta = this.isHorizontal() ? deltaX : deltaY
    if (delta !== 0) {
      delta /= this.scale
      this.triggerCallback(this.props.scrollPosition + delta)
    }
  }

  onMouseMoveEnd = () => {
    this.mouseMoveTracker.release()
  }

  refContainer = (container: HTMLDivElement) => {
    this.containerElem = container
  }

  refThumb = (thumb: HTMLDivElement) => {
    this.thumbElem = thumb
  }

  render() {
    const {
      prefixCls,
      className,
      scrollPosition,
      containerSize,
      contentSize,
      miniThumbSize,
      zIndex,
      scrollbarSize,
    } = this.props

    // unscrollable
    if (containerSize < 1 || contentSize <= containerSize) {
      return null
    }

    let scale = containerSize / contentSize
    let thumbSize = containerSize * scale

    if (thumbSize < miniThumbSize!) {
      scale = (containerSize - miniThumbSize!) / (contentSize - containerSize)
      thumbSize = miniThumbSize!
    }

    // cache
    this.scale = scale
    this.thumbSize = thumbSize

    let trackStyle: React.CSSProperties
    let thumbStyle: React.CSSProperties
    const horizontal = this.isHorizontal()

    if (horizontal) {
      trackStyle = {
        width: containerSize,
        height: scrollbarSize,
      }
      thumbStyle = {
        width: thumbSize,
        transform: `translate(${scrollPosition * scale}px, 0)`,
      }
    } else {
      trackStyle = {
        width: scrollbarSize,
        height: containerSize,
      }
      thumbStyle = {
        height: thumbSize,
        transform: `translate(0, ${scrollPosition * scale}px)`,
      }
    }

    if (zIndex) {
      trackStyle.zIndex = zIndex
    }

    const baseCls = `${prefixCls}-scrollbar`

    return (
      <div
        className={classNames(
          baseCls,
          {
            [`${baseCls}-vertical`]: !horizontal,
            [`${baseCls}-horizontal`]: horizontal,
          },
          className,
        )}
        style={trackStyle}
        tabIndex={0}
        ref={this.refContainer}
        onKeyDown={this.onKeyDown}
        onMouseDown={this.onMouseDown}
        onWheel={this.wheelHandler.onWheel}
      >
        <div
          ref={this.refThumb}
          style={thumbStyle}
          className={`${baseCls}-thumb`}
        />
      </div>
    )
  }
}

export namespace Scrollbar {
  export interface Props {
    prefixCls?: string
    className?: string
    orientation: 'vertical' | 'horizontal'
    contentSize: number
    containerSize: number
    scrollPosition: number
    scrollbarSize?: number
    miniThumbSize?: number
    keyboardScrollAmount?: number
    zIndex?: number
    stopPropagation?: boolean | (() => boolean)
    onScroll: (delta: number) => void
  }

  export const defaultProps = {
    prefixCls: 'x6',
    orientation: 'vertical',
    contentSize: 0,
    containerSize: 0,
    defaultPosition: 0,
    scrollbarSize: 4,
    miniThumbSize: 16,
    keyboardScrollAmount: 40,
  }
}
