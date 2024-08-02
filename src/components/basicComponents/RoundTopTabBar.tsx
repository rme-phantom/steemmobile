import {View, useColorScheme} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  MD3DarkTheme,
  MD3LightTheme,
  Text,
} from 'react-native-paper';

interface Props {
  children: React.ReactNode;
  initialRoute?: string;
}
const RoundTopTabBar = (props: Props) => {
  const {children, initialRoute} = props;
  const Tab = createMaterialTopTabNavigator();
  const isDarkTheme = useColorScheme() === 'dark';

  const _renderLabel = (focused, children) => {
    return (
      <View
        className={`rounded-xl bg-transparent/10 dark:bg-transparent/10 ${
          focused && `  bg-black/90 dark:bg-white/90`
        }`}>
        <Text
          style={{fontSize: 14}}
          className={`px-2 py-[2] ${
            focused
              ? `text-white dark:text-black`
              : `text-black dark:text-white`
          }`}>
          {children}
        </Text>
      </View>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName={'Trending'}
      className=" shadow-none"
      screenOptions={{
        lazy: true,
        lazyPreloadDistance: 0,
        tabBarLabelStyle: {
          fontSize: 14,
          fontStyle: 'normal',
          textTransform: 'none',
          color: isDarkTheme
            ? MD3LightTheme.colors.surface
            : MD3DarkTheme.colors.surface,
        },
        tabBarPressOpacity: 0.9,
        tabBarPressColor: 'transparent',
        tabBarBounces: true,
        tabBarScrollEnabled: true,
        tabBarStyle: {
          maxHeight: 40,
          backgroundColor: 'transparent',
        },
        tabBarLabel: props => _renderLabel(props.focused, props.children),
        tabBarIndicatorStyle: {backgroundColor: 'transparent'},
        tabBarIndicator: () => {
          return <></>;
        },
        tabBarItemStyle: {width: 'auto'},
      }}>
      {children}
    </Tab.Navigator>
  );
};

export default RoundTopTabBar;
