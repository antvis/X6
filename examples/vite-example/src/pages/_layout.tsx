import React from 'react'
import { RouteObject } from 'react-router'
import { Outlet, NavLink } from 'react-router-dom'
import style from './_layout.module.less'

function renderLink(route: RouteObject, parentPath: string) {
  let children = route.children
  let indexRoute: RouteObject | null = null
  if (children) {
    children = children.slice()
    const idx = children.findIndex((r) => r.index)
    if (idx >= 0) {
      indexRoute = children[idx]
      children.splice(idx, 1)
    }
  }

  const routeName = route.path
  const routePath = `${parentPath}/${routeName}`
  const element = indexRoute ? indexRoute.element : route.element

  return (
    <React.Fragment key={routePath}>
      <li>
        {element ? (
          <NavLink
            to={routePath}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {routeName}
          </NavLink>
        ) : (
          routeName
        )}
      </li>
      {children && <li>{renderLinks(children, routePath)}</li>}
    </React.Fragment>
  )
}

function renderLinks(routes: RouteObject[], parentPath = '') {
  return <ul>{routes.map((route) => renderLink(route, parentPath))}</ul>
}

export default function Layout(props: { routes: RouteObject[] }) {
  return (
    <div className={style.wrap}>
      <div className={style.nav}>
        <h2>Examples</h2>
        <section>{renderLinks(props.routes)}</section>
      </div>
      <div className={style.content}>
        <Outlet />
      </div>
    </div>
  )
}
