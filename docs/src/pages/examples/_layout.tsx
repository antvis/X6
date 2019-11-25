import React from 'react'
import NavLink from 'umi/navlink'
import './_layout.less'

const Layout: React.FC = props => {
  return (
    <div className="examples">
      <div className="examples-nav">
        <h2>Examples</h2>
        <ul>
          <li><NavLink to="/examples/helloworld">Hello World</NavLink></li>
          <li><NavLink to="/examples/markers">Markers</NavLink></li>
          <li><NavLink to="/examples/routers">Routers</NavLink></li>
          <li><NavLink to="/examples/helloport">Cell as Connection Ports</NavLink></li>
          <li><NavLink to="/examples/constraints">Fixed Connection Points</NavLink></li>
          <li><NavLink to="/examples/guide">SnapLines</NavLink></li>
          <li><NavLink to="/examples/layers">Layers</NavLink></li>
          <li><NavLink to="/examples/transform">Transform</NavLink></li>
          <li><NavLink to="/examples/indicators">Indicators</NavLink></li>
          <li><NavLink to="/examples/images">Images</NavLink></li>
          <li><NavLink to="/examples/overlays">Overlays</NavLink></li>
          <li><NavLink to="/examples/labels">Labels</NavLink></li>
          <li><NavLink to="/examples/label-position">Label Position</NavLink></li>
          <li><NavLink to="/examples/editing">Editing</NavLink></li>
          <li><NavLink to="/examples/pagebreaks">Page Breaks</NavLink></li>
          <li><NavLink to="/examples/custom-render">Custom Render</NavLink></li>
        </ul>
        <h2>Charts</h2>
        <ul>
          <li><NavLink to="/examples/flowchart">FlowChart</NavLink></li>
        </ul>
      </div>
      <div className="examples-content">
        {props.children}
      </div>
    </div>
  )
}

export default Layout
