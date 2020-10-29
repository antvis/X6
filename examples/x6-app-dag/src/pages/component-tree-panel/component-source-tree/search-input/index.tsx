import React, { useState } from 'react'
import { Input } from 'antd'
import { useDebounceFn } from 'ahooks'
import { useModel } from 'umi'
import styles from './index.less'

const { Search } = Input

export const SearchInput = () => {
  const [value, setValue] = useState<string>('')
  const { search, setKeyword } = useModel('guide-algo-component')

  const { run: onDebouncedSearch } = useDebounceFn(
    (v: string) => {
      if (!v) {
        return
      }
      search({ keyword: v })
    },
    { wait: 500 },
  )

  return (
    <div className={styles.searchInput}>
      <Search
        className={styles.input}
        placeholder="请输入组件名称或描述"
        value={value}
        allowClear={true}
        onChange={(e) => {
          const v = e.target.value
          if (!v) {
            setKeyword('')
          }
          setValue(v)
        }}
        onSearch={onDebouncedSearch}
      />
    </div>
  )
}
