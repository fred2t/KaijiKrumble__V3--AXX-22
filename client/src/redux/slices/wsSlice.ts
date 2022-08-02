import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
    socket: WebSocket | null;
    errored: boolean;
    isConnecting: boolean;

    // in epoch
    connectionTime: number | null;

    /**
     * When the connection times out, the user may choose an action in the
     * time it takes to reconnect. This will store those actions and play
     * them using the new socket. The following actions will be paused.
     *  - searching for new game
     *
     */
    pausedMessages: ((socket: WebSocket | null) => unknown)[];
}

const initialState: State = {
    socket: null,
    errored: false,
    isConnecting: false,
    connectionTime: null,
    pausedMessages: [],
};

export const slice = createSlice({
    name: "ws",
    initialState,
    reducers: {
        setSocket: function (state, action: PayloadAction<WebSocket>) {
            state.socket = action.payload;
        },

        setIsConnecting: function (state, action: PayloadAction<boolean>) {
            state.isConnecting = action.payload;
        },

        setConnectionTime: function (state, action: PayloadAction<number>) {
            state.connectionTime = action.payload;
        },

        reportErrorStatus: function (state, action: PayloadAction<boolean>) {
            state.errored = action.payload;
        },

        queuePausedMessage: function (
            state,
            action: PayloadAction<(socket: WebSocket | null) => unknown>
        ) {
            state.pausedMessages = [...state.pausedMessages, action.payload];
        },
    },
});

export const {
    setSocket,
    setIsConnecting,
    reportErrorStatus,
    queuePausedMessage,
    setConnectionTime,
} = slice.actions;

export default slice.reducer;
