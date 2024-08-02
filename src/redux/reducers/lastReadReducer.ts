import { createSlice } from "@reduxjs/toolkit";


interface LastReadType {
    time: number
}

type LastReadState = {
    value: LastReadType
};



const initialstate: LastReadState = {
    value: { time: 0 }
};

const lastReadReducer = createSlice({
    name: 'lastRead',
    initialState: initialstate,
    reducers: {
        saveLastRead: (state: LastReadState, actions) => {
            state.value = actions.payload
        },
    },
});


export const { saveLastRead } = lastReadReducer.actions;
export const LastReadReducer = lastReadReducer.reducer;