import React from 'react'
import ReactDOM from 'react-dom'
import Devtool from './components/Devtool'
import 'antd/dist/antd.css'

window.mount = (data = [], container, actions = {}) => {
  ReactDOM.render(<Devtool data={data} actions={actions} />, container)
}
