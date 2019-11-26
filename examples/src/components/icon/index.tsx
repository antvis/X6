import React from 'react'
import { Icon as AntdIcon } from 'antd'
import { IconProps as AntdIconProps } from 'antd/lib/icon'
import { IconProp as FaIconProps, IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, Props as FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

export const Icon: React.SFC<Icon.Props> = ({ icon, svg, fa, ...props }) => {
  if (fa) {
    return (
      <FontAwesomeIcon
        {...fa}
        icon={icon as FaIconProps}
      />
    )
  }

  if (typeof icon === 'object' && icon.icon) {
    const [width, height, pathData] = (icon as IconDefinition).icon
    return (
      <AntdIcon {...props} viewBox={`0 0 ${width} ${height}`}>
        <path d={pathData.join(' ')} />
      </AntdIcon >
    )
  }

  if (typeof icon === 'string' && svg) {
    const matches1 = icon.match(/viewBox="(.*?)"/i)
    const matches2 = icon.match(/<svg.*?>(.*?)<\/svg>/i)
    const viewBox = matches1 && matches1[1]
    const content = matches2 && matches2[1]
    const component = (svgProps: any) => (
      <svg {...svgProps} dangerouslySetInnerHTML={{ __html: content }} />
    )

    return (
      <AntdIcon
        {...props}
        viewBox={viewBox as string}
        component={component}
      />
    )
  }

  return (<AntdIcon {...props} type={icon} />)
}

export namespace Icon {
  export interface Props extends AntdIconProps {
    /**
     * Specify `fa` to force render icon as `FontAwesomeIcon`.
     */
    fa?: FontAwesomeIconProps
    /**
     * Whether `icon` is a raw svg string.
     */
    svg?: boolean
    icon: any
  }
}
