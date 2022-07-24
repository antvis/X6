export const Config = {
  prefixCls: 'x6',
  autoInsertCSS: true,
  useCSSSelector: true,

  prefix(suffix: string) {
    return `${Config.prefixCls}-${suffix}`
  },
}
