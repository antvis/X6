import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import { Wrap } from '@antv/x6-example-sites-helper'

ReactDOM.render(
  <Wrap>
    <div className="bar" />
    <App />
  </Wrap>,
  document.getElementById('root'),
)
