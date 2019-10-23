import fs from 'fs';
import path from 'path';
import lessToJs from 'less-vars-to-js';
import { IConfig } from 'umi-types';

const getVariables = (filename) => {
  const content = fs.readFileSync(path.join(__dirname, `./src/style/${filename}`), 'utf8')
  return lessToJs(content);
}

const theme = {
  ...getVariables('antd/12px.less'),
}

const config: IConfig = {
  theme,
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
