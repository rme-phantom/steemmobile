import React from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppSelector} from '../constants/AppFunctions';
import {useQuery} from '@tanstack/react-query';
import {FeedTabNavigator} from '../pages/home';
import NotificationPage from '../pages/notification';
import {AppRoutes} from '../constants/AppRoutes';
import WalletPage from '../pages/wallet';
import {AccountPage} from '../pages/account/screen/AccountPage';
import {getUnreadNotifications} from '../steem/SteemApis';
import {AppConstants} from '../constants/AppConstants';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {getAppVersionString} from '../utils/utils';
import {Avatar} from 'react-native-paper';
import {getResizedAvatar} from '../utils/ImageApis';
import { AppColors } from '../constants/AppColors';

export default function BottomTabNavigator({}) {
  const Tab = createMaterialBottomTabNavigator();
  const loginInfo = useAppSelector(state => state.loginReducer.value);

  const notificationKey = `notifications-${
    loginInfo.name ?? ''
  }-bottomTab-${getAppVersionString()}`;

  const {data: notificationData} = useQuery({
    enabled: loginInfo.login === true,
    queryKey: [notificationKey],
    queryFn: () =>
      getUnreadNotifications(
        loginInfo.name,
        loginInfo.notification ?? AppConstants.DEFAULT_NOTIFICATION_SETTINGS,
      ),
    retryDelay: 2 * 60 * 1000,
    refetchInterval: 3 * 60 * 1000,
  });

  return (
    <Tab.Navigator
      initialRouteName="Feed"
      barStyle={{paddingVertical: 0, padding: 0}}>
      <Tab.Screen
        name="Home"
        component={FeedTabNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon
                name={`home${!focused ? '-outline' : ''}`}
                size={24}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={AppRoutes.PAGES.NotificationPage}
        component={NotificationPage}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon
                name={`bell${!focused ? '-outline' : ''}`}
                size={24}
                color={color}
              />
            );
          },
          tabBarBadge:
            notificationData && notificationData >= 100
              ? '99+'
              : notificationData || undefined,
        }}
      />

      <Tab.Screen
        name={AppRoutes.PAGES.WalletPage}
        component={WalletPage}
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({focused, color}) => {
            return (
              <Icon
                name={`wallet${!focused ? '-outline' : ''}`}
                size={24}
                color={color}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name={AppRoutes.PAGES.AccountPage}
        component={AccountPage}
        options={{
          tabBarLabel: loginInfo?.login ? 'You' : 'Account',
          tabBarIcon: ({focused, color}) => {
            return loginInfo?.login && loginInfo?.name ? (
              <Avatar.Image
                style={{backgroundColor: AppColors.LIGHT_WHITE}}
                source={{uri: getResizedAvatar(loginInfo.name)}}
                size={24}
              />
            ) : (
              <Icon
                name={`account${!focused ? '-outline' : ''}`}
                size={24}
                color={color}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
