export const Config = {
  prefixCls: 'x6',
  autoInsertCSS: true,
  useCSSSelector: true,
  trackable: false,
  trackInfo: {},

  /**
   * Turn on/off collect information of user client.
   *
   * In order to serve the users better, x6 will send the URL and version
   * information back to the AntV server:https://kcart.alipay.com/web/bi.do
   *
   * Except for URL and G2 version information, no other information will
   * be collected.
   *
   * @param enabled Specifies if seed client information to AntV server.
   */
  track(enabled: boolean) {
    Config.trackable = enabled
  },
}
