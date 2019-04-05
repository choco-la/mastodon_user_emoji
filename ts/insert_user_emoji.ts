import { getAccounts, nameToID } from './API'
import { replaceContent } from './replace_content'

const ICON_STYLE: { height: string, width: string } = {
  height: '1.2em',
  width: '1.2em'
}

const userIconRegex = /:@([a-zA-Z0-9_]+):/
const getUserIconURL = async (screenName: string): Promise<string> => {
  const accountNumber = await nameToID(screenName)
  const accounts = await getAccounts(accountNumber)
  return accounts.avatar
}

const replaceUserEmoji = async (innerHTML: string, screenName: string): Promise<string> => {
  const userIconSrc = await getUserIconURL(screenName)
  const iconHTMLStrings = `<img src="${userIconSrc}" style='height: ${ICON_STYLE.height}; width: ${ICON_STYLE.width};'>`
  return replaceContent(innerHTML, iconHTMLStrings, screenName)
}

const sliceWith = (text: string, length: number, separator: string): string => {
  return text.split(separator).slice(1).join(separator)
}

const replaceContentParagraph = async (content: HTMLParagraphElement) => {
  const execCount = content.querySelectorAll('.h-card').length
  let html = content.innerHTML
  let text = content.innerText
  for (let i = 0; i < execCount; i++) {
    const match = userIconRegex.exec(text)
    if (!match) continue
    const screenName = match[1]
    html = await replaceUserEmoji(html, screenName)
    text = sliceWith(text, 1, screenName)
  }
  return html
}

export const insertUserEmoji: (element: Element) => void = async (element) => {
  const content = element.querySelector('p')
  if (content) {
    content.innerHTML = await replaceContentParagraph(content)
  }
}
