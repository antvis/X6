export interface Port {
  id: string
  group: string
  index: number
  args?: any
}

export function generateData(count: number) {
  return Array.from(Array(count).keys()).map((i) => {
    const ports = []
    if (Math.random() < 0.5) {
      ports.push({
        id: `port-in-${i}`,
        group: 'in',
      })
    }
    if (Math.random() < 0.5) {
      ports.push({
        id: `port-out-${i}`,
        group: 'out',
      })
    }

    return {
      id: `column-${i}`,
      name: `column name ${i}`,
      ports: ports.length ? ports : null,
    }
  })
}

export function parsePorts(data: ReturnType<typeof generateData>) {
  const ports: Port[] = []
  data.forEach((item, index) => {
    if (item.ports) {
      item.ports.forEach((port) => {
        ports.push({ index, ...port })
      })
    }
  })

  return ports
}
