import React, { PropsWithChildren } from 'react'
import ResizeDetector from 'react-resize-detector'
import { ScrollBox } from '../scroll-box'

export class AutoScrollBox extends React.PureComponent<
  PropsWithChildren<AutoScrollBox.Props>,
  AutoScrollBox.State
> {
  constructor(props: AutoScrollBox.Props) {
    super(props)
    this.state = {
      contentWidth: null,
      contentHeight: null,
    }
  }

  onContentResize = (width: number, height: number) => {
    if (this.props.scrollX) {
      this.setState({ contentWidth: width })
    }

    if (this.props.scrollY) {
      this.setState({ contentHeight: height })
    }
  }

  render() {
    const { prefixCls, children, scrollX, scrollY, scrollBoxProps, ...props } =
      this.props
    return (
      <ResizeDetector handleWidth={scrollX} handleHeight={scrollY} {...props}>
        {(size: { width: number; height: number }) => {
          const { width, height } = size
          const others: any = {}

          if (!scrollX) {
            others.contentWidth = width
          }

          if (!scrollY) {
            others.contentHeight = height
          }

          if (this.state.contentWidth != null) {
            others.contentWidth = this.state.contentWidth
          }

          if (this.state.contentHeight != null) {
            others.contentHeight = this.state.contentHeight
          }

          return (
            <ScrollBox
              dragable={false}
              scrollbarSize={3}
              {...scrollBoxProps}
              containerWidth={width}
              containerHeight={height}
            >
              <div className={`${prefixCls}-auto-scroll-box-content`}>
                <ResizeDetector
                  handleWidth={scrollX}
                  handleHeight={scrollY}
                  skipOnMount
                  onResize={this.onContentResize}
                >
                  {children}
                </ResizeDetector>
              </div>
            </ScrollBox>
          )
        }}
      </ResizeDetector>
    )
  }
}

export namespace AutoScrollBox {
  export interface Props {
    prefixCls?: string

    /**
     * Function that will be invoked with width and height arguments
     */
    onResize?: (width: number, height: number) => void

    /**
     * Do not trigger onResize when a component mounts.
     *
     * Default: `false`
     */
    skipOnMount?: boolean

    /**
     * Possible values: throttle and debounce.
     */
    refreshMode?: 'throttle' | 'debounce'

    /**
     * Makes sense only when refreshMode is set.
     *
     * Default: `1000`
     */
    refreshRate?: number
    scrollX?: boolean
    scrollY?: boolean
    scrollBoxProps?: ScrollBox.Props
  }

  export const defaultProps: Props = {
    prefixCls: 'x6',
    scrollX: true,
    scrollY: true,
  }

  export interface State {
    contentWidth?: number | null
    contentHeight?: number | null
  }
}
