import multihash from 'multihashes';
import querystring from 'querystring';
import {AppStrings} from '../../../constants/AppStrings';

let proxyBase = AppStrings.IMAGER_SERVER;

export const setProxyBase = (p: string): void => {
  proxyBase = p;
};

export const extractPHash = (url: string): string | null => {
  if (url.startsWith(`${proxyBase}/p/`)) {
    const [hash] = url.split('/p/')[1].split('?');
    return hash.replace(/.webp/, '').replace(/.png/, '');
  }
  return null;
};

export const getLatestUrl = (str: string): string => {
  const [last] = [
    ...str
      .replace(/https?:\/\//g, '\n$&')
      ?.trim()
      .split('\n'),
  ].reverse();
  return last;
};

export const proxifyImageSrc = (
  url?: string,
  width = 0,
  height = 0,
  format = 'match',
) => {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // skip images already proxified with images.hive.blog
  if (
    url.indexOf('https://steemitimages.com/') === 0 &&
    url.indexOf('https://steemitimages.com/D') !== 0
  ) {
    return url.replace('https://images.hive.blog', proxyBase);
  }

  // if (url.indexOf('https://steemitimages.com/') === 0 && url.indexOf('https://steemitimages.com/D') !== 0) {
  //   return url.replace('https://steemitimages.com', proxyBase)
  // }

  const realUrl = getLatestUrl(url);
  const pHash = extractPHash(realUrl);

  const options: Record<string, string | number> = {
    format,
    mode: 'fit',
  };
  if (realUrl.includes('.gif')) options.format = 'match';
  else options.width = width ?? 640;

  if (height > 0) {
    options.height = height;
  }
  const qs = querystring.stringify(options);

  if (pHash) {
    return `${proxyBase}/p/${pHash}${
      format === 'webp' ? '.webp' : '.png'
    }?${qs}`.replace('width=0', `width=${width ?? 640}`);
  }

  const buffer = require('buffer').Buffer;
  const b58url = multihash.toB58String(buffer.from(realUrl.toString()));

  return `${proxyBase}/p/${b58url}${format === 'webp' ? '' : ''}?${qs}`.replace(
    'width=0',
    `width=${width ?? 640}`,
  );
};
