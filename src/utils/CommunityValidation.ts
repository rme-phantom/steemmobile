import {isNumber} from 'lodash';

export const isAccountCommunity = text => {
  return (
    /^hive-[1-3]\d{4,6}$/.test(text) && isNumber(Number(text.split('-')[1]))
  );
};
