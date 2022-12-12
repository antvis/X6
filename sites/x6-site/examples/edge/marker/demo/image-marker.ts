import { Graph } from '@antv/x6'

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
})

const marker = {
  tagName: 'image',
  // https://www.iconfinder.com/icons/15539/arrow_left_previos_icon
  'xlink:href':
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFMklEQVRYR+2WaWxUVRiGnzt3lntnptPOdGba6ZRS7ALUsFY2g7SyhKWA0ALKHrBgWBRqQioQKJZdVpHdH5jKokGBgopoBCpbIkvYJIoIspUudGEYmHY6c8eMLCHIojVATLjJ+XfP9z75znve7wg84094xvo8B/jfd8AsQZMq2AP4a+On/9KBZqmyvPpnj+enUhhTG/HgnloB6GFU/8YJM40Gg/mjA0dHK7DiaQHEN0CYkzmke8ao+SOYmTk/MGvrj12A7540gDEE+neJi80ZO/0tZ7v+rwOVZMSkuTddvNIKOPWkAV4a1jBu/3sLummi6xmpqizh/O8VZI3e8UeB60ZroPhJAOiA6juFW5vlrV99k9lDY5BAFDm2+wyjx205dNLnG2AymRJdLtevwJl7QGQguEyACqgCKgDPvbAPMqEzCkY6NdpOB2u8fYHLgKZnXJ19+Wc+bQFBLpk9679k8rsfX7e+3MZrMBrD9+Xnr/W4XMcjjVJilD08tq4zMiY03GTTaWVtQPELJUVlyuWzhZeOFhYVXERZDRy5/xY0jYIBHRvEDewz/NWoUJuRqZPW7T10pXRzS4u5w8ylmd3a9G8D1X7Qacib9AknTonkfr6OJYsXUT/iJimpzTHHRgABwAWuIryuMnzVHnw1ApWlHvZvP8GGlQWVWyuuDQG2CREwPNFoHNa1S6OWKV2StInJDkJC/Cg1XorOlXPxTCUxDevgiLdzo+IqNdfKELwlrFpwmMjkMYyYNY0ZM6bx5tAEHFFq3L8c4dql01Rdr0AjmZBCLaj1JrSGUDSSjE6vpiD/HJPHrT27z+NuFTyCVxJFMXvMoLZpaekRhJo8uCt9+Lw1CHjRaDQoiPj8IKol1JIOQ5jEqnlHCU3sxdD3c8jJzmJAiwtY9T4EKQSjIw5DZCxanRFkAyjgdRXjdZVjtEaD3kBWxyks3nui310PqGB8rzrWKeOyUy3J7euhlqz4FQMBRSEQ8COogj4S8N6oxO8+zcoPjqB/oTudR2WyYtFcsnpL2BwOVDrDrXjz3+piTc1NqsqKCfi9mOomIVscqIUq5o1dw8SNB7LuN2GjeEHMGdYzKSN9UALRCTEIchwIOqrdZfg9blQ6CcF3gSW5uxCdnWiakc6OTWvITtdhDNHj94sEVEGjiqAIBEQBtU6PWjbi93sRUOG7fp4lU75m5s6zfwO4Y8zBaZGm3IG9bHWTW8iExaWgtTVBo9WhUmtwnd7C0tk7uWpuT6u+vfn+szWBpOqTQp1oPXaHCZvDhMlqRh9mxRBuRyOF4PepUNChxsPpfRtZNPs31l9yjX3ULIirhzBncIq9z2v9HMQmp2KMCaauSNnxPJbN2Myuy9HlSZ1TLMcOHjp78PDhhWEQHymKjZ2y2CDSoolwOnRiRIQOq02L3WnBEWPD5ykl/4vz7D+s1Pzgrmz/uGGk0sDbfeuZc9/IkEzNU1rjbDsV9+UCFr+Ty/Sd5XMFWS4ON5uTCwsLB9++f1rACsSroGkYNI4U1UkOvTYxVBYssloreKq07C0vziuBkY8DuBNa7doapeVDu6pf7NivDbb6HViW/SFTtl+Z44WJt9PuJuB7SCTrATvQUA/NvODzQR5Q9E8BgnWj6wvi8mGdQnr0Tjfw7Q6FCZuvzPfChNrOgdq8B3QWmD0+1ZJlCtEwaVvxspsw9mkC/KUlw/jeDvvC3cVXNxQqysCnDhAUlGCkXaVqcUFRRj3i7B/L9m888KBiDqAM8D5W6SE//FeA2ure3fcc4HkH/gSNF7Qt0mUkowAAAABJRU5ErkJggg==',
  width: 32,
  height: 32,
  x: -16,
  y: -16,
}

graph.addEdge({
  source: { x: 240, y: 120 },
  target: { x: 420, y: 80 },
  vertices: [{ x: 320, y: 170 }],
  connector: { name: 'rounded' },
  attrs: {
    line: {
      stroke: '#653433',
      sourceMarker: { ...marker },
      targetMarker: { ...marker },
    },
  },
})
