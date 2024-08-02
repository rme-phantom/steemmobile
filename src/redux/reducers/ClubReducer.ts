import { createSlice } from "@reduxjs/toolkit";

type GlobalState = {
    value: ClubData
};


const initialstate: GlobalState = {
    value: {
        powered_up: 0,
        transfer_in: 0,
        transfer_out: 0
    },
};

const clubReducer = createSlice({
    name: 'clubData',
    initialState: initialstate,
    reducers: {
        saveclubData: (state: GlobalState, actions) => {
            state.value = actions.payload
        },

    },
});


export const { saveclubData } = clubReducer.actions;
export const ClubReducer = clubReducer.reducer;