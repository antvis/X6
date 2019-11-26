import React from 'react'
import { Editor } from './editor'
import * as x6 from '../../../../src'

console.log(x6)

let editor: Editor

export function getEditor() {
  return editor
}

export function fetchEditor() {
  return new Promise<Editor>((resolve) => {
    const watch = () => {
      if (editor != null) {
        resolve(editor)
      } else {
        setTimeout(watch, 100)
      }
    }
    watch()
  })
}

export default class X6Editor extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    editor = new Editor(this.container)
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div
        ref={this.refContainer}
        tabIndex={0}
        className="x6-graph-container"
      />
    )
  }
}
