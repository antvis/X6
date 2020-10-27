/* eslint-disable no-param-reassign */
import { useCallback, useState } from 'react'
import { algoData, searchByKeyword } from '../mock/algo'

export namespace Res {
  export interface Data {
    defs: NodeDef[]
    cats: Cat[]
  }

  export interface NodeDef {
    up: number
    down: number
    defSource: number
    catName: string
    isDeprecated: boolean
    isSubscribed: boolean
    isEnabled: boolean
    iconType: number
    docUrl: string
    sequence: number
    author?: string
    ioType: number
    lastModifyTime: string
    createdTime: string
    catId: number
    isComposite: boolean
    codeName: string
    engineType?: number
    description?: string
    name: string
    id: number
    type: number
    owner: string
    algoSourceType?: number
  }

  export interface Cat {
    defSource: number
    isEnabled: boolean
    iconType: number
    codeName: string
    description: string
    sequence: number
    name: string
    id: number
    category?: string
  }
}

function dfs(
  path = '',
  nodes: any[],
  isTarget: (node: any) => boolean,
  result: string[] = [],
) {
  nodes.forEach((node, idx) => {
    if (node.children) {
      const currentIdx = path ? `${path}.${idx}.children` : `${idx}.children`
      dfs(currentIdx, node.children, isTarget, result)
    }

    if (isTarget(node)) {
      const currentIdx = path ? `${path}.${idx}` : idx
      result.push(currentIdx.toString())
    }
  })
}

export default () => {
  const [keyword, setKeyword] = useState<string>('') // 搜索关键字
  const [loading, setLoading] = useState<boolean>(false) // 加载状态
  const [componentTreeNodes, setComponentTreeNodes] = useState<any[]>([])
  const [searchList, setSearchList] = useState<any[]>([]) // 搜索结果列表

  // 加载组件
  const loadComponentNodes = useCallback(() => {
    setLoading(true)
    const load = async () => {
      try {
        if (algoData) {
          setComponentTreeNodes(algoData)
        }
      } finally {
        setLoading(false)
      }
    }

    return load()
  }, [])

  // 搜索组件
  const search = useCallback((params: { keyword: string }) => {
    setKeyword(params.keyword ? params.keyword : '')
    if (!params.keyword) {
      return
    }
    setLoading(true)

    const load = async () => {
      try {
        const nodes = ([] = await searchByKeyword(params.keyword))
        setSearchList(nodes)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return {
    // 状态
    keyword,
    loading,
    componentTreeNodes,
    searchList,

    // 方法
    setKeyword,
    loadComponentNodes,
    search,
  }
}
