import React from 'react'

export class Box extends React.PureComponent<Box.Props> {
  render() {
    const { className, split, size, refIt } = this.props
    const style = {
      display: 'flex',
      flexShrink: 0,
      overflow: 'hidden',
      position: 'relative',
      ...this.props.style,
    } as React.CSSProperties

    if (size != null) {
      if (split === 'vertical') {
        style.width = size
      } else {
        style.height = size
      }
    } else {
      style.flex = 1
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
    className?: string
    size?: number | string
    split?: 'vertical' | 'horizontal'
    style?: React.CSSProperties
    refIt: React.LegacyRef<HTMLDivElement>
  }
}
