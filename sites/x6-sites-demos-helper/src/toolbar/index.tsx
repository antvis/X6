import React from 'react'
import Icon, {
  ReloadOutlined,
  GithubOutlined,
  CodeSandboxOutlined,
} from '@ant-design/icons'
import { Tooltip } from 'antd'
import 'antd/dist/antd.css'
// import stackblitzSdk from '@stackblitz/sdk'
import { getParameters } from 'codesandbox/lib/api/define'
import './index.css'

// eslint-disable-next-line
const repo = require('../../loaders/repo.js!./data.js')

const iconOpenInNewWindow: React.FC = () => (
  <svg
    width="15"
    height="12"
    viewBox="0 0 15 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.4545 0H10.5C10.1988 0 10 0.198754 10 0.5C10 0.801246 10.1988 1 10.5 1H13L9.5 4.5L10.5 5.5L14 2V4.5C14 4.80125 14.1988 5 14.5 5C14.8012 5 15 4.80125 15 4.5V0.545455C15 0.244208 14.7558 0 14.4545 0ZM1.73333 1H8.00001V1.86667H1.73333C1.25469 1.86667 0.866667 2.25469 0.866667 2.73333V9.32003C0.866667 9.79868 1.25469 10.1867 1.73333 10.1867H12.1333C12.612 10.1867 13 9.79868 13 9.32004V7.00003H13.8667V9.32004C13.8667 10.2773 13.0906 11.0534 12.1333 11.0534H1.73333C0.776041 11.0534 0 10.2773 0 9.32003V2.73333C0 1.77604 0.77604 1 1.73333 1Z"
      fill="currentcolor"
    />
  </svg>
)

// eslint-disable-next-line react/prefer-stateless-function
export class Toolbar extends React.Component {
  render() {
    return (
      <div className="demo-toolbar">
        <Tooltip
          placement="bottomLeft"
          arrowPointAtCenter
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
            arrowPointAtCenter
            title="在新窗口打开"
            mouseEnterDelay={0.5}
          >
            <a
              href={`${window.location.href}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon component={iconOpenInNewWindow} />
            </a>
          </Tooltip>
        )}

        <Tooltip
          placement="bottomLeft"
          arrowPointAtCenter
          title="在 Github 中查看"
          mouseEnterDelay={0.5}
        >
          <a href={`${repo.host}`} rel="noopener noreferrer" target="_blank">
            <GithubOutlined />
          </a>
        </Tooltip>

        <Tooltip
          arrowPointAtCenter
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

        {/* <Tooltip
          placement="bottomLeft"
          arrowPointAtCenter
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
        </Tooltip> */}
      </div>
    )
  }
}
