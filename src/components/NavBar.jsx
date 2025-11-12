import React from 'react'
import { Link } from 'react-router-dom'
import SearchUsers from './SearchUsers'
import ChatsList from './ChatsList'


const NavBar = () => {
    return (
        <div>
            <Link to='/usersList' element={<SearchUsers />}>Users</Link>
            <Link to='*' element={<ChatsList />}>Chats</Link>
        </div>
    )
}

export default NavBar