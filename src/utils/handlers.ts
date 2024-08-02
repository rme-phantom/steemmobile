import { AppGlobals } from '../constants/AppGlobals';
import { AppStrings } from '../constants/AppStrings';
import {
  logoutHandler,
  saveLoginHandler,
} from '../redux/reducers/LoginReducer';
import { removeItemFromStorage, setItemToStorage, setSettings } from './realm';

export const saveLoginInfo = (
  dispatch,
  data: AccountExt | undefined,
  isLogout?: boolean,
): boolean | undefined => {
  let result;
  if (isLogout) {
    result = removeItemFromStorage(AppStrings.CURRENT_USER_SCHEMA);
    dispatch(logoutHandler());
    AppGlobals.PIN_CODE = '';
    setSettings({ pinEnabled: false }, dispatch);
  } else {
    if (data) {
      data.login = true;
      result = setItemToStorage(AppStrings.CURRENT_USER_SCHEMA, data);
      dispatch(saveLoginHandler(data));
    }
  }

  return result;
};
