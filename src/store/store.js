import { configureStore } from "@reduxjs/toolkit";
import usersSlicer from './slicers/usersSlice';
import messagesSlice from './slicers/messagesSlice';
const store = configureStore({
    reducer: {
        users: usersSlicer,
        chat: messagesSlice,
    }
})

export default store;