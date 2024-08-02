import React from 'react';
import {Appearance} from 'react-native';

export const PreferencesContext = React.createContext({
  toggleTheme: () => {},
  isThemeDark: Appearance.getColorScheme() === 'dark',
});
