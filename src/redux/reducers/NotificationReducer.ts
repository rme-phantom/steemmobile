import {createSlice} from '@reduxjs/toolkit';

type NotificationrStat = {
  values: Notification[];
};

const initialstate: NotificationrStat = {
  values: [],
};

const notificationsReducer = createSlice({
  name: 'postlist',
  initialState: initialstate,
  reducers: {
    addNotificationsHandler: (state: NotificationrStat, actions) => {
      state.values = actions.payload;
    },
    // updateNotificationsHandler: (state: NotificationrStat, actions) => {
    //   const api = actions.payload.api || 'trending';
    //   const data = actions.payload.data;

    //   const index = state.values[api].findIndex(
    //     item => item['link_id'] === data['link_id'],
    //   );

    //   const newArray = state.values[api]; //making a new array
    //   newArray[index] = data; //changing value in the new array
    //   state.values[api] = newArray;
    // },

    // appendNotificationsHandler: (state: NotificationrStat, actions) => {
    //   const api = actions.payload.api || 'trending';
    //   const data = actions.payload.data || [];

    //   state.values[api] = state.values[api].concat(data);
    // },
  },
});

export const {addNotificationsHandler} = notificationsReducer.actions;
export const NotificationsReducer = notificationsReducer.reducer;
