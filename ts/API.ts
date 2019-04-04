interface IFullfilledResponse extends XMLHttpRequest {
  response: string
}
interface IAccount {
  avatar: string
}

const PARSER = new DOMParser()
const baseName = (path: string) => path.split('/').slice(-1)[0]

const TOKEN = (() => {
  const initStateNode = document.getElementById('initial-state')
  if (!initStateNode || !initStateNode.textContent) throw new Error('cannot get initial-state')
  const initState = JSON.parse(initStateNode.textContent)

  const meta = initState.meta
  return meta.access_token
})()

const getAccountPage = (displayName: string): Promise<IFullfilledResponse> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `${window.origin}/@${displayName}`)

    xhr.onloadend = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr as IFullfilledResponse)
      } else {
        reject(xhr)
      }
    }

    xhr.onerror = () => {
      reject(xhr)
    }

    xhr.send()
  })
}

export const nameToID = async (screenName: string) => {
  const response = await getAccountPage(screenName)
  const responseHTML = PARSER.parseFromString(response.response, 'text/html')
  const links = responseHTML.querySelectorAll('link')
  for (const link of links) {
    if (link.getAttribute('rel') === 'salmon') {
      const href = link.getAttribute('href')
      if (!href) throw new Error('ref is null or undefined')
      return baseName(href)
    }
  }
  throw new Error()
}

export const getAccounts = (userNumber: string): Promise<IAccount> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', `${window.origin}/api/v1/accounts/${userNumber}`)
    xhr.setRequestHeader('Authorization', `Bearer ${TOKEN}`)
    xhr.responseType = 'json'
    xhr.withCredentials = true

    xhr.onloadend = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response)
      } else {
        reject(xhr)
      }
    }

    xhr.onerror = () => {
      reject(xhr)
    }

    xhr.send()
  })
}
