import type { Node } from '@antv/x6'
import { register } from '@antv/x6-react-shape'

const TableNode = ({ node }: { node: Node }) => {
  const data = node.getData() || {}
  const { tableName = 'Unknown', fields = [] } = data

  const headerHeight = 40
  const fieldHeight = 25
  const bottomPadding = 16
  const calculatedHeight =
    headerHeight + fields.length * fieldHeight + bottomPadding

  return (
    <div
      style={{
        width: '240px',
        height: `${calculatedHeight}px`,
        background: '#ffffff',
        border: '2px solid #1890ff',
        borderRadius: '4px',
        fontFamily: 'Arial, sans-serif',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          background: '#1890ff',
          color: '#ffffff',
          padding: '8px',
          fontWeight: 'bold',
          fontSize: '14px',
          textAlign: 'center',
          boxSizing: 'border-box',
          borderTopLeftRadius: '2px',
          borderTopRightRadius: '2px',
        }}
      >
        {tableName}
      </div>

      {/* 字段列表 */}
      <div style={{ padding: '0', boxSizing: 'border-box' }}>
        {fields.length === 0 ? (
          <div
            style={{
              padding: '10px',
              textAlign: 'center',
              color: '#999',
              fontSize: '12px',
            }}
          >
            无字段
          </div>
        ) : (
          fields.map(
            (
              field: {
                name: string
                type: string
                isPrimary?: boolean
                isForeign?: boolean
                isUnique?: boolean
              },
              index: number,
            ) => {
              let icon = ''
              let color = '#262626'
              let fontWeight = 'normal'

              if (field.isPrimary) {
                icon = '🔑'
                color = '#ff4d4f'
                fontWeight = 'bold'
              } else if (field.isForeign) {
                icon = '🔗'
                color = '#52c41a'
                fontWeight = 'bold'
              } else if (field.isUnique) {
                icon = '⭐'
                color = '#faad14'
                fontWeight = 'bold'
              }

              return (
                <div
                  key={field.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px 8px',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
                    borderBottom:
                      index === fields.length - 1
                        ? 'none'
                        : '1px solid #e8e8e8',
                    fontSize: '12px',
                    height: '25px',
                    lineHeight: '1',
                    boxSizing: 'border-box',
                  }}
                >
                  <span style={{ marginRight: '4px', fontSize: '11px' }}>
                    {icon}
                  </span>
                  <span
                    style={{ color, fontWeight, flex: 1, textAlign: 'left' }}
                  >
                    {field.name}
                  </span>
                  <span style={{ color: '#8c8c8c', fontSize: '11px' }}>
                    {field.type}
                  </span>
                </div>
              )
            },
          )
        )}
      </div>
    </div>
  )
}

register({
  shape: 'er-table',
  width: 240,
  height: 300,
  component: TableNode,
  effect: ['data'],
})
