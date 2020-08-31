import React, { useEffect } from 'react'
import X6Editor from '@/x6Editor'
import Header from './components/Header'
import Sider from './components/Sider'
import ToolBar from './components/ToolBar'
import ConfigPanel from './components/ConfigPanel'
import '../reset.less'
import styles from './index.less'

export default function() {
  const getContainerSize = () => {
    return {
      width: document.body.offsetWidth - 800,
      height: document.body.offsetHeight - 132,
    }
  }

  useEffect(() => {
    const { graph } = X6Editor.getInstance()
    const resizeFn = () => {
      const { width, height } = getContainerSize()
      graph.resize(width, height)
    }
    window.addEventListener('resize', resizeFn)
    return () => {
      window.removeEventListener('resize', resizeFn)
    }
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
          <div id="container" className="x6-graph"/>
        </div>
        <div className={styles.config}>
          <ConfigPanel />
        </div>
      </div>
    </div>
  )
}
