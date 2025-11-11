import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk(
    'users/fetch',
    async () => {
        const response = await fetch('https://hr2.sibers.com/test/frontend/users.json');
        const data = await response.json();
        return data;
    }
)

const usersSlicer = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null,
        totalPages: 10,
        currentPage: 1,
        userPerPage: 10,
        filteredUsers: [],
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        searchUsers: (state, action) => {
            state.searchTerm = action.payload.toLowerCase();

            if (state.searchTerm === '') {
                state.filteredUsers = state.users;
            } else {
                state.filteredUsers = state.users.filter(user =>
                    user.name.toLowerCase().includes(state.searchTerm)
                );
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => { state.loading = true; })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
                state.filteredUsers = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
    }
})

export const {
    setLoading,
    setCurrentPage,
    setUsers,
    searchUsers
} = usersSlicer.actions;

export default usersSlicer.reducer;