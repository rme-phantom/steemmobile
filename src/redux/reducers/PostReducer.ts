import { createSlice } from "@reduxjs/toolkit";

type InfoState = {
    values: {}
};


export const initialstate: InfoState = {
    values: {}
};

const postReducer = createSlice({
    name: 'postData',
    initialState: initialstate,
    reducers: {
        savePostHandler: (state: InfoState, actions) => {
            const payload: Feed | Post | undefined = actions?.payload;
            if (payload)
                state.values[`${payload?.author}/${payload?.permlink}`] = payload;
            else state.values = initialstate;
        },

    },
});


export const { savePostHandler } = postReducer.actions;
export const PostReducer = postReducer.reducer;