import React from 'react'
import './index.less'

const BasicLayout: React.FC = props => (
  <div className="wrap">
    {props.children}
  </div>
)

export default BasicLayout
