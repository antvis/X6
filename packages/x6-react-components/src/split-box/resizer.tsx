import React from 'react'
import { MouseMoveTracker } from '../util/dom/MouseMoveTracker'

export class Resizer extends React.PureComponent<Resizer.Props> {
  private mouseMoveTracker: MouseMoveTracker

  UNSAFE_componentWillMount() {
    this.mouseMoveTracker = new MouseMoveTracker({
      onMouseMove: this.onMouseMove,
      onMouseMoveEnd: this.onMouseMoveEnd,
    })
  }

  componentWillUnmount() {
    this.mouseMoveTracker.release()
  }

  onMouseDown = (e: React.MouseEvent) => {
    this.mouseMoveTracker.capture(e)
    this.props.onMouseDown(e)
  }

  onMouseMove = (
    deltaX: number,
    deltaY: number,
    pos: MouseMoveTracker.ClientPosition,
  ) => {
    if (this.props.onMouseMove != null) {
      this.props.onMouseMove(deltaX, deltaY, pos)
    }
  }

  onMouseMoveEnd = () => {
    this.mouseMoveTracker.release()
    if (this.props.onMouseMoveEnd != null) {
      this.props.onMouseMoveEnd()
    }
  }

  onClick = (e: React.MouseEvent) => {
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  onDoubleClick = (e: React.MouseEvent) => {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick(e)
    }
  }

  render() {
    const { className, style } = this.props

    return (
      // eslint-disable-next-line
      <div
        role="button"
        style={style}
        className={className}
        onClick={this.onClick}
        ref={this.props.refIt}
        onMouseDown={this.onMouseDown}
        onDoubleClick={this.onDoubleClick}
      />
    )
  }
}

export namespace Resizer {
  export interface Props {
    className?: string
    style?: React.CSSProperties
    refIt: React.LegacyRef<HTMLDivElement>
    onClick?: (e: React.MouseEvent) => void
    onDoubleClick?: (e: React.MouseEvent) => void
    onMouseDown: (e: React.MouseEvent) => void
    onMouseMove?: (
      deltaX: number,
      deltaY: number,
      pos: MouseMoveTracker.ClientPosition,
    ) => void
    onMouseMoveEnd?: () => void
  }
}
