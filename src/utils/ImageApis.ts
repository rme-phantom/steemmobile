import {Platform} from 'react-native';
import {AppStrings} from '../constants/AppStrings';
import {proxifyImageSrc} from './e-render/src';

const whatOs = Platform.OS;
const BASE_IMAGE_URL = AppStrings.IMAGER_SERVER;

// get the image from meta data
export const catchImageFromMetadata = (
  meta,
  format = 'match',
  thumbnail = false,
) => {
  format = whatOs === 'android' ? 'webp' : 'match';
  meta = JSON.parse(meta);
  if (meta && meta.image) {
    const images = meta.image;
    // console.log('images : ',images);

    if (thumbnail) {
      return proxifyImageSrc(images[0], 6, 5, format);
    }
    return proxifyImageSrc(images[0], 600, 500, format);
  }
  return null;
};

export const getResizedImage = (url, size = 600, format = 'match') => {
  //TODO: implement fallback onError, for imagehoster is down case
  format = whatOs === 'android' ? 'webp' : 'match';
  if (!url) {
    return '';
  }
  return proxifyImageSrc(url, size, 0, format);
};

export const getResizedAvatar = (author: string, sizeString = 'small') => {
  if (!author) {
    return '';
  }
  // author = author.replace('@', '').toLowerCase().trim();
  return `${BASE_IMAGE_URL}/u/${author}/avatar/${sizeString}`;
};

export const getCoverImageUrl = (meta: any) => {
  if (!meta) {
    return null;
  }
  try {
    if (typeof meta === 'string') meta = JSON.parse(meta);
    return meta.profile.cover_image;
  } catch (err) {
    return null;
  }
};


export const getPostThumbnail = (json_images: string) => {
  if (!json_images) {
    return null;
  }

  try {
    const metadata: string[] = JSON.parse(json_images);
    if (metadata.length <= 0) {
      return null;
    }
    const thumbnail = metadata[0];
    return getResizedImage(thumbnail);
  } catch (error) {
    // console.error('Failed to get post thumbnail:', error);
    return null;
  }
};
