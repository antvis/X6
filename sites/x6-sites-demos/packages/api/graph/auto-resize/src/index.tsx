import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import { Wrap } from '@antv/x6-sites-demos-helper'

ReactDOM.render(
  <Wrap>
    <div className="bar" />
    <App />
  </Wrap>,
  document.getElementById('root'),
)
