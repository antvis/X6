import React from 'react'
import ReactDOM from 'react-dom'
import { Modal, ConfigProvider } from 'antd'
import { ModalFuncProps, ModalProps } from 'antd/es/modal'
import { isPromise } from '@/common/utils'
import { ANT_PREFIX } from '@/constants/global'

type ShowProps = ModalProps & {
  afterClose?: (...args: any[]) => void
  children: React.ReactNode
}

export const showModal = (props: ShowProps) => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  let config: ShowProps = {
    ...props,
    visible: true,
    onCancel: close,
    onOk: (e) => {
      if (typeof props.onOk === 'function') {
        const ret = props.onOk(e)
        if (isPromise(ret as any)) {
          ;(ret as any).then(() => {
            close()
          })
        }
      } else {
        close()
      }
    },
  }

  function destroy(...args: any[]) {
    const unmountResult = ReactDOM.unmountComponentAtNode(div)
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div)
    }
    if (typeof props.afterClose === 'function') {
      props.afterClose(...args)
    }
  }

  function update(newConfig: ModalFuncProps) {
    config = {
      ...config,
      ...newConfig,
    }
    render(config)
  }

  function close(...args: any[]) {
    const nextConfig = {
      ...config,
      visible: false,
      afterClose: destroy.bind(undefined, ...args),
    }
    update(nextConfig)
  }

  function render(usedConfig: ModalProps & { children: React.ReactNode }) {
    const { children, ...others } = usedConfig
    setTimeout(() => {
      ReactDOM.render(
        <ConfigProvider prefixCls={ANT_PREFIX}>
          <Modal {...others}>{children}</Modal>
        </ConfigProvider>,
        div,
      )
    }, 0)
  }

  render(config)

  return {
    close,
    update,
  }
}
