import { createSlice } from "@reduxjs/toolkit";

type InfoState = {
    values: {}
};


export const initialstate: InfoState = {
    values: {}
};

const repliesReducer = createSlice({
    name: 'postReplies',
    initialState: initialstate,
    reducers: {
        saveRepliesHandler: (state: InfoState, actions) => {
            const { comment, replies } = actions.payload;
            state.values[`${comment?.author}/${comment?.permlink}`] = replies;
        },

    },
});


export const { saveRepliesHandler } = repliesReducer.actions;
export const RepliesReducer = repliesReducer.reducer;