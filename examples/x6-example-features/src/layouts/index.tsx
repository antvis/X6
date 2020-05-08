import React from 'react'
import NavLink from 'umi/navlink'
import './index.less'

const features = [{ link: '/basic', title: 'Basic' }]
const BasicLayout: React.FC = (props) => {
  const pathname = (props as any).location.pathname as string
  if (pathname) {
    return props.children as React.ReactElement
  }

  return (
    <div className="wrap">
      <div className="nav">
        <h2>Features</h2>
        <ul>
          {features.map((item) => (
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
