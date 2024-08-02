import firestore from '@react-native-firebase/firestore';
import { AppConstants } from '../constants/AppConstants';

const isHumanReadable = (input: number): boolean => {
  return Math.abs(input) > 0 && Math.abs(input) <= 100;
};

export const parseReputation = (input: string | number) => {
  if (typeof input === 'number' && isHumanReadable(input)) {
    return Math.floor(input);
  }

  if (typeof input === 'string') {
    input = Number(input);

    if (isHumanReadable(input)) {
      return input.toFixed(2);
    }
  }

  if (input === 0) {
    return 25;
  }

  let neg = false;

  if (input < 0) neg = true;

  let reputationLevel = Math.log10(Math.abs(input));
  reputationLevel = Math.max(reputationLevel - 9, 0);

  if (reputationLevel < 0) reputationLevel = 0;

  if (neg) reputationLevel *= -1;

  reputationLevel = reputationLevel * 9 + 25;

  return reputationLevel.toFixed(2);
};

export const getName = about => {
  if (about.profile && about.profile.name) {
    return about.profile.name;
  }
  return null;
};

export const validateUsername = username => {
  const usernameRegex =
    /^(?=[a-zA-Z0-9._-]{3,16}$)(?!.*[_.-]{2})[^-_.].*[^-_.]$/g;
  return usernameRegex.test(username);
};

export const parseAccountMeta = (metaData: string) => {
  const metadata = JSON.parse(metaData || '{}');
  const { profile } = metadata;
  return {
    username: profile?.name || '',
    profileImage: profile?.profile_image || '',
    coverImage: profile?.cover_image || '',
    website: profile?.website || '',
    location: profile?.location || '',
    about: profile?.about || '',
  };
};

export const parsePostMeta = (metaData: string) => {
  const metadata = JSON.parse(metaData || '{}');
  const postTags = metadata?.tags;
  return {
    image: metadata?.image || undefined,
    users: metadata?.users || [],
    tags: typeof postTags === 'string' ? [postTags] : postTags || [],
    app: metadata?.app || '',
    format: metadata?.format || '',
  };
};
export const parseUsername = (username: string) => {
  if (!username) {
    return username;
  }

  return username.replace('@', '')?.toLowerCase()?.trim();
};

export const isAdminMod = (role: string): boolean => {
  if (!role) return false;
  return role === 'admin' || role === 'mod';
};


export async function getNotificationSettings(username: string):
  Promise<FirebaseNotificationSettings> {
  const response = await firestore().collection('Users').doc(username).get();
  if (response) {
    const notification_settings = response.data()?.notification;
    if (notification_settings) {
      return notification_settings
    } else {
      return AppConstants.DEFAULT_NOTIFICATION_SETTINGS;
    }
  }
  return AppConstants.DEFAULT_NOTIFICATION_SETTINGS;

}