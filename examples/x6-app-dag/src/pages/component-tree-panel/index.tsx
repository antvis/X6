import React, { useState } from 'react'
import classNames from 'classnames'
import { ComponentSourceTree } from './component-source-tree'
import styles from './index.less'

interface Props {
  className?: string
  experimentId: string
}

type TabOption = 'component' | 'model'

export const ComponentTreePanel: React.FC<Props> = (props) => {
  const { className } = props
  const [activeTab, setActiveTab] = useState<TabOption>('component')

  return (
    <div className={classNames(className, styles.nodeSourceTreeContainer)}>
      <div className={styles.tabWrapper}>
        <div
          className={classNames(styles.tab, {
            [styles.active]: activeTab === 'component',
          })}
          onClick={() => {
            setActiveTab('component')
          }}
        >
          组件库
        </div>
      </div>
      <div className={styles.tabContentWrapper}>
        <ComponentSourceTree
          className={classNames({ [styles.hide]: activeTab !== 'component' })}
        />
      </div>
    </div>
  )
}
