import React from 'react'
import { Graph } from '@antv/x6'
import '../../index.less'

interface TableData {
  name: string;
  comment: string;
  type: string;
}

interface Mapping {
  sourceColumn: string | null,
  sourceColumnName: string | null,
  sourceColumnType: string | null,
  targetColumn: string | null,
  targetColumnName: string | null,
  targetColumnType: string | null
}

interface PortsType {
  id: string,
  group: string,
  attrs?: {} | { circle: { magnet: false } }
}

Graph.registerPortLayout('queue', (portsPositionArgs, elemBBox) => {
  return portsPositionArgs.map((_, index) => {
    let y = 54 + 36 * index

    return {
      position: {
        y,
        x: _.pos === 'left' ? 360 : 0
      }
    }
  })
})

export default class Example extends React.Component {
  private container: HTMLDivElement
  private GRAPH: Graph
  private portsAttrs = {
    circle: {
      r: 6,
      magnet: true,
      stroke: '#31d0c6',
      strokeWidth: 2,
      fill: '#fff'
    }
  }
  private BUTTONS = [
    { label: '同名映射', value: 'sameNameMapping' },
    { label: '同行映射', value: 'sameLineMapping' },
    { label: '取消映射', value: 'cancelMapping' },
  ]

  private leftTableData: TableData[] = [
    {
      name: 'daq_task_info_id',
      comment: '主键ID',
      type: 'BIGINT'
    },
    {
      name: 'task_id',
      comment: '基础任务ID',
      type: 'BIGINT'
    },
    {
      name: 'name',
      comment: '采集名称',
      type: 'VARCHAR'
    },
    {
      name: 'mode',
      comment: '采集方式',
      type: 'VARCHAR'
    },
    {
      name: 'tool',
      comment: '采集工具 ',
      type: 'VARCHAR'
    },
    {
      name: 'param',
      comment: '自定义参数，参数为键值对类型k=v，中间以;隔开',
      type: 'VARCHAR'
    },
    {
      name: 'src_table',
      comment: '源表',
      type: 'VARCHAR'
    },
    {
      name: 'sourcedata_id',
      comment: '源表数据源ID',
      type: 'BIGINT'
    },
    {
      name: 'sourcedata_type',
      comment: '源表数据源类型',
      type: 'VARCHAR'
    }
  ]

  private rightTableData: TableData[] = [
    {
      name: 'daq_task_info_id',
      comment: '主键ID',
      type: 'BIGINT'
    },
    {
      name: 'task_id',
      comment: '基础任务ID',
      type: 'BIGINT'
    },
    {
      name: 'name',
      comment: '采集名称',
      type: 'VARCHAR'
    },
    {
      name: 'mode',
      comment: '采集方式',
      type: 'VARCHAR'
    },
    {
      name: 'tool',
      comment: '采集工具 ',
      type: 'VARCHAR'
    },
    {
      name: 'param',
      comment: '自定义参数，参数为键值对类型k=v，中间以;隔开',
      type: 'VARCHAR'
    },
    {
      name: 'src_table',
      comment: '源表',
      type: 'VARCHAR'
    },
    {
      name: 'sourcedata_id',
      comment: '源表数据源ID',
      type: 'BIGINT'
    },
    {
      name: 'sourcedata_type',
      comment: '源表数据源类型',
      type: 'VARCHAR'
    }]

  private mapping: Mapping[] = []

