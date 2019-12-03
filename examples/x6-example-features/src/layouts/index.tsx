import React from 'react'
import NavLink from 'umi/navlink'
import styles from './index.less'

const features = [
  { link: '/helloworld', title: 'Hello World' },
  { link: '/markers', title: 'Markers' },
  { link: '/routers', title: 'Routers' },
  { link: '/ports', title: 'Ports' },
  { link: '/anchors', title: 'Anchors' },
  { link: '/layers', title: 'Layers' },
  { link: '/images', title: 'Images' },
  { link: '/indicators', title: 'Indicators' },
  { link: '/overlays', title: 'Overlays' },
  { link: '/labels', title: 'Labels' },
  { link: '/label-position', title: 'Label Position' },
  { link: '/page-breaks', title: 'Page Breaks' },
  { link: '/snapline', title: 'SnapLine' },
  { link: '/custom-render', title: 'Custom Render' },
]

const BasicLayout: React.FC = props => {
  return (
    <div className={styles.wrap}>
      <div className={styles.nav}>
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
          <li>
            <NavLink to="/flowchart">FlowChart</NavLink>
          </li>
        </ul>
      </div>
      <div className={styles.content}>{props.children}</div>
    </div>
  )
}

export default BasicLayout
