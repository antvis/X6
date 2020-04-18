import React from 'react'
import NavLink from 'umi/navlink'
import './index.less'

const features = [
  { link: '/helloworld', title: 'Hello World' },
  { link: '/markers', title: 'Markers' },
  { link: '/routers', title: 'Routers' },
  { link: '/ports', title: 'Ports' },
  { link: '/anchors', title: 'Anchors' },
  { link: '/layers', title: 'Layers' },
  { link: '/group', title: 'Group' },
  { link: '/images', title: 'Images' },
  { link: '/indicators', title: 'Indicators' },
  { link: '/overlays', title: 'Overlays' },
  { link: '/labels', title: 'Labels' },
  { link: '/label-position', title: 'Label Position' },
  { link: '/page-breaks', title: 'Page Breaks' },
  { link: '/snapline', title: 'SnapLine' },
  { link: '/custom-render', title: 'Custom Render' },
  { link: '/react-shape', title: 'React Shape' },
  { link: '/infinite', title: 'Infinite Canvas' },
]

const charts = [{ link: '/flowchart', title: 'FlowChart' }]

const BasicLayout: React.FC = props => {
  const pathname = (props as any).location.pathname as string
  if (
    charts.some(item => item.link === pathname) ||
    pathname.startsWith('/joint')
  ) {
    return props.children as React.ReactElement
  }

  return (
    <div className="wrap">
      <div className="nav">
        <h2>Features</h2>
        <ul>
          {features.map(item => (
            <li key={item.link}>
              <NavLink to={item.link}>{item.title}</NavLink>
            </li>
          ))}
        </ul>
        <h2>Charts</h2>
        <ul>
          {charts.map(item => (
            <li key={item.link}>
              <NavLink to={item.link}>{item.title}</NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="content">{props.children}</div>
    </div>
  )
}

export default BasicLayout
