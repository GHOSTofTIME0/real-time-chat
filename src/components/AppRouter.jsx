import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SearchUsers from './SearchUsers'
import UserProfile from './UserProfile'
import NavBar from './NavBar'
import ChatsList from './ChatsList'
import ChatsPage from './ChatsPage'


const AppRouter = () => {
    return (
        <div>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path='/usersList' element={<SearchUsers />} />
                    <Route path='/user/:userId' element={<UserProfile />} />
                    <Route path='*' element={<ChatsPage />} />
                    <Route path='/chats' element={<ChatsPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default AppRouter