  componentDidMount() {
    // 画布初始化
    this.GRAPH = new Graph({
      container: this.container,
      width: 800,
      height: 1000,
      connecting: {
        allowBlank: false,
        allowMulti: true,
        allowLoop: true,
        allowNode: false,
        allowEdge: false,
        allowPort: true,
        validateMagnet: (args) => {
          if (args.magnet.attributes['port-group' as any].value === 'right') {
            return false
          }
          return true
        }
      },
      background: {
        color: 'transparent' // 设置画布背景颜色
      },
      interacting: function () {
        return { nodeMovable: false }
      }
    })
    // 连接桩连接成功后的操作
    this.GRAPH.on('edge:connected', ({ isNew, edge }) => {
      if (isNew) {
        const mapItem = this.mapping.find(
          (item) => item.targetColumn === edge.target.port
        )
        const lfD = this.leftTableData.find(
          (item) => item.name === edge.source.port
        )
        mapItem!.sourceColumn = lfD!.name
        mapItem!.sourceColumnName = lfD!.comment
        mapItem!.sourceColumnType = lfD!.type
        this.handleExecuteRender(this.mapping)
      }
    })
    // 鼠标悬浮在边上时的操作
    this.GRAPH.on('edge:mouseenter', ({ cell }) => {
      cell.addTools(
        [
          {
            name: 'button',
            args: {
              markup: [
                {
                  tagName: 'circle',
                  selector: 'button',
                  attrs: {
                    r: 8,
                    fill: '#fff',
                    cursor: 'pointer',
                    x: 20
                  }
                },
                {
                  tagName: 'text',
                  textContent: '×',
                  selector: 'icon',
                  attrs: {
                    fill: 'red',
                    y: 8,
                    'font-size': 24,
                    'text-anchor': 'middle',
                    'pointer-events': 'none'
                  }
                }
              ],
              distance: -33,
              onClick: ({ view }) => {
                const edge = view.cell
                const mapItem = this.mapping.find(
                  (item) =>
                    item.sourceColumn === edge.source.port &&
                    item.targetColumn === edge.target.port
                )
                mapItem!.sourceColumn = null
                mapItem!.sourceColumnName = null
                mapItem!.sourceColumnType = null

                this.handleExecuteRender(this.mapping)
              }
            }
          }
        ],
        'onhover' // 工具集名称，可省略
      )
    })
    // 鼠标离开边后的操作
    this.GRAPH.on('edge:mouseleave', ({ cell }) => {
      if (cell.hasTools('onhover')) {
        cell.removeTools()
      }
    })
    // 渲染画布
    this.renderCanvas()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }
  // 新增、更新画布数据
  renderCanvas = () => {
    const lfLen = this.leftTableData.length
    const rtLen = this.rightTableData.length
    if (lfLen > 0 && rtLen > 0) {
      this.mapping = this.sameNameMapping() // 映射关系
      this.sortTableData(this.mapping)
      this.renderMappingTable(this.mapping)
      this.renderMappingRelation(this.mapping)
      const Hnum = lfLen > rtLen ? lfLen : rtLen
      const height = Hnum * 36 + 80
      this.GRAPH.resize(800, height)
    }
  }
  // 渲染映射表
  renderMappingTable = (mapping: Mapping[]) => {
    this.addTable('ac-table1', 'left', mapping)
    this.addTable('ac-table2', 'right', mapping)
  }
  // 渲染连接的映射关系
  renderMappingRelation(mapping: Mapping[]) {
    mapping.length > 0 &&
      mapping.forEach((map) => {
        if (map.sourceColumn && map.targetColumn) {
          this.GRAPH.addEdge({
            source: { cell: 'left-bar', port: map.sourceColumn },
            target: { cell: 'right-bar', port: map.targetColumn }
          })
        }
      })
  }
  // 画布创建后的重新渲染操作
  handleExecuteRender = (mapping: Mapping[]) => {
    this.GRAPH.removeNode('left-bar')
    this.GRAPH.removeNode('right-bar')
    this.sortTableData(mapping)
    this.renderMappingTable(mapping)
    this.renderMappingRelation(mapping)
  }
  // 映射模式切换
  toggleMapingMode = (mode: 'sameLineMapping' | 'cancelMapping' | 'cancelMapping') => {
    switch (mode) {
      case 'sameLineMapping':
        this.mapping = this.sameLineMapping()
        this.handleExecuteRender(this.mapping)
        break
      case 'cancelMapping':
        this.mapping = this.mapping.map((item) => ({
          ...item,
          sourceColumn: null,
          sourceColumnName: null,
          sourceColumnType: null
        }))
        this.handleExecuteRender(this.mapping)
        break
      default:
        this.mapping = this.sameNameMapping()
        this.handleExecuteRender(this.mapping)
    }
  }
  // 创建表格
  addTable = (id: string, pos: string, mapping: Mapping[]) => {
    let attrs: any = { x: 440, y: 0 }
    if (pos === 'left') {
      attrs = {}
    }
    const table = document.createElement('table')
    table.className = 'gridtable'
    table.id = id
    this.createTrContent(table, 'th', [
      pos === 'left' ? '源头表字段' : '目标表字段',
      '类型',
      '注释'
    ])
    const items: PortsType[] = []

    this[pos + 'TableData'].forEach((col: TableData) => {
      const map =
        pos === 'left'
          ? mapping.find((map) => map.sourceColumn === col.name)
          : mapping.find(
            (map) => map.sourceColumn && map.targetColumn === col.name
          )
      items.push({
        id: col.name,
        group: pos,
        attrs: map ? { circle: { magnet: false } } : {}
      })
      this.createTrContent(table, 'td', [col.name, col.type, col.comment])
    })

    this.GRAPH.addNode({
      id: pos === 'left' ? 'left-bar' : 'right-bar',
      shape: 'html',
      width: 360,
      ...attrs,
      html: () => table,
      ports: {
        groups: {
          [pos]: {
            position: { name: 'queue', args: { pos } },
            attrs: this.portsAttrs
          }
        },
        items
      }
    })
  }
  // 创建tr和内容
  createTrContent = (table: HTMLTableElement, elType: string, textArr: string[]) => {
    const tr = document.createElement('tr')
    textArr.forEach((text) => {
      const item = document.createElement(elType)
      item.title = text
      item.innerText = text
      tr.appendChild(item)
    })
    table.appendChild(tr)
  }
  /* 同名映射 */
  sameNameMapping = () => {
    const enMapping: Mapping[] = []
    const unMapping: Mapping[] = []
    this.leftTableData.forEach((lfD) => {
      const mapD = this.rightTableData.find((rtD) => rtD.name === lfD.name)
      if (mapD) {
        enMapping.push({
          sourceColumn: lfD.name,
          sourceColumnName: lfD.comment,
          sourceColumnType: lfD.type,
          targetColumn: mapD.name,
          targetColumnName: mapD.comment,
          targetColumnType: mapD.type
        })
      }
    })
    let rightUnData = this.rightTableData.filter(
      (item) => !enMapping.find((map) => map.targetColumn === item.name)
    )
    rightUnData.forEach((item) => {
      unMapping.push({
        sourceColumn: null,
        sourceColumnName: null,
        sourceColumnType: null,
        targetColumn: item.name,
        targetColumnName: item.comment,
        targetColumnType: item.type
      })
    })
    return [...enMapping, ...unMapping]
  }
  /* 同行映射 */
  sameLineMapping = () => {
    let i = 0
    const mapping = []
    const lfData = this.leftTableData
    const rtData = this.rightTableData
    while (i < rtData.length) {
      let lf = lfData[i]
        ? lfData[i]
        : {
          name: null,
          comment: null,
          type: null
        }
      const rt = rtData[i]
      mapping.push({
        sourceColumn: lf.name,
        sourceColumnName: lf.comment,
        sourceColumnType: lf.type,
        targetColumn: rt.name,
        targetColumnName: rt.comment,
        targetColumnType: rt.type
      })
      i++
    }
    return mapping
  }
  // 根据映射关系重新排序
  sortTableData = (mapping: Mapping[]) => {
    let FirstLfTabMapDa: TableData[] = []
    let SecondLfTabMapDa: TableData[] = []
    let FirstRtTabMapDa: TableData[] = []
    let SecondRtTabMapDa: TableData[] = []
    this.rightTableData.forEach((item) => {
      const rtD = mapping.find((map) => map.targetColumn === item.name)
      if (rtD && rtD.sourceColumn !== null) {
        FirstRtTabMapDa.unshift(item)
        const lfItem = this.leftTableData.find(
          (lfD) => lfD.name === rtD.sourceColumn
        )
        FirstLfTabMapDa.unshift(lfItem as TableData)
      } else {
        SecondRtTabMapDa.push(item)
      }
    })
    this.leftTableData.forEach((item) => {
      if (!FirstLfTabMapDa.some((lfD) => lfD.name === item.name)) {
        SecondLfTabMapDa.push(item)
      }
    })

    const finalLfData = [...FirstLfTabMapDa.reverse(), ...SecondLfTabMapDa]
    const finalRtData = [...FirstRtTabMapDa.reverse(), ...SecondRtTabMapDa]
    this.leftTableData = finalLfData
    this.rightTableData = finalRtData
  }

  render() {
    return (
      <div className="x6-graph-wrap">
        <ul className="right-tab">
          {
            this.BUTTONS.map(item => (
              <li
                key={item.value}
              >
                <button className="el-button" onClick={() => this.toggleMapingMode(item.value)}>
                  {item.label}
                </button>
              </li>
            ))
          }
        </ul>
        <div ref={this.refContainer} className="x6-graph" />
      </div>
    )
  }
}
