const PARSER = new DOMParser()

export const replaceContent = (originHTML: string, newHTML: string, screenName: string, _origin?: string): string => {
  if (!_origin) _origin = window.origin
  const space = String.raw`[\s\t]*`
  const prefix = String.raw`:${space}<span class="h-card">${space}<a href="${_origin}/@${screenName}`
  const middle0 = String.raw`" class="u-url mention status-link" title="${screenName}`
  const middle1 = String.raw`" target="_blank" rel="noopener">@<span>${screenName}`
  const suffix = String.raw`</span>${space}</a>${space}</span>${space}:`

  const pattern = `${prefix}${middle0}${middle1}${suffix}`
  const re = new RegExp(pattern, 'iu')

  console.debug('parse')
  const dom = PARSER.parseFromString(originHTML, 'text/html')
  console.debug(dom)
  return dom.body.innerHTML.replace(re, newHTML)
}