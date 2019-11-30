import React from "react";
import { Icon as AntdIcon } from "antd";
import { IconProps as AntdIconProps } from "antd/lib/icon";

export const Icon: React.SFC<Icon.Props> = ({ type: icon, svg, ...props }) => {
  if (typeof icon === "object") {
    const { width, height, pathData } = icon;
    return (
      <AntdIcon {...props} viewBox={`0 0 ${width} ${height}`}>
        <path d={Array.isArray(pathData) ? pathData.join(" ") : pathData} />
      </AntdIcon>
    );
  }

  if (typeof icon === "string" && svg) {
    const matches1 = icon.match(/viewBox="(.*?)"/i);
    const matches2 = icon.match(/<svg.*?>(.*?)<\/svg>/i);
    const viewBox = matches1 && matches1[1];
    const content = matches2 && matches2[1];
    const component = (svgProps: any) => (
      <svg {...svgProps} dangerouslySetInnerHTML={{ __html: content }} />
    );

    return (
      <AntdIcon {...props} viewBox={viewBox as string} component={component} />
    );
  }

  return <AntdIcon {...props} type={icon} />;
};

export namespace Icon {
  export interface IconData {
    width: number;
    height: number;
    pathData: string | string[];
  }

  // see: https://stackoverflow.com/a/49198999
  type Diff<T extends keyof any, U extends keyof any> = ({ [P in T]: P } &
    { [P in U]: never } & { [x: string]: never })[T];
  type Overwrite<T, U> = Pick<T, Diff<keyof T, keyof U>> & U;

  interface IconProps {
    /**
     * Whether `icon` is a raw svg string.
     */
    svg?: boolean;
    type?: string | IconData;
  }

  export interface Props extends Overwrite<AntdIconProps, IconProps> {}
}
