import { createSlice } from "@reduxjs/toolkit";
import { getItemFromStorage } from "../../utils/realm";
import { AppStrings } from "../../constants/AppStrings";
import { empty_profile } from "../../utils/placeholders";


type LoginState = {
    value: AccountExt | {}
};



const accountExt = getItemFromStorage(AppStrings.CURRENT_USER_SCHEMA);
const initialstate: LoginState = {
    value: accountExt ?? {}
};

const profileReducer = createSlice({
    name: 'profile',
    initialState: initialstate,
    reducers: {
        saveProfileHandler: (state: LoginState, actions) => {
            const payload = actions?.payload;
            if (payload)
                state.value[`${payload?.name}`] = payload;
        },

    },
});


export const { saveProfileHandler } = profileReducer.actions;
export const ProfileReducer = profileReducer.reducer;