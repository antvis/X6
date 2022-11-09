#!/usr/bin/env node

if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    `This repository requires using pnpm as the package manager for scripts to work properly.`,
  )
  process.exit(1)
}
