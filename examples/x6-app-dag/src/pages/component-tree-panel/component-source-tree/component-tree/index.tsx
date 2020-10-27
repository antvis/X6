import React from 'react'
import { useModel } from 'umi'
import { useMount } from 'ahooks'
import { CategoryTree } from './category-tree'
import { SearchResultList } from './search-result-list'
import styles from './index.less'

export const ComponentTree = () => {
  const { keyword, loadComponentNodes } = useModel('guide-algo-component')

  useMount(() => {
    loadComponentNodes()
  })

  return (
    <div className={styles.componentTree}>
      {keyword ? <SearchResultList /> : <CategoryTree />}
    </div>
  )
}
