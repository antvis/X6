(this["webpackJsonpapi.ui.toolbar.basic"]=this["webpackJsonpapi.ui.toolbar.basic"]||[]).push([[0],{119:function(b,_,t){"use strict";t.r(_),t.d(_,"host",function(){return x}),t.d(_,"getCodeSandboxParams",function(){return n}),t.d(_,"getStackblitzPrefillConfig",function(){return P});const x="https://github.com/antvis/X6/tree/master//home/runner/work/X6/X6/sites/x6-sites-demos/packages/api/ui/toolbar/basic";function n(){return{files:{"package.json":{isBinary:!1,content:'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}'},".gitignore":{content:`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
react-app-env.d.ts
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,isBinary:!1},"public/index.html":{content:`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title></title>
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
  </body>
</html>
`,isBinary:!1},"src/app.tsx":{content:`import React from 'react'
import { message } from 'antd'
import { Menu, Toolbar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/toolbar/style/index.css'
import 'antd/dist/antd.css'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RedoOutlined,
  UndoOutlined,
  DeleteOutlined,
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from '@ant-design/icons'

const Item = Toolbar.Item // tslint:disable-line
const Group = Toolbar.Group // tslint:disable-line

export default class Example extends React.Component {
  onClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onItemClick = () => {
    this.onClick('undo')
  }

  renderZoomDropdown() {
    const MenuItem = Menu.Item // tslint:disable-line
    const Divider = Menu.Divider // tslint:disable-line

    return (
      <Menu>
        <MenuItem name="resetView" hotkey="Cmd+H">
          Reset View
        </MenuItem>
        <MenuItem name="fitWindow" hotkey="Cmd+Shift+H">
          Fit Window
        </MenuItem>
        <Divider />
        <MenuItem name="25">25%</MenuItem>
        <MenuItem name="50">50%</MenuItem>
        <MenuItem name="75">75%</MenuItem>
        <MenuItem name="100">100%</MenuItem>
        <MenuItem name="125">125%</MenuItem>
        <MenuItem name="150">150%</MenuItem>
        <MenuItem name="200">200%</MenuItem>
        <MenuItem name="300">300%</MenuItem>
        <MenuItem name="400">400%</MenuItem>
      </Menu>
    )
  }

  render() {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ background: '#f5f5f5', paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoom"
                tooltipAsTitle={true}
                tooltip="Zoom (Alt+Mousewheel)"
                dropdown={this.renderZoomDropdown()}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 40,
                    textAlign: 'right',
                  }}
                >
                  100%
                </span>
              </Item>
            </Group>
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar extra={<span>Extra Component</span>}>
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar onClick={this.onClick} extra={<span>Extra Component</span>}>
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
      </div>
    )
  }
}
`,isBinary:!1},"src/index.css":{content:`body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`,isBinary:!1},"src/index.tsx":{content:`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,isBinary:!1},"tsconfig.json":{content:`{
  "compilerOptions": {
    "allowJs": true,
    "strict": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "strictPropertyInitialization": false,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "noImplicitAny": true,
    "noEmitOnError": true,
    "noUnusedLocals": true,
    "strictNullChecks": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "jsx": "react",
    "target": "es5",
    "lib": [
      "dom",
      "es2015"
    ]
  },
  "include": [
    "src"
  ]
}
`,isBinary:!1}}}}function P(){return{title:"api/ui/toolbar/basic",description:"",template:"create-react-app",dependencies:{"@antv/x6-react-components":"latest",antd:"^4.4.2",react:"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},files:{"package.json":'{"dependencies":{"@antv/x6-react-components":"latest","antd":"^4.4.2","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"devDependencies":{"@types/react":"^16.9.19","@types/react-dom":"^16.9.5","typescript":"^4.0.2"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]}}',".gitignore":`# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
react-app-env.d.ts
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`,"public/index.html":`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <title></title>
  </head>
  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
  </body>
</html>
`,"src/app.tsx":`import React from 'react'
import { message } from 'antd'
import { Menu, Toolbar } from '@antv/x6-react-components'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/toolbar/style/index.css'
import 'antd/dist/antd.css'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RedoOutlined,
  UndoOutlined,
  DeleteOutlined,
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
} from '@ant-design/icons'

const Item = Toolbar.Item // tslint:disable-line
const Group = Toolbar.Group // tslint:disable-line

export default class Example extends React.Component {
  onClick = (name: string) => {
    message.success(\`\${name} clicked\`, 10)
  }

  onItemClick = () => {
    this.onClick('undo')
  }

  renderZoomDropdown() {
    const MenuItem = Menu.Item // tslint:disable-line
    const Divider = Menu.Divider // tslint:disable-line

    return (
      <Menu>
        <MenuItem name="resetView" hotkey="Cmd+H">
          Reset View
        </MenuItem>
        <MenuItem name="fitWindow" hotkey="Cmd+Shift+H">
          Fit Window
        </MenuItem>
        <Divider />
        <MenuItem name="25">25%</MenuItem>
        <MenuItem name="50">50%</MenuItem>
        <MenuItem name="75">75%</MenuItem>
        <MenuItem name="100">100%</MenuItem>
        <MenuItem name="125">125%</MenuItem>
        <MenuItem name="150">150%</MenuItem>
        <MenuItem name="200">200%</MenuItem>
        <MenuItem name="300">300%</MenuItem>
        <MenuItem name="400">400%</MenuItem>
      </Menu>
    )
  }

  render() {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ background: '#f5f5f5', paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoom"
                tooltipAsTitle={true}
                tooltip="Zoom (Alt+Mousewheel)"
                dropdown={this.renderZoomDropdown()}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 40,
                    textAlign: 'right',
                  }}
                >
                  100%
                </span>
              </Item>
            </Group>
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar extra={<span>Extra Component</span>}>
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item
                name="zoomIn"
                tooltip="Zoom In (Cmd +)"
                icon={<ZoomInOutlined />}
              />
              <Item
                name="zoomOut"
                tooltip="Zoom Out (Cmd -)"
                icon={<ZoomOutOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="undo"
                tooltip="Undo (Cmd + Z)"
                icon={<UndoOutlined />}
              />
              <Item
                name="redo"
                tooltip="Redo (Cmd + Shift + Z)"
                icon={<RedoOutlined />}
              />
            </Group>
            <Group>
              <Item
                name="delete"
                icon={<DeleteOutlined />}
                disabled={true}
                tooltip="Delete (Delete)"
              />
            </Group>
            <Group>
              <Item
                name="bold"
                icon={<BoldOutlined />}
                active={true}
                tooltip="Bold (Cmd + B)"
              />
              <Item
                name="italic"
                icon={<ItalicOutlined />}
                tooltip="Italic (Cmd + I)"
              />
              <Item
                name="strikethrough"
                icon={<StrikethroughOutlined />}
                tooltip="Strikethrough (Cmd + Shift + x)"
              />
              <Item
                name="underline"
                icon={<UnderlineOutlined />}
                tooltip="Underline (Cmd + U)"
              />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="big"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar onClick={this.onClick} extra={<span>Extra Component</span>}>
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            hoverEffect={true}
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />
            </Group>
          </Toolbar>
        </div>
        <div style={{ background: '#f5f5f5', marginTop: 24, paddingRight: 16 }}>
          <Toolbar
            size="small"
            onClick={this.onClick}
            extra={<span>Extra Component</span>}
          >
            <Group>
              <Item name="alignLeft" icon="align-left" text="Align Left" />
              <Item
                name="alignCenter"
                icon="align-center"
                text="Align Center"
              />
              <Item name="alignRight" icon="align-right" text="Align Right" />{' '}
            </Group>
          </Toolbar>
        </div>
      </div>
    )
  }
}
`,"src/index.css":`body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
`,"src/index.tsx":`import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

ReactDOM.render(<App />, document.getElementById('root'))`,"tsconfig.json":`{
  "compilerOptions": {
    "allowJs": true,
    "strict": true,
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "strictPropertyInitialization": false,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "node",
    "sourceMap": true,
    "declaration": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "noImplicitAny": true,
    "noEmitOnError": true,
    "noUnusedLocals": true,
    "strictNullChecks": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "jsx": "react",
    "target": "es5",
    "lib": [
      "dom",
      "es2015"
    ]
  },
  "include": [
    "src"
  ]
}
`}}}},120:function(b,_,t){},121:function(b,_,t){},133:function(b,_,t){"use strict";t.r(_);var x=t(0),n=t.n(x),P=t(6),S=t.n(P),k=t(8),T=t(9),D=t(11),G=t(10),Z=t(138),m=t(140),y=t(141),$=t(84),K=t(85),Q=t(54),p=t(143),E=t(144),g=t(145),f=t(146),h=t(147),R=t(148),C=t(149),U=t(150),I=t(151),e=m.a.Item,a=m.a.Group,X=function(c){Object(D.a)(l,c);var u=Object(G.a)(l);function l(){var r;Object(k.a)(this,l);for(var o=arguments.length,d=new Array(o),i=0;i<o;i++)d[i]=arguments[i];return r=u.call.apply(u,[this].concat(d)),r.onClick=function(s){Z.b.success("".concat(s," clicked"),10)},r.onItemClick=function(){r.onClick("undo")},r}return Object(T.a)(l,[{key:"renderZoomDropdown",value:function(){var o=y.a.Item,d=y.a.Divider;return n.a.createElement(y.a,null,n.a.createElement(o,{name:"resetView",hotkey:"Cmd+H"},"Reset View"),n.a.createElement(o,{name:"fitWindow",hotkey:"Cmd+Shift+H"},"Fit Window"),n.a.createElement(d,null),n.a.createElement(o,{name:"25"},"25%"),n.a.createElement(o,{name:"50"},"50%"),n.a.createElement(o,{name:"75"},"75%"),n.a.createElement(o,{name:"100"},"100%"),n.a.createElement(o,{name:"125"},"125%"),n.a.createElement(o,{name:"150"},"150%"),n.a.createElement(o,{name:"200"},"200%"),n.a.createElement(o,{name:"300"},"300%"),n.a.createElement(o,{name:"400"},"400%"))}},{key:"render",value:function(){return n.a.createElement("div",{style:{padding:24}},n.a.createElement("div",{style:{background:"#f5f5f5",paddingRight:16}},n.a.createElement(m.a,{hoverEffect:!0,size:"big",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(a,null,n.a.createElement(e,{name:"zoom",tooltipAsTitle:!0,tooltip:"Zoom (Alt+Mousewheel)",dropdown:this.renderZoomDropdown()},n.a.createElement("span",{style:{display:"inline-block",width:40,textAlign:"right"}},"100%"))),n.a.createElement(a,null,n.a.createElement(e,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:n.a.createElement(p.a,null)}),n.a.createElement(e,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:n.a.createElement(E.a,null)})),n.a.createElement(a,null,n.a.createElement(e,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:n.a.createElement(g.a,null)}),n.a.createElement(e,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:n.a.createElement(f.a,null)})),n.a.createElement(a,null,n.a.createElement(e,{name:"delete",icon:n.a.createElement(h.a,null),disabled:!0,tooltip:"Delete (Delete)"})),n.a.createElement(a,null,n.a.createElement(e,{name:"bold",icon:n.a.createElement(R.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),n.a.createElement(e,{name:"italic",icon:n.a.createElement(C.a,null),tooltip:"Italic (Cmd + I)"}),n.a.createElement(e,{name:"strikethrough",icon:n.a.createElement(U.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),n.a.createElement(e,{name:"underline",icon:n.a.createElement(I.a,null),tooltip:"Underline (Cmd + U)"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{size:"big",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(a,null,n.a.createElement(e,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:n.a.createElement(p.a,null)}),n.a.createElement(e,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:n.a.createElement(E.a,null)})),n.a.createElement(a,null,n.a.createElement(e,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:n.a.createElement(g.a,null)}),n.a.createElement(e,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:n.a.createElement(f.a,null)})),n.a.createElement(a,null,n.a.createElement(e,{name:"delete",icon:n.a.createElement(h.a,null),disabled:!0,tooltip:"Delete (Delete)"})),n.a.createElement(a,null,n.a.createElement(e,{name:"bold",icon:n.a.createElement(R.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),n.a.createElement(e,{name:"italic",icon:n.a.createElement(C.a,null),tooltip:"Italic (Cmd + I)"}),n.a.createElement(e,{name:"strikethrough",icon:n.a.createElement(U.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),n.a.createElement(e,{name:"underline",icon:n.a.createElement(I.a,null),tooltip:"Underline (Cmd + U)"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{hoverEffect:!0,onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(a,null,n.a.createElement(e,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:n.a.createElement(p.a,null)}),n.a.createElement(e,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:n.a.createElement(E.a,null)})),n.a.createElement(a,null,n.a.createElement(e,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:n.a.createElement(g.a,null)}),n.a.createElement(e,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:n.a.createElement(f.a,null)})),n.a.createElement(a,null,n.a.createElement(e,{name:"delete",icon:n.a.createElement(h.a,null),disabled:!0,tooltip:"Delete (Delete)"})),n.a.createElement(a,null,n.a.createElement(e,{name:"bold",icon:n.a.createElement(R.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),n.a.createElement(e,{name:"italic",icon:n.a.createElement(C.a,null),tooltip:"Italic (Cmd + I)"}),n.a.createElement(e,{name:"strikethrough",icon:n.a.createElement(U.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),n.a.createElement(e,{name:"underline",icon:n.a.createElement(I.a,null),tooltip:"Underline (Cmd + U)"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(a,null,n.a.createElement(e,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:n.a.createElement(p.a,null)}),n.a.createElement(e,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:n.a.createElement(E.a,null)})),n.a.createElement(a,null,n.a.createElement(e,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:n.a.createElement(g.a,null)}),n.a.createElement(e,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:n.a.createElement(f.a,null)})),n.a.createElement(a,null,n.a.createElement(e,{name:"delete",icon:n.a.createElement(h.a,null),disabled:!0,tooltip:"Delete (Delete)"})),n.a.createElement(a,null,n.a.createElement(e,{name:"bold",icon:n.a.createElement(R.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),n.a.createElement(e,{name:"italic",icon:n.a.createElement(C.a,null),tooltip:"Italic (Cmd + I)"}),n.a.createElement(e,{name:"strikethrough",icon:n.a.createElement(U.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),n.a.createElement(e,{name:"underline",icon:n.a.createElement(I.a,null),tooltip:"Underline (Cmd + U)"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{hoverEffect:!0,size:"small",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(a,null,n.a.createElement(e,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:n.a.createElement(p.a,null)}),n.a.createElement(e,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:n.a.createElement(E.a,null)})),n.a.createElement(a,null,n.a.createElement(e,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:n.a.createElement(g.a,null)}),n.a.createElement(e,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:n.a.createElement(f.a,null)})),n.a.createElement(a,null,n.a.createElement(e,{name:"delete",icon:n.a.createElement(h.a,null),disabled:!0,tooltip:"Delete (Delete)"})),n.a.createElement(a,null,n.a.createElement(e,{name:"bold",icon:n.a.createElement(R.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),n.a.createElement(e,{name:"italic",icon:n.a.createElement(C.a,null),tooltip:"Italic (Cmd + I)"}),n.a.createElement(e,{name:"strikethrough",icon:n.a.createElement(U.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),n.a.createElement(e,{name:"underline",icon:n.a.createElement(I.a,null),tooltip:"Underline (Cmd + U)"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{size:"small",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(a,null,n.a.createElement(e,{name:"zoomIn",tooltip:"Zoom In (Cmd +)",icon:n.a.createElement(p.a,null)}),n.a.createElement(e,{name:"zoomOut",tooltip:"Zoom Out (Cmd -)",icon:n.a.createElement(E.a,null)})),n.a.createElement(a,null,n.a.createElement(e,{name:"undo",tooltip:"Undo (Cmd + Z)",icon:n.a.createElement(g.a,null)}),n.a.createElement(e,{name:"redo",tooltip:"Redo (Cmd + Shift + Z)",icon:n.a.createElement(f.a,null)})),n.a.createElement(a,null,n.a.createElement(e,{name:"delete",icon:n.a.createElement(h.a,null),disabled:!0,tooltip:"Delete (Delete)"})),n.a.createElement(a,null,n.a.createElement(e,{name:"bold",icon:n.a.createElement(R.a,null),active:!0,tooltip:"Bold (Cmd + B)"}),n.a.createElement(e,{name:"italic",icon:n.a.createElement(C.a,null),tooltip:"Italic (Cmd + I)"}),n.a.createElement(e,{name:"strikethrough",icon:n.a.createElement(U.a,null),tooltip:"Strikethrough (Cmd + Shift + x)"}),n.a.createElement(e,{name:"underline",icon:n.a.createElement(I.a,null),tooltip:"Underline (Cmd + U)"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{hoverEffect:!0,size:"big",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(a,null,n.a.createElement(e,{name:"alignLeft",icon:"align-left",text:"Align Left"}),n.a.createElement(e,{name:"alignCenter",icon:"align-center",text:"Align Center"}),n.a.createElement(e,{name:"alignRight",icon:"align-right",text:"Align Right"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{size:"big",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(a,null,n.a.createElement(e,{name:"alignLeft",icon:"align-left",text:"Align Left"}),n.a.createElement(e,{name:"alignCenter",icon:"align-center",text:"Align Center"}),n.a.createElement(e,{name:"alignRight",icon:"align-right",text:"Align Right"})," "))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{hoverEffect:!0,onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(a,null,n.a.createElement(e,{name:"alignLeft",icon:"align-left",text:"Align Left"}),n.a.createElement(e,{name:"alignCenter",icon:"align-center",text:"Align Center"}),n.a.createElement(e,{name:"alignRight",icon:"align-right",text:"Align Right"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(a,null,n.a.createElement(e,{name:"alignLeft",icon:"align-left",text:"Align Left"}),n.a.createElement(e,{name:"alignCenter",icon:"align-center",text:"Align Center"}),n.a.createElement(e,{name:"alignRight",icon:"align-right",text:"Align Right"})," "))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{hoverEffect:!0,size:"small",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(a,null,n.a.createElement(e,{name:"alignLeft",icon:"align-left",text:"Align Left"}),n.a.createElement(e,{name:"alignCenter",icon:"align-center",text:"Align Center"}),n.a.createElement(e,{name:"alignRight",icon:"align-right",text:"Align Right"})))),n.a.createElement("div",{style:{background:"#f5f5f5",marginTop:24,paddingRight:16}},n.a.createElement(m.a,{size:"small",onClick:this.onClick,extra:n.a.createElement("span",null,"Extra Component")},n.a.createElement(a,null,n.a.createElement(e,{name:"alignLeft",icon:"align-left",text:"Align Left"}),n.a.createElement(e,{name:"alignCenter",icon:"align-center",text:"Align Center"}),n.a.createElement(e,{name:"alignRight",icon:"align-right",text:"Align Right"})," "))))}}]),l}(n.a.Component),w=t(152),z=t(136),B=t(153),N=t(154),j=t(155),v=t(139),H=t(69),F=t(70),q=t(120),M=t(119),V=function(){return n.a.createElement("svg",{width:"15",height:"12",viewBox:"0 0 15 12",fill:"none",xmlns:"http://www.w3.org/2000/svg"},n.a.createElement("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z",fill:"currentcolor"}))},J=function(c){Object(D.a)(l,c);var u=Object(G.a)(l);function l(){return Object(k.a)(this,l),u.apply(this,arguments)}return Object(T.a)(l,[{key:"render",value:function(){return n.a.createElement("div",{className:"demo-toolbar"},n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"重新加载",mouseEnterDelay:.5},n.a.createElement(w.a,{onClick:function(){window.location.reload()}})),window.frameElement&&n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在新窗口打开",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(window.location.href),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(z.a,{component:V}))),n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 Github 中查看",mouseEnterDelay:.5},n.a.createElement("a",{href:"".concat(M.host),rel:"noopener noreferrer",target:"_blank"},n.a.createElement(B.a,null))),n.a.createElement(v.a,{arrowPointAtCenter:!0,placement:"bottomLeft",title:"在 CodeSandbox 中打开",mouseEnterDelay:.5},n.a.createElement("form",{action:"https://codesandbox.io/api/v1/sandboxes/define",method:"POST",target:"_blank"},n.a.createElement("input",{type:"hidden",name:"parameters",value:Object(F.getParameters)(M.getCodeSandboxParams())}),n.a.createElement("button",{type:"submit"},n.a.createElement(N.a,null)))),n.a.createElement(v.a,{placement:"bottomLeft",arrowPointAtCenter:!0,title:"在 StackBlitz 中打开",mouseEnterDelay:.5},n.a.createElement(j.a,{onClick:function(){H.a.openProject(M.getStackblitzPrefillConfig(),{openFile:"src/app.tsx"})}})))}}]),l}(n.a.Component),W=t(142),nn=t(121),A=function(c){Object(D.a)(l,c);var u=Object(G.a)(l);function l(r){var o;return Object(k.a)(this,l),o=u.call(this,r),o.refContainer=function(d){o.container=d},l.restoreIframeSize(),o}return Object(T.a)(l,[{key:"componentDidMount",value:function(){var o=this;if(this.updateIframeSize(),window.ResizeObserver){var d=new window.ResizeObserver(function(){o.updateIframeSize()});d.observe(this.container)}else window.addEventListener("resize",function(){return o.updateIframeSize()});setTimeout(function(){var i=document.getElementById("loading");i&&i.parentNode&&i.parentNode.removeChild(i)},1e3)}},{key:"updateIframeSize",value:function(){var o=window.frameElement;if(o){var d=this.container.scrollHeight||this.container.clientHeight;o.style.width="100%",o.style.height="".concat(d+16,"px"),o.style.border="0",o.style.overflow="hidden",l.saveIframeSize()}}},{key:"render",value:function(){return n.a.createElement("div",{className:"demo-wrap",ref:this.refContainer},n.a.createElement(J,null),this.props.children)}}]),l}(n.a.Component);(function(c){var u=window.location.pathname,l="x6-iframe-size";function r(){var i=localStorage.getItem(l),s;if(i)try{s=JSON.parse(i)}catch(O){}else s={};return s}function o(){var i=window.frameElement;if(i){var s=i.style,O={width:s.width,height:s.height},L=r();L[u]=O,localStorage.setItem(l,JSON.stringify(L))}}c.saveIframeSize=o;function d(){var i=window.frameElement;if(i){var s=r(),O=s[u];O&&(i.style.width=O.width||"100%",i.style.height=O.height||"auto")}}c.restoreIframeSize=d})(A||(A={}));var en=t(122),Y=function(u){var l=u.children;return n.a.createElement(W.a.ErrorBoundary,null,n.a.createElement(A,null,l))};S.a.render(n.a.createElement(Y,null,n.a.createElement(X,null)),document.getElementById("root"))},79:function(b,_,t){b.exports=t(133)}},[[79,1,2]]]);
