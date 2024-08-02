import { createSlice } from "@reduxjs/toolkit";
import { empty_settings } from "../../utils/placeholders";
import { getSettings } from "../../utils/realm";

type InfoState = {
    value: Setting
};


export const initialstate: InfoState = {
    value: getSettings() || empty_settings()
};

const settingsReducer = createSlice({
    name: 'settings',
    initialState: initialstate,
    reducers: {
        saveSettingsHandler: (state: InfoState, actions) => {
            state.value = actions.payload
        },

    },
});


export const { saveSettingsHandler } = settingsReducer.actions;
export const SettingsReducer = settingsReducer.reducer;