import React, { PropsWithChildren } from 'react'
import { Toolbar } from '../toolbar'
import './content.css'

export class Content extends React.Component<
  PropsWithChildren<Content.Props>,
  Content.State
> {
  private container: HTMLDivElement

  constructor(props: Content.Props) {
    super(props)
    Content.restoreIframeSize()
  }

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

    setTimeout(() => {
      const loading = document.getElementById('loading')
      if (loading && loading.parentNode) {
        loading.parentNode.removeChild(loading)
      }
    }, 1000)
  }

  updateIframeSize() {
    const iframe = window.frameElement as HTMLIFrameElement
    if (iframe) {
      const height = this.container.scrollHeight || this.container.clientHeight

      iframe.style.width = '100%'
      iframe.style.height = `${height + 16}px`
      iframe.style.border = '0'
      iframe.style.overflow = 'hidden'
      Content.saveIframeSize()
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

export namespace Content {
  export interface Props {}
  export interface State {}
}

export namespace Content {
  const STORE_KEY = window.location.pathname
  const STORE_ROOT = 'x6-iframe-size'

  function getData() {
    const raw = localStorage.getItem(STORE_ROOT)
    let data
    if (raw) {
      try {
        data = JSON.parse(raw)
      } catch (error) {
        // pass
      }
    } else {
      data = {}
    }
    return data
  }

  export function saveIframeSize() {
    const iframe = window.frameElement as HTMLIFrameElement
    if (iframe) {
      const style = iframe.style
      const size = { width: style.width, height: style.height }
      const data = getData()
      data[STORE_KEY] = size
      localStorage.setItem(STORE_ROOT, JSON.stringify(data))
    }
  }

  export function restoreIframeSize() {
    const iframe = window.frameElement as HTMLIFrameElement
    if (iframe) {
      const data = getData()
      const size = data[STORE_KEY]
      if (size) {
        iframe.style.width = size.width || '100%'
        iframe.style.height = size.height || 'auto'
      }
    }
  }
}
