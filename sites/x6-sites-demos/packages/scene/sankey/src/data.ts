import { sankey } from 'd3-sankey'

interface DataItem {
  name: string
  count: number
  id: string
  dep?: string
}

const data: DataItem[] = [
  { name: '4S店', count: 131, id: '0' },
  { name: '服务部', count: 66, id: '1', dep: '0' },
  { name: '销售部', count: 35, id: '2', dep: '0' },
  { name: '管理团队', count: 8, id: '3', dep: '0' },
  { name: '行政人事部', count: 4, id: '4', dep: '0' },
  { name: '财务部', count: 8, id: '5', dep: '0' },
  { name: '客服部', count: 7, id: '6', dep: '0' },
  { name: '市场企划部', count: 3, id: '7', dep: '0' },

  // 服务部
  { name: '车间行政管理', count: 9, id: '8', dep: '1' },
  { name: '接待服务', count: 11, id: '9', dep: '1' },
  { name: '保险服务', count: 7, id: '10', dep: '1' },
  { name: '备件管理', count: 7, id: '11', dep: '1' },
  { name: '机修车间', count: 14, id: '12', dep: '1' },
  { name: '钣喷车间', count: 18, id: '13', dep: '1' },

  { name: '钣喷车间1', count: 2, id: '24', dep: '13' },
  { name: '钣喷车间2', count: 6, id: '25', dep: '13' },
  { name: '钣喷车间3', count: 10, id: '26', dep: '13' },

  // 销售部
  { name: '展厅', count: 17, id: '14', dep: '2' },
  { name: 'DCC', count: 3, id: '15', dep: '2' },
  { name: '区域', count: 2, id: '16', dep: '2' },
  { name: '精品销售', count: 4, id: '17', dep: '2' },
  { name: '二手车', count: 2, id: '18', dep: '2' },
  { name: '物流中心', count: 3, id: '19', dep: '2' },
  { name: '货款', count: 1, id: '20', dep: '2' },
  { name: '销售支持', count: 3, id: '21', dep: '2' },
]

export function getNodes() {
  const nodes: any[] = []
  const links: any[] = []
  data.forEach((d) => {
    nodes.push({ ...d })
    if (d.dep) {
      links.push({ source: d.dep, target: d.id, value: d.count })
    }
  })

  // @see https://github.com/d3/d3-sankey
  const layout = sankey()
    .nodeWidth(20)
    .nodePadding(12)
    .size([980, 760])
    .nodeId((d: any) => d.id)
    .nodeSort(() => {
      return 0
    })
    .iterations(32)
  return layout({ nodes, links })
}
