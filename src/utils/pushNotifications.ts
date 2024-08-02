// const createPushListener = async () => {
//     await messaging().requestPermission();

//     const firebaseOnMessageListener = messaging().onMessage((remoteMessage) => {
//         console.log('Notification Received: foreground', remoteMessage);
//         setNotiData(remoteMessage);
//     });
// };
 

// const _enableNotification = async (username, isEnable, settings = null, accessToken = null) => {
//     // compile notify_types
//     let notify_types: any[] = [];
//     if (settings) {
//         const notifyTypesConst = {
//             voteNotification: 1,
//             mentionNotification: 2,
//             followNotification: 3,
//             commentNotification: 4,
//             reblogNotification: 5,
//             transfersNotification: 6,
//             favoriteNotification: 13,
//             bookmarkNotification: 15,
//         };

//         Object.keys(settings).map((item) => {
//             if (notifyTypesConst[item] && settings[item]) {
//                 notify_types.push(notifyTypesConst[item]);
//             }
//         });
//     } else {
//         notify_types = [1, 2, 3, 4, 5, 6, 13, 15];
//     }

//     messaging()
//         .getToken()
//         .then((token) => {
//             setPushToken(
//                 {
//                     username,
//                     token: isEnable ? token : '',
//                     system: `fcm-${Platform.OS}`,
//                     allows_notify: Number(isEnable),
//                     notify_types,
//                 },
//                 accessToken,
//             );
//         });
// };

