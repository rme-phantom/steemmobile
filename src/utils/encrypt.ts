import CryptoJS from 'crypto-js';
const STAMP = '995a06d5-ee54-407f-bb8e-e4af2ab2fe01';
import md5 from 'md5';
import Config from 'react-native-config';
export const ConvertExpress = require('amrhextotext');

// AES implementation using cryptojs


const SECRET_KEY = Config.REACT_APP_ENC_KEY;


// We add an md5 hash to check if decryption is successful later on.
export const encryptJson = (json, pwd) => {
  json.hash = md5(json.list);
  var msg = encryptKey(JSON.stringify(json), pwd);
  return msg;
};

// Decrypt and check the hash to confirm the decryption
export const decryptToJson = (msg, pwd) => {
  try {
    var decrypted = decryptKey(msg, pwd, () => {
      return null;
    }).toString(CryptoJS.enc.Utf8);
    decrypted = JSON.parse(decrypted);
    if (decrypted.hash != null && decrypted.hash === md5(decrypted.list))
      return decrypted;
    else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

export const encryptKey = (data, key) => {
  // console.log('encrypting: ', data, key);
  const stampedData = getStampedData(data);
  const encJson = CryptoJS.AES.encrypt(JSON.stringify(stampedData), key).toString();
  const encData = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));
  // console.log('returning: ', encData);
  return encData;
};

export const decryptKey = (data, key, onError) => {
  const legacyDecrypt = () => decryptKeyLegacy(data, key, onError);

  try {
    const response = decryptKeyNew(data, key);
    return response;
  } catch (err) {
    console.warn('decryption with new method failed, trying legacy', err);
    return legacyDecrypt();
  }
};


const decryptKeyNew = (data, key) => {
  // console.log('decrypting new: ', data, key);
  const decData = CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
  const bytes = CryptoJS.AES.decrypt(decData, key).toString(CryptoJS.enc.Utf8);
  const stampedData = JSON.parse(bytes);
  const ret = processStampedData(stampedData);
  // console.log('returning: ', ret);
  return ret;
};

const decryptKeyLegacy = (data, key, onError) => {
  try {
    // console.log('decrypting legacy ', data, key);
    const ret = CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
    // console.log('returning: ', ret);
    return ret;
  } catch (err) {
    console.warn('decryption with legacy failed as well');
    if (onError) {
      onError(err);
    }
  }
};


// stamping mechanism will help distinguish old legacy data and new encrypted data
// second purpose is to avoid necrypting empty strings
const getStampedData = (data) => {
  return {
    data,
    stamp: STAMP,
  };
};


const processStampedData = (stampedData) => {
  if (stampedData.hasOwnProperty('stamp') && stampedData.stamp == STAMP) {
    return stampedData.data;
  }
  throw new Error('Possibly un-stamped legacy data');
};


export const HexToJson = (data: string) => {
  if (data) return JSON.parse(ConvertExpress.hexToUtf8(data));
  else return null;
};

export const JsonToHex = (data: any) => {
  if (data) return ConvertExpress.textToHex(JSON.stringify(data));
  else return null;
};

export function Encrypt(data: any, isJson: boolean = false) {
  var encryptedDataHexStr = encryptKey(data, SECRET_KEY);
  return encryptedDataHexStr;
}

export function Decrypt(data: any, toJson: boolean = false) {
  try {

    let decryptText = decryptKey(data, SECRET_KEY, undefined);
    return toJson ? JSON.parse(decryptText) : decryptText;
  } catch {
    return null;
  }
}
