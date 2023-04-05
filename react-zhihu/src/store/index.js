import { configureStore } from "@reduxjs/toolkit";
import baseReducer from "./baseSlice";
import storeReducer from "./storeSlice";

const store = configureStore({
    reducer: {
        base: baseReducer,
        store: storeReducer
    }
})

export default store