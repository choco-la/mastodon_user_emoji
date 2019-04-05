import { getAccounts, nameToID } from './API'
import { replaceContent } from './replace_content'

const ICON_STYLE: { height: string, width: string } = {
  height: '1.2em',
  width: '1.2em'
}

const userIconRegex = /:@([a-zA-Z0-9_]+):/g
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

const replaceContentParagraph = async (content: HTMLParagraphElement) => {
  const matches = content.innerText.match(userIconRegex)
  let html = content.innerHTML
  if (!matches) return html
  for (const match of matches) {
    const screenName = match.slice(2, -1)
    html = await replaceUserEmoji(html, screenName)
  }
  return html
}

export const insertUserEmoji: (element: Element) => void = async (element) => {
  const content = element.querySelector('p')
  if (content) {
    content.innerHTML = await replaceContentParagraph(content)
  }
}
