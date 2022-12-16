if (window) {
  (window as any).react = require('react');
  (window as any).reactDom = require('react-dom');
  (window as any).antd = require('antd');
  (window as any).dagre = require('dagre');
  (window as any).x6 = require('@antv/x6');
  (window as any).x6PluginSnapline = require('@antv/x6-plugin-snapline');
  (window as any).x6PluginClipboard = require('@antv/x6-plugin-clipboard');
  (window as any).x6PluginKeyboard = require('@antv/x6-plugin-keyboard');
  (window as any).x6PluginSelection = require('@antv/x6-plugin-selection');
  (window as any).x6PluginTransform = require('@antv/x6-plugin-transform');
  (window as any).x6PluginStencil = require('@antv/x6-plugin-stencil');
  (window as any).x6PluginHistory = require('@antv/x6-plugin-history');
  (window as any).x6ReactShape = require('@antv/x6-react-shape');
  (window as any).layout = require('@antv/layout');
  (window as any).hierarchy = require('@antv/hierarchy');
  (window as any).elkjs = require('elkjs/lib/elk.bundled.js');
}