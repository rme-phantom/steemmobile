import { createSlice } from "@reduxjs/toolkit";
import { getItemFromStorage } from "../../utils/realm";
import { AppStrings } from "../../constants/AppStrings";
import { empty_profile } from "../../utils/placeholders";


type LoginState = {
    value: AccountExt
};



const accountExt = getItemFromStorage(AppStrings.CURRENT_USER_SCHEMA);
const initialstate: LoginState = {
    value: accountExt ?? empty_profile('')
};

const loginReducer = createSlice({
    name: 'login',
    initialState: initialstate,
    reducers: {
        saveLoginHandler: (state: LoginState, actions) => {
            state.value = actions.payload
        },
        logoutHandler: (state: LoginState) => {
            state.value = empty_profile('');
        }
    },
});


export const { saveLoginHandler, logoutHandler } = loginReducer.actions;
export const LoginReducer = loginReducer.reducer;