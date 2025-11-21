/**
 * 将驼峰命名字符串转换为短横线命名（kebab-case）
 * @example
 * kebabCase('fontSize') // 'font-size'
 * kebabCase('backgroundColor') // 'background-color'
 * kebabCase('-moz-transform') // 'moz-transform'
 */
export const kebabCase = (str: string): string => {
  // 处理空字符串场景
  if (typeof str !== 'string' || str.length === 0) {
    return ''
  }
  // 核心转换逻辑：
  // 1. 匹配大写字母，在前面插入短横线
  // 2. 移除开头可能出现的短横线
  // 3. 统一转换为小写
  const convertedRes = str
    .replace(/([A-Z])/g, '-$1') // 大写字母前加短横线
    .replace(/^-/, '') // 移除开头可能出现的短横线
    .toLowerCase() // 全小写转换

  return convertedRes
}
