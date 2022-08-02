import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
    currentGameLength: number | null;
    usingAdBlock: boolean | null;
}

const initialState: State = {
    currentGameLength: null,
    usingAdBlock: null,
};

export const slice = createSlice({
    name: "misc",
    initialState,
    reducers: {
        // setters
        setCurrentGameLength: function (state, action: PayloadAction<number>) {
            return { ...state, currentGameLength: action.payload };
        },
        setUsingAdBlock: function (state, action: PayloadAction<boolean>) {
            return { ...state, usingAdBlock: action.payload };
        },
    },
});

export const { setCurrentGameLength, setUsingAdBlock } = slice.actions;

export default slice.reducer;
