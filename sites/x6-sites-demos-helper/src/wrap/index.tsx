import React, { PropsWithChildren } from 'react'
import { Alert } from 'antd'
import { Helmet } from 'react-helmet'
import { Content } from './content'
import 'antd/es/alert/style/index.css'

export const Wrap: React.FC<PropsWithChildren> = ({ children }) => (
  <Alert.ErrorBoundary>
    {process.env.NODE_ENV !== 'development' && (
      <Helmet>
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link
          rel="apple-touch-icon"
          sizes="48x48"
          href="/icons/icon-48x48.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/icons/icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="96x96"
          href="/icons/icon-96x96.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/icons/icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="256x256"
          href="/icons/icon-256x256.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="384x384"
          href="/icons/icon-384x384.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/icons/icon-512x512.png"
        />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
      </Helmet>
    )}

    <Content>{children}</Content>
  </Alert.ErrorBoundary>
)
