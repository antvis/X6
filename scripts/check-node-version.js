#!/usr/bin/env node

/**
 * 检查 Node.js 版本是否满足要求
 * 要求 Node.js 版本 >= 20.0.0
 */

const currentNodeVersion = process.versions.node
const semver = currentNodeVersion.split('.')
const major = parseInt(semver[0], 10)

const REQUIRED_NODE_VERSION = 20

if (major < REQUIRED_NODE_VERSION) {
  console.error(
    '\x1b[31m%s\x1b[0m',
    `你当前使用的 Node.js 版本为 ${currentNodeVersion}。\n` +
      `请升级 Node.js 版本 >= ${REQUIRED_NODE_VERSION}.0.0。\n` +
      `推荐使用 nvm 管理 Node.js 版本：\n` +
      `- 安装 nvm: https://github.com/nvm-sh/nvm\n` +
      `- 安装并使用 Node.js v${REQUIRED_NODE_VERSION}: nvm install ${REQUIRED_NODE_VERSION} && nvm use ${REQUIRED_NODE_VERSION}\n`,
  )
  process.exit(1)
}
