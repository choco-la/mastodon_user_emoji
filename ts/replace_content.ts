const PARSER = new DOMParser()

export const generateContentPattern = (screenName: string, _origin?: string) => {
  if (!_origin) _origin = window.origin

  const space = String.raw`[\s\t]*`
  const prefix = String.raw`:${space}<span class="h-card">${space}<a href="${_origin}/@${screenName}`
  const middle0 = String.raw`" class="u-url mention status-link" title="${screenName}`
  const middle1 = String.raw`" target="_blank" rel="noopener">@<span>${screenName}`
  const suffix = String.raw`</span>${space}</a>${space}</span>${space}:`

  const pattern = `${prefix}${middle0}${middle1}${suffix}`
  return pattern
}

export const replaceContent = (originHTML: string, newHTML: string, regex: RegExp): string => {
  const dom = PARSER.parseFromString(originHTML, 'text/html')
  return dom.body.innerHTML.replace(regex, newHTML)
}
