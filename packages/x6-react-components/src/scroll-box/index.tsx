import React, { PropsWithChildren } from 'react'
import clamp from 'clamp'
import classNames from 'classnames'
import { debounce } from '../util'
import { WheelHandler } from '../util/dom/WheelHandler'
import { TouchHandler } from '../util/dom/TouchHandler'
import { MouseMoveTracker } from '../util/dom/MouseMoveTracker'
import { Scrollbar } from '../scrollbar'

export class ScrollBox extends React.PureComponent<
  PropsWithChildren<ScrollBox.Props>,
  ScrollBox.State
> {
  private containerElem: HTMLDivElement
  private contentElem: HTMLDivElement
  private wheelHandler: WheelHandler | null
  private touchHandler: TouchHandler | null
  private mouseMoveTracker: MouseMoveTracker | null
  private scrolling: boolean
  private mounted: boolean
  private triggerScrollStop: () => void

  UNSAFE_componentWillMount() {
    this.triggerScrollStop = debounce(this.triggerScrollStopSync, 200, this)
    this.wheelHandler = new WheelHandler({
      onWheel: this.onScroll,
      shouldHandleScrollX: this.shouldHandleWheelX,
      shouldHandleScrollY: this.shouldHandleWheelY,
      stopPropagation: this.props.stopPropagation,
    })

    if (this.props.touchable) {
      this.touchHandler = new TouchHandler({
        onTouchScroll: this.onScroll,
        shouldHandleScrollX: this.shouldHandleTouchX,
        shouldHandleScrollY: this.shouldHandleTouchY,
        stopPropagation: this.props.stopPropagation,
      })
    }

    if (this.props.dragable) {
      this.mouseMoveTracker = new MouseMoveTracker({
        elem: document.documentElement,
        onMouseMove: this.onMouseMove,
        onMouseMoveEnd: this.onMouseMoveEnd,
      })
    }

    this.setState(this.calculateState())
  }

  componentDidMount() {
    this.mounted = true
    this.setState(this.calculateState())
  }

  UNSAFE_componentWillReceiveProps(nextProps: ScrollBox.Props) {
    this.setState(this.calculateState(nextProps))
  }

  componentWillUnmount() {
    this.wheelHandler = null
    if (this.props.touchable) {
      this.touchHandler = null
    }
    if (this.props.dragable && this.mouseMoveTracker != null) {
      this.mouseMoveTracker.release()
      this.mouseMoveTracker = null
    }

    const triggerScrollStop = this.triggerScrollStop as any
    triggerScrollStop.reset()

    this.triggerScrollStopSync()
  }

  calculateState(props = this.props) {
    const containerWidth =
      props.containerWidth !== undefined &&
      props.containerWidth !== this.props.containerWidth
        ? props.containerWidth
        : this.props.containerWidth !== undefined
        ? this.props.containerWidth
        : (this.containerElem && this.containerElem.clientWidth) || 0

    const containerHeight =
      props.containerHeight !== undefined &&
      props.containerHeight !== this.props.containerHeight
        ? props.containerHeight
        : this.props.containerHeight !== undefined
        ? this.props.containerHeight
        : (this.containerElem && this.containerElem.clientHeight) || 0

    const contentWidth =
      props.contentWidth !== undefined &&
      props.contentWidth !== this.props.contentWidth
        ? props.contentWidth
        : this.props.contentWidth !== undefined
        ? this.props.contentWidth
        : (this.contentElem && this.contentElem.scrollWidth) || 0

    const contentHeight =
      props.contentHeight !== undefined &&
      props.contentHeight !== this.props.contentHeight
        ? props.contentHeight
        : this.props.contentHeight !== undefined
        ? this.props.contentHeight
        : (this.contentElem && this.contentElem.scrollHeight) || 0

    const hasVerticalBar = contentHeight > containerHeight
    const hasHorizontalBar = contentWidth > containerWidth

    let scrollTop = 0
    let scrollLeft = 0
    let maxScrollTop = 0
    let maxScrollLeft = 0
    let verticalBarHeight = containerHeight
    let horizontalBarWidth = containerWidth

    if (hasVerticalBar) {
      if (hasHorizontalBar) {
        verticalBarHeight -= props.scrollbarSize!
      }

      maxScrollTop = contentHeight - verticalBarHeight

      if (props.scrollTop !== this.props.scrollTop) {
        scrollTop = props.scrollTop!
      } else {
        scrollTop = (this.state ? this.state.scrollTop : props.scrollTop) || 0
      }
    }

    if (hasHorizontalBar) {
      if (hasVerticalBar) {
        horizontalBarWidth -= props.scrollbarSize!
      }

      maxScrollLeft = contentWidth - horizontalBarWidth

      if (props.scrollLeft !== this.props.scrollLeft) {
        scrollLeft = props.scrollLeft!
      } else {
        scrollLeft =
          (this.state ? this.state.scrollLeft : props.scrollLeft) || 0
      }
    }

    const nextState: ScrollBox.State = {
      containerWidth,
      containerHeight,
      contentWidth,
      contentHeight,
      verticalBarHeight,
      horizontalBarWidth,
      hasVerticalBar,
      hasHorizontalBar,
      maxScrollTop,
      maxScrollLeft,
      scrollTop: clamp(scrollTop, 0, maxScrollTop),
      scrollLeft: clamp(scrollLeft, 0, maxScrollLeft),
    }

    return nextState
  }

  onScroll = (deltaX: number, deltaY: number) => {
    if (!this.scrolling) {
      this.triggerScrollStart()
    }

    if (Math.abs(deltaY) > Math.abs(deltaX) && this.state.hasVerticalBar) {
      this.scrollVertical(deltaY, true)
    } else if (deltaX && this.state.hasHorizontalBar) {
      this.scrollHorizontal(deltaX, true)
    }

    this.triggerScrollStop()
  }

  onVerticalScroll = (scrollY: number) => {
    if (scrollY === this.state.scrollTop) {
      return
    }

    if (!this.scrolling) {
      this.triggerScrollStart()
    }

    this.scrollVertical(scrollY, false)
    this.triggerScrollStop()
  }

  onHorizontalScroll = (scrollX: number) => {
    if (scrollX === this.state.scrollLeft) {
      return
    }

    if (!this.scrolling) {
      this.triggerScrollStart()
    }

    this.scrollHorizontal(scrollX, false)
    this.triggerScrollStop()
  }

  scrollVertical(scrollY: number, relative: boolean) {
    const scrollTop = clamp(
      relative ? this.state.scrollTop! + scrollY : scrollY,
      0,
      this.state.maxScrollTop,
    )

    if (this.props.onVerticalScroll) {
      this.props.onVerticalScroll(scrollTop)
    }

    this.setState({ scrollTop })
  }

  scrollHorizontal(scrollX: number, relative: boolean) {
    const scrollLeft = clamp(
      relative ? this.state.scrollLeft! + scrollX : scrollX,
      0,
      this.state.maxScrollLeft,
    )

    if (this.props.onHorizontalScroll) {
      this.props.onHorizontalScroll(scrollLeft)
    }

    this.setState({ scrollLeft })
  }

  triggerScrollStart() {
    if (this.scrolling) {
      return
    }

    this.scrolling = true
    if (this.props.onScrollStart) {
      this.props.onScrollStart(this.state.scrollLeft!, this.state.scrollTop!)
    }
  }

  triggerScrollStopSync() {
    if (!this.scrolling) {
      return
    }

    this.scrolling = false
    if (this.props.onScrollEnd) {
      this.props.onScrollEnd(this.state.scrollLeft!, this.state.scrollTop!)
    }
  }

  shouldHandleWheelX = (delta: number) => {
    if (!this.state.hasHorizontalBar || delta === 0) {
      return false
    }

    delta = Math.round(delta) // eslint-disable-line
    if (delta === 0) {
      return false
    }

    return (
      (delta < 0 && this.state.scrollLeft! > 0) ||
      (delta >= 0 && this.state.scrollLeft! < this.state.maxScrollLeft!)
    )
  }

  shouldHandleWheelY = (delta: number) => {
    if (!this.state.hasVerticalBar || delta === 0) {
      return false
    }

    delta = Math.round(delta) // eslint-disable-line
    if (delta === 0) {
      return false
    }

    return (
      (delta < 0 && this.state.scrollTop! > 0) ||
      (delta >= 0 && this.state.scrollTop! < this.state.maxScrollTop!)
    )
  }

  shouldHandleTouchX = (delta: number) =>
    this.props.touchable ? this.shouldHandleWheelX(delta) : false

  shouldHandleTouchY = (delta: number) =>
    this.props.touchable ? this.shouldHandleWheelY(delta) : false

  onMouseDown = (e: React.MouseEvent) => {
    if (this.mouseMoveTracker != null) {
      this.mouseMoveTracker.capture(e)
    }
  }

  onMouseMove = (deltaX: number, deltaY: number) => {
    if (!this.scrolling) {
      this.triggerScrollStart()
    }
    this.scrollVertical(deltaY, true)
    this.scrollHorizontal(deltaX, true)
  }

  onMouseMoveEnd = () => {
    if (this.mouseMoveTracker != null) {
      this.mouseMoveTracker.release()
    }
    this.triggerScrollStop()
  }

  getScrollbarProps() {
    return {
      zIndex: this.props.zIndex,
      miniThumbSize: this.props.miniThumbSize,
      scrollbarSize: this.props.scrollbarSize,
      keyboardScrollAmount: this.props.keyboardScrollAmount,
      stopPropagation: true,
    }
  }

  renderVerticalBar() {
    if (this.state.hasVerticalBar) {
      return (
        <Scrollbar
          orientation="vertical"
          scrollPosition={this.state.scrollTop!}
          contentSize={this.state.contentHeight}
          containerSize={this.state.verticalBarHeight}
          onScroll={this.onVerticalScroll}
          {...this.getScrollbarProps()}
        />
      )
    }
  }

  renderHorizontalBar() {
    if (this.state.hasHorizontalBar) {
      return (
        <Scrollbar
          orientation="horizontal"
          scrollPosition={this.state.scrollLeft!}
          contentSize={this.state.contentWidth}
          containerSize={this.state.horizontalBarWidth}
          onScroll={this.onHorizontalScroll}
          {...this.getScrollbarProps()}
        />
      )
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.containerElem = container
  }

  refContent = (content: HTMLDivElement) => {
    this.contentElem = content
  }

  onWheel = (e: React.WheelEvent) => {
    if (this.wheelHandler != null) {
      this.wheelHandler.onWheel(e)
    }
  }

  render() {
    const props = {} as any
    if (this.props.touchable) {
      props.onTouchStart = this.touchHandler!.onTouchStart
      props.onTouchEnd = this.touchHandler!.onTouchEnd
      props.onTouchMove = this.touchHandler!.onTouchMove
      props.onTouchCancel = this.touchHandler!.onTouchCancel
    }

    if (this.props.dragable) {
      props.onMouseDown = this.onMouseDown
    }

    const contentStyle: React.CSSProperties = {}
    const containerStyle: React.CSSProperties = {}

    if (this.props.containerWidth != null || this.mounted) {
      containerStyle.width = this.state.containerWidth
    }

    if (this.props.containerHeight != null || this.mounted) {
      containerStyle.height = this.state.containerHeight
    }

    if (this.props.contentWidth != null || this.mounted) {
      contentStyle.width = this.state.contentWidth
    }

    if (this.props.contentHeight != null || this.mounted) {
      contentStyle.height = this.state.contentHeight
    }

    if (this.mounted) {
      contentStyle.transform = `translate(-${this.state.scrollLeft}px, -${this.state.scrollTop}px)`
    }

    const { prefixCls, scrollbarAutoHide } = this.props
    const baseCls = `${prefixCls}-scroll-box`

    return (
      <div
        {...props}
        style={{
          ...this.props.containerStyle,
          ...containerStyle,
        }}
        ref={this.refContainer}
        onWheel={this.onWheel}
        className={classNames(
          baseCls,
          {
            [`${baseCls}-auto-hide`]: scrollbarAutoHide,
          },
          this.props.containerClassName,
        )}
      >
        <div
          style={{
            ...this.props.contentStyle,
            ...contentStyle,
          }}
          ref={this.refContent}
          className={classNames(
            `${baseCls}-content`,
            this.props.contentClassName,
          )}
        >
          {this.props.children}
        </div>
        {this.renderVerticalBar()}
        {this.renderHorizontalBar()}
      </div>
    )
  }
}

export namespace ScrollBox {
  export interface Props {
    prefixCls?: string
    containerClassName?: string
    contentClassName?: string
    containerStyle?: React.CSSProperties
    contentStyle?: React.CSSProperties
    containerWidth?: number
    containerHeight?: number
    contentWidth?: number
    contentHeight?: number
    scrollTop?: number
    scrollLeft?: number
    dragable?: boolean
    touchable?: boolean
    miniThumbSize?: number
    scrollbarSize?: number
    keyboardScrollAmount?: number
    stopPropagation?: boolean | (() => boolean)
    zIndex?: number
    scrollbarAutoHide?: boolean
    onVerticalScroll?: (scrollTop: number) => void
    onHorizontalScroll?: (scrollLeft: number) => void
    onScrollStart?: (scrollLeft: number, scrollTop: number) => void
    onScroll?: (scrollLeft: number, scrollTop: number) => void
    onScrollEnd?: (scrollLeft: number, scrollTop: number) => void
  }

  export const defaultProps = {
    prefixCls: 'x6',
    scrollTop: 0,
    scrollLeft: 0,
    dragable: true,
    touchable: true,
    scrollbarAutoHide: true,
    scrollbarSize: Scrollbar.defaultProps.scrollbarSize,
    miniThumbSize: Scrollbar.defaultProps.miniThumbSize,
    keyboardScrollAmount: Scrollbar.defaultProps.keyboardScrollAmount,
  }

  export interface State {
    containerWidth?: number
    containerHeight?: number
    contentWidth?: number
    contentHeight?: number
    verticalBarHeight: number
    horizontalBarWidth: number
    scrollTop?: number
    scrollLeft?: number
    maxScrollTop?: number
    maxScrollLeft?: number
    hasVerticalBar?: boolean
    hasHorizontalBar?: boolean
  }
}
