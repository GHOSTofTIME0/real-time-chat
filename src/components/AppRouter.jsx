import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SearchUsers from './SearchUsers'
import UserProfile from './UserProfile'

const AppRouter = () => {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/usersList' element={<SearchUsers />} />
                    <Route path='/user/:userId' element={<UserProfile />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default AppRouter