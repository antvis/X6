export interface CreateGridOptions {
  id: string
  size: number
  minSize: number
  color: string
  step: number
  type: 'line' | 'dot'
}

const defaults: CreateGridOptions = {
  id: 'x6-graph-grid',
  size: 10,
  step: 4,
  minSize: 4,
  color: '#e0e0e0',
  type: 'line',
}

export function createGrid(options: Partial<CreateGridOptions> = {}) {
  const opts: CreateGridOptions = { ...defaults, ...options }
  fixSize(opts)

  const svg = opts.type === 'line' ? createLineGrid(opts) : createDotGrid(opts)
  return base64(svg)
}

function createLineGrid(options: CreateGridOptions) {
  const gridSize = options.size
  const blockSize = options.size * options.step
  const d = []
  for (let i = 1, ii = options.step; i < ii; i += 1) {
    const tmp = i * gridSize
    d.push(`M 0 ${tmp} L ${blockSize} ${tmp} M ${tmp} 0 L ${tmp} ${blockSize}`)
  }

  const content = `
    <path
      d="${d.join(' ')}"
      fill="none"
      opacity="0.2"
      stroke="${options.color}"
      stroke-width="1"
    />
    <path
      d="M ${blockSize} 0 L 0 0 0 ${blockSize}"
      fill="none"
      stroke="${options.color}"
      stroke-width="1"
    />
  `

  return wrap(options.id, blockSize, content)
}

function createDotGrid(options: CreateGridOptions) {
  const content = `<rect width="1" height="1" fill="${options.color}"/>`
  return wrap(options.id, options.size, content)
}

function fixSize(options: CreateGridOptions) {
  let size = options.size
  while (size < options.minSize) {
    size *= 2
  }
  options.size = size
  return size
}

function wrap(id: string, size: number, content: string) {
  return `<svg
      width="${size}"
      height="${size}"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <pattern
          id="${id}"
          width="${size}"
          height="${size}"
          patternUnits="userSpaceOnUse"
        >
          ${content}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#${id})"/>
    </svg>`
}

function base64(svg: string) {
  const img = unescape(encodeURIComponent(svg))
  return `url(data:image/svg+xml;base64,${window.btoa(img)})`
}
