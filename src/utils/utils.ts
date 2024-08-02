import {SheetManager} from 'react-native-actions-sheet';
import {translate} from '@vitalets/google-translate-api';
import {getSettings} from './realm';
import VersionNumber from 'react-native-version-number';
import {AppConstants} from '../constants/AppConstants';

export const validateTags = (tags: any[]): string | null => {
  let warning = null;
  function setWarning(text) {
    warning = text;
  }

  if (tags.length > 8) {
    setWarning('Please use only 8 tags');
    return warning;
  }
  tags.find(c => c.length > 24)
    ? setWarning('Maximum length of each tag should be 24')
    : tags.find(c => c.split('-').length > 2)
    ? setWarning('Use one dash in each tag')
    : tags.find(c => c.indexOf(',') >= 0)
    ? setWarning('Use space to separate tags')
    : tags.find(c => /[A-Z]/.test(c))
    ? setWarning('Only use lower letters in tag')
    : tags.find(c => !/^[a-z0-9-#]+$/.test(c))
    ? setWarning('Use only lowercase letters, digits and one dash')
    : tags.find(c => !/[a-z0-9]$/.test(c))
    ? setWarning('Tag must end with letter or number')
    : tags.find(c => /[0-9]/.test(c[0]))
    ? setWarning('Tag must start with a letter')
    : setWarning(null);

  return warning;
};

export const countWords = (entry: string) => {
  const cjkEntry = new RegExp('[\u4E00-\u9FFF]', 'g');
  entry = entry.replace(cjkEntry, ' {CJK} ');
  const splitEntry: any = entry?.trim().split(/\s+/);
  const cjkCount = splitEntry.filter((e: string) => e === '{CJK}');
  const count: any = splitEntry.includes('{CJK}')
    ? cjkCount.length
    : splitEntry.length;
  return entry ? count : 0;
};

export function isFloatOrInt(str: string): boolean {
  const regex = /^-?\d+(\.\d+)?$/;
  return regex.test(str);
}

export const openActionSheet = (sheet_id: string, payload = undefined) => {
  if (!SheetManager.get(sheet_id))
    SheetManager.show(sheet_id, {
      payload: payload,
    });
};

export const closeActionSheet = (sheet_id: string, payload = undefined) => {
  SheetManager.hide(sheet_id, {
    payload: payload,
  });
};

export function abbreviateNumber(number: number, floatFixes = 0): string {
  var SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];

  // what tier? (determines SI symbol)
  var tier = (Math.log10(Math.abs(number)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier === 0 || tier === -1) return number?.toFixed(floatFixes);

  // get suffix and determine scale
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);

  // scale the number
  var scaled = number / scale;

  // format number and add suffix
  return scaled.toFixed(floatFixes) + suffix;
}

type QueryKeyTypes =
  | 'feed'
  | 'account'
  | 'profile'
  | 'wallet'
  | 'reply'
  | 'search';

export const MakeQueryKey = (
  api: string,
  type: QueryKeyTypes,
  account: string | undefined,
  field?: string,
): string => {
  let key: string;
  if (field) {
    key = `${api}-${type}-${field}`;
  } else key = `${api}-${type}-${account || ''}`;
  return key;
};

export const TranslateText = async (text: string): Promise<string> => {
  const settings = getSettings();
  return new Promise((resolve, reject) => {
    AppConstants.SHOW_TOAST('Translating...');
    translate(text, {to: settings!.languageTo.code})
      .then(result => {
        resolve(result.text);
      })
      .catch(err => {
        AppConstants.SHOW_TOAST('Failed', String(err), 'error');

        reject(err);
      });
  });
};

export const DetectPromotionText = (body: string): boolean => {
  if (!body) return false;
  const regex = /posted using \[steemmobile/;
  if (regex.test(body?.toLowerCase())) {
    return true;
  } else {
    return false;
  }
};

export const getAppVersionString = () => {
  return `steem-mobile/${VersionNumber.appVersion}`;
};

export function unionAndSort(arr1: string[], arr2: string[]): string[] {
  // Merge the two arrays using the spread operator
  const mergedArray = [...arr1, ...arr2];

  // Sort the merged array alphabetically
  const sortedArray = mergedArray.sort((a, b) => a.localeCompare(b));

  // Remove duplicates using a Set
  const uniqueArray = Array.from(new Set(sortedArray));

  return uniqueArray;
}
export function getUniqueItems<T>(list: string[]): string[] {
  if (!list) return [];
  return Array.from(new Set(list));
}
