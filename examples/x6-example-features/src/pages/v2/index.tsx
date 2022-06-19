import React, { Component } from 'react'
import Canvas from './graph'
import Clock from './clock'

export default class Example extends Component {
  render() {
    return (
      <div>
        <Canvas />
        {/* <Clock /> */}
      </div>
    )
  }
}
