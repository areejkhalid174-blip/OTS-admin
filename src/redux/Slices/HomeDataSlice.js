
import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: {},
    name: "",
    role: "buyer"
};

const homeSlice = createSlice({
    name: "home",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setName: (state, action) => {
            state.name = action.payload
        },
        setRole: (state, action) => {
            state.roler = action.payload
        },



    },
});

export const {
    setUser,
    setName,
    setRole

} = homeSlice.actions;

export default homeSlice.reducer;
