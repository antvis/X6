import React from 'react'
import { GraphToolbar, GraphMenubar, Sidebar } from './graph'
import { Format } from './graph/format'
import { version } from '../../../../src'
import './_layout.less'

const Layout: React.FC = props => {
  return (
    <div className="x6-editor">
      <div className="x6-editor-menubar">
        <GraphMenubar />
      </div>
      <div className="x6-editor-toolbar">
        <GraphToolbar />
      </div>
      <div className="x6-editor-wrap">
        <div className="x6-editor-sidebar">
          <Sidebar />
        </div>
        <div className="x6-editor-graph">
          {props.children}
        </div>
        <div className="x6-editor-format">
          <Format />
        </div>
      </div>
      <div className="x6-editor-footer">
        <span className="version">
          x6 v{version}
        </span>
      </div>
    </div>
  )
}

export default Layout
