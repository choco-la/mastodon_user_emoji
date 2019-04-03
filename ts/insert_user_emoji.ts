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

export const insertUserEmoji: (content: HTMLElement) => void = (content) => {
  const execCount = content.querySelectorAll('.h-card').length

  for (let i = 0; i < execCount; i++) {
    const match = userIconRegex.exec(content.innerText)
    if (!match) continue
    replaceUserEmoji(content.innerHTML, match[1]).then((innerHTML) => content.innerHTML = innerHTML)
  }
}
