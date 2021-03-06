import { insertUserEmoji } from './insert_user_emoji'

const onMutation: MutationCallback = (mutation) => {
  mutation.map((dom) => handleNodeList(dom.addedNodes))
}
const observer = new MutationObserver(onMutation)
const configure = {
  childList: true
}

const handleNodeList = (nodelist: NodeList) => {
  for (const node of nodelist) {
    insertUserEmoji(node as Element)
  }
}

const timelines = document.querySelectorAll('.item-list')
for (const timeline of timelines) {
  observer.observe(timeline, configure)
}
