import React from 'react'
import classnames from 'classnames'
import { App } from '../index'
import './drop.less'

export class DropOverlay extends React.Component<
  DropOverlay.Props,
  DropOverlay.State
> {
  private count = 0
  private target: HTMLDivElement | null = null

  state = { active: false }

  componentDidMount() {
    document.addEventListener('drop', this.onDrop)
    document.addEventListener('dragover', this.onDragOver)
    document.addEventListener('dragenter', this.onDragEnter)
    document.addEventListener('dragleave', this.onDragLeave)
  }

  componentWillUnmount() {
    document.removeEventListener('drop', this.onDrop)
    document.removeEventListener('dragover', this.onDragOver)
    document.removeEventListener('dragenter', this.onDragEnter)
    document.removeEventListener('dragleave', this.onDragLeave)
  }

  onDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  onDragEnter = (e: DragEvent) => {
    if (this.target === e.target) {
      return
    }

    if (this.count === 0) {
      this.setState({ active: true })
    }

    this.target = e.target as HTMLDivElement
    this.count += 1
  }

  onDragLeave = (e: DragEvent) => {
    this.target = null
    this.count -= 1
    if (this.count === 0) {
      this.setState({ active: false })
    }
  }

  onDrop = (e: DragEvent) => {
    e.preventDefault()
    this.setState({ active: false })
    const file = e.dataTransfer && e.dataTransfer.files[0]
    if (!file) {
      return
    }

    new Response(file).text().then((data) => {
      if (data.includes('</svg>')) {
        this.props.onFileChanged({
          data,
          name: file.name,
        })
      }
    })
  }

  render() {
    return (
      <div
        className={classnames('drop-overlay', { hidden: !this.state.active })}
      >
        Drop it!
      </div>
    )
  }
}

export namespace DropOverlay {
  export interface Props {
    onFileChanged: (file: App.File) => void
  }

  export interface State {
    active: boolean
  }
}
