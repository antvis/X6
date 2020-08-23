import React, { useEffect } from 'react'
import Header from './components/Header'
import Sider from './components/Sider'
import ToolBar from './components/ToolBar'
import ConfigPanel from './components/ConfigPanel'
import X6Editor from '@/x6Editor'
import '../reset.less'
import styles from './index.less'

export default function() {
  useEffect(() => {
    // init
    X6Editor.getInstance()
  }, [])

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.content}>
        <div className={styles.sider}>
          <Sider />
        </div>
        <div className={styles.panel}>
          <div className={styles.toolbar}>
            <ToolBar />
          </div>
          <div id="container" className="x6-graph"></div>
        </div>
        <div className={styles.config}>
          <ConfigPanel />
        </div>
      </div>
    </div>
  )
}
