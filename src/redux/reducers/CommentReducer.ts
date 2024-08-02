import { createSlice } from "@reduxjs/toolkit";

type InfoState = {
    values: {}
};


export const initialstate: InfoState = {
    values: {}
};

const commentReducer = createSlice({
    name: 'commentsData',
    initialState: initialstate,
    reducers: {
        saveCommentHandler: (state: InfoState, actions) => {
            const payload = actions.payload;
            if (payload)
                state.values[`${payload?.author}/${payload?.permlink}`] = payload;
            else state.values = initialstate;

        },

    },
});


export const { saveCommentHandler } = commentReducer.actions;
export const CommentReducer = commentReducer.reducer;