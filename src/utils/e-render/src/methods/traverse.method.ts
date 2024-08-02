import { a } from './a.method'
import { iframe } from './iframe.method'
import { img } from './img.method'
import { text } from './text.method'

export function traverse(node: Node, forApp: boolean, depth = 0, webp = false): void {
  if (!node || !node.childNodes) {
    return
  }

  Array.from(Array(node.childNodes.length).keys())
    .map(i => node.childNodes[i])
    .forEach(child => {
      if (child.nodeName.toLowerCase() === 'a') {
        a(<HTMLElement>child, forApp, webp)
      }
      if (child.nodeName.toLowerCase() === 'iframe') {
        iframe(<HTMLElement>child)
      }
      if (child.nodeName === '#text') {
        text(<HTMLElement>child, forApp, webp)
      }
      if (child.nodeName.toLowerCase() === 'img') {
        img(<HTMLElement>child, webp)
      }

      traverse(child, forApp, depth + 1, webp)
    })
}
