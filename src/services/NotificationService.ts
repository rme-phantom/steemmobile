import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { Platform } from 'react-native';
import { NotificationSDS, notificationParser } from '../utils/notificationParser';
import { AppGlobals } from '../constants/AppGlobals';
import { getSettings } from '../utils/realm';
import { AppRoutes } from '../constants/AppRoutes';
import { StackActions } from '@react-navigation/native';

export async function getFcmToken() {
    let token = await messaging().getToken() ?? '';
    return token
}

export async function pushFcmToken(username: string, pushLastRead?: boolean) {

    const token = await getFcmToken();
    if (token) {
        const pushData = {
            timestamp: Date.now(),
            fcmToken: token || '',
        };

        if (pushLastRead) {
            pushData['lastRead'] = firebase.firestore.FieldValue.serverTimestamp();
        }
        await firestore()
            .collection('Users').doc(username).set
            (pushData, { merge: true });
    }

}

const handleRemoteMessage = (navigationRef, remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    const settings = getSettings();

    console.log('Notificaiton opened app', remoteMessage);

    if (remoteMessage) {
        const { routeName, params } = notificationParser(remoteMessage?.data as unknown as NotificationSDS ?? undefined);
        if (routeName) {
            if (navigationRef?.isReady()) {
                if (settings.pinEnabled && !AppGlobals.PIN_CODE) {
                    navigationRef.navigate(AppRoutes.PAGES.PinCodePage, { hideCloseButton: true, target: routeName, targetProps: params });
                } else {
                    const pushAction = StackActions.push(routeName, { ...params });
                    navigationRef.dispatch(pushAction);
                }
            }


        }
    }
}

export const initiNotificationListener = async (navigationRef) => {


    // on android messaging event work fine for both background and quite state
    // while notifee events do not fuction as expected
    if (Platform.OS === 'android') {
        messaging().onNotificationOpenedApp((remoteMessage) => {
            handleRemoteMessage(navigationRef, remoteMessage);
        });

        messaging().getInitialNotification().then(remoteMessage => {
            if (remoteMessage)
                handleRemoteMessage(navigationRef, remoteMessage);
        });

    } else if (Platform.OS === 'ios') {
        // for ios, notifee events work while messaging event are malfunctioning, the foreground event
        // on ios is called if user opens/starts app from notification
        // notifeeEventRef.current = notifee.onForegroundEvent(({ type, detail }) => {
        //   if (type === EventType.PRESS) {
        //     _pushNavigate(detail.notification);
        //   }
        // });
    }
};