if (typeof window !== 'undefined' && window) {
  const X6 = require('@antv/x6')
  ;(window as any).react = require('react')
  ;(window as any).reactDom = require('react-dom')
  ;(window as any).client = require('react-dom/client')
  ;(window as any).antd = require('antd')
  ;(window as any).dagre = require('dagre')
  ;(window as any).x6 = X6
  ;(window as any).x6PluginSnapline = X6
  ;(window as any).x6PluginClipboard = X6
  ;(window as any).x6PluginKeyboard = X6
  ;(window as any).x6PluginSelection = X6
  ;(window as any).x6PluginTransform = X6
  ;(window as any).x6PluginStencil = X6
  ;(window as any).x6PluginHistory = X6
  ;(window as any).x6ReactShape = require('@antv/x6-react-shape')
  ;(window as any).layout = require('@antv/layout')
  ;(window as any).classnames = require('classnames')
  ;(window as any).hierarchy = require('@antv/hierarchy')
  ;(window as any).elkjs = require('elkjs/lib/elk.bundled.js')
  ;(window as any).insertCss = require('insert-css')
}
