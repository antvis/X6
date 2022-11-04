import React, { PropsWithChildren } from 'react'

export class Box extends React.PureComponent<PropsWithChildren<Box.Props>> {
  render() {
    const { refIt, className, index, currentSize, oppositeSize, vertical } =
      this.props

    const style = {
      ...this.props.style,
      overflow: 'hidden',
      position: 'absolute',
      zIndex: 1,
    } as React.CSSProperties

    if (vertical) {
      style.bottom = 0
      style.top = 0
    } else {
      style.left = 0
      style.right = 0
    }

    if (currentSize != null) {
      if (vertical) {
        style.width = currentSize
        if (index === 1) {
          style.left = 0
        } else {
          style.right = 0
        }
      } else {
        style.height = currentSize
        if (index === 1) {
          style.top = 0
        } else {
          style.bottom = 0
        }
      }
    } else if (vertical) {
      if (index === 1) {
        style.left = 0
        style.right = oppositeSize
      } else {
        style.left = oppositeSize
        style.right = 0
      }
    } else if (index === 1) {
      style.top = 0
      style.bottom = oppositeSize
    } else {
      style.top = oppositeSize
      style.bottom = 0
    }

    return (
      <div ref={refIt} style={style} className={className}>
        {this.props.children}
      </div>
    )
  }
}

export namespace Box {
  export interface Props {
    style?: React.CSSProperties
    className?: string
    currentSize?: number | string
    oppositeSize?: number | string
    index: 1 | 2
    vertical: boolean
    isPrimary: boolean
    refIt: React.LegacyRef<HTMLDivElement>
  }
}
