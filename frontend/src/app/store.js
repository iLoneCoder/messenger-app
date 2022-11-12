import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import messengerReducer from "../features/messenger/messengerSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        messenger: messengerReducer
    }
})

