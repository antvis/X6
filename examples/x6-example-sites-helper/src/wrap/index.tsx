import React from 'react'
import { Alert } from 'antd'
import { Content } from './content'
import 'antd/es/alert/style/index.css'

export const Wrap: React.FC = () => (
  <Alert.ErrorBoundary>
    <Content />
  </Alert.ErrorBoundary>
)
