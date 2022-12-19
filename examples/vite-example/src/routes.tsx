import React from 'react'
import { set } from 'lodash-es'
import { RouteObject } from 'react-router'
import { Helmet } from 'react-helmet'

function parseRouteConfig() {
  const modules = import.meta.glob(`/src/pages/**/*.tsx`)
  const config: Record<string, any> = {}
  Object.keys(modules).forEach((filePath) => {
    const routeParts = filePath
      .replace(/^\/src\/pages\//, '') // 去除 /src/pages
      .replace(/.tsx$/, '') // 去除文件名后缀
      .replace(/\[([\w-]+)]/, ':$1') // 转换动态路由 [foo].tsx => :foo
      .split('/')

    set(config, routeParts, modules[filePath])
  })
  return config
}

function wrapSuspense(
  mod: () => Promise<{
    default: React.ComponentType<{ routes?: RouteObject[] }>
  }>,
  routes?: RouteObject[],
  title?: string,
) {
  if (!mod) {
    return undefined
  }

  const Component = React.lazy(mod)
  // 结合 Suspense ，这里可以自定义 loading 组件
  return (
    <React.Suspense fallback={null}>
      {title && (
        <Helmet>
          <title>{title}</title>
        </Helmet>
      )}
      {title ? <Component /> : <Component routes={routes} />}
    </React.Suspense>
  )
}

function wrapLayout(
  routePath: string,
  routeConfig: Record<string, any>,
): RouteObject {
  const { _layout, ...rest } = routeConfig
  const routes = routeConfigToRoute(rest, routePath)
  return {
    path: routePath,
    element: wrapSuspense(_layout, routes),
    children: routes,
  }
}

function routeConfigToRoute(
  config: Record<string, any>,
  parentPath: string,
): RouteObject[] {
  return Object.entries(config).map(([routePath, child]) => {
    // () => import() 语法判断
    if (typeof child === 'function') {
      // 等于 index 则映射为当前根路由
      const isIndex = routePath === 'index'
      return {
        index: isIndex,
        path: isIndex ? undefined : routePath,
        // 转换为组件
        element: wrapSuspense(
          child,
          undefined,
          isIndex ? parentPath : `${parentPath}/${routePath}`,
        ),
      }
    }
    // 否则为目录，则查找下一层级
    return wrapLayout(routePath, child)
  })
}

export function getRoutes(): RouteObject[] {
  const routeConfig = parseRouteConfig()
  return [wrapLayout('/', routeConfig)]
}
