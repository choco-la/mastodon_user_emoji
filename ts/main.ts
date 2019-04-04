import { insertUserEmoji } from './insert_user_emoji'

const LOCAL_TIMELINE = document.getElementsByClassName('item-list')[0]

const onMutation: MutationCallback = (mutation) => {
  mutation.map((dom) => handleNodeList(dom.addedNodes))
}
const observer = new MutationObserver(onMutation)
const configure = {
  childList: true
}

const handleNodeList = (nodelist: NodeList) => {
  for (const node of nodelist) {
    const content = (node as HTMLElement).querySelector('p')
    if (content) {
      insertUserEmoji(content)
    }
  }
}

observer.observe(LOCAL_TIMELINE, configure)
