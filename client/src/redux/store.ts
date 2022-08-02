import { configureStore } from "@reduxjs/toolkit";

import aestheticSlice from "./slices/aestheticSlice";
import clientSlice from "./slices/clientSlice";
import kaijiGameSlice from "./slices/kaijiGameSlice";
import socketSlice from "./slices/wsSlice";

const store = configureStore({
    reducer: {
        ws: socketSlice,
        aesthetic: aestheticSlice,
        kaijiGame: kaijiGameSlice,
        client: clientSlice,
    },

    // required to store sockets
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
