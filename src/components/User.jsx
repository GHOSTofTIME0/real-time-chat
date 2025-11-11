import React from 'react'
import defaultAvatar from '../assets/defaultAvatar.jpg';
import styles from '../Styles/searchUsers.module.css'
const User = ({ user }) => {
    return (
        <div className={styles.userContent}>
            <img src={defaultAvatar} alt="avatar" width='70px' height='50px' className={styles.userAvatar} />
            <span>{user.name}</span>
        </div >
    )
}

export default User