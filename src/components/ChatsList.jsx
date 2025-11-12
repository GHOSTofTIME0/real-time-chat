import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    createDirectChat,
    setActiveChat,
    createGroupChannel,
} from '../store/slicers/messagesSlice';
import { fetchUsers } from '../store/slicers/usersSlice';
import CreateChannelModal from './CreateChannelModal';
import { OrbitProgress } from 'react-loading-indicators';
import styles from '../Styles/ChatsList.module.css';

const ChatsList = () => {
    const [showUserList, setShowUserList] = useState(false);
    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const {
        allUsers,
        directChats,
        groupChannels,
        currentUser,
        loading,
        error
    } = useSelector(state => state.chat);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const availableUsers = allUsers.filter(user =>
        user.id !== currentUser.id &&
        !directChats.find(chat => chat.userId === user.id)
    );

    const filteredUsers = availableUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateDirectChat = (userId) => {
        dispatch(createDirectChat({ userId }));
        setShowUserList(false);
        setSearchTerm('');
    };

    const handleChatClick = (chat) => {
        dispatch(setActiveChat(chat));
    };

    const formatLastMessage = (lastMessage) => {
        if (!lastMessage) return 'No messages yet';
        const text = lastMessage.text.length > 30
            ? lastMessage.text.substring(0, 30) + '...'
            : lastMessage.text;
        return `${lastMessage.senderName}: ${text}`;
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <OrbitProgress variant="disc" color="#32cd32" size="medium" />
                <p>Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h2>Error loading users</h2>
                <p>{error}</p>
                <button
                    onClick={() => dispatch(fetchUsers())}
                    className={styles.retryButton}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Chats</h1>
                <div className={styles.actions}>
                    <button
                        className={styles.primaryButton}
                        onClick={() => setShowUserList(true)}
                        disabled={allUsers.length === 0}
                    >
                        New Chat
                    </button>
                    <button
                        className={styles.secondaryButton}
                        onClick={() => setShowCreateChannel(true)}
                        disabled={allUsers.length === 0}
                    >
                        Create Channel
                    </button>
                </div>
            </div>

            <div className={styles.stats}>
                <span>{allUsers.length} users available</span>
            </div>

            <div className={styles.chatsSection}>
                <h2>Direct Messages</h2>
                {directChats.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No direct messages yet</p>
                        <button
                            onClick={() => setShowUserList(true)}
                            className={styles.textButton}
                        >
                            Start a conversation
                        </button>
                    </div>
                ) : (
                    <div className={styles.chatsList}>
                        {directChats.map(chat => (
                            <div
                                key={chat.id}
                                className={styles.chatItem}
                                onClick={() => handleChatClick(chat)}
                            >
                                <img
                                    width='70px'
                                    height='50px'
                                    src={chat.userAvatar}
                                    alt={chat.userName}
                                    className={styles.avatar}
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/50x50/cccccc/969696?text=U';
                                    }}
                                />
                                <div className={styles.chatInfo}>
                                    <div className={styles.chatHeader}>
                                        <h3 className={styles.userName}>{chat.userName}</h3>
                                        <span className={styles.time}>
                                            {formatTime(chat.lastMessage?.timestamp)}
                                        </span>
                                    </div>
                                    <p className={styles.lastMessage}>
                                        {formatLastMessage(chat.lastMessage)}
                                    </p>
                                </div>
                                {chat.unreadCount > 0 && (
                                    <span className={styles.unreadBadge}>
                                        {chat.unreadCount}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.chatsSection}>
                <h2>Channels</h2>
                {groupChannels.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No channels yet</p>
                        <button
                            onClick={() => setShowCreateChannel(true)}
                            className={styles.textButton}
                        >
                            Create your first channel
                        </button>
                    </div>
                ) : (
                    <div className={styles.chatsList}>
                        {groupChannels.map(channel => (
                            <div
                                key={channel.id}
                                className={styles.chatItem}
                                onClick={() => handleChatClick(channel)}
                            >
                                <div className={styles.channelAvatar}>
                                    #{channel.name.charAt(0).toUpperCase()}
                                </div>
                                <div className={styles.chatInfo}>
                                    <div className={styles.chatHeader}>
                                        <h3 className={styles.channelName}>{channel.name}</h3>
                                        <span className={styles.time}>
                                            {formatTime(channel.lastMessage?.timestamp)}
                                        </span>
                                    </div>
                                    <p className={styles.lastMessage}>
                                        {formatLastMessage(channel.lastMessage)}
                                    </p>
                                    <div className={styles.memberCount}>
                                        {channel.members.length} members
                                    </div>
                                </div>
                                {channel.unreadCount > 0 && (
                                    <span className={styles.unreadBadge}>
                                        {channel.unreadCount}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showUserList && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>New Chat</h2>
                            <button
                                onClick={() => {
                                    setShowUserList(false);
                                    setSearchTerm('');
                                }}
                                className={styles.closeButton}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.searchBox}>
                            <input
                                type="text"
                                placeholder="Search users by name or username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.usersList}>
                            {filteredUsers.map(user => (
                                <div
                                    key={user.id}
                                    className={styles.userItem}
                                    onClick={() => handleCreateDirectChat(user.id)}
                                >
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className={styles.avatar}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/50x50/cccccc/969696?text=U';
                                        }}
                                    />
                                    <div className={styles.userInfo}>
                                        <h4>{user.name}</h4>
                                        <p>@{user.username} • {user.company?.name}</p>
                                    </div>
                                </div>
                            ))}

                            {filteredUsers.length === 0 && searchTerm && (
                                <div className={styles.noResults}>
                                    No users found matching "{searchTerm}"
                                </div>
                            )}

                            {filteredUsers.length === 0 && !searchTerm && (
                                <div className={styles.noResults}>
                                    No available users found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showCreateChannel && (
                <CreateChannelModal
                    onClose={() => setShowCreateChannel(false)}
                    availableUsers={availableUsers}
                />
            )}
        </div>
    );
};

export default ChatsList;