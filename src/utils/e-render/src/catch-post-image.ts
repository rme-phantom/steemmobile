import { proxifyImageSrc } from './proxify-image-src'
import { markdown2Html } from './markdown-2-html'
import { createDoc, makeEntryCacheKey } from './helper'
import { cacheGet, cacheSet } from './cache'
import { Entry } from './types'

function getImage(entry: Entry, width = 0, height = 0, format = 'match'): string | null {
  /*
  * Return from json metadata if exists
  * */
  let meta: Entry['json_metadata'] | null

  if (typeof entry.json_metadata === 'object') {
    meta = entry.json_metadata
  } else {
    try {
      meta = JSON.parse(entry.json_metadata as string)
    } catch (e) {
      meta = null
    }
  }

  if (meta && meta.image && !!meta.image.length && meta.image[0]) {
    return proxifyImageSrc(meta.image[0], width, height, format)
  }

  // try to find first image from post body
  const html = markdown2Html(entry)
  const doc = createDoc(html)
  if (!doc) {
    return null
  }

  const imgEls = doc.getElementsByTagName('img')
  if (imgEls.length >= 1) {
    const src = imgEls[0].getAttribute('src')
    return proxifyImageSrc(src, width, height, format)
  }

  return null
}

export function catchPostImage(obj: Entry | string, width = 0, height = 0, format = 'match'): string {
  if (typeof obj === 'string') {
    return getImage(obj as any, width, height, format)
  }
  const key = `${makeEntryCacheKey(obj)}-${width}x${height}-${format}`

  const item = cacheGet<string>(key)
  if (item) {
    return item
  }

  const res = getImage(obj, width, height, format)
  cacheSet(key, res)

  return res
}

