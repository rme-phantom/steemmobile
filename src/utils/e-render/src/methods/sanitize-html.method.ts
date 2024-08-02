import xss from 'xss'
import { ALLOWED_ATTRIBUTES } from '../consts'

export function sanitizeHtml(html: string): string {
  return xss(html, {
    whiteList: ALLOWED_ATTRIBUTES,
    stripIgnoreTag: true, // filter out all HTML not in the whitelist
    css: true,
    stripIgnoreTagBody: ['style'],
    onTagAttr: (tag, name, value) => {
      if (tag === 'span' && name === 'class' && value === 'wr') {
        return ''
      }
      if (tag === 'img' && name === 'src' && !/^https?:\/\//.test(value)) {
        return ''
      }
    }
  })
}
