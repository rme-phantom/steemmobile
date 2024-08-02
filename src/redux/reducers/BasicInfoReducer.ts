import {createSlice} from '@reduxjs/toolkit';

type InfoState = {
  value: any;
};

const initialstate: InfoState = {
  value: null,
};

const infoReducer = createSlice({
  name: 'basicinfo',
  initialState: initialstate,
  reducers: {
    saveBasicInfoHandler: (state: InfoState, actions) => {
      state.value = actions.payload;
    },
  },
});

export const {saveBasicInfoHandler} = infoReducer.actions;
export const BasicInfoReducer = infoReducer.reducer;
