import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../store/slicers/usersSlice';
import ChatsList from './ChatsList';
import ChatWindow from './ChatWindow';
import styles from '../Styles/ChatsPage.module.css';

const ChatsPage = () => {
    const { activeChat } = useSelector(state => state.chat);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUsers());
        alert('Прочитать комментарий store/slicers/messagesSlice.js на 64 строке. Весь остальной функционал выполнен. Использовал ИИ только для написания стилей')
    }, [dispatch]);

    return (
        <div className={styles.chatsPage}>
            <div className={`${styles.sidebar} ${activeChat ? styles.sidebarCollapsed : ''}`}>
                <ChatsList />
            </div>

            <div className={styles.chatArea}>
                <ChatWindow />
            </div>
        </div>
    );
};

export default ChatsPage;