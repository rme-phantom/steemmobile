import { configureStore } from '@reduxjs/toolkit';
import { ClubReducer } from '../reducers/ClubReducer';
import { LastReadReducer } from '../reducers/lastReadReducer';
import { LoginReducer } from '../reducers/LoginReducer';
import { NotificationsReducer } from '../reducers/NotificationReducer';
import { SteemGlobalsReducer } from '../reducers/SteemGlobalReducer';
import { SettingsReducer } from '../reducers/SettingsReducer';
import { RepliesReducer } from '../reducers/RepliesReducer';
import { PostReducer } from '../reducers/PostReducer';
import { CommentReducer } from '../reducers/CommentReducer';
import { ProfileReducer } from '../reducers/ProfileReducer';

export const store = configureStore({
  reducer: {
    loginReducer: LoginReducer,
    lastReadReducer: LastReadReducer,
    notificationsReducer: NotificationsReducer,
    steemGlobalReducer: SteemGlobalsReducer,
    clubReducer: ClubReducer,
    settingsReducer: SettingsReducer,
    repliesReducer: RepliesReducer,
    postReducer: PostReducer,
    commentReducer: CommentReducer,
    profileReducer: ProfileReducer,



  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: { warnAfter: 128 },
    serializableCheck: { warnAfter: 128 },
  })
});

export type RootState = ReturnType<typeof store.getState>;
