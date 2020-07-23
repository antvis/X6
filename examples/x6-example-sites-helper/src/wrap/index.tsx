import React from 'react'
import { Toolbar } from '../toolbar'
import './index.css'

export class Wrap extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    this.updateIframeSize()

    if (window.ResizeObserver) {
      const ro = new window.ResizeObserver(() => {
        this.updateIframeSize()
      })
      ro.observe(this.container)
    } else {
      window.addEventListener('resize', () => this.updateIframeSize())
    }
  }

  updateIframeSize() {
    const iframe = window.frameElement as HTMLIFrameElement
    if (iframe) {
      const height = this.container.scrollHeight || this.container.clientHeight

      iframe.style.width = '100%'
      iframe.style.height = `${height + 16}px`
      iframe.style.border = '0'
      iframe.style.overflow = 'hidden'
    }
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="demo-wrap" ref={this.refContainer}>
        <Toolbar />
        {this.props.children}
      </div>
    )
  }
}
