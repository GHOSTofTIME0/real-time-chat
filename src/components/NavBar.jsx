import React from 'react'
import { Link } from 'react-router-dom'
import SearchUsers from './SearchUsers'
import ChatsList from './ChatsList'
import styles from '../Styles/NavBar.module.css';
import { useLocation } from 'react-router-dom';
const NavBar = () => {
    const location = useLocation();

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div className={styles.logo}>
                    💬 Messenger
                </div>
                <div className={styles.navLinks}>
                    <Link
                        to='/usersList'
                        className={`${styles.navLink} ${location.pathname === '/usersList' ? styles.active : ''
                            }`}
                    >
                        👥 Users
                    </Link>
                    <Link
                        to='/chats'
                        className={`${styles.navLink} ${location.pathname === '/chats' || location.pathname === '/' ? styles.active : ''
                            }`}
                    >
                        💭 Chats
                    </Link>
                </div>
            </div>
        </nav>
    );
};



export default NavBar