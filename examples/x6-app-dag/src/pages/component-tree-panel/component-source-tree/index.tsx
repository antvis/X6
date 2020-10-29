import React from 'react'
import classNames from 'classnames'
import { SearchInput } from './search-input'
import { ComponentTree } from './component-tree'
import styles from './index.less'

interface Props {
  className?: string
}

export const ComponentSourceTree: React.FC<Props> = (props) => {
  const { className } = props
  return (
    <div className={classNames(className, styles.componentSourceTree)}>
      <div className={styles.component}>
        <SearchInput />
        <ComponentTree />
      </div>
      <div className={styles.links} />
    </div>
  )
}
