import {DOMParser} from './consts';

export function createDoc(html: string): Document | null {
  if (html?.trim() === '') {
    return null;
  }

  const doc = DOMParser.parseFromString(html, 'text/html');

  return doc;
}

export function makeEntryCacheKey(entry: any): string {
  return `${entry?.author}-${entry?.permlink}-${entry?.last_update}-${entry?.updated}`;
}

export function extractYtStartTime(url: string): string {
  try {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    if (params.has('t')) {
      return '' + parseInt(params.get('t')); //parsing is important as sometimes t is famated '123s';
    } else if (params.has('start')) {
      return params.get('start');
    }
  } catch (error) {
    return '';
  }
}
