import { IConfig } from 'umi-types';

const config: IConfig = {
  treeShaking: true,
  plugins: [
    ['umi-plugin-react', {
      antd: true,
      dva: false,
      dynamicImport: false,
      dll: false,
      title: 'x6',

      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
}

export default config;
