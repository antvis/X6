import React from 'react'
import { GraphToolbar, GraphMenubar, Sidebar } from './graph'
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
          format
        </div>
      </div>
      <div className="x6-editor-footer">
        footer
      </div>
    </div>
  )
}

export default Layout
