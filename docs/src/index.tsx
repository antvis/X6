import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route } from 'react-router-dom'
import { Examples } from './examples'
import 'normalize.css'
import './index.less'

ReactDOM.render(
  (
    <Router>
      <Route path="/examples" component={Examples} />
    </Router>
  ),
  document.getElementById('root'),
)
