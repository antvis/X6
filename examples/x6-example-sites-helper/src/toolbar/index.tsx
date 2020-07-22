import React from 'react'
import {
  SelectOutlined,
  ReloadOutlined,
  GithubOutlined,
  CodeSandboxOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { Tooltip } from 'antd'
import 'antd/dist/antd.css'
import stackblitzSdk from '@stackblitz/sdk'
import { getParameters } from 'codesandbox/lib/api/define'
const repo = require('../../loaders/repo.js!./data.js')
import './index.css'

export class Toolbar extends React.Component {
  render() {
    return (
      <div className="demo-toolbar">
        <Tooltip
          placement="bottomLeft"
          arrowPointAtCenter={true}
          title="重新加载"
          mouseEnterDelay={0.5}
        >
          <ReloadOutlined
            onClick={() => {
              window.location.reload()
            }}
          />
        </Tooltip>

        {window.frameElement && (
          <Tooltip
            placement="bottomLeft"
            arrowPointAtCenter={true}
            title="在新窗口打开"
            mouseEnterDelay={0.5}
          >
            <a
              href={`${window.location.href}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <SelectOutlined />
            </a>
          </Tooltip>
        )}

        <Tooltip
          placement="bottomLeft"
          arrowPointAtCenter={true}
          title="在 Github 中查看"
          mouseEnterDelay={0.5}
        >
          <a href={`${repo.host}`} rel="noopener noreferrer" target="_blank">
            <GithubOutlined />
          </a>
        </Tooltip>

        <Tooltip
          arrowPointAtCenter={true}
          placement="bottomLeft"
          title="在 CodeSandbox 中打开"
          mouseEnterDelay={0.5}
        >
          <form
            action="https://codesandbox.io/api/v1/sandboxes/define"
            method="POST"
            target="_blank"
          >
            <input
              type="hidden"
              name="parameters"
              value={getParameters(repo.getCodeSandboxParams())}
            />
            <button type="submit">
              <CodeSandboxOutlined />
            </button>
          </form>
        </Tooltip>

        <Tooltip
          placement="bottomLeft"
          arrowPointAtCenter={true}
          title="在 StackBlitz 中打开"
          mouseEnterDelay={0.5}
        >
          <ThunderboltOutlined
            onClick={() => {
              stackblitzSdk.openProject(repo.getStackblitzPrefillConfig(), {
                openFile: 'src/app.tsx',
              })
            }}
          />
        </Tooltip>
      </div>
    )
  }
}
