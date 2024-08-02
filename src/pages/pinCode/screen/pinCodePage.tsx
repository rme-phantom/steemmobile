import React, {useEffect} from 'react';
import PinCodeContainer from '../container/pinCodeContainer';
import {useAppSelector} from '../../../constants/AppFunctions';
import {delay} from '../../../utils/editor';
import {AppColors} from '../../../constants/AppColors';

const PinCodePage = ({route, navigation}) => {
  const hideCloseButton = route.params
    ? route.params.hideCloseButton ?? false
    : true;
  const settings = useAppSelector(state => state.settingsReducer.value);

  // useEffect(() => {
  //     const backEventSub = BackHandler.addEventListener('hardwareBackPress', _handleBackPress);

  //     return () => {
  //         if (backEventSub) {
  //             backEventSub.remove();
  //         }
  //     };
  // }, [navigation]);

  // const _handleBackPress = () => !!hideCloseButton;

  const _renderStatusBar = async () => {
    await delay(800);

  };
  useEffect(() => {
    _renderStatusBar();
  }, []);

  return (
    <PinCodeContainer
      navigation={navigation}
      hideCloseButton={hideCloseButton}
      pinCodeParams={
        route.params ?? {isNew: !settings.pinEnabled, isReset: false}
      }
      applicationPinCode={undefined}
      encUnlockPin={undefined}
      isBiometricEnabled={false}
    />
  );
};

export default PinCodePage;
