import {AppStrings} from './AppStrings';
import Toast from 'react-native-toast-message';

export const AppConstants = {
  SDS_API: (endpoint: string): string => `${AppStrings.SDS_BASE}${endpoint}`,
  IS_DEBUG: false,
  SHOW_TOAST: (text1: string, text2?: string, type = 'info') =>
    Toast.show({type, text1, text2}),
  ACCOUNT_REFETCH_INTERVAL: 5 * 60 * 1000,
  GLOBAL_REFETCH_INTERVAL: 15 * 60 * 1000,
  CLUB_MONTHS: 2,
  SNIPPETS_LIMIT: 25,
  APP_LINK: 'https://play.google.com/store/apps/details?id=com.steempro.mobile',
  STEEMIT_SIGNUP: 'https://signup.steemit.com/',
  DISCORD_LINK: 'https://discord.gg/Bsf98vMg6U',
  MAX_PIN_ATTEMPS: 3,
  STEEMMOBILE_TEAM: [
    {
      name: 'bangla.witness',
      title: 'Founder and Witness',
      contact: '@bangla.witness',
      contactType: 'account',
    },
    {
      name: 'faisalamin',
      title: 'Developer',
      contact: '@faisalamin',
      contactType: 'account',
    },
  ],
  DEFAULT_NOTIFICATION_SETTINGS: {
    status: true,
    vote: {
      status: true,
      minRep: 25,
      minSp: 15,
      minVote: 0.001,
    },
    reply: {
      status: true,
      minRep: 25,
      minSp: 15,
    },
    follow: {
      status: true,
      minRep: 25,
      minSp: 0,
    },
    mention: {
      status: true,
      minRep: 25,
      minSp: 15,
    },
    resteem: {
      status: true,
      minRep: 25,
      minSp: 15,
    },
  },
};
