/**
 * @format
 */


import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().getInitialNotification((remoteMessage) => {

});


messaging().setBackgroundMessageHandler(async remoteMessage => {
    // Handle the background message here
    console.log('Received a background message', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
