import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../store/slicers/usersSlice';
import ChatsList from './ChatsList';
import ChatWindow from './ChatWindow';
import styles from '../Styles/ChatsPage.module.css';

const ChatsPage = () => {
    const { activeChat, loading, error } = useSelector(state => state.chat);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    return (
        <div className={styles.chatsPage}>
            {/* Боковая панель со списком чатов */}
            <div className={`${styles.sidebar} ${activeChat ? styles.sidebarCollapsed : ''}`}>
                <ChatsList />
            </div>

            {/* Основное окно чата */}
            <div className={styles.chatArea}>
                {activeChat ? (
                    <ChatWindow />
                ) : (
                    <div className={styles.welcomeScreen}>
                        <div className={styles.welcomeContent}>
                            <h1>Welcome to Messenger</h1>
                            <p>Select a chat from the list or start a new conversation</p>
                            <div className={styles.features}>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>💬</span>
                                    <h3>Direct Messages</h3>
                                    <p>Chat one-on-one with other users</p>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>👥</span>
                                    <h3>Group Channels</h3>
                                    <p>Create channels for team communication</p>
                                </div>
                                <div className={styles.feature}>
                                    <span className={styles.featureIcon}>⚡</span>
                                    <h3>Real-time</h3>
                                    <p>Instant messaging experience</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatsPage;