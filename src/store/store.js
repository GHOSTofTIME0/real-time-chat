import { configureStore } from "@reduxjs/toolkit";
import usersSlicer from './slicers/usersSlice';
const store = configureStore({
    reducer: {
        users: usersSlicer,
    }
})

export default store;