import React from 'react'
import NavLink from 'umi/navlink'
import './index.less'

const BasicLayout: React.FC = props => (
  <div className="wrap">
    <div className="nav">
      <h2>Components</h2>
      <ul>
        <li>
          <NavLink to="/icon">Icon</NavLink>
        </li>
        <li>
          <NavLink to="/dropdown">Dropdown</NavLink>
        </li>
        <li>
          <NavLink to="/menu">Menu</NavLink>
        </li>
        <li>
          <NavLink to="/menubar">Menubar</NavLink>
        </li>
        <li>
          <NavLink to="/toolbar">Toolbar</NavLink>
        </li>
        <li>
          <NavLink to="/contextmenu">ContextMenu</NavLink>
        </li>
        <li>
          <NavLink to="/colorpicker">ColorPicker</NavLink>
        </li>
      </ul>
    </div>
    <div className="content">{props.children}</div>
  </div>
)

export default BasicLayout